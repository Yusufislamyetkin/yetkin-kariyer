import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token gerekli"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Find user by reset token
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Geçersiz veya süresi dolmuş token. Lütfen yeni bir şifre sıfırlama isteği gönderin." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json(
      { message: "Şifreniz başarıyla sıfırlandı. Giriş sayfasından yeni şifrenizle giriş yapabilirsiniz." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}

// GET endpoint to verify token validity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, message: "Token gerekli" }, { status: 400 });
    }

    // Check if token exists and is not expired
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, message: "Geçersiz veya süresi dolmuş token" },
        { status: 200 }
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ valid: false, message: "Token doğrulanamadı" }, { status: 500 });
  }
}

