import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { del } from "@vercel/blob";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage not configured" },
        { status: 500 }
      );
    }

    console.log("[DELETE_PROFILES] Starting profile deletion...");

    // Find all users with profile images that start with "profile-photos/"
    // These are the users created by the create-profiles script
    const profileUsers = await db.user.findMany({
      where: {
        profileImage: {
          startsWith: "https://",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });

    // Filter users whose profileImage contains "profile-photos/"
    const usersToDelete = profileUsers.filter(
      (user: { id: string; email: string | null; name: string | null; profileImage: string | null }) => 
        user.profileImage && user.profileImage.includes("profile-photos/")
    );

    console.log(`[DELETE_PROFILES] Found ${usersToDelete.length} profile users to delete`);

    let deletedCount = 0;
    let blobDeletedCount = 0;
    const errors: Array<{ user: string; error: string }> = [];

    for (const user of usersToDelete) {
      try {
        // Delete blob if exists
        if (user.profileImage) {
          try {
            // Extract blob URL from profileImage
            // Vercel blob URLs are like: https://xxx.vercel-storage.com/path/to/file
            await del(user.profileImage, {
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            blobDeletedCount++;
          } catch (blobError: any) {
            // Blob might already be deleted, continue
            console.warn(`[DELETE_PROFILES] Could not delete blob for ${user.email}:`, blobError.message);
          }
        }

        // Delete user from database
        await db.user.delete({
          where: { id: user.id },
        });

        deletedCount++;
        console.log(`[DELETE_PROFILES] Deleted user: ${user.name} (${user.email})`);
      } catch (error: any) {
        console.error(`[DELETE_PROFILES] Error deleting user ${user.email}:`, error);
        errors.push({
          user: user.email,
          error: error.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} profil hesabı başarıyla silindi.`,
      stats: {
        deletedCount,
        blobDeletedCount,
        errorsCount: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[DELETE_PROFILES] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Profil hesapları silinirken beklenmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

