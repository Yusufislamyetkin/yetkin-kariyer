import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { TURKISH_FEMALE_NAMES, TURKISH_MALE_NAMES, TURKISH_SURNAMES } from "@/lib/admin/turkish-names";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body for noPhotoUserCount
    let noPhotoUserCount = 1000; // Default value
    try {
      const body = await request.json();
      if (body && typeof body.noPhotoUserCount === "number" && body.noPhotoUserCount >= 0) {
        noPhotoUserCount = body.noPhotoUserCount;
      }
    } catch (e) {
      // If body parsing fails, use default value
      console.log("[CREATE_PROFILES] Using default noPhotoUserCount: 1000");
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
      (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
    );
    const womanPhotos = readdirSync(womanPhotosPath).filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
    );

    console.log(`[CREATE_PROFILES] Found ${manPhotos.length} male photos, ${womanPhotos.length} female photos`);

    if (manPhotos.length === 0 && womanPhotos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Fotoğraf klasörlerinde hiç fotoğraf bulunamadı. Lütfen .jpg, .jpeg veya .png uzantılı fotoğrafların mevcut olduğundan emin olun.",
        },
        { status: 500 }
      );
    }

    const createdUsers: Array<{ name: string; email: string; gender: string }> = [];
    const errors: Array<{ photo: string; error: string }> = [];
    let globalUserIndex = 0; // Track total users created for email uniqueness
    const usedNameCombinations = new Set<string>(); // Track used name combinations for diversity

    // Helper function to generate email with varied formats
    const generateEmail = (name: string, surname: string, index: number): string => {
      const nameLower = name.toLowerCase();
      const surnameLower = surname.toLowerCase();
      const emailProviders = ["@outlook.com.tr", "@outlook.com", "@gmail.com"];
      
      // Randomly select a provider
      const provider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
      
      // 5 different email formats, randomly selected
      const formats = [
        () => `${nameLower}.${surnameLower}${index}${provider}`, // isim.soyisim{numara}@domain
        () => `${nameLower}${index}${provider}`, // isim{numara}@domain
        () => `${nameLower}${surnameLower}${index}${provider}`, // isimsoyisim{numara}@domain
        () => `${nameLower}_${surnameLower}${index}${provider}`, // isim_soyisim{numara}@domain
        () => `${surnameLower}.${nameLower}${index}${provider}`, // soyisim.isim{numara}@domain
      ];
      
      const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
      return selectedFormat();
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

    // Helper function to get random name-surname combination with diversity
    const getRandomNameSurname = (isMale: boolean, usedCombinations: Set<string>): { name: string; surname: string; fullName: string } => {
      let name: string;
      let surname: string;
      let fullName: string;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loop
      
      do {
        const nameList = isMale ? TURKISH_MALE_NAMES : TURKISH_FEMALE_NAMES;
        const nameIndex = Math.floor(Math.random() * nameList.length);
        const surnameIndex = Math.floor(Math.random() * TURKISH_SURNAMES.length);
        name = nameList[nameIndex];
        surname = TURKISH_SURNAMES[surnameIndex];
        fullName = `${name} ${surname}`;
        attempts++;
      } while (usedCombinations.has(fullName) && attempts < maxAttempts);
      
      usedCombinations.add(fullName);
      return { name, surname, fullName };
    };

    // Process male photos
    for (let i = 0; i < manPhotos.length; i++) {
      const photoFile = manPhotos[i];
      const photoPath = join(manPhotosPath, photoFile);

      try {
        // Get name and surname from lists (random for diversity)
        const { name, surname, fullName } = getRandomNameSurname(true, usedNameCombinations);

        // Generate email
        let email = generateEmail(name, surname, globalUserIndex);
        let emailIndex = 0;
        // Ensure email uniqueness
        while (true) {
          const existingUser = await db.user.findUnique({
            where: { email },
          });
          if (!existingUser) break;
          email = generateEmail(name, surname, globalUserIndex + emailIndex);
          emailIndex++;
        }
        globalUserIndex++;

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
        // Get name and surname from lists (random for diversity)
        const { name, surname, fullName } = getRandomNameSurname(false, usedNameCombinations);

        // Generate email
        let email = generateEmail(name, surname, globalUserIndex);
        let emailIndex = 0;
        // Ensure email uniqueness
        while (true) {
          const existingUser = await db.user.findUnique({
            where: { email },
          });
          if (!existingUser) break;
          email = generateEmail(name, surname, globalUserIndex + emailIndex);
          emailIndex++;
        }
        globalUserIndex++;

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

    // Create users without profile photos (random gender distribution)
    console.log(`[CREATE_PROFILES] Creating ${noPhotoUserCount} users without profile photos...`);

    // Create 1000 users without photos (random gender distribution)
    for (let i = 0; i < noPhotoUserCount; i++) {
      try {
        // Randomly assign gender (approximately 50/50 split)
        const isMale = Math.random() < 0.5;
        const { name, surname, fullName } = getRandomNameSurname(isMale, usedNameCombinations);

        // Generate email
        let email = generateEmail(name, surname, globalUserIndex);
        let emailIndex = 0;
        // Ensure email uniqueness
        while (true) {
          const existingUser = await db.user.findUnique({
            where: { email },
          });
          if (!existingUser) break;
          email = generateEmail(name, surname, globalUserIndex + emailIndex);
          emailIndex++;
        }
        globalUserIndex++;

        // Generate password and hash
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate random date within last month
        const createdAt = generateRandomDate();

        // Create user without profile image
        const user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            name: fullName,
            role: "candidate",
            profileImage: null, // No profile photo
            createdAt,
          },
        });

        createdUsers.push({
          name: fullName,
          email,
          gender: isMale ? "male" : "female",
        });

        console.log(`[CREATE_PROFILES] Created no-photo user: ${fullName} (${email}) - ${isMale ? "male" : "female"}`);
      } catch (error: any) {
        console.error(`[CREATE_PROFILES] Error creating no-photo user:`, error);
        errors.push({
          photo: "no-photo",
          error: error.message || "Unknown error",
        });
      }
    }

    const maleCount = createdUsers.filter((u) => u.gender === "male").length;
    const femaleCount = createdUsers.filter((u) => u.gender === "female").length;
    const noPhotoMaleCount = createdUsers.filter((u) => u.gender === "male").length - manPhotos.length;
    const noPhotoFemaleCount = createdUsers.filter((u) => u.gender === "female").length - womanPhotos.length;

    return NextResponse.json({
      success: true,
      message: `${createdUsers.length} profil hesabı başarıyla oluşturuldu.`,
      stats: {
        totalCreated: createdUsers.length,
        maleCount,
        femaleCount,
        photoMaleCount: manPhotos.length,
        photoFemaleCount: womanPhotos.length,
        noPhotoUserCount,
        noPhotoMaleCount,
        noPhotoFemaleCount,
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

