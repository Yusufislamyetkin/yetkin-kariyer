import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendAccountCredentialsEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, planType } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "E-posta ve ad soyad gereklidir" },
        { status: 400 }
      );
    }

    // E-posta format kontrolü
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    let user;
    let password = "";
    let isNewUser = false;

    if (existingUser) {
      // Kullanıcı zaten varsa, mevcut kullanıcıyı kullan
      user = existingUser;
    } else {
      // Yeni kullanıcı oluştur
      isNewUser = true;
      // Otomatik şifre oluştur
      password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + "!@#";
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            name: fullName,
            role: "candidate",
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });
      } catch (createError: any) {
        console.error("User creation error:", createError);
        if (createError.code === "P2002") {
          return NextResponse.json(
            { error: "Bu email adresi zaten kullanılıyor" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "Kullanıcı oluşturulurken bir hata oluştu" },
          { status: 500 }
        );
      }

      // E-posta gönder
      try {
        await sendAccountCredentialsEmail(email, fullName, password, planType);
      } catch (emailError: any) {
        console.error("Email send error:", emailError);
        // E-posta gönderilemese bile kullanıcı oluşturuldu, sadece log'la
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      isNewUser,
      message: isNewUser 
        ? "Hesabınız oluşturuldu ve giriş bilgileri e-posta adresinize gönderildi."
        : "Mevcut hesabınız kullanılıyor.",
    });
  } catch (error: any) {
    console.error("Create account error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

