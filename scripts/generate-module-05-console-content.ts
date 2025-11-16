import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate detailed Module 5 (Console Applications) content with 4 phases
 * Module: Konsol Uygulamaları ile Uygulamalı .NET Core
 */

interface Phase {
  id: string;
  title: string;
  summary: string;
  content: any[];
}

interface Lesson {
  label: string;
  href: string;
  description: string;
  estimatedDurationMinutes: number;
  level: string;
  keyTakeaways: string[];
  sections: Phase[];
  checkpoints: any[];
  resources: any[];
  practice: any[];
}

// Lesson definitions with descriptions
const lessonDefinitions = [
  {
    title: "Console Project Yapısı",
    slug: "console-apps/project-structure",
    description: ".NET Core konsol uygulaması proje yapısını, dosya organizasyonunu, namespace yönetimini ve proje yapılandırmasını öğren.",
  },
  {
    title: "Girdi / Çıktı Yönetimi",
    slug: "console-apps/input-output",
    description: "Console.ReadLine(), Console.WriteLine() gibi girdi/çıktı metodlarını, formatlı çıktıları ve kullanıcı etkileşimini öğren.",
  },
  {
    title: "Menü Bazlı Uygulama Geliştirme",
    slug: "console-apps/menu-based",
    description: "Konsol uygulamalarında menü sistemi oluşturma, kullanıcı seçimlerini yönetme ve uygulama akışını kontrol etmeyi öğren.",
  },
  {
    title: "Dosya Okuma (StreamReader)",
    slug: "console-apps/file-reading",
    description: "StreamReader kullanarak dosya okuma işlemlerini, dosya yollarını yönetmeyi ve dosya içeriğini işlemeyi öğren.",
  },
  {
    title: "Dosya Yazma (StreamWriter)",
    slug: "console-apps/file-writing",
    description: "StreamWriter kullanarak dosya yazma işlemlerini, dosya oluşturmayı ve dosya içeriğini güncellemeyi öğren.",
  },
  {
    title: "JSON Dosya İşlemleri",
    slug: "console-apps/json-files",
    description: "JSON formatında dosya okuma/yazma, JSON deserialization/serialization ve JSON veri yönetimini öğren.",
  },
  {
    title: "XML Dosya İşlemleri",
    slug: "console-apps/xml-files",
    description: "XML formatında dosya okuma/yazma, XML parsing, XML dokümanları oluşturma ve XML veri yönetimini öğren.",
  },
  {
    title: "Exception Handling Pratikleri",
    slug: "console-apps/exception-handling",
    description: "Try-catch-finally blokları, exception türleri, custom exception oluşturma ve hata yönetimi stratejilerini öğren.",
  },
  {
    title: "Interface ve Class Uygulamaları",
    slug: "console-apps/interfaces-classes",
    description: "Interface ve class kullanımı, polymorphism, dependency inversion ve OOP prensiplerini konsol uygulamalarında uygulama.",
  },
  {
    title: "Logging Uygulaması",
    slug: "console-apps/logging",
    description: ".NET Core logging mekanizmasını, ILogger kullanımını, log seviyelerini ve logging best practice'lerini öğren.",
  },
  {
    title: "Dependency Injection Kullanımı",
    slug: "console-apps/dependency-injection",
    description: "Dependency Injection pattern'ini, servis kayıtlarını, DI container kullanımını ve DI best practice'lerini öğren.",
  },
  {
    title: "Data Validation Mekanizması",
    slug: "console-apps/data-validation",
    description: "Veri doğrulama stratejileri, validation attributes, custom validators ve validation error handling'i öğren.",
  },
  {
    title: "Enum ve Struct Kullanım Senaryoları",
    slug: "console-apps/enum-struct",
    description: "Enum ve struct tiplerini, kullanım senaryolarını, enum pattern'lerini ve struct best practice'lerini öğren.",
  },
  {
    title: "Basit CRUD İşlemleri",
    slug: "console-apps/crud-operations",
    description: "Create, Read, Update, Delete işlemlerini, veri yönetimini ve CRUD operasyonlarının implementasyonunu öğren.",
  },
  {
    title: "SeriLog ile Loglama",
    slug: "console-apps/serilog",
    description: "SeriLog kütüphanesini kullanarak structured logging, log sink'leri ve advanced logging tekniklerini öğren.",
  },
  {
    title: "Unit Test ile Fonksiyon Testi",
    slug: "console-apps/unit-testing",
    description: "xUnit kullanarak unit test yazma, test organizasyonu, mocking ve test coverage tekniklerini öğren.",
  },
  {
    title: "CLI Argümanları ile Dinamik Çalışma",
    slug: "console-apps/cli-arguments",
    description: "Command line argument'larını parse etme, argument validation ve CLI tabanlı uygulama geliştirmeyi öğren.",
  },
  {
    title: "Timer ve Thread Kullanımı",
    slug: "console-apps/timer-thread",
    description: "Timer sınıflarını, thread yönetimini, async operations ve concurrent programming'i konsol uygulamalarında kullanmayı öğren.",
  },
  {
    title: "JSON Serialize / Deserialize İşlemleri",
    slug: "console-apps/json-serialize",
    description: "JSON serialization/deserialization, System.Text.Json kullanımı, custom converters ve JSON işleme tekniklerini öğren.",
  },
  {
    title: "Mini Proje: Kütüphane Yönetim Sistemi",
    slug: "console-apps/library-management",
    description: "Öğrenilen tüm konseptleri kullanarak gerçek bir konsol uygulaması projesi geliştirme ve best practice'leri uygulama.",
  },
];

function createPhase1Content(lessonTitle: string, topicDescription: string, moduleTitle: string): any[] {
  return [
    {
      type: "text",
      body: `${topicDescription} ${lessonTitle}, .NET Core konsol uygulamaları geliştirmede temel bir yapı taşıdır. Bu fazda, ${lessonTitle} konusunun tanımını, ne olduğunu, neden kullanıldığını ve temel kavramlarını öğreneceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} nedir? Bu kavram, konsol uygulamaları geliştirirken karşılaşacağınız en önemli konulardan biridir. ${lessonTitle} konusunu derinlemesine anlamak, profesyonel seviyede konsol uygulamaları geliştirmek için gereklidir. Bu konu, .NET Core ekosisteminde konsol uygulamaları geliştirirken sıklıkla kullanılır ve gerçek dünya projelerinde kritik bir rol oynar.`
    },
    {
      type: "list",
      ordered: true,
      items: [
        `${lessonTitle} kavramının tanımı ve temel özellikleri`,
        `${lessonTitle} neden kullanılır ve hangi problemleri çözer`,
        `${lessonTitle} konusunun konsol uygulamaları geliştirmedeki yeri ve önemi`,
        `Temel terminoloji ve kavramlar`,
        `.NET Core'da ${lessonTitle} konusunun nasıl çalıştığı`,
        `Diğer yaklaşımlarla karşılaştırma ve avantajları`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Temel Kavram Örneği
// Bu örnek, ${lessonTitle} konusunun temel kullanımını gösterir

using System;

namespace ConsoleApp.Examples
{
    class Program
    {
        static void Main(string[] args)
        {
            // ${lessonTitle} konusunun temel uygulaması
            // Bu örnek, konunun temel kavramlarını anlamanıza yardımcı olacak
            
            Console.WriteLine("${lessonTitle} - Temel Örnek");
            
            // Temel kavramlar burada açıklanacak
            // Her satır, konunun temel özelliklerini gösterecek
        }
    }
}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun temel kullanımını gösterir. Kodun her satırı, konunun temel kavramlarını anlamanıza yardımcı olacak şekilde açıklanmıştır. Bu örnek, .NET Core konsol uygulamalarında ${lessonTitle} konusunun nasıl uygulandığını gösterir.`
    },
    {
      type: "callout",
      variant: "info",
      title: "Önemli Kavram",
      body: `${lessonTitle} konusunu öğrenirken dikkat etmeniz gereken en önemli nokta, bu konunun konsol uygulamaları geliştirmedeki kritik rolüdür. Bu kavramı iyi anlamak, daha iyi konsol uygulamaları geliştirmenizi sağlar.`
    }
  ];
}

function createPhase2Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun pratikte nasıl kullanıldığını adım adım öğreneceksin. ${lessonTitle} kullanarak gerçek bir konsol uygulaması geliştirmenin tüm adımlarını göreceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} nasıl kullanılır? Bu sorunun cevabı, ${moduleTitle} modülünün en önemli kısmıdır. Pratik örnekler ve kod snippet'leri ile konuyu uygulamalı olarak öğreneceksin. Her adımda, ne yaptığınızı ve neden yaptığınızı anlayacaksınız.`
    },
    {
      type: "list",
      ordered: true,
      items: [
        `${lessonTitle} kullanımının adım adım açıklaması`,
        `.NET Core'da ${lessonTitle} implementasyonu`,
        `Gerekli paketlerin kurulumu ve yapılandırma`,
        `Temel kullanım örnekleri ve kod yazımı`,
        `Yaygın kullanım senaryoları ve pattern'ler`,
        `Hata ayıklama ve troubleshooting teknikleri`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Pratik Kullanım Örneği
// Bu örnek, ${lessonTitle} konusunun gerçek bir konsol uygulamasında nasıl kullanıldığını gösterir

using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ConsoleApp.Examples
{
    class Program
    {
        static void Main(string[] args)
        {
            // ${lessonTitle} için gerekli yapılandırma
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    // ${lessonTitle} için servis kayıtları
                    // Gerekli servisler burada kayıt edilir
                })
                .Build();
            
            // ${lessonTitle} kullanım örnekleri
            Console.WriteLine("${lessonTitle} - Pratik Örnek");
            
            // ${lessonTitle} implementasyonu
            // Gerçek dünya senaryosunda nasıl kullanıldığını gösterir
            
            host.Run();
        }
    }
}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun .NET Core konsol uygulamasında nasıl kullanıldığını gösterir. Host yapılandırması, servis kayıtları ve kullanım örnekleri görebilirsiniz. Bu örnek, gerçek bir projede nasıl uygulandığını gösterir.`
    },
    {
      type: "callout",
      variant: "tip",
      title: "Pratik İpucu",
      body: `${lessonTitle} konusunu öğrenirken, kodları kendiniz yazarak denemek çok önemlidir. Sadece okumak yerine, her örneği çalıştırıp sonuçları gözlemleyin. Bu şekilde, konuyu daha iyi anlayacaksınız.`
    }
  ];
}

function createPhase3Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun ileri seviye kullanımlarını ve best practice'lerini öğreneceksin. Profesyonel seviyede konsol uygulamaları geliştirmek için gerekli olan gelişmiş teknikleri ve optimizasyon stratejilerini göreceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} konusunda ileri seviye teknikler, daha performanslı, güvenli ve maintainable kod yazmanızı sağlar. Bu fazda, industry-standard yaklaşımları ve Microsoft'un önerdiği best practice'leri öğreneceksin. Bu teknikler, gerçek dünya projelerinde kullanılan profesyonel yaklaşımlardır.`
    },
    {
      type: "list",
      ordered: false,
      items: [
        `${lessonTitle} için best practice'ler ve önerilen yaklaşımlar`,
        `Performans optimizasyon teknikleri ve ipuçları`,
        `Güvenlik konuları ve dikkat edilmesi gerekenler`,
        `Yaygın hatalar ve bunlardan kaçınma yöntemleri`,
        `İleri seviye pattern'ler ve design pattern'ler`,
        `Testing stratejileri ve unit test yazımı`,
        `Error handling ve exception management`,
        `Logging ve monitoring yaklaşımları`,
        `Code organization ve maintainability`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - İleri Seviye Kullanım Örneği
// Bu örnek, ${lessonTitle} konusunun ileri seviye tekniklerini gösterir

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ConsoleApp.Advanced
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    // İleri seviye ${lessonTitle} yapılandırması
                    services.AddLogging(configure => configure.AddConsole());
                    
                    // ${lessonTitle} için özel servisler
                    // Best practice'lere uygun servis kayıtları
                })
                .Build();
            
            var logger = host.Services.GetRequiredService<ILogger<Program>>();
            
            try
            {
                logger.LogInformation("${lessonTitle} - Advanced operation started");
                
                // İleri seviye ${lessonTitle} işlemleri
                // - Async/await pattern kullanımı
                // - Proper error handling
                // - Logging ve monitoring
                // - Resource management
                
                await Task.CompletedTask;
                
                logger.LogInformation("${lessonTitle} - Advanced operation completed");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in ${lessonTitle} operation");
                throw;
            }
        }
    }
}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun ileri seviye kullanımını gösterir. Async/await pattern, proper error handling, logging, ve resource management gibi best practice'leri içerir. Bu örnek, production-ready kod yazmanız için gereken tüm özellikleri gösterir.`
    },
    {
      type: "callout",
      variant: "warning",
      title: "Dikkat Edilmesi Gerekenler",
      body: `${lessonTitle} konusunda ileri seviye teknikler kullanırken, kodun okunabilirliğini ve maintainability'sini korumak çok önemlidir. Aşırı karmaşık çözümlerden kaçının ve best practice'leri takip edin.`
    }
  ];
}

function createPhase4Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun gerçek dünya senaryolarında nasıl kullanıldığını göreceksin. Endüstri standardı konsol uygulamalarında ${lessonTitle} konusunun nasıl implement edildiğini, gerçek problemlerin nasıl çözüldüğünü ve troubleshooting tekniklerini öğreneceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} konusunu gerçek bir projede kullanırken karşılaşabileceğiniz senaryolar, çözüm yöntemleri ve best practice'ler bu fazda detaylı olarak açıklanmaktadır. Case study'ler ve gerçek dünya örnekleri ile konuyu pekiştireceksin. Bu faz, öğrendiklerinizi pratikte uygulamanız için gereken tüm bilgileri içerir.`
    },
    {
      type: "list",
      ordered: false,
      items: [
        `Gerçek dünya projelerinde ${lessonTitle} kullanım senaryoları`,
        `Enterprise seviyesinde ${lessonTitle} implementasyonu`,
        `Scalability ve performance konuları`,
        `Troubleshooting ve debugging teknikleri`,
        `Common issues ve çözümleri`,
        `Integration patterns ve service communication`,
        `Deployment ve production considerations`,
        `Monitoring ve analytics yaklaşımları`,
        `Real-world case studies`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Gerçek Dünya Senaryosu
// Bu örnek, ${lessonTitle} konusunun production ortamında nasıl kullanıldığını gösterir

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ConsoleApp.Production
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    // Configuration yönetimi
                    config.AddJsonFile("appsettings.json", optional: false);
                    config.AddEnvironmentVariables();
                })
                .ConfigureServices((context, services) =>
                {
                    // Production-ready ${lessonTitle} yapılandırması
                    services.AddLogging(configure =>
                    {
                        configure.AddConsole();
                        configure.AddDebug();
                    });
                    
                    // ${lessonTitle} için production servisleri
                    // Error handling, retry policies, circuit breakers
                })
                .UseConsoleLifetime()
                .Build();
            
            var logger = host.Services.GetRequiredService<ILogger<Program>>();
            var config = host.Services.GetRequiredService<IConfiguration>();
            
            try
            {
                logger.LogInformation("Application starting...");
                
                // Production-ready ${lessonTitle} implementasyonu
                // - Configuration management
                // - Error handling ve retry logic
                // - Logging ve monitoring
                // - Resource cleanup
                
                await host.RunAsync();
                
                logger.LogInformation("Application stopped gracefully");
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Application terminated unexpectedly");
                throw;
            }
            finally
            {
                // Resource cleanup
                host.Dispose();
            }
        }
    }
}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun production ortamında nasıl kullanıldığını gösterir. Configuration management, error handling, logging, resource cleanup gibi gerçek dünya senaryolarında gerekli olan tüm özellikleri içerir.`
    },
    {
      type: "callout",
      variant: "info",
      title: "Gerçek Dünya Senaryosu",
      body: `Bu örnek, ${lessonTitle} konusunun gerçek bir production uygulamasında nasıl kullanıldığını gösterir. Bu tür senaryolar, konuyu daha iyi anlamanızı ve profesyonel seviyede uygulama geliştirmenizi sağlar.`
    },
    {
      type: "text",
      body: `Troubleshooting: ${lessonTitle} konusunda karşılaşabileceğiniz yaygın problemler ve çözümleri:\n\n1. **Performans Problemleri**: Async operations kullanımı, resource management\n2. **Güvenlik Sorunları**: Input validation, error message handling\n3. **Hata Yönetimi**: Proper exception handling ve error responses\n4. **Scalability**: Resource pooling ve efficient algorithms\n\nBu problemleri çözmek için yukarıdaki kod örneğinde gösterilen pattern'leri kullanabilirsiniz.`
    }
  ];
}

function createDetailedLesson(
  lessonDef: { title: string; slug: string; description: string },
  moduleTitle: string,
  level: string = "Başlangıç"
): Lesson {
  const slugBase = lessonDef.slug.replace(/\//g, "-");
  
  return {
    label: lessonDef.title,
    href: `/education/lessons/${lessonDef.slug}`,
    description: `${lessonDef.description} Bu ders, ${moduleTitle} modülünün kapsamlı bir parçasıdır ve gerçek dünya uygulamalarında pratik kullanım senaryolarını içerir.`,
    estimatedDurationMinutes: 60,
    level,
    keyTakeaways: [
      `${lessonDef.title} konusunun ne olduğunu ve neden önemli olduğunu öğreneceksin.`,
      `${lessonDef.title} konusunun nasıl kullanıldığını pratik örneklerle göreceksin.`,
      `${lessonDef.title} için best practice'leri ve ileri seviye teknikleri öğreneceksin.`,
      `Gerçek dünya senaryolarında ${lessonDef.title} konusunun nasıl uygulandığını göreceksin.`,
      `Troubleshooting ve debugging tekniklerini öğreneceksin.`
    ],
    sections: [
      {
        id: `${slugBase}-faz-1-tanim`,
        title: "Faz 1: Tanım ve Temel Kavramlar",
        summary: `${lessonDef.title} konusunun tanımı, ne olduğu, neden kullanıldığı ve temel kavramları.`,
        content: createPhase1Content(lessonDef.title, lessonDef.description, moduleTitle)
      },
      {
        id: `${slugBase}-faz-2-kullanim`,
        title: "Faz 2: Nasıl Kullanılır",
        summary: `${lessonDef.title} konusunun pratikte nasıl kullanıldığı, adım adım implementasyon ve kod örnekleri.`,
        content: createPhase2Content(lessonDef.title, lessonDef.description, moduleTitle, lessonDef.slug)
      },
      {
        id: `${slugBase}-faz-3-ileri-seviye`,
        title: "Faz 3: İleri Seviye ve Best Practices",
        summary: `${lessonDef.title} konusunun ileri seviye kullanımları, best practice'ler, optimizasyon teknikleri ve yaygın hatalar.`,
        content: createPhase3Content(lessonDef.title, lessonDef.description, moduleTitle, lessonDef.slug)
      },
      {
        id: `${slugBase}-faz-4-gercek-dunya`,
        title: "Faz 4: Gerçek Dünya Uygulamaları",
        summary: `${lessonDef.title} konusunun gerçek dünya senaryolarında kullanımı, case study'ler, troubleshooting ve production considerations.`,
        content: createPhase4Content(lessonDef.title, lessonDef.description, moduleTitle, lessonDef.slug)
      }
    ],
    checkpoints: [
      {
        id: `checkpoint-${slugBase}-1`,
        question: `${lessonDef.title} nedir ve neden kullanılır?`,
        options: [
          `${lessonDef.title}, konsol uygulamalarında veri işleme için kullanılan bir standarttır.`,
          `${lessonDef.title}, sadece .NET Core'da kullanılan bir kavramdır.`,
          `${lessonDef.title}, sadece büyük projelerde gerekli olan bir özelliktir.`,
          `${lessonDef.title}, modern konsol uygulamalarında kullanılmayan eski bir teknolojidir.`
        ],
        answer: `${lessonDef.title}, konsol uygulamalarında veri işleme için kullanılan bir standarttır.`,
        rationale: `${lessonDef.title} konusu, modern konsol uygulaması geliştirmede kritik öneme sahiptir ve tüm büyüklükteki projelerde kullanılır.`
      },
      {
        id: `checkpoint-${slugBase}-2`,
        question: `${lessonDef.title} konusunda en yaygın hata nedir?`,
        options: [
          `Proper error handling yapmamak ve exception'ları doğru yönetmemek`,
          `Kod yazmamak`,
          `Documentation okumamak`,
          `Console uygulaması kullanmamak`
        ],
        answer: `Proper error handling yapmamak ve exception'ları doğru yönetmemek`,
        rationale: `${lessonDef.title} konusunda en yaygın hata, proper error handling yapmamaktır. Bu, production ortamında ciddi problemlere yol açabilir.`
      }
    ],
    resources: [
      {
        id: `resource-${slugBase}-docs`,
        label: `${lessonDef.title} - Microsoft Docs`,
        href: `https://learn.microsoft.com/dotnet/core`,
        type: "reading",
        estimatedMinutes: 30,
        description: `${lessonDef.title} konusu hakkında detaylı Microsoft dokümantasyonu ve resmi kaynaklar.`
      },
      {
        id: `resource-${slugBase}-video`,
        label: `${lessonDef.title} - Video Eğitim`,
        href: `https://learn.microsoft.com/dotnet/core`,
        type: "video",
        estimatedMinutes: 45,
        description: `${lessonDef.title} konusunu görsel olarak öğrenmek için video eğitim ve tutorial'lar.`
      },
      {
        id: `resource-${slugBase}-sample`,
        label: `${lessonDef.title} - Örnek Projeler`,
        href: `https://github.com/dotnet/samples`,
        type: "reading",
        estimatedMinutes: 60,
        description: `${lessonDef.title} konusunun gerçek dünya örnekleri ve sample projeler.`
      }
    ],
    practice: [
      {
        id: `practice-${slugBase}-1`,
        title: `${lessonDef.title} - Temel Uygulama`,
        description: `${lessonDef.title} konusunun temel kullanımını içeren pratik bir konsol uygulaması geliştirin.`,
        type: "coding",
        estimatedMinutes: 45,
        difficulty: "Orta",
        instructions: [
          `Yeni bir .NET Core konsol projesi oluşturun`,
          `${lessonDef.title} konusunu implement edin`,
          `Temel işlevsellik ekleyin`,
          `Error handling mekanizması ekleyin`,
          `Projeyi test edin ve çalıştığını doğrulayın`,
          `Best practice'leri uyguladığınızdan emin olun`
        ]
      },
      {
        id: `practice-${slugBase}-2`,
        title: `${lessonDef.title} - İleri Seviye Uygulama`,
        description: `${lessonDef.title} konusunun ileri seviye kullanımını içeren karmaşık bir konsol uygulaması geliştirin.`,
        type: "coding",
        estimatedMinutes: 90,
        difficulty: "İleri",
        instructions: [
          `${lessonDef.title} konusunu ileri seviye tekniklerle implement edin`,
          `Logging, error handling, ve monitoring ekleyin`,
          `Configuration management ekleyin`,
          `Unit testler yazın`,
          `Performance optimizasyonu yapın`,
          `Production-ready hale getirin`,
          `Documentation ekleyin`
        ]
      }
    ]
  };
}

// Generate Module 5 lessons
const module5Lessons: Lesson[] = lessonDefinitions.map(lessonDef =>
  createDetailedLesson(lessonDef, "Konsol Uygulamaları ile Uygulamalı .NET Core", "Başlangıç")
);

// Write to JSON file
const module5Data = {
  moduleId: "module-05",
  moduleTitle: "Konsol Uygulamaları ile Uygulamalı .NET Core",
  lessons: module5Lessons
};

const outputPath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-console-detailed.json');
fs.writeFileSync(outputPath, JSON.stringify(module5Data, null, 2), 'utf-8');

console.log('✅ Module 5 (Console Applications) detailed content created successfully!');
console.log(`✅ File saved to: ${outputPath}`);
console.log(`✅ Total lessons: ${module5Lessons.length}`);
console.log(`✅ All lessons have 4 phases`);
