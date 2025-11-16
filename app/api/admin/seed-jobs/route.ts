import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Employer kullanıcı bul veya admin kullanıcıyı kullan
    let employerUser = await db.user.findFirst({
      where: { role: "employer" },
      select: { id: true }
    });

    // Eğer employer yoksa, admin kullanıcıyı kullan
    if (!employerUser) {
      employerUser = await db.user.findFirst({
        where: { role: "admin" },
        select: { id: true }
      });

      if (!employerUser) {
        return NextResponse.json(
          { error: "İş ilanı oluşturmak için employer veya admin kullanıcı bulunamadı" },
          { status: 404 }
        );
      }
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Yakın tarihte (son 1-7 gün içinde) paylaşılmış 10 detaylı iş ilanı
    const jobTemplates = [
      {
        title: "Senior .NET Core Backend Developer",
        description: "Teknoloji odaklı bir ekip ile çalışmak isteyen deneyimli .NET Core geliştiricisi arıyoruz. Microservices mimarisi, Entity Framework Core, RESTful API geliştirme ve cloud teknolojileri (Azure/AWS) konularında tecrübeli adaylar tercih edilecektir. Agile metodolojiler ile çalışma deneyimi önemlidir.",
        requirements: {
          mustHave: [
            "En az 4 yıl .NET Core ve C# geliştirme deneyimi",
            "Entity Framework Core ile veritabanı yönetimi",
            "RESTful API tasarımı ve geliştirme deneyimi",
            "Microservices mimarisi bilgisi",
            "Git versiyon kontrolü kullanımı",
            "İyi düzeyde İngilizce"
          ],
          niceToHave: [
            "Docker ve Kubernetes deneyimi",
            "Azure veya AWS cloud deneyimi",
            "RabbitMQ, Redis gibi mesajlaşma sistemleri",
            "Unit test yazma deneyimi (xUnit, NUnit)",
            "CI/CD pipeline kurulumu"
          ]
        },
        location: "İstanbul / Hibrit",
        salary: "25.000 - 40.000₺",
        daysAgo: 1
      },
      {
        title: "Full Stack Developer (React + Node.js)",
        description: "Modern web uygulamaları geliştiren dinamik bir ekibe katılın. React, TypeScript, Node.js ve MongoDB teknolojileri ile çalışacak, kullanıcı deneyimini ön planda tutan projeler geliştireceksiniz. Startup kültürüne uyum sağlayabilecek, hızlı öğrenen ve problem çözme yeteneği güçlü adaylar arıyoruz.",
        requirements: {
          mustHave: [
            "En az 3 yıl full stack geliştirme deneyimi",
            "React ve TypeScript bilgisi",
            "Node.js ve Express.js deneyimi",
            "MongoDB veya PostgreSQL veritabanı kullanımı",
            "Responsive web tasarım bilgisi",
            "API entegrasyonu deneyimi"
          ],
          niceToHave: [
            "Next.js framework deneyimi",
            "GraphQL kullanımı",
            "AWS veya Heroku deployment deneyimi",
            "Jest veya Mocha test framework'leri",
            "WebSocket ve real-time uygulama geliştirme"
          ]
        },
        location: "Ankara / Uzaktan",
        salary: "20.000 - 35.000₺",
        daysAgo: 2
      },
      {
        title: "DevOps Engineer",
        description: "DevOps mühendisi olarak cloud altyapısı yönetimi, CI/CD pipeline kurulumu ve otomasyon süreçleri geliştireceksiniz. AWS veya Azure platformlarında çalışma deneyimi olan, containerization ve orchestration teknolojilerinde uzman adaylar tercih edilecektir.",
        requirements: {
          mustHave: [
            "En az 3 yıl DevOps deneyimi",
            "Docker ve Kubernetes bilgisi",
            "AWS veya Azure cloud platform deneyimi",
            "CI/CD pipeline kurulumu (Jenkins, GitLab CI, GitHub Actions)",
            "Linux sistem yönetimi",
            "Infrastructure as Code (Terraform veya CloudFormation)"
          ],
          niceToHave: [
            "Prometheus ve Grafana ile monitoring",
            "Ansible veya Chef ile configuration management",
            "Elasticsearch ve Logstash deneyimi",
            "Python veya Bash scripting",
            "Network ve güvenlik bilgisi"
          ]
        },
        location: "İzmir / Hibrit",
        salary: "28.000 - 45.000₺",
        daysAgo: 3
      },
      {
        title: "Python Data Engineer",
        description: "Büyük veri işleme, ETL pipeline'ları ve veri analiz sistemleri geliştiren bir ekibe katılın. Python, Apache Spark, Airflow ve cloud data platformları ile çalışacaksınız. Makine öğrenmesi modelleri için veri hazırlama süreçlerinde yer alacaksınız.",
        requirements: {
          mustHave: [
            "En az 3 yıl Python geliştirme deneyimi",
            "Pandas ve NumPy kütüphaneleri",
            "SQL ve veritabanı sorgulama",
            "ETL pipeline geliştirme deneyimi",
            "Apache Spark veya Hadoop bilgisi",
            "Veri modelleme ve tasarım bilgisi"
          ],
          niceToHave: [
            "Apache Airflow deneyimi",
            "AWS Glue veya Azure Data Factory",
            "Machine Learning model deployment",
            "Snowflake veya Redshift deneyimi",
            "Kubernetes ve containerization"
          ]
        },
        location: "İstanbul / Hibrit",
        salary: "22.000 - 38.000₺",
        daysAgo: 1
      },
      {
        title: "Mobile Developer (React Native)",
        description: "iOS ve Android platformları için native performans sunan mobil uygulamalar geliştireceksiniz. React Native framework'ü ile cross-platform uygulama geliştirme deneyimi olan, modern mobil uygulama mimarileri konusunda bilgili adaylar arıyoruz.",
        requirements: {
          mustHave: [
            "En az 3 yıl React Native geliştirme deneyimi",
            "JavaScript ve TypeScript bilgisi",
            "Redux veya MobX state management",
            "RESTful API entegrasyonu",
            "iOS ve Android deployment süreçleri",
            "App Store ve Google Play Store yayınlama deneyimi"
          ],
          niceToHave: [
            "Native module geliştirme (Objective-C, Swift, Java, Kotlin)",
            "Firebase entegrasyonu",
            "Push notification implementasyonu",
            "Performance optimization",
            "Automated testing (Jest, Detox)"
          ]
        },
        location: "Bursa / Uzaktan",
        salary: "18.000 - 32.000₺",
        daysAgo: 4
      },
      {
        title: "Frontend Developer (Vue.js)",
        description: "Vue.js ekosistemi ile modern ve kullanıcı dostu web uygulamaları geliştireceksiniz. Vue 3 Composition API, Vuex/Pinia, Vue Router gibi teknolojiler ile çalışacak, component-based architecture tasarlayacaksınız.",
        requirements: {
          mustHave: [
            "En az 3 yıl Vue.js geliştirme deneyimi",
            "Vue 3 ve Composition API bilgisi",
            "Vuex veya Pinia state management",
            "Vue Router ile routing",
            "HTML5, CSS3 ve JavaScript/TypeScript",
            "Responsive design ve mobile-first yaklaşım"
          ],
          niceToHave: [
            "Nuxt.js framework deneyimi",
            "Vite build tool kullanımı",
            "Webpack veya Vite konfigürasyonu",
            "Jest veya Vitest test framework",
            "Design system ve component library deneyimi"
          ]
        },
        location: "Antalya / Hibrit",
        salary: "19.000 - 33.000₺",
        daysAgo: 2
      },
      {
        title: "Java Spring Boot Developer",
        description: "Enterprise seviyesinde Java Spring Boot uygulamaları geliştiren bir ekibe katılın. Spring Framework ekosistemi (Spring Security, Spring Data JPA, Spring Cloud) ile microservices mimarisi üzerinde çalışacaksınız.",
        requirements: {
          mustHave: [
            "En az 4 yıl Java geliştirme deneyimi",
            "Spring Boot ve Spring Framework bilgisi",
            "Spring Data JPA ve Hibernate",
            "RESTful API geliştirme",
            "Maven veya Gradle build tool",
            "SQL ve veritabanı yönetimi"
          ],
          niceToHave: [
            "Spring Cloud ve microservices",
            "Docker ve Kubernetes",
            "RabbitMQ veya Kafka message broker",
            "JUnit ve Mockito test framework",
            "Elasticsearch veya Solr deneyimi"
          ]
        },
        location: "İstanbul / Hibrit",
        salary: "24.000 - 42.000₺",
        daysAgo: 5
      },
      {
        title: "UI/UX Designer & Frontend Developer",
        description: "Hem tasarım hem de geliştirme yeteneklerinizi kullanabileceğiniz bir pozisyon. Figma veya Adobe XD ile arayüz tasarımı yapacak, tasarımları HTML/CSS/JavaScript ile kodlayacaksınız. Kullanıcı deneyimini optimize eden çözümler üreteceksiniz.",
        requirements: {
          mustHave: [
            "En az 3 yıl UI/UX tasarım deneyimi",
            "Figma veya Adobe XD kullanımı",
            "HTML5, CSS3 ve JavaScript bilgisi",
            "Responsive design prensipleri",
            "Kullanıcı araştırması ve wireframing",
            "Prototyping araçları kullanımı"
          ],
          niceToHave: [
            "React veya Vue.js bilgisi",
            "CSS preprocessors (SASS, LESS)",
            "Animation ve transition bilgisi",
            "Accessibility (WCAG) standartları",
            "A/B testing ve user analytics"
          ]
        },
        location: "İzmir / Hibrit",
        salary: "20.000 - 35.000₺",
        daysAgo: 6
      },
      {
        title: "Cloud Solutions Architect",
        description: "Kurumsal cloud mimarisi tasarlayacak, AWS veya Azure platformlarında scalable ve güvenli çözümler geliştireceksiniz. Teknik liderlik yapacak, mimari kararlar alacak ve best practice'leri uygulayacaksınız.",
        requirements: {
          mustHave: [
            "En az 5 yıl cloud architecture deneyimi",
            "AWS veya Azure sertifikaları",
            "Microservices ve serverless architecture",
            "Security ve compliance bilgisi",
            "Network ve infrastructure design",
            "Cost optimization stratejileri"
          ],
          niceToHave: [
            "Multi-cloud platform deneyimi",
            "Kubernetes ve container orchestration",
            "Terraform veya CloudFormation IaC",
            "CI/CD ve DevOps best practices",
            "Leadership ve teknik mentörlük deneyimi"
          ]
        },
        location: "Ankara / Uzaktan",
        salary: "35.000 - 55.000₺",
        daysAgo: 3
      },
      {
        title: "QA Automation Engineer",
        description: "Test otomasyonu framework'leri geliştirecek, Selenium, Cypress veya Playwright gibi araçlarla end-to-end testler yazacaksınız. Continuous testing süreçlerini kurulacak ve test coverage'ı artıracaksınız.",
        requirements: {
          mustHave: [
            "En az 3 yıl QA otomasyon deneyimi",
            "Selenium WebDriver veya Cypress",
            "Java, Python veya JavaScript programlama",
            "TestNG, JUnit veya Jest test framework",
            "API testing (Postman, REST Assured)",
            "Agile metodolojiler deneyimi"
          ],
          niceToHave: [
            "Playwright veya Puppeteer",
            "Performance testing (JMeter, Gatling)",
            "BDD framework (Cucumber, SpecFlow)",
            "CI/CD entegrasyonu",
            "Test reporting ve analytics araçları"
          ]
        },
        location: "İstanbul / Hibrit",
        salary: "18.000 - 32.000₺",
        daysAgo: 7
      }
    ];

    // İş ilanlarını oluştur
    for (const jobTemplate of jobTemplates) {
      try {
        // Yakın tarihte paylaşılmış (daysAgo gün önce)
        const createdAt = new Date(now.getTime() - jobTemplate.daysAgo * 24 * 60 * 60 * 1000);

        const job = await db.job.create({
          data: {
            employerId: employerUser.id,
            title: jobTemplate.title,
            description: jobTemplate.description,
            requirements: jobTemplate.requirements as any,
            location: jobTemplate.location,
            salary: jobTemplate.salary,
            status: JobStatus.published, // Yakın tarihte paylaşıldığı için published
            createdAt: createdAt,
            updatedAt: createdAt
          }
        });

        created.push(job.title);
      } catch (error: any) {
        errors.push(`${jobTemplate.title}: ${error.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      message: `${created.length} adet iş ilanı başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating jobs:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "İş ilanları oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

