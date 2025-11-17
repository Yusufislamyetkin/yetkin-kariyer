import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// İlk 10 C# konusu (canlı kodlama için)
const C_SHARP_TOPICS_10 = [
  { title: "C# Array İşlemleri", level: "beginner", description: "Diziler üzerinde temel işlemler yapın." },
  { title: "C# LINQ Sorguları", level: "intermediate", description: "LINQ ile veri sorgulama ve filtreleme." },
  { title: "C# Async/Await", level: "intermediate", description: "Asenkron programlama ile performans optimizasyonu." },
  { title: "C# Collections", level: "beginner", description: "List, Dictionary ve diğer koleksiyon türleri." },
  { title: "C# String Manipülasyonu", level: "beginner", description: "String işlemleri ve metin dönüşümleri." },
  { title: "C# OOP Prensipleri", level: "intermediate", description: "Nesne yönelimli programlama temelleri." },
  { title: "C# Exception Handling", level: "beginner", description: "Hata yönetimi ve exception handling." },
  { title: "C# Delegates ve Events", level: "advanced", description: "Delegates ve event mekanizmaları." },
  { title: "C# Generics", level: "intermediate", description: "Generic tipler ve type-safe kodlama." },
  { title: "C# Extension Methods", level: "intermediate", description: "Extension method'lar ile kod genişletme." },
];

const DEFAULT_CSHARP_TEMPLATE = `using System;
using System.Collections.Generic;
using System.Linq;

namespace LiveCoding
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            // Çözümünüzü buraya yazın
        }
    }
}`;

function generateTaskForTopic(topic: typeof C_SHARP_TOPICS_10[0], index: number) {
  const taskId = `task-${index + 1}`;
  
  const acceptanceCriteria = [
    "Kod derlenmeli ve hatasız çalışmalı",
    "Beklenen çıktıyı üretmeli",
    "Kod okunabilir ve temiz olmalı",
  ];

  let description = topic.description;
  let initialCode = DEFAULT_CSHARP_TEMPLATE;

  if (topic.title.includes("Array")) {
    description = "Bir integer dizisi verildiğinde, dizideki en büyük ve en küçük elemanları bulun ve toplamlarını döndürün.";
    acceptanceCriteria.push("Dizi boş olamaz", "Sonuç doğru hesaplanmalı");
  } else if (topic.title.includes("LINQ")) {
    description = "Bir koleksiyondan belirli kriterlere uyan elemanları LINQ kullanarak filtreleyin ve sıralayın.";
    acceptanceCriteria.push("LINQ metodları kullanılmalı", "Performans optimize edilmeli");
  } else if (topic.title.includes("Async")) {
    description = "Asenkron bir metod oluşturun ve birden fazla async işlemi paralel olarak çalıştırın.";
    acceptanceCriteria.push("Async/await kullanılmalı", "Task.WhenAll veya benzeri kullanılmalı");
  } else if (topic.title.includes("Collections")) {
    description = "Farklı koleksiyon türlerini kullanarak veri yapıları oluşturun ve işlemler yapın.";
    acceptanceCriteria.push("En az 2 farklı koleksiyon türü kullanılmalı");
  } else if (topic.title.includes("String")) {
    description = "String manipülasyonu yaparak metinleri dönüştürün, birleştirin veya parse edin.";
    acceptanceCriteria.push("StringBuilder veya string interpolation kullanılmalı");
  } else if (topic.title.includes("OOP")) {
    description = "OOP prensipleri kullanarak bir sınıf hiyerarşisi oluşturun (inheritance, polymorphism).";
    acceptanceCriteria.push("En az 2 sınıf arasında inheritance olmalı", "Polymorphism kullanılmalı");
  } else if (topic.title.includes("Exception")) {
    description = "Try-catch blokları kullanarak hata yönetimi yapın ve özel exception'lar oluşturun.";
    acceptanceCriteria.push("Try-catch-finally kullanılmalı", "Özel exception sınıfı oluşturulmalı");
  } else {
    description = `${topic.description} Bu konuyla ilgili bir çözüm geliştirin.`;
  }

  return {
    id: taskId,
    title: topic.title,
    description,
    languages: ["csharp"] as const,
    timeLimitMinutes: topic.level === "beginner" ? 30 : topic.level === "intermediate" ? 45 : 60,
    acceptanceCriteria,
    initialCode: {
      csharp: initialCode,
    },
  };
}

// İlk 10 bugfix template'i
function generateBugfixTemplates10(): Array<{
  id: string;
  title: string;
  description: string;
  level: string;
  buggyCode: string;
  hints?: string[];
  acceptanceCriteria?: string[];
}> {
  return [
    {
      id: "bugfix-001",
      title: "Null Reference Exception",
      description: "Aşağıdaki kodda null reference exception hatası var. Kodu düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class UserService
{
    public string GetUserName(string userId)
    {
        var user = GetUser(userId);
        return user.Name; // Null reference hatası
    }
    
    private User GetUser(string userId)
    {
        // Kullanıcı bulunamazsa null döner
        return null;
    }
}

public class User
{
    public string Name { get; set; }
}`,
      hints: ["Null kontrolü yapmayı unutmayın", "Null-conditional operator (?) kullanabilirsiniz"],
      acceptanceCriteria: ["Null reference exception oluşmamalı", "Kullanıcı bulunamazsa uygun bir mesaj dönmeli"]
    },
    {
      id: "bugfix-002",
      title: "Array Index Out of Bounds",
      description: "Dizi sınırları dışına çıkma hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class ArrayProcessor
{
    public int GetLastElement(int[] numbers)
    {
        return numbers[numbers.Length]; // Index out of bounds
    }
}`,
      hints: ["Dizi indeksleri 0'dan başlar", "Son eleman için Length - 1 kullanın"],
      acceptanceCriteria: ["Index out of bounds hatası olmamalı", "Son eleman doğru dönmeli"]
    },
    {
      id: "bugfix-003",
      title: "Infinite Loop",
      description: "Sonsuz döngü problemi var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class Counter
{
    public void CountToTen()
    {
        int i = 0;
        while (i < 10)
        {
            Console.WriteLine(i);
            // i artırılmıyor - sonsuz döngü
        }
    }
}`,
      hints: ["Döngü değişkenini artırmayı unutmayın", "i++ ekleyin"],
      acceptanceCriteria: ["Döngü 10 kez çalışmalı", "0'dan 9'a kadar sayılar yazdırılmalı"]
    },
    {
      id: "bugfix-004",
      title: "String Comparison Bug",
      description: "String karşılaştırma hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class StringValidator
{
    public bool IsValid(string input)
    {
        return input == "admin"; // Büyük/küçük harf duyarlı
    }
}`,
      hints: ["String karşılaştırmada büyük/küçük harf duyarlılığına dikkat edin", "Equals metodunu kullanın"],
      acceptanceCriteria: ["Büyük/küçük harf fark etmeksizin karşılaştırma yapmalı", "'Admin' ve 'admin' aynı kabul edilmeli"]
    },
    {
      id: "bugfix-005",
      title: "Division by Zero",
      description: "Sıfıra bölme hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class Calculator
{
    public double Divide(double a, double b)
    {
        return a / b; // Sıfıra bölme hatası
    }
}`,
      hints: ["Bölen sıfır olup olmadığını kontrol edin", "Exception fırlatabilir veya özel değer dönebilirsiniz"],
      acceptanceCriteria: ["Sıfıra bölme durumunda uygun hata yönetimi yapılmalı", "Exception fırlatılmalı veya uygun mesaj dönmeli"]
    },
    {
      id: "bugfix-006",
      title: "Off-by-One Error",
      description: "Off-by-one hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class RangeProcessor
{
    public void ProcessRange(int start, int end)
    {
        for (int i = start; i <= end; i++)
        {
            Console.WriteLine(i);
        }
        // end değeri dahil edilmiyor
    }
}`,
      hints: ["Döngü sınırlarını kontrol edin", "<= veya < kullanımına dikkat edin"],
      acceptanceCriteria: ["Tüm aralık işlenmeli", "start ve end dahil olmalı"]
    },
    {
      id: "bugfix-007",
      title: "Uninitialized Variable",
      description: "Başlatılmamış değişken hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class SumCalculator
{
    public int CalculateSum(int[] numbers)
    {
        int sum;
        foreach (var num in numbers)
        {
            sum += num; // sum başlatılmamış
        }
        return sum;
    }
}`,
      hints: ["Değişkenleri kullanmadan önce başlatın", "sum = 0 ile başlatın"],
      acceptanceCriteria: ["Tüm sayıların toplamı doğru hesaplanmalı", "Derleme hatası olmamalı"]
    },
    {
      id: "bugfix-008",
      title: "Missing Return Statement",
      description: "Return ifadesi eksik. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class MathHelper
{
    public int Add(int a, int b)
    {
        int result = a + b;
        // return eksik
    }
}`,
      hints: ["Metodun dönüş tipi varsa return ifadesi olmalı", "result değerini döndürün"],
      acceptanceCriteria: ["Metod doğru değeri döndürmeli", "Derleme hatası olmamalı"]
    },
    {
      id: "bugfix-009",
      title: "Logic Error in Condition",
      description: "Koşul ifadesinde mantık hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class AgeValidator
{
    public bool IsAdult(int age)
    {
        return age > 18 && age < 18; // Mantık hatası
    }
}`,
      hints: ["Koşul mantığını gözden geçirin", "&& yerine || kullanılmalı mı?"],
      acceptanceCriteria: ["18 yaş ve üzeri true dönmeli", "18 yaş altı false dönmeli"]
    },
    {
      id: "bugfix-010",
      title: "Missing Null Check",
      description: "Null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Collections.Generic;

public class ListProcessor
{
    public int GetFirstItem(List<int> numbers)
    {
        return numbers[0]; // Null check eksik
    }
}`,
      hints: ["Liste null olabilir mi kontrol edin", "Liste boş olabilir mi kontrol edin"],
      acceptanceCriteria: ["Null liste kontrolü yapılmalı", "Boş liste kontrolü yapılmalı"]
    }
  ];
}

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Seed data functionality has been removed" },
      { status: 410 }
    );

    // course-dotnet-roadmap'i bul
    const course = await db.course.findUnique({
      where: { id: "course-dotnet-roadmap" },
    });

    if (!course) {
      return NextResponse.json(
        { error: "course-dotnet-roadmap bulunamadı" },
        { status: 404 }
      );
    }

    const liveCodingCreated = [];
    const liveCodingErrors = [];
    const bugfixCreated = [];
    const bugfixErrors = [];

    // 10 adet canlı kodlama oluştur
    for (let i = 0; i < C_SHARP_TOPICS_10.length; i++) {
      const topic = C_SHARP_TOPICS_10[i];
      const task = generateTaskForTopic(topic, i);
      
      const quizId = `quiz-csharp-live-coding-batch-${i + 1}`;
      
      const questions = {
        tasks: [task],
        instructions: `${topic.title} konusunda pratik yapın. Görevi tamamlamak için verilen kriterleri karşılamalısınız.`,
      };

      try {
        const quiz = await db.quiz.upsert({
          where: { id: quizId },
          update: {
            title: topic.title,
            description: topic.description,
            topic: ".NET Core",
            type: "LIVE_CODING",
            level: topic.level,
            questions,
            passingScore: 60,
          },
          create: {
            id: quizId,
            courseId: course.id,
            title: topic.title,
            description: topic.description,
            topic: ".NET Core",
            type: "LIVE_CODING",
            level: topic.level,
            questions,
            passingScore: 60,
          },
        });

        liveCodingCreated.push({
          id: quiz.id,
          title: quiz.title,
          level: quiz.level,
        });
      } catch (error: any) {
        liveCodingErrors.push({
          topic: topic.title,
          error: error.message || "Bilinmeyen hata",
        });
      }
    }

    // 10 adet bugfix oluştur
    const bugfixTemplates = generateBugfixTemplates10();
    
    for (const template of bugfixTemplates) {
      try {
        const quizId = `bugfix-csharp-batch-${template.id}`;
        
        // Bugfix için questions field'ını tasks array formatında oluştur
        const questions: any = {
          tasks: [
            {
              id: template.id,
              title: template.title,
              description: template.description,
              languages: ["csharp"],
              buggyCode: {
                csharp: template.buggyCode
              },
              hints: template.hints || [],
              acceptanceCriteria: template.acceptanceCriteria || []
            }
          ]
        };
        
        const quiz = await db.quiz.upsert({
          where: { id: quizId },
          create: {
            id: quizId,
            courseId: course.id,
            title: `C# Bugfix: ${template.title}`,
            description: template.description,
            topic: "C#",
            type: "BUG_FIX",
            level: template.level,
            questions: questions as any,
            passingScore: 60,
            lessonSlug: null,
          },
          update: {
            title: `C# Bugfix: ${template.title}`,
            description: template.description,
            topic: "C#",
            type: "BUG_FIX",
            level: template.level,
            questions: questions as any,
            passingScore: 60,
            lessonSlug: null,
            updatedAt: new Date(),
          },
        });
        
        bugfixCreated.push({
          id: quiz.id,
          title: quiz.title,
          level: quiz.level || template.level,
        });
      } catch (error: any) {
        bugfixErrors.push({
          template: template.id,
          error: error.message || 'Unknown error'
        });
      }
    }

    const totalCreated = liveCodingCreated.length + bugfixCreated.length;
    const totalErrors = liveCodingErrors.length + bugfixErrors.length;

    return NextResponse.json({
      success: totalErrors === 0,
      liveCodingCreated: liveCodingCreated.length,
      bugfixCreated: bugfixCreated.length,
      totalCreated,
      liveCoding: liveCodingCreated,
      bugfix: bugfixCreated,
      errors: totalErrors > 0 ? {
        liveCoding: liveCodingErrors.length > 0 ? liveCodingErrors : undefined,
        bugfix: bugfixErrors.length > 0 ? bugfixErrors : undefined,
      } : undefined,
      message: `${liveCodingCreated.length} adet canlı kodlama ve ${bugfixCreated.length} adet bugfix içeriği başarıyla oluşturuldu.`,
    });
  } catch (error: any) {
    console.error("Error creating content batch:", error);
    return NextResponse.json(
      { 
        success: false,
        liveCodingCreated: 0,
        bugfixCreated: 0,
        totalCreated: 0,
        error: error.message || "İçerik oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

