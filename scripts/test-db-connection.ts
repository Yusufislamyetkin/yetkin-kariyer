/* eslint-disable no-console */
import { db } from "@/lib/db";

async function test() {
  try {
    const user = await db.user.findUnique({
      where: { email: "yusufislamyetkin@hotmail.com" },
    });
    console.log("✅ Veritabanı bağlantısı başarılı!");
    if (user) {
      console.log(`✅ Kullanıcı bulundu: ${user.id}`);
    } else {
      console.log("ℹ️  Kullanıcı henüz oluşturulmamış");
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

test();

