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

    // Get request body for mode and noPhotoUserCount
    let mode: "photos" | "no-photos" | "both" = "both"; // Default to both for backward compatibility
    let noPhotoUserCount = 1000; // Default value
    try {
      const body = await request.json();
      if (body && typeof body.mode === "string" && ["photos", "no-photos", "both"].includes(body.mode)) {
        mode = body.mode;
      }
      if (body && typeof body.noPhotoUserCount === "number" && body.noPhotoUserCount >= 0) {
        noPhotoUserCount = body.noPhotoUserCount;
      }
    } catch (e) {
      // If body parsing fails, use default values
      console.log("[CREATE_PROFILES] Using default values: mode=both, noPhotoUserCount=1000");
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN && mode !== "no-photos") {
      return NextResponse.json(
        { error: "Blob storage not configured" },
        { status: 500 }
      );
    }

    console.log(`[CREATE_PROFILES] Starting profile creation with mode: ${mode}, noPhotoUserCount: ${noPhotoUserCount}`);

    // Initialize tracking variables
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

    // Process photos if mode is "photos" or "both"
    let manPhotos: string[] = [];
    let womanPhotos: string[] = [];
    
    if (mode === "photos" || mode === "both") {
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
      manPhotos = readdirSync(manPhotosPath).filter(
        (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
      );
      womanPhotos = readdirSync(womanPhotosPath).filter(
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
          let emailAttempts = 0;
          const maxEmailAttempts = 100; // Prevent infinite loop
          // Ensure email uniqueness
          while (emailAttempts < maxEmailAttempts) {
            const existingUser = await db.user.findUnique({
              where: { email },
            });
            if (!existingUser) break;
            email = generateEmail(name, surname, globalUserIndex + emailIndex);
            emailIndex++;
            emailAttempts++;
          }
          
          if (emailAttempts >= maxEmailAttempts) {
            throw new Error(`Could not generate unique email after ${maxEmailAttempts} attempts`);
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
          let emailAttempts = 0;
          const maxEmailAttempts = 100; // Prevent infinite loop
          // Ensure email uniqueness
          while (emailAttempts < maxEmailAttempts) {
            const existingUser = await db.user.findUnique({
              where: { email },
            });
            if (!existingUser) break;
            email = generateEmail(name, surname, globalUserIndex + emailIndex);
            emailIndex++;
            emailAttempts++;
          }
          
          if (emailAttempts >= maxEmailAttempts) {
            throw new Error(`Could not generate unique email after ${maxEmailAttempts} attempts`);
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
    }

    // Create users without profile photos (random gender distribution)
    let noPhotoCreatedCount = 0;
    let noPhotoMaleCount = 0;
    let noPhotoFemaleCount = 0;
    
    if (mode === "no-photos" || mode === "both") {
      console.log(`[CREATE_PROFILES] Creating ${noPhotoUserCount} users without profile photos...`);

      // Create users without photos with better error handling
      for (let i = 0; i < noPhotoUserCount; i++) {
        try {
          // Randomly assign gender (approximately 50/50 split)
          const isMale = Math.random() < 0.5;
          const { name, surname, fullName } = getRandomNameSurname(isMale, usedNameCombinations);

          // Generate email
          let email = generateEmail(name, surname, globalUserIndex);
          let emailIndex = 0;
          let emailAttempts = 0;
          const maxEmailAttempts = 100; // Prevent infinite loop
          // Ensure email uniqueness
          while (emailAttempts < maxEmailAttempts) {
            const existingUser = await db.user.findUnique({
              where: { email },
            });
            if (!existingUser) break;
            email = generateEmail(name, surname, globalUserIndex + emailIndex);
            emailIndex++;
            emailAttempts++;
          }
          
          if (emailAttempts >= maxEmailAttempts) {
            throw new Error(`Could not generate unique email after ${maxEmailAttempts} attempts`);
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

          noPhotoCreatedCount++;
          if (isMale) {
            noPhotoMaleCount++;
          } else {
            noPhotoFemaleCount++;
          }

          console.log(`[CREATE_PROFILES] Created no-photo user ${noPhotoCreatedCount}/${noPhotoUserCount}: ${fullName} (${email}) - ${isMale ? "male" : "female"}`);
        } catch (error: any) {
          console.error(`[CREATE_PROFILES] Error creating no-photo user (iteration ${i + 1}/${noPhotoUserCount}):`, error);
          errors.push({
            photo: `no-photo-${i + 1}`,
            error: error.message || "Unknown error",
          });
          // Continue to next iteration instead of breaking
        }
      }
      
      console.log(`[CREATE_PROFILES] Completed no-photo creation: ${noPhotoCreatedCount}/${noPhotoUserCount} users created successfully`);
    }

    // Calculate statistics
    const totalCreated = createdUsers.length;
    const maleCount = createdUsers.filter((u) => u.gender === "male").length;
    const femaleCount = createdUsers.filter((u) => u.gender === "female").length;
    
    // Calculate photo counts
    const photoMaleCount = mode === "photos" || mode === "both" ? manPhotos.length : 0;
    const photoFemaleCount = mode === "photos" || mode === "both" ? womanPhotos.length : 0;
    const photoCreatedCount = createdUsers.length - noPhotoCreatedCount;
    
    // Calculate no-photo counts
    const noPhotoRequestedCount = mode === "no-photos" || mode === "both" ? noPhotoUserCount : 0;
    
    // Build message based on mode
    let message = "";
    if (mode === "photos") {
      message = `${photoCreatedCount} fotoğraflı profil hesabı başarıyla oluşturuldu.`;
    } else if (mode === "no-photos") {
      message = `${noPhotoCreatedCount} fotoğrafsız profil hesabı başarıyla oluşturuldu (${noPhotoRequestedCount} istenen, ${noPhotoRequestedCount - noPhotoCreatedCount} hata).`;
    } else {
      message = `${totalCreated} profil hesabı başarıyla oluşturuldu (${photoCreatedCount} fotoğraflı, ${noPhotoCreatedCount} fotoğrafsız).`;
    }

    return NextResponse.json({
      success: true,
      message,
      stats: {
        totalCreated,
        maleCount,
        femaleCount,
        photoMaleCount,
        photoFemaleCount,
        photoCreatedCount,
        noPhotoRequestedCount,
        noPhotoCreatedCount,
        noPhotoMaleCount,
        noPhotoFemaleCount,
        mode,
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

