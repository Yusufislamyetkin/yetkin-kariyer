import { db } from "@/lib/db";
import { HackathonTeamRole, HackathonTeamMemberStatus } from "@prisma/client";
import { buildTeamSlug, generateTeamInviteCode } from "@/lib/hackathon/team";

interface TeamFormationResult {
  teamId: string;
  teamName: string;
  memberIds: string[];
  leaderId: string;
}

/**
 * Form teams from bot IDs randomly
 * @param botIds Array of bot user IDs
 * @param teamSize Target team size (number of bots per team)
 * @param hackathonId Hackathon ID
 * @returns Array of team formation results
 */
export async function formTeams(
  botIds: string[],
  teamSize: number,
  hackathonId: string
): Promise<TeamFormationResult[]> {
  if (botIds.length === 0) {
    return [];
  }

  if (teamSize < 2) {
    throw new Error("Team size must be at least 2");
  }

  // Shuffle bot IDs randomly
  const shuffled = [...botIds].sort(() => Math.random() - 0.5);

  const teams: TeamFormationResult[] = [];
  let teamIndex = 1;

  // Group bots into teams
  for (let i = 0; i < shuffled.length; i += teamSize) {
    const teamMembers = shuffled.slice(i, i + teamSize);
    
    // If remaining bots are less than team size, add them to the last team if it exists
    if (teamMembers.length < teamSize && teams.length > 0) {
      teams[teams.length - 1].memberIds.push(...teamMembers);
      break;
    }

    // Create team (even if smaller than teamSize, e.g., if it's the only team)
    const teamName = generateTeamName(teamIndex);
    const leaderId = teamMembers[0]; // First bot is the leader

    teams.push({
      teamId: "", // Will be set after team creation
      teamName,
      memberIds: teamMembers,
      leaderId,
    });

    teamIndex++;
  }

  // Create teams in database
  const createdTeams: TeamFormationResult[] = [];

  for (const team of teams) {
    try {
      const createdTeam = await createTeamInDatabase(
        hackathonId,
        team.teamName,
        team.leaderId,
        team.memberIds
      );

      createdTeams.push({
        ...team,
        teamId: createdTeam.id,
      });
    } catch (error: any) {
      console.error(`[TEAM_FORMATION] Error creating team ${team.teamName}:`, error);
      // Continue with other teams even if one fails
    }
  }

  return createdTeams;
}

/**
 * Generate a unique team name
 */
function generateTeamName(index: number): string {
  const adjectives = [
    "Hızlı",
    "Yaratıcı",
    "Akıllı",
    "Güçlü",
    "İnovatif",
    "Dinamik",
    "Başarılı",
    "Uzman",
    "Profesyonel",
    "Yenilikçi",
  ];

  const nouns = [
    "Takım",
    "Ekip",
    "Grup",
    "Squad",
    "Team",
    "Crew",
    "Squadron",
    "Alliance",
    "Force",
    "Unit",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective} ${noun} ${index}`;
}

/**
 * Create a team in the database with all members
 */
async function createTeamInDatabase(
  hackathonId: string,
  teamName: string,
  leaderId: string,
  memberIds: string[]
): Promise<{ id: string }> {
  const slug = buildTeamSlug(teamName);
  let inviteCode = generateTeamInviteCode();

  // Ensure invite code uniqueness
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existingCode = await db.hackathonTeam.findUnique({
      where: { inviteCode },
      select: { id: true },
    });
    if (!existingCode) break;
    inviteCode = generateTeamInviteCode();
  }

  // Create team and members in a transaction
  const team = await db.$transaction(async (tx: any) => {
    // Create the team
    const createdTeam = await tx.hackathonTeam.create({
      data: {
        hackathonId,
        name: teamName,
        slug,
        inviteCode,
        creatorId: leaderId,
      },
    });

    // Add all members to the team
    for (let i = 0; i < memberIds.length; i++) {
      const memberId = memberIds[i];
      await tx.hackathonTeamMember.create({
        data: {
          teamId: createdTeam.id,
          userId: memberId,
          role: i === 0 ? HackathonTeamRole.leader : HackathonTeamRole.member,
          status: HackathonTeamMemberStatus.active,
          joinedAt: new Date(),
        },
      });
    }

    return createdTeam;
  });

  return team;
}

