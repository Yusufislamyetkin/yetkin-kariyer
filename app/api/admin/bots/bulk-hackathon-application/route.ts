import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { HackathonApplicationStatus } from "@prisma/client";
import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";
import { generateHackathonApplicationData } from "@/lib/bot/hackathon-application-generator";
import { formTeams } from "@/lib/bot/team-formation";
import { z } from "zod";

const bulkApplicationSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1),
  hackathonId: z.string().cuid(),
  mode: z.enum(["solo", "team"]),
  teamSize: z.number().int().min(2).max(10).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const data = bulkApplicationSchema.parse(payload);

    // Get hackathon
    const hackathon = await db.hackathon.findUnique({
      where: { id: data.hackathonId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon bulunamadı" }, { status: 404 });
    }

    // Check application window
    const lifecycle = computeHackathonPhase(hackathon);
    if (!lifecycle.isApplicationWindowOpen) {
      return NextResponse.json(
        { error: "Başvuru dönemi açık değil" },
        { status: 400 }
      );
    }

    // Check capacity
    if (
      hackathon.maxParticipants &&
      hackathon._count.applications >= hackathon.maxParticipants
    ) {
      return NextResponse.json(
        { error: "Kontenjan dolduğu için başvuru alınamamaktadır" },
        { status: 409 }
      );
    }

    // Validate team size if team mode
    if (data.mode === "team") {
      if (!data.teamSize) {
        return NextResponse.json(
          { error: "Takım modu için takım boyutu gereklidir" },
          { status: 400 }
        );
      }

      if (hackathon.minTeamSize && data.teamSize < hackathon.minTeamSize) {
        return NextResponse.json(
          {
            error: `Bu hackathon için minimum takım boyutu ${hackathon.minTeamSize}'dir`,
          },
          { status: 400 }
        );
      }

      if (hackathon.maxTeamSize && data.teamSize > hackathon.maxTeamSize) {
        return NextResponse.json(
          {
            error: `Bu hackathon için maksimum takım boyutu ${hackathon.maxTeamSize}'dir`,
          },
          { status: 400 }
        );
      }
    }

    // Get bots with their characters
    const bots = await db.user.findMany({
      where: {
        id: { in: data.userIds },
        isBot: true,
      },
      include: {
        botCharacter: true,
      },
    });

    if (bots.length === 0) {
      return NextResponse.json(
        { error: "Seçilen kullanıcılar arasında bot bulunamadı" },
        { status: 400 }
      );
    }

    // Check for existing applications
    const existingApplications = await db.hackathonApplication.findMany({
      where: {
        hackathonId: hackathon.id,
        userId: { in: bots.map((b: { id: string }) => b.id) },
      },
      select: {
        userId: true,
      },
    });

    const existingUserIds = new Set(existingApplications.map((a: { userId: string }) => a.userId));
    const botsToProcess = bots.filter((b: { id: string }) => !existingUserIds.has(b.id));

    if (botsToProcess.length === 0) {
      return NextResponse.json(
        {
          error: "Seçilen botların hepsi bu hackathon'a zaten başvurmuş",
          total: bots.length,
          successful: 0,
          failed: bots.length,
        },
        { status: 400 }
      );
    }

    const results = {
      total: bots.length,
      successful: 0,
      failed: bots.length - botsToProcess.length,
      teamsCreated: 0,
      errors: [] as string[],
    };

    if (data.mode === "solo") {
      // Solo mode: each bot applies individually
      for (const bot of botsToProcess) {
        try {
          if (!bot.botCharacter) {
            results.failed++;
            results.errors.push(`${bot.name || bot.id}: Bot karakteri bulunamadı`);
            continue;
          }

          // Generate application data
          const applicationData = await generateHackathonApplicationData(
            bot.botCharacter,
            hackathon.title,
            hackathon.description
          );

          // Create application
          await db.hackathonApplication.create({
            data: {
              hackathonId: hackathon.id,
              userId: bot.id,
              status: HackathonApplicationStatus.auto_accepted,
              motivation: applicationData.motivation,
              skills: applicationData.skills,
              githubProfile: applicationData.githubProfile,
              portfolioUrl: applicationData.portfolioUrl,
            },
          });

          results.successful++;
        } catch (error: any) {
          console.error(`[BULK_APPLICATION] Error applying bot ${bot.id}:`, error);
          results.failed++;
          results.errors.push(
            `${bot.name || bot.id}: ${error.message || "Bilinmeyen hata"}`
          );
        }
      }
    } else {
      // Team mode: form teams and apply
      try {
        const teamSize = data.teamSize!;
        const botIds = botsToProcess.map((b: { id: string }) => b.id);

        // Form teams
        const teams = await formTeams(botIds, teamSize, hackathon.id);
        results.teamsCreated = teams.length;

        // Create applications for each team
        for (const team of teams) {
          try {
            // Get the leader bot for generating application data
            const leaderBot = botsToProcess.find((b: { id: string }) => b.id === team.leaderId);
            if (!leaderBot || !leaderBot.botCharacter) {
              results.failed += team.memberIds.length;
              results.errors.push(
                `Takım ${team.teamName}: Lider bot karakteri bulunamadı`
              );
              continue;
            }

            // Generate application data using leader's character
            const applicationData = await generateHackathonApplicationData(
              leaderBot.botCharacter,
              hackathon.title,
              hackathon.description
            );

            // Create application for the team (using leader as the applicant)
            await db.hackathonApplication.create({
              data: {
                hackathonId: hackathon.id,
                userId: team.leaderId,
                teamId: team.teamId,
                status: HackathonApplicationStatus.auto_accepted,
                motivation: applicationData.motivation,
                skills: applicationData.skills,
                githubProfile: applicationData.githubProfile,
                portfolioUrl: applicationData.portfolioUrl,
              },
            });

            // Create applications for other team members (they're already team members)
            for (const memberId of team.memberIds.slice(1)) {
              try {
                const memberBot = botsToProcess.find((b: { id: string }) => b.id === memberId);
                if (!memberBot || !memberBot.botCharacter) {
                  continue;
                }

                const memberApplicationData = await generateHackathonApplicationData(
                  memberBot.botCharacter,
                  hackathon.title,
                  hackathon.description
                );

                await db.hackathonApplication.create({
                  data: {
                    hackathonId: hackathon.id,
                    userId: memberId,
                    teamId: team.teamId,
                    status: HackathonApplicationStatus.auto_accepted,
                    motivation: memberApplicationData.motivation,
                    skills: memberApplicationData.skills,
                    githubProfile: memberApplicationData.githubProfile,
                    portfolioUrl: memberApplicationData.portfolioUrl,
                  },
                });
              } catch (error: any) {
                console.error(
                  `[BULK_APPLICATION] Error creating application for team member ${memberId}:`,
                  error
                );
                // Don't fail the whole team for one member
              }
            }

            results.successful += team.memberIds.length;
          } catch (error: any) {
            console.error(
              `[BULK_APPLICATION] Error processing team ${team.teamName}:`,
              error
            );
            results.failed += team.memberIds.length;
            results.errors.push(
              `Takım ${team.teamName}: ${error.message || "Bilinmeyen hata"}`
            );
          }
        }
      } catch (error: any) {
        console.error("[BULK_APPLICATION] Error in team formation:", error);
        return NextResponse.json(
          {
            error: "Takım oluşturma sırasında hata oluştu",
            details: error.message,
            total: botsToProcess.length,
            successful: 0,
            failed: botsToProcess.length,
          },
          { status: 500 }
        );
      }
    }

    const message =
      results.successful > 0
        ? `${results.successful} bot başarıyla başvurdu${results.failed > 0 ? `, ${results.failed} başarısız` : ""}${results.teamsCreated > 0 ? `, ${results.teamsCreated} takım oluşturuldu` : ""}`
        : "Hiçbir bot başvuru yapamadı";

    return NextResponse.json({
      message,
      ...results,
    });
  } catch (error: any) {
    console.error("[BULK_APPLICATION] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Başvurular oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

