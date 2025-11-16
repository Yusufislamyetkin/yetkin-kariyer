import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// 50 farklı C# konu bazlı görev tanımları
const C_SHARP_TOPICS = [
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
  { title: "C# Lambda Expressions", level: "intermediate", description: "Lambda ifadeleri ve fonksiyonel programlama." },
  { title: "C# Pattern Matching", level: "advanced", description: "Pattern matching ve switch expressions." },
  { title: "C# Nullable Types", level: "beginner", description: "Nullable tipler ve null kontrolü." },
  { title: "C# Tuples ve Deconstruction", level: "intermediate", description: "Tuple kullanımı ve deconstruction." },
  { title: "C# Records", level: "advanced", description: "Record tipleri ve immutable veri yapıları." },
  { title: "C# File I/O", level: "beginner", description: "Dosya okuma ve yazma işlemleri." },
  { title: "C# JSON Serialization", level: "intermediate", description: "JSON serileştirme ve deserileştirme." },
  { title: "C# DateTime İşlemleri", level: "beginner", description: "Tarih ve saat işlemleri." },
  { title: "C# Regex Kullanımı", level: "intermediate", description: "Regular expressions ile metin işleme." },
  { title: "C# Reflection", level: "advanced", description: "Reflection ile runtime tip bilgisi." },
  { title: "C# Attributes", level: "intermediate", description: "Attribute'lar ve metadata kullanımı." },
  { title: "C# Memory Management", level: "advanced", description: "Bellek yönetimi ve performans." },
  { title: "C# Threading", level: "advanced", description: "Multi-threading ve paralel programlama." },
  { title: "C# Task ve Task<T>", level: "intermediate", description: "Task-based asenkron programlama." },
  { title: "C# IEnumerable ve IEnumerator", level: "intermediate", description: "Iterator pattern ve koleksiyonlar." },
  { title: "C# Yield Keyword", level: "intermediate", description: "Yield ile lazy evaluation." },
  { title: "C# Using Statements", level: "beginner", description: "Resource management ve IDisposable." },
  { title: "C# Indexers", level: "intermediate", description: "Indexer'lar ile özel erişim." },
  { title: "C# Operator Overloading", level: "advanced", description: "Operator overloading ve özel operatörler." },
  { title: "C# Interface Segregation", level: "intermediate", description: "Interface tasarım prensipleri." },
  { title: "C# Dependency Injection", level: "intermediate", description: "DI container ve bağımlılık yönetimi." },
  { title: "C# Factory Pattern", level: "intermediate", description: "Factory pattern implementasyonu." },
  { title: "C# Singleton Pattern", level: "intermediate", description: "Singleton pattern ve thread safety." },
  { title: "C# Builder Pattern", level: "intermediate", description: "Builder pattern ile nesne oluşturma." },
  { title: "C# Observer Pattern", level: "advanced", description: "Observer pattern ve event-driven design." },
  { title: "C# Strategy Pattern", level: "intermediate", description: "Strategy pattern ile algoritma değiştirme." },
  { title: "C# Repository Pattern", level: "intermediate", description: "Repository pattern ve veri erişimi." },
  { title: "C# Unit of Work", level: "advanced", description: "Unit of Work pattern implementasyonu." },
  { title: "C# Specification Pattern", level: "advanced", description: "Specification pattern ile business logic." },
  { title: "C# Value Objects", level: "intermediate", description: "Value object pattern ve DDD." },
  { title: "C# Domain Events", level: "advanced", description: "Domain events ve event sourcing." },
  { title: "C# CQRS Basics", level: "advanced", description: "Command Query Responsibility Segregation." },
  { title: "C# Mediator Pattern", level: "intermediate", description: "Mediator pattern ile decoupling." },
  { title: "C# Pipeline Pattern", level: "advanced", description: "Pipeline pattern ve middleware." },
  { title: "C# Chain of Responsibility", level: "intermediate", description: "Chain of Responsibility pattern." },
  { title: "C# Adapter Pattern", level: "intermediate", description: "Adapter pattern ile uyumluluk." },
  { title: "C# Decorator Pattern", level: "intermediate", description: "Decorator pattern ile dinamik genişletme." },
  { title: "C# Facade Pattern", level: "beginner", description: "Facade pattern ile basitleştirme." },
  { title: "C# Proxy Pattern", level: "advanced", description: "Proxy pattern ve lazy loading." },
  { title: "C# State Pattern", level: "intermediate", description: "State pattern ile durum yönetimi." },
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

function generateTaskForTopic(topic: typeof C_SHARP_TOPICS[0], index: number) {
  const taskId = `task-${index + 1}`;
  
  // Konuya göre özel açıklamalar ve kabul kriterleri
  const acceptanceCriteria = [
    "Kod derlenmeli ve hatasız çalışmalı",
    "Beklenen çıktıyı üretmeli",
    "Kod okunabilir ve temiz olmalı",
  ];

  let description = topic.description;
  let initialCode = DEFAULT_CSHARP_TEMPLATE;

  // Konuya özel açıklamalar
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

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const createdExams = [];
    const errors = [];

    // 50 adet sınav oluştur
    for (let i = 0; i < C_SHARP_TOPICS.length; i++) {
      const topic = C_SHARP_TOPICS[i];
      const task = generateTaskForTopic(topic, i);
      
      const quizId = `quiz-csharp-live-coding-${i + 1}`;
      
      // Questions JSON'u - LiveCodingQuizPayload formatında
      const questions: Prisma.InputJsonValue = {
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

        createdExams.push({
          id: quiz.id,
          title: quiz.title,
          level: quiz.level,
        });
      } catch (error: any) {
        errors.push({
          topic: topic.title,
          error: error.message || "Bilinmeyen hata",
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: createdExams.length,
      exams: createdExams,
      errors: errors.length > 0 ? errors : undefined,
      message: `${createdExams.length} adet C# canlı kodlama sınavı başarıyla oluşturuldu.`,
    });
  } catch (error: any) {
    console.error("Error creating live coding exams:", error);
    return NextResponse.json(
      { error: error.message || "Canlı kodlama sınavları oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

