// Bu script tüm diller için junior case JSON dosyalarını oluşturur
import fs from "fs";
import path from "path";

const languages = [
  { id: "csharp", name: "C#" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "cpp", name: "C++" },
  { id: "kotlin", name: "Kotlin" },
  { id: "swift", name: "Swift" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "scala", name: "Scala" },
  { id: "dart", name: "Dart" },
  { id: "r", name: "R" },
];

const cases = [
  {
    id: 1,
    title: "Sayısal Çıktı Döngüsü",
    description: "1'den 50'ye kadar sayıları ekrana yazdırın.",
    taskDescription: "1'den 50'ye kadar olan sayıları ekrana yazdırın. Her satırda bir sayı olsun ve format şu şekilde olsun: 'Selam Sana Dünya 1', 'Selam Sana Dünya 2', ... 'Selam Sana Dünya 50'",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "1'den 50'ye kadar tüm sayılar yazdırılmalı",
      "Her satır 'Selam Sana Dünya X' formatında olmalı",
      "Döngü kullanılmalı",
      "Kod okunabilir ve temiz olmalı"
    ]
  },
  {
    id: 2,
    title: "Temel Matematik İşlemleri",
    description: "İki sayı üzerinde temel matematik işlemleri yapın.",
    taskDescription: "Kullanıcıdan iki sayı alın (a ve b) ve bu sayılar üzerinde toplama, çıkarma, çarpma ve bölme işlemlerini yaparak sonuçları ekrana yazdırın. Örnek: a=10, b=5 için '10 + 5 = 15', '10 - 5 = 5', '10 * 5 = 50', '10 / 5 = 2'",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "Dört işlem (toplama, çıkarma, çarpma, bölme) yapılmalı",
      "Sonuçlar ekrana yazdırılmalı",
      "Bölme işleminde sıfıra bölme hatası kontrol edilmeli",
      "Kod okunabilir ve temiz olmalı"
    ]
  },
  {
    id: 3,
    title: "String İşlemleri",
    description: "Metin üzerinde temel string işlemleri yapın.",
    taskDescription: "Bir string alın ve şu işlemleri yapın: 1) String'in uzunluğunu bulun, 2) String'i büyük harfe çevirin, 3) String'i küçük harfe çevirin, 4) String'in tersini alın, 5) String içinde belirli bir karakteri sayın. Tüm sonuçları ekrana yazdırın.",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "String uzunluğu hesaplanmalı",
      "Büyük/küçük harf dönüşümleri yapılmalı",
      "String tersi alınmalı",
      "Karakter sayımı yapılmalı",
      "Tüm sonuçlar ekrana yazdırılmalı"
    ]
  },
  {
    id: 4,
    title: "Dizi İşlemleri",
    description: "Bir dizi oluşturun ve üzerinde temel işlemler yapın.",
    taskDescription: "5 elemanlı bir integer dizisi oluşturun ve şu işlemleri yapın: 1) Diziye değerler atayın, 2) Dizideki en büyük elemanı bulun, 3) Dizideki en küçük elemanı bulun, 4) Dizideki tüm elemanların toplamını hesaplayın, 5) Dizideki tüm elemanları ekrana yazdırın.",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "5 elemanlı bir dizi oluşturulmalı",
      "En büyük ve en küçük eleman bulunmalı",
      "Elemanların toplamı hesaplanmalı",
      "Tüm elemanlar ekrana yazdırılmalı",
      "Dizi kullanılmalı"
    ]
  },
  {
    id: 5,
    title: "Koşullu İfadeler",
    description: "If-else yapıları ile basit kontrol akışı oluşturun.",
    taskDescription: "Kullanıcıdan bir sayı alın ve şu kontrolleri yapın: 1) Sayı 0'dan küçükse 'Negatif' yazdırın, 2) Sayı 0 ise 'Sıfır' yazdırın, 3) Sayı 0'dan büyükse 'Pozitif' yazdırın. Ayrıca sayı çift ise 'Çift', tek ise 'Tek' bilgisini de yazdırın.",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "Sayının pozitif/negatif/sıfır kontrolü yapılmalı",
      "Sayının çift/tek kontrolü yapılmalı",
      "If-else yapıları kullanılmalı",
      "Sonuçlar ekrana yazdırılmalı"
    ]
  },
  {
    id: 6,
    title: "Fonksiyon Oluşturma",
    description: "Basit bir fonksiyon yazın ve çağırın.",
    taskDescription: "İki sayıyı parametre olarak alan ve bu sayıların toplamını döndüren bir fonksiyon yazın. Fonksiyonun adı 'Topla' olsun. Main metodunda bu fonksiyonu 3 kez farklı sayılarla çağırın ve sonuçları ekrana yazdırın. Örnek: Topla(5, 3) = 8, Topla(10, 20) = 30, Topla(100, 200) = 300",
    acceptanceCriteria: [
      "Kod derlenmeli ve hatasız çalışmalı",
      "İki parametre alan bir fonksiyon oluşturulmalı",
      "Fonksiyon toplamı döndürmeli",
      "Fonksiyon en az 3 kez çağrılmalı",
      "Sonuçlar ekrana yazdırılmalı",
      "Fonksiyon yapısı doğru kullanılmalı"
    ]
  }
];

const outputDir = path.join(process.cwd(), "data", "live-coding", "junior-cases");

// Output dizinini oluştur
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Her dil için JSON dosyası oluştur
languages.forEach((lang) => {
  const languageCases = cases.map((c) => ({
    id: `${lang.id}-junior-${c.id}`,
    title: c.title,
    description: c.description,
    taskDescription: c.taskDescription,
    level: "beginner",
    timeLimitMinutes: 30,
    acceptanceCriteria: c.acceptanceCriteria
  }));

  const jsonContent = {
    language: lang.id,
    languageName: lang.name,
    cases: languageCases
  };

  const filePath = path.join(outputDir, `${lang.id}-junior-cases.json`);
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), "utf8");
  console.log(`✓ ${lang.name} case'leri oluşturuldu: ${filePath}`);
});

console.log(`\n✅ Toplam ${languages.length} dil için ${cases.length} case oluşturuldu!`);

