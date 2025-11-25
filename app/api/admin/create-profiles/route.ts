import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { TURKISH_FEMALE_NAMES, TURKISH_MALE_NAMES, TURKISH_SURNAMES } from "@/lib/admin/turkish-names";

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

    console.log("[CREATE_PROFILES] Starting profile creation...");

    // Try multiple possible paths for the photos directory
    const possiblePaths = [
      join(process.cwd(), "public", "Photos", "ProfilePhotos"),
      join(process.cwd(), "Photos", "ProfilePhotos"),
    ];

    let photosBasePath: string | null = null;
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        photosBasePath = path;
        break;
      }
    }

    if (!photosBasePath) {
      return NextResponse.json(
        {
          success: false,
          error: `Fotoğraf klasörü bulunamadı. Şu yollarda arandı: ${possiblePaths.join(", ")}. Lütfen Photos/ProfilePhotos klasörünün doğru konumda olduğundan emin olun.`,
        },
        { status: 500 }
      );
    }

    const manPhotosPath = join(photosBasePath, "Man");
    const womanPhotosPath = join(photosBasePath, "Woman");

    // Check if directories exist
    if (!existsSync(manPhotosPath)) {
      return NextResponse.json(
        {
          success: false,
          error: `Erkek fotoğrafları klasörü bulunamadı: ${manPhotosPath}`,
        },
        { status: 500 }
      );
    }

    if (!existsSync(womanPhotosPath)) {
      return NextResponse.json(
        {
          success: false,
          error: `Kadın fotoğrafları klasörü bulunamadı: ${womanPhotosPath}`,
        },
        { status: 500 }
      );
    }

    // Read photo files
    const manPhotos = readdirSync(manPhotosPath).filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png")
    );
    const womanPhotos = readdirSync(womanPhotosPath).filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png")
    );

    console.log(`[CREATE_PROFILES] Found ${manPhotos.length} male photos and ${womanPhotos.length} female photos`);

    if (manPhotos.length === 0 && womanPhotos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Fotoğraf klasörlerinde hiç fotoğraf bulunamadı. Lütfen .jpg veya .png uzantılı fotoğrafların mevcut olduğundan emin olun.",
        },
        { status: 500 }
      );
    }

    const createdUsers: Array<{ name: string; email: string; gender: string }> = [];
    const errors: Array<{ photo: string; error: string }> = [];

    // Helper function to generate email
    const generateEmail = (name: string, surname: string, index: number): string => {
      const baseEmail = `${name.toLowerCase()}.${surname.toLowerCase()}`;
      const emailProviders = ["@gmail.com", "@outlook.com"];
      const provider = emailProviders[index % emailProviders.length];
      return `${baseEmail}${index}${provider}`;
    };

    // Helper function to generate random date within last month
    const generateRandomDate = (): Date => {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
      return new Date(randomTime);
    };

    // Helper function to generate random password
    const generatePassword = (): string => {
      const length = 12;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    // Process male photos
    for (let i = 0; i < manPhotos.length; i++) {
      const photoFile = manPhotos[i];
      const photoPath = join(manPhotosPath, photoFile);

      try {
        // Get name and surname from lists (sequential, not random)
        const nameIndex = i % TURKISH_MALE_NAMES.length;
        const surnameIndex = i % TURKISH_SURNAMES.length;
        const name = TURKISH_MALE_NAMES[nameIndex];
        const surname = TURKISH_SURNAMES[surnameIndex];
        const fullName = `${name} ${surname}`;

        // Generate email
        let email = generateEmail(name, surname, i);
        let emailIndex = 0;
        // Ensure email uniqueness
        while (true) {
          const existingUser = await db.user.findUnique({
            where: { email },
          });
          if (!existingUser) break;
          email = generateEmail(name, surname, i + emailIndex);
          emailIndex++;
        }

        // Read photo file
        const photoBuffer = readFileSync(photoPath);
        const photoBlob = new Blob([photoBuffer]);

        // Upload to Vercel Blob
        const blobPath = `profile-photos/${Date.now()}-${photoFile}`;
        const blob = await put(blobPath, photoBlob, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // Generate password and hash
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate random date within last month
        const createdAt = generateRandomDate();

        // Create user
        const user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            name: fullName,
            role: "candidate",
            profileImage: blob.url,
            createdAt,
          },
        });

        createdUsers.push({
          name: fullName,
          email,
          gender: "male",
        });

        console.log(`[CREATE_PROFILES] Created user: ${fullName} (${email})`);
      } catch (error: any) {
        console.error(`[CREATE_PROFILES] Error processing ${photoFile}:`, error);
        errors.push({
          photo: photoFile,
          error: error.message || "Unknown error",
        });
      }
    }

    // Process female photos
    for (let i = 0; i < womanPhotos.length; i++) {
      const photoFile = womanPhotos[i];
      const photoPath = join(womanPhotosPath, photoFile);

      try {
        // Get name and surname from lists (sequential, not random)
        const nameIndex = i % TURKISH_FEMALE_NAMES.length;
        const surnameIndex = i % TURKISH_SURNAMES.length;
        const name = TURKISH_FEMALE_NAMES[nameIndex];
        const surname = TURKISH_SURNAMES[surnameIndex];
        const fullName = `${name} ${surname}`;

        // Generate email
        let email = generateEmail(name, surname, i + manPhotos.length);
        let emailIndex = 0;
        // Ensure email uniqueness
        while (true) {
          const existingUser = await db.user.findUnique({
            where: { email },
          });
          if (!existingUser) break;
          email = generateEmail(name, surname, i + manPhotos.length + emailIndex);
          emailIndex++;
        }

        // Read photo file
        const photoBuffer = readFileSync(photoPath);
        const photoBlob = new Blob([photoBuffer]);

        // Upload to Vercel Blob
        const blobPath = `profile-photos/${Date.now()}-${photoFile}`;
        const blob = await put(blobPath, photoBlob, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // Generate password and hash
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate random date within last month
        const createdAt = generateRandomDate();

        // Create user
        const user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            name: fullName,
            role: "candidate",
            profileImage: blob.url,
            createdAt,
          },
        });

        createdUsers.push({
          name: fullName,
          email,
          gender: "female",
        });

        console.log(`[CREATE_PROFILES] Created user: ${fullName} (${email})`);
      } catch (error: any) {
        console.error(`[CREATE_PROFILES] Error processing ${photoFile}:`, error);
        errors.push({
          photo: photoFile,
          error: error.message || "Unknown error",
        });
      }
    }

    const maleCount = createdUsers.filter((u) => u.gender === "male").length;
    const femaleCount = createdUsers.filter((u) => u.gender === "female").length;

    return NextResponse.json({
      success: true,
      message: `${createdUsers.length} profil hesabı başarıyla oluşturuldu.`,
      stats: {
        totalCreated: createdUsers.length,
        maleCount,
        femaleCount,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[CREATE_PROFILES] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Profil hesapları oluşturulurken beklenmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

