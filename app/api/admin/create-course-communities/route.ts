import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ChatGroupVisibility } from "@prisma/client";

const COURSE_COMMUNITIES = [
  {
    courseName: ".NET Core",
    id: "community-dotnet-core",
    slug: "dotnet-core-community",
    expertise: ".NET Core",
    description: ".NET Core Backend Framework öğrenenler için yardımlaşma topluluğu. ASP.NET Core, Entity Framework ve modern backend pratikleri üzerine sohbet edin.",
  },
  {
    courseName: "Java",
    id: "community-java",
    slug: "java-community",
    expertise: "Java",
    description: "Java Enterprise Language öğrenenler için yardımlaşma topluluğu. Spring Framework, Hibernate ve Java ekosistemi üzerine bilgi paylaşın.",
  },
  {
    courseName: "MSSQL",
    id: "community-mssql",
    slug: "mssql-community",
    expertise: "MSSQL",
    description: "MSSQL Database Management öğrenenler için yardımlaşma topluluğu. SQL sorguları, performans optimizasyonu ve veritabanı tasarımı konularında yardımlaşın.",
  },
  {
    courseName: "React",
    id: "community-react",
    slug: "react-community",
    expertise: "React",
    description: "React Frontend Library öğrenenler için yardımlaşma topluluğu. React hooks, state management ve modern frontend pratikleri üzerine sohbet edin.",
  },
  {
    courseName: "Angular",
    id: "community-angular",
    slug: "angular-community",
    expertise: "Angular",
    description: "Angular Frontend Framework öğrenenler için yardımlaşma topluluğu. TypeScript, RxJS ve Angular ekosistemi üzerine bilgi paylaşın.",
  },
  {
    courseName: "Node.js",
    id: "community-nodejs",
    slug: "nodejs-community",
    expertise: "Node.js",
    description: "Node.js Runtime Environment öğrenenler için yardımlaşma topluluğu. Express.js, npm paketleri ve server-side JavaScript üzerine sohbet edin.",
  },
  {
    courseName: "Yapay Zeka",
    id: "community-ai",
    slug: "ai-community",
    expertise: "AI",
    description: "Yapay Zeka (AI for Developers) öğrenenler için yardımlaşma topluluğu. Machine Learning, AI modelleri ve AI entegrasyonları üzerine bilgi paylaşın.",
  },
  {
    courseName: "Flutter",
    id: "community-flutter",
    slug: "flutter-community",
    expertise: "Flutter",
    description: "Flutter Mobile Development öğrenenler için yardımlaşma topluluğu. Dart programlama, widget'lar ve cross-platform mobil geliştirme üzerine sohbet edin.",
  },
  {
    courseName: "Ethical Hacking",
    id: "community-ethical-hacking",
    slug: "ethical-hacking-community",
    expertise: "Cybersecurity",
    description: "Ethical Hacking ve Cybersecurity öğrenenler için yardımlaşma topluluğu. Penetrasyon testleri, güvenlik açıkları ve siber güvenlik pratikleri üzerine bilgi paylaşın.",
  },
  {
    courseName: "Next.js",
    id: "community-nextjs",
    slug: "nextjs-community",
    expertise: "Next.js",
    description: "Next.js React Framework öğrenenler için yardımlaşma topluluğu. Server-side rendering, API routes ve Next.js ekosistemi üzerine sohbet edin.",
  },
  {
    courseName: "Docker & K8s",
    id: "community-docker-kubernetes",
    slug: "docker-kubernetes-community",
    expertise: "DevOps",
    description: "Docker & Kubernetes Containerization öğrenenler için yardımlaşma topluluğu. Konteyner teknolojileri, orchestration ve DevOps pratikleri üzerine bilgi paylaşın.",
  },
  {
    courseName: "OWASP Security",
    id: "community-owasp",
    slug: "owasp-community",
    expertise: "Web Security",
    description: "OWASP Web Security öğrenenler için yardımlaşma topluluğu. Web uygulama güvenliği, OWASP Top 10 ve güvenlik best practices üzerine sohbet edin.",
  },
  {
    courseName: "Python",
    id: "community-python",
    slug: "python-community",
    expertise: "Python",
    description: "Python Programming Language öğrenenler için yardımlaşma topluluğu. Web geliştirme, veri bilimi, yapay zeka ve Python ekosistemi üzerine bilgi paylaşın.",
  },
  {
    courseName: "Vue.js",
    id: "community-vuejs",
    slug: "vuejs-community",
    expertise: "Vue.js",
    description: "Vue.js Frontend Framework öğrenenler için yardımlaşma topluluğu. Vue 3, Composition API, Vuex ve modern frontend pratikleri üzerine sohbet edin.",
  },
  {
    courseName: "TypeScript",
    id: "community-typescript",
    slug: "typescript-community",
    expertise: "TypeScript",
    description: "TypeScript Programming Language öğrenenler için yardımlaşma topluluğu. Tip güvenliği, advanced types ve TypeScript best practices üzerine bilgi paylaşın.",
  },
  {
    courseName: "Go",
    id: "community-go",
    slug: "go-community",
    expertise: "Go",
    description: "Go Backend Language öğrenenler için yardımlaşma topluluğu. Go routines, channels, web development ve Go ekosistemi üzerine sohbet edin.",
  },
  {
    courseName: "PostgreSQL",
    id: "community-postgresql",
    slug: "postgresql-community",
    expertise: "PostgreSQL",
    description: "PostgreSQL Database System öğrenenler için yardımlaşma topluluğu. SQL sorguları, performans optimizasyonu, indexing ve veritabanı yönetimi konularında yardımlaşın.",
  },
  {
    courseName: "AWS",
    id: "community-aws",
    slug: "aws-community",
    expertise: "Cloud Platform",
    description: "AWS Cloud Platform öğrenenler için yardımlaşma topluluğu. EC2, S3, Lambda, CloudFormation ve AWS servisleri üzerine bilgi paylaşın.",
  },
  {
    courseName: "Swift",
    id: "community-swift",
    slug: "swift-community",
    expertise: "Swift",
    description: "Swift iOS Development öğrenenler için yardımlaşma topluluğu. iOS uygulama geliştirme, SwiftUI, UIKit ve Apple ekosistemi üzerine sohbet edin.",
  },
  {
    courseName: "Kotlin",
    id: "community-kotlin",
    slug: "kotlin-community",
    expertise: "Kotlin",
    description: "Kotlin Android Development öğrenenler için yardımlaşma topluluğu. Android uygulama geliştirme, Jetpack Compose ve Kotlin best practices üzerine bilgi paylaşın.",
  },
  {
    courseName: "MongoDB",
    id: "community-mongodb",
    slug: "mongodb-community",
    expertise: "MongoDB",
    description: "MongoDB NoSQL Database öğrenenler için yardımlaşma topluluğu. Document database, aggregation pipeline, indexing ve MongoDB ekosistemi üzerine sohbet edin.",
  },
  {
    courseName: "Spring Boot",
    id: "community-spring-boot",
    slug: "spring-boot-community",
    expertise: "Spring Boot",
    description: "Spring Boot Java Framework öğrenenler için yardımlaşma topluluğu. Spring ecosystem, REST APIs, microservices ve enterprise Java development üzerine bilgi paylaşın.",
  },
  {
    courseName: "NestJS",
    id: "community-nestjs",
    slug: "nestjs-community",
    expertise: "NestJS",
    description: "NestJS Node.js Framework öğrenenler için yardımlaşma topluluğu. TypeScript, decorators, modules ve scalable Node.js uygulamaları üzerine sohbet edin.",
  },
  {
    courseName: "Azure",
    id: "community-azure",
    slug: "azure-community",
    expertise: "Cloud Platform",
    description: "Azure Cloud Platform öğrenenler için yardımlaşma topluluğu. Azure services, cloud architecture, DevOps ve Microsoft cloud ekosistemi üzerine bilgi paylaşın.",
  },
];

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const createdCommunities = [];
    const updatedCommunities = [];

    for (const community of COURSE_COMMUNITIES) {
      const existing = await db.chatGroup.findUnique({
        where: { slug: community.slug },
      });

      const data = {
        name: `${community.courseName} Yardımlaşma Topluluğu`,
        slug: community.slug,
        expertise: community.expertise,
        description: community.description,
        visibility: "public" as ChatGroupVisibility,
        allowLinkJoin: false,
        inviteCode: null,
        createdById: null,
      };

      if (existing) {
        await db.chatGroup.update({
          where: { id: existing.id },
          data,
        });
        updatedCommunities.push(community.courseName);
      } else {
        await db.chatGroup.create({
          data: {
            id: community.id,
            ...data,
          },
        });
        createdCommunities.push(community.courseName);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdCommunities.length} topluluk oluşturuldu, ${updatedCommunities.length} topluluk güncellendi.`,
      stats: {
        created: createdCommunities.length,
        updated: updatedCommunities.length,
        total: COURSE_COMMUNITIES.length,
      },
      created: createdCommunities,
      updated: updatedCommunities,
    });
  } catch (error: any) {
    console.error("[CREATE_COURSE_COMMUNITIES]", error);
    return NextResponse.json(
      { error: error.message || "Topluluklar oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}

