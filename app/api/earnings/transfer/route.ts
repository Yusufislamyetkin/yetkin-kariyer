import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const body = await request.json();
    const { iban: providedIban, fullName } = body;

    // Get user profile to check name and IBAN
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        iban: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Use provided fullName or user's name
    const userName = fullName || user.name;

    // Check if user has name (ad soyad)
    if (!userName || userName.trim() === "") {
      return NextResponse.json(
        {
          error: "AD_SOYAD_REQUIRED",
          message: "Lütfen önce ad ve soyad bilgilerinizi giriniz",
        },
        { status: 400 }
      );
    }

    // Use provided IBAN or user's saved IBAN
    let cleanIban: string;
    if (providedIban && providedIban.trim() !== "") {
      cleanIban = providedIban.replace(/\s/g, "").toUpperCase();
    } else if (user.iban) {
      cleanIban = user.iban.replace(/\s/g, "").toUpperCase();
    } else {
      return NextResponse.json(
        {
          error: "IBAN_REQUIRED",
          message: "Lütfen IBAN bilginizi giriniz",
        },
        { status: 400 }
      );
    }

    // Validate IBAN format (basic validation)
    if (cleanIban.length < 26 || cleanIban.length > 34) {
      return NextResponse.json(
        {
          error: "INVALID_IBAN",
          message: "Geçersiz IBAN formatı",
        },
        { status: 400 }
      );
    }

    // Save IBAN if it was provided and different from saved one
    if (providedIban && providedIban.trim() !== "" && user.iban !== cleanIban) {
      await db.user.update({
        where: { id: userId },
        data: { iban: cleanIban },
      });
    }

    // Calculate total earnings from Earning table (source of truth)
    let allEarnings: any[] = [];
    try {
      allEarnings = await db.earning.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      allEarnings = [];
    }

    const totalEarnings = allEarnings.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    // Check if balance is 0
    if (totalEarnings === 0) {
      return NextResponse.json(
        {
          error: "ZERO_BALANCE",
          message: "Henüz bir kazanç elde etmediniz",
        },
        { status: 400 }
      );
    }

    // Check minimum withdrawal amount (1000 TL)
    if (totalEarnings < 1000) {
      return NextResponse.json(
        {
          error: "MINIMUM_AMOUNT_REQUIRED",
          message: "Para çekmek için minimum 1000 TL kazanç gerekmektedir",
        },
        { status: 400 }
      );
    }

    // Here you would implement the actual transfer logic
    // In a real implementation, you would:
    // 1. Create a transfer record in database
    // 2. Mark earnings as transferred
    // 3. Send money to the IBAN via payment gateway
    // 4. Log the transaction
    // 5. Update user's IBAN for future use

    // For now, we'll just validate and return success
    // In production, you would integrate with a payment provider

    return NextResponse.json({
      success: true,
      message: "Kazanç hesabınıza aktarılıyor...",
      amount: totalEarnings,
      iban: cleanIban.substring(0, 4) + "****" + cleanIban.substring(cleanIban.length - 4), // Masked IBAN
    });
  } catch (error) {
    console.error("Error processing transfer:", error);
    return NextResponse.json(
      { error: "Transfer işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
