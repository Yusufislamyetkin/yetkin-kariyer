-- Module 02: .NET Core Runtime - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-02-architecture",
          "title": ".NET Core Mimarisi ve Yapısı",
          "summary": "CLR, BCL ve host bileşenlerini kavrayarak uygulamanın yaşam döngüsünü yönet.",
          "durationMinutes": 180,
          "objectives": [
            "Bu modülü tamamladığında .NET Core runtime bileşenlerini ve uygulama yaşam döngüsünü açıklayıp doğru host yapılandırmaları yapabileceksin.",
            "CLR, BCL ve assembly yapısını derinlemesine anlayacak ve uygulama başlatma süreçlerini yönetebileceksin.",
            "Garbage Collection ve JIT compilation mekanizmalarını kavrayıp performans optimizasyonları yapabileceksin.",
            "Host builder patternini kullanarak servis yaşam döngüsünü yönetebileceksin."
          ],
          "activities": [
            {
              "id": "activity-arch-01-clr-overview",
              "type": "concept",
              "title": "Common Language Runtime (CLR) Temelleri",
              "estimatedMinutes": 20,
              "content": "CLR, .NET Core un kalbidir ve managed kodun çalıştırılmasından sorumludur. CLR ın temel bileşenleri: n n**1. Type System (Tip Sistemi)** n- CTS (Common Type System): Tüm dillerin ortak tip sistemini tanımlar n- CLS (Common Language Specification): Diller arası uyumluluk kuralları n n**2. Memory Management (Bellek Yönetimi)** n- Managed heap: Otomatik bellek yönetimi n- Stack: Value type lar ve referanslar için n- Garbage Collector: Otomatik bellek temizleme n n**3. Execution Engine (Çalıştırma Motoru)** n- JIT (Just-In-Time) Compiler: IL kodunu native koda çevirir n- IL (Intermediate Language): Platform bağımsız ara dil n- Metadata: Tip bilgileri ve assembly yapısı n n**4. Security Model (Güvenlik Modeli)** n- Code Access Security (CAS) n- Role-based security n- Assembly evidence ve permissions",
              "highlights": [
                "CLR, managed kodun çalıştırılmasından ve bellek yönetiminden sorumludur",
                "JIT compiler, IL kodunu çalışma zamanında native koda çevirir",
                "Garbage Collector otomatik olarak kullanılmayan bellek alanlarını temizler",
                "Metadata, assembly içindeki tip ve üye bilgilerini içerir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "CLRExample.cs",
                  "code": "using System; nusing System.Reflection; n nclass Program n{ n    static void Main() n    { n        // Assembly bilgilerini al n        Assembly assembly = Assembly.GetExecutingAssembly(); n        Console.WriteLine("Assembly Name:  \" + assembly.FullName); n        Console.WriteLine( "CLR Version:  \" + Environment.Version); n         n        // Runtime bilgileri n        Console.WriteLine( "Is 64-bit:  \" + Environment.Is64BitProcess); n        Console.WriteLine( "OS Version:  \" + Environment.OSVersion); n         n        // GC bilgileri n        Console.WriteLine( "GC Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n    } n}",
                  "explanation": "Bu örnek, CLR hakkında temel bilgileri gösterir: assembly bilgileri, runtime versiyonu, işlem mimarisi ve garbage collection istatistikleri."
                }
              ],
              "checklist": [
                {
                  "id": "check-clr-understanding",
                  "label": "CLRın temel bileşenlerini (Type System, Memory Management, Execution Engine) açıklayabilirim",
                  "explanation": "CLRın her bir bileşeninin rolünü ve birbirleriyle nasıl etkileşime girdiğini anlamak önemlidir."
                },
                {
                  "id": "check-jit-understanding",
                  "label": "JIT compilation sürecini ve IL kodunun native koda dönüşümünü anlıyorum",
                  "explanation": "JIT compilerın nasıl çalıştığını anlamak, performans optimizasyonları için kritiktir."
                }
              ]
            },
            {
              "id": "activity-arch-02-bcl-overview",
              "type": "concept",
              "title": "Base Class Library (BCL) Yapısı",
              "estimatedMinutes": 15,
              "content": "BCL, .NET Core uygulamalarında kullanılan temel sınıf kütüphanesidir. BCLın ana bileşenleri: n n**1. System Namespace** n- Temel tipler (String, Int32, DateTime, etc.) n- Collections (List, Dictionary, Queue, etc.) n- I/O işlemleri (File, Stream, etc.) n n**2. System.Collections.Generic** n- Generic koleksiyonlar (List<T>, Dictionary<TKey, TValue>) n- Performanslı ve type-safe veri yapıları n n**3. System.Linq** n- LINQ (Language Integrated Query) n- Collection üzerinde sorgulama ve dönüşüm işlemleri n n**4. System.Threading** n- Thread yönetimi n- Task Parallel Library (TPL) n- Async/await desteği n n**5. System.Text** n- String encoding/decoding n- StringBuilder n- Regex işlemleri n n**6. System.Net** n- HTTP client işlemleri n- Network protokolleri n- WebSocket desteği",
              "highlights": [
                "BCL, .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır",
                "Generic koleksiyonlar type-safe ve performanslıdır",
                "LINQ, koleksiyonlar üzerinde güçlü sorgulama imkanı sağlar",
                "System.Threading namespace i modern async/await programlamayı destekler"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "BCLExample.cs",
                  "code": "using System; nusing System.Collections.Generic; nusing System.Linq; n nclass Program n{ n    static void Main() n    { n        // Generic Collections n        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }; n         n        // LINQ Operations n        var evenNumbers = numbers.Where(n => n % 2 == 0).ToList(); n        var sum = numbers.Sum(); n        var average = numbers.Average(); n         n        Console.WriteLine("Even Numbers:  \" + string.Join( ",", evenNumbers)); n        Console.WriteLine( "Sum:  \" + sum); n        Console.WriteLine( "Average:  \" + average); n         n        // Dictionary Example n        var dictionary = new Dictionary<string, int> n        { n            {  "one", 1 }, n            {  "two", 2 }, n            {  "three", 3 } n        }; n         n        foreach (var kvp in dictionary) n        { n            Console.WriteLine($ \"{kvp.Key}: {kvp.Value} "); n        } n    } n}",
                  "explanation": "Bu örnek, BCLın temel bileşenlerini gösterir: generic koleksiyonlar, LINQ sorguları ve dictionary kullanımı."
                }
              ],
              "checklist": [
                {
                  "id": "check-bcl-namespaces",
                  "label": "BCL ın ana namespace lerini ve kullanım alanlarını biliyorum",
                  "explanation": "BCLın organizasyonunu anlamak, doğru namespace leri kullanmak için önemlidir."
                },
                {
                  "id": "check-generic-collections",
                  "label": "Generic koleksiyonların avantajlarını ve kullanım senaryolarını anlıyorum",
                  "explanation": "Generic koleksiyonlar type-safe ve performanslı çözümler sunar."
                }
              ]
            },
            {
              "id": "activity-arch-03-assembly-structure",
              "type": "concept",
              "title": "Assembly Yapısı ve Metadata",
              "estimatedMinutes": 20,
              "content": "Assembly, .NET Core da kodun dağıtım birimidir. Her assembly şunları içerir: n n**1. Assembly Manifest** n- Assembly kimliği (name, version, culture) n- Referans edilen diğer assembly ler n- Güvenlik izinleri n- Public key token n n**2. Type Metadata** n- Sınıf, interface, struct tanımları n- Metot, property, field bilgileri n- Attribute lar ve annotation lar n n**3. IL Code (Intermediate Language)** n- Platform bağımsız ara dil kodu n- JIT compiler tarafından native koda çevrilir n n**4. Resources** n- Embedded resources (resimler, string ler) n- Satellite assemblies (yerelleştirme) n n**Assembly Türleri:** n- **Executable (.exe)**: Çalıştırılabilir uygulama n- **Library (.dll)**: Paylaşılan kütüphane n- **Satellite**: Yerelleştirme kaynakları n n**Strong Naming:** n- Assembly ye benzersiz kimlik verir n- Version kontrolü sağlar n- GAC (Global Assembly Cache) için gereklidir",
              "highlights": [
                "Assembly, .NET Core da kodun dağıtım ve yürütme birimidir",
                "Metadata, reflection ve IntelliSense için gerekli bilgileri içerir",
                "IL kodu platform bağımsızdır ve JIT compiler tarafından native koda çevrilir",
                "Strong naming, assembly lerin benzersiz kimliğini sağlar"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "AssemblyExample.cs",
                  "code": "using System; nusing System.Reflection; n nclass Program n{ n    static void Main() n    { n        // Mevcut assembly bilgileri n        Assembly assembly = Assembly.GetExecutingAssembly(); n         n        // Assembly Manifest Bilgileri n        Console.WriteLine("Full Name:  \" + assembly.FullName); n        Console.WriteLine( "Location:  \" + assembly.Location); n        Console.WriteLine( "Entry Point:  \" + assembly.EntryPoint?.Name); n         n        // Assembly deki tipler n        Type[] types = assembly.GetTypes(); n        Console.WriteLine( \"  nTypes in Assembly: "); n        foreach (var type in types) n        { n            Console.WriteLine( \"  -  \" + type.FullName); n             n            // Tip in metodları n            MethodInfo[] methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static); n            foreach (var method in methods) n            { n                if (!method.IsSpecialName) n                    Console.WriteLine( \"    Method:  \" + method.Name); n            } n        } n         n        // Referans edilen assembly ler n        Console.WriteLine( \"  nReferenced Assemblies: "); n        foreach (var refAssembly in assembly.GetReferencedAssemblies()) n        { n            Console.WriteLine( \"  -  \" + refAssembly.FullName); n        } n    } n}",
                  "explanation": "Bu örnek, assembly yapısını incelemek için reflection kullanır: manifest bilgileri, tipler, metodlar ve referanslar."
                }
              ],
              "checklist": [
                {
                  "id": "check-assembly-components",
                  "label": "Assembly nin bileşenlerini (manifest, metadata, IL code) açıklayabilirim",
                  "explanation": "Assembly yapısını anlamak, debugging ve deployment için kritiktir."
                },
                {
                  "id": "check-metadata-usage",
                  "label": "Metadata nın reflection ve IntelliSense için nasıl kullanıldığını anlıyorum",
                  "explanation": "Metadata, .NET in güçlü reflection özelliklerinin temelidir."
                }
              ]
            },
            {
              "id": "activity-arch-04-app-startup",
              "type": "guided-exercise",
              "title": "Uygulama Başlatma Süreci",
              "estimatedMinutes": 25,
              "description": "Bir .NET Core uygulamasının başlatma sürecini adım adım inceleyelim ve host yapılandırmasını öğrenelim.",
              "steps": [
                {
                  "title": "Program.cs Yapısını İncele",
                  "detail": "Modern .NET Core uygulamaları top-level statements kullanır. Program.cs dosyasında uygulamanın giriş noktasını belirle.",
                  "hint": "Top-level statements, Main metodunu otomatik oluşturur.",
                  "reference": "https://learn.microsoft.com/dotnet/csharp/fundamentals/program-structure/top-level-statements"
                },
                {
                  "title": "Host Builder Oluştur",
                  "detail": "Host.CreateDefaultBuilder() ile varsayılan host yapılandırmasını oluştur. Bu, logging, configuration ve dependency injection ı otomatik yapılandırır.",
                  "hint": "CreateDefaultBuilder, appsettings.json ve environment variables ı otomatik yükler."
                },
                {
                  "title": "Servisleri Kaydet",
                  "detail": "ConfigureServices metodunda veya extension metodlarıyla servisleri DI container a kaydet.",
                  "hint": "AddScoped, AddSingleton, AddTransient lifetime seçeneklerini kullan."
                },
                {
                  "title": "Middleware Pipeline ını Yapılandır",
                  "detail": "Configure metodunda middleware leri sırayla ekle. Sıralama çok önemlidir!",
                  "hint": "UseRouting() ve UseEndpoints() arasında middleware ekle."
                },
                {
                  "title": "Host u Çalıştır",
                  "detail": "Build() ve Run() metodlarıyla host u başlat. Run() blocking bir çağrıdır.",
                  "hint": "RunAsync() kullanarak async başlatma da yapabilirsin."
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "Program.cs",
                "code": "using Microsoft.Extensions.Hosting; nusing Microsoft.Extensions.DependencyInjection; nusing Microsoft.Extensions.Logging; n n// TODO: Host builder oluştur ve yapılandır n nvar host = Host.CreateDefaultBuilder(args) n    .ConfigureServices((context, services) => n    { n        // TODO: Servisleri buraya ekle n        // services.AddScoped<IMyService, MyService>(); n    }) n    .ConfigureLogging(logging => n    { n        // TODO: Logging yapılandırması n        logging.AddConsole(); n    }) n    .Build(); n n// TODO: Host u başlat n// await host.RunAsync(); n",
                "explanation": "Bu starter code, host builder patterninin temel yapısını gösterir. Adımları takip ederek tamamlayın."
              },
              "hints": [
                "Host.CreateDefaultBuilder() varsayılan yapılandırmaları içerir",
                "ConfigureServices içinde servisleri kaydederken lifetime a dikkat edin",
                "Middleware sıralaması request pipeline ında kritik öneme sahiptir",
                "Run() blocking, RunAsync() non-blocking çalışır"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Host başarıyla oluşturuldu ve çalıştırıldı",
                  "En az bir servis DI container a kaydedildi",
                  "Logging yapılandırması eklendi",
                  "Uygulama hatasız başlatılıyor"
                ]
              }
            },
            {
              "id": "activity-arch-05-host-builder",
              "type": "guided-exercise",
              "title": "Generic Host Builder Pattern",
              "estimatedMinutes": 30,
              "description": "Generic Host patternini kullanarak servis yaşam döngüsünü yönetmeyi öğrenelim.",
              "steps": [
                {
                  "title": "IHostedService Interface ini Anla",
                  "detail": "IHostedService, arka plan servisleri için kullanılır. StartAsync ve StopAsync metodlarını içerir.",
                  "hint": "BackgroundService, IHostedService in abstract implementasyonudur."
                },
                {
                  "title": "Background Service Oluştur",
                  "detail": "BackgroundService den türeyen bir sınıf oluştur ve ExecuteAsync metodunu override et.",
                  "hint": "ExecuteAsync, servis çalıştığı sürece devam eden async işlemleri içerir."
                },
                {
                  "title": "Hosted Service i Kaydet",
                  "detail": "AddHostedService<T>() extension metodunu kullanarak servisi kaydet.",
                  "hint": "Hosted service ler singleton olarak kaydedilir."
                },
                {
                  "title": "Graceful Shutdown Yapılandır",
                  "detail": "CancellationToken kullanarak servisin düzgün şekilde kapanmasını sağla.",
                  "hint": "StoppingToken, uygulama kapanırken set edilir."
                },
                {
                  "title": "Host Lifecycle ını Test Et",
                  "detail": "Uygulamayı başlat ve durdur, servislerin doğru şekilde başlayıp durduğunu doğrula.",
                  "hint": "Console.WriteLine ile lifecycle event lerini logla."
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "BackgroundWorkerService.cs",
                "code": "using Microsoft.Extensions.Hosting; n npublic class BackgroundWorkerService : BackgroundService n{ n    private readonly ILogger<BackgroundWorkerService> _logger; n     n    public BackgroundWorkerService(ILogger<BackgroundWorkerService> logger) n    { n        _logger = logger; n    } n     n    protected override async Task ExecuteAsync(CancellationToken stoppingToken) n    { n        _logger.LogInformation("Background Service başlatıldı. "); n         n        // TODO: Periyodik işlemleri buraya ekle n        while (!stoppingToken.IsCancellationRequested) n        { n            // TODO: İş mantığını buraya ekle n            await Task.Delay(1000, stoppingToken); n        } n         n        _logger.LogInformation("Background Service durduruldu. "); n    } n}",
                "explanation": "Bu starter code, BackgroundService patterninin temel yapısını gösterir. ExecuteAsync metodunu tamamlayın."
              },
              "hints": [
                "BackgroundService, IHostedService in kolay kullanım için sağlanan abstract sınıfıdır",
                "CancellationToken, graceful shutdown için kritiktir",
                "ExecuteAsync içinde sonsuz döngü kullanılır, ancak cancellation token kontrol edilir",
                "Host kapanırken tüm hosted service ler otomatik durdurulur"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Background service başarıyla oluşturuldu",
                  "ExecuteAsync içinde cancellation token kontrol ediliyor",
                  "Servis host ile birlikte başlatılıp durduruluyor",
                  "Logging ile lifecycle event leri görüntüleniyor"
                ]
              }
            },
            {
              "id": "activity-arch-06-garbage-collection",
              "type": "concept",
              "title": "Garbage Collection (GC) Mekanizması",
              "estimatedMinutes": 25,
              "content": "Garbage Collector (GC), .NET Core da otomatik bellek yönetiminden sorumludur. Managed heap üzerindeki kullanılmayan nesneleri otomatik olarak temizler. n n**GC Generations (Nesil Sistemi):** n- **Generation 0**: Yeni oluşturulan nesneler (küçük, kısa ömürlü) n- **Generation 1**: Generation 0 dan kurtulan nesneler (orta ömürlü) n- **Generation 2**: Uzun ömürlü nesneler (büyük nesneler, static alanlar) n n**GC Türleri:** n- **Ephemeral GC**: Generation 0 ve 1 i temizler (hızlı) n- **Full GC**: Tüm generation ları temizler (yavaş, blocking) n- **Background GC**: Generation 2 için arka planda çalışır (non-blocking) n n**GC Stratejileri:** n- **Workstation GC**: Client uygulamalar için optimize edilmiş n- **Server GC**: Sunucu uygulamaları için çoklu thread ile çalışır n n**GC Optimizasyon İpuçları:** n- Büyük nesneleri mümkün olduğunca az kullan n- IDisposable pattern ini doğru uygula n- String concatenation yerine StringBuilder kullan n- Event handler ları unsubscribe et n- Weak references kullan (cache senaryolarında)",
              "highlights": [
                "GC, managed heap teki kullanılmayan nesneleri otomatik temizler",
                "Generation sistemi, GC performansını optimize eder",
                "Workstation GC client, Server GC sunucu uygulamaları için optimize edilmiştir",
                "IDisposable pattern, unmanaged kaynakların temizlenmesi için kritiktir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "GCExample.cs",
                  "code": "using System; n nclass Program n{ n    static void Main() n    { n        // GC istatistiklerini göster n        Console.WriteLine("=== GC İstatistikleri === "); n        Console.WriteLine("Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Generation 1 Collections:  \" + GC.CollectionCount(1)); n        Console.WriteLine( "Generation 2 Collections:  \" + GC.CollectionCount(2)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // Büyük nesne oluştur n        byte[] largeArray = new byte[1000000]; n        Console.WriteLine( \"  nBüyük nesne oluşturuldu. "); n        Console.WriteLine("Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // Nesneyi null yap ve GC yi zorla n        largeArray = null; n        GC.Collect(); n        GC.WaitForPendingFinalizers(); n         n        Console.WriteLine( \"  nGC çalıştırıldı. "); n        Console.WriteLine("Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // GC Latency Mode n        Console.WriteLine( \"  nGC Latency Mode:  \" + GCSettings.LatencyMode); n         n        // Server GC kontrolü n        Console.WriteLine( "Is Server GC:  \" + GCSettings.IsServerGC); n    } n}",
                  "explanation": "Bu örnek, GC nin çalışmasını gösterir: collection sayıları, bellek kullanımı ve GC ayarları."
                }
              ],
              "checklist": [
                {
                  "id": "check-gc-generations",
                  "label": "GC generation sistemini (0, 1, 2) ve her birinin amacını anlıyorum",
                  "explanation": "Generation sistemi, GC performansını önemli ölçüde artırır."
                },
                {
                  "id": "check-gc-optimization",
                  "label": "GC optimizasyon tekniklerini (IDisposable, StringBuilder, etc.) biliyorum",
                  "explanation": "Doğru bellek yönetimi, uygulama performansını doğrudan etkiler."
                }
              ]
            },
            {
              "id": "activity-arch-07-jit-compilation",
              "type": "concept",
              "title": "JIT (Just-In-Time) Compilation",
              "estimatedMinutes": 20,
              "content": "JIT compiler, IL (Intermediate Language) kodunu çalışma zamanında native makine koduna çevirir. n n**JIT Compilation Süreci:** n1. **IL Loading**: Assembly den IL kodu yüklenir n2. **Type Verification**: Tip güvenliği kontrol edilir n3. **JIT Compilation**: IL kodu native koda çevrilir n4. **Code Caching**: Derlenen kod cache lenir (sonraki çağrılar için) n5. **Execution**: Native kod çalıştırılır n n**JIT Optimizasyonları:** n- **Inlining**: Küçük metodları çağrı yerine inline eder n- **Dead Code Elimination**: Kullanılmayan kodları kaldırır n- **Loop Optimizations**: Döngü optimizasyonları yapar n- **Register Allocation**: CPU register larını optimize kullanır n n**Tiered Compilation:** n- **Tier 0 (Quick JIT)**: Hızlı derleme, az optimizasyon n- **Tier 1 (Optimized JIT)**: Yavaş derleme, çok optimizasyon n- Hot path ler Tier 1 e yükseltilir n n**AOT (Ahead-of-Time) Compilation:** n- .NET Native ve Native AOT ile önceden derleme n- Daha hızlı başlatma, daha küçük footprint n- Reflection sınırlamaları",
              "highlights": [
                "JIT compiler, IL kodunu çalışma zamanında native koda çevirir",
                "Tiered compilation, performans ve başlatma süresi arasında denge sağlar",
                "JIT optimizasyonları (inlining, dead code elimination) performansı artırır",
                "AOT compilation, başlatma süresini azaltır ancak bazı sınırlamalar getirir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "JITExample.cs",
                  "code": "using System; nusing System.Diagnostics; nusing System.Runtime.CompilerServices; n nclass Program n{ n    static void Main() n    { n        // İlk çağrı (JIT compilation dahil) n        var sw = Stopwatch.StartNew(); n        CalculateSum(1000000); n        sw.Stop(); n        Console.WriteLine("İlk çağrı (JIT dahil):  \" + sw.ElapsedMilliseconds +  \" ms "); n         n        // Sonraki çağrılar (cached native code) n        sw.Restart(); n        for (int i = 0; i < 10; i++) n        { n            CalculateSum(1000000); n        } n        sw.Stop(); n        Console.WriteLine("10 çağrı (cached):  \" + sw.ElapsedMilliseconds +  \" ms "); n         n        // AggressiveInlining örneği n        sw.Restart(); n        InlinedMethod(); n        sw.Stop(); n        Console.WriteLine("Inlined method:  \" + sw.ElapsedMilliseconds +  \" ms "); n    } n     n    static int CalculateSum(int n) n    { n        int sum = 0; n        for (int i = 0; i < n; i++) n        { n            sum += i; n        } n        return sum; n    } n     n    [MethodImpl(MethodImplOptions.AggressiveInlining)] n    static int InlinedMethod() n    { n        return 42; n    } n}",
                  "explanation": "Bu örnek, JIT compilation ın etkisini gösterir: ilk çağrıda JIT overhead i, sonraki çağrılarda cached native code performansı."
                }
              ],
              "checklist": [
                {
                  "id": "check-jit-process",
                  "label": "JIT compilation sürecini (IL → native code) anlıyorum",
                  "explanation": "JIT compilation, .NET in platform bağımsızlığının temelidir."
                },
                {
                  "id": "check-tiered-compilation",
                  "label": "Tiered compilation kavramını ve avantajlarını biliyorum",
                  "explanation": "Tiered compilation, başlatma süresi ve performans arasında denge sağlar."
                }
              ]
            },
            {
              "id": "activity-arch-08-runtime-components",
              "type": "knowledge-check",
              "title": "Runtime Bileşenleri Bilgi Kontrolü",
              "estimatedMinutes": 15,
              "questions": [
                {
                  "id": "q-runtime-01",
                  "question": "CLRın temel sorumlulukları nelerdir?",
                  "options": [
                    "Sadece bellek yönetimi",
                    "Bellek yönetimi, tip sistemi, güvenlik ve kod çalıştırma",
                    "Sadece kod derleme",
                    "Sadece güvenlik kontrolü"
                  ],
                  "answer": 1,
                  "explanation": "CLR, managed kodun çalıştırılmasından sorumlu olan runtime dır ve bellek yönetimi, tip sistemi, güvenlik ve kod çalıştırma gibi birçok sorumluluğu vardır."
                },
                {
                  "id": "q-runtime-02",
                  "question": "GC Generation 0 da hangi tür nesneler bulunur?",
                  "options": [
                    "Uzun ömürlü nesneler",
                    "Yeni oluşturulan, kısa ömürlü nesneler",
                    "Static nesneler",
                    "Büyük nesneler"
                  ],
                  "answer": 1,
                  "explanation": "Generation 0, yeni oluşturulan ve genellikle kısa ömürlü olan nesneleri içerir. Çoğu nesne Generation 0 da kalır ve hızlıca temizlenir."
                },
                {
                  "id": "q-runtime-03",
                  "question": "JIT compiler ne zaman çalışır?",
                  "options": [
                    "Derleme zamanında",
                    "Çalışma zamanında, metod ilk çağrıldığında",
                    "Uygulama yüklendiğinde",
                    "Hiçbir zaman"
                  ],
                  "answer": 1,
                  "explanation": "JIT compiler, metod ilk çağrıldığında IL kodunu native koda çevirir. Bu just-in-time yaklaşımıdır."
                },
                {
                  "id": "q-runtime-04",
                  "question": "Assembly manifest i ne içerir?",
                  "options": [
                    "Sadece IL kodu",
                    "Assembly kimliği, referanslar ve güvenlik bilgileri",
                    "Sadece tip tanımları",
                    "Sadece kaynaklar"
                  ],
                  "answer": 1,
                  "explanation": "Assembly manifest, assembly nin kimliği (name, version, culture), referans edilen diğer assembly ler ve güvenlik izinleri gibi metadata bilgilerini içerir."
                },
                {
                  "id": "q-runtime-05",
                  "question": "Host.CreateDefaultBuilder() ne yapar?",
                  "options": [
                    "Sadece logging yapılandırır",
                    "Logging, configuration ve dependency injection ı otomatik yapılandırır",
                    "Sadece configuration yükler",
                    "Hiçbir şey yapmaz"
                  ],
                  "answer": 1,
                  "explanation": "CreateDefaultBuilder(), logging, configuration (appsettings.json, environment variables) ve dependency injection gibi temel servisleri otomatik olarak yapılandırır."
                }
              ]
            },
            {
              "id": "activity-arch-09-lifecycle-challenge",
              "type": "code-challenge",
              "title": "Uygulama Yaşam Döngüsü Yönetimi",
              "estimatedMinutes": 35,
              "description": "Bir .NET Core uygulaması oluştur ve host lifecycle event lerini yönet. Uygulama başlatma, çalışma ve kapanma süreçlerini logla ve graceful shutdown implementasyonu yap.",
              "acceptanceCriteria": [
                "Host builder ile uygulama oluşturulmalı",
                "IHostApplicationLifetime interface i kullanılarak lifecycle event leri yakalanmalı",
                "ApplicationStarted, ApplicationStopping ve ApplicationStopped event leri loglanmalı",
                "Graceful shutdown için CancellationToken kullanılmalı",
                "Background service ile lifecycle entegrasyonu yapılmalı"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "LifecycleApp.cs",
                "code": "using Microsoft.Extensions.Hosting; nusing Microsoft.Extensions.DependencyInjection; nusing Microsoft.Extensions.Logging; n nvar host = Host.CreateDefaultBuilder(args) n    .ConfigureServices((context, services) => n    { n        // TODO: IHostApplicationLifetime servisini kullan n        // TODO: Background service ekle n    }) n    .Build(); n n// TODO: Lifecycle event lerini yakala ve logla n nawait host.RunAsync(); n",
                "explanation": "Bu starter code, host lifecycle yönetimi için temel yapıyı gösterir. Lifecycle event lerini yakalayıp loglayın."
              },
              "testCases": [
                {
                  "id": "test-lifecycle-01",
                  "description": "Uygulama başlatıldığında ApplicationStarted event i tetiklenmeli",
                  "input": "Uygulama başlatılır",
                  "expectedOutput": "ApplicationStarted log mesajı görünmeli"
                },
                {
                  "id": "test-lifecycle-02",
                  "description": "Ctrl+C ile uygulama durdurulduğunda ApplicationStopping event i tetiklenmeli",
                  "input": "SIGTERM veya Ctrl+C sinyali gönderilir",
                  "expectedOutput": "ApplicationStopping log mesajı görünmeli, background service düzgün durdurulmalı"
                },
                {
                  "id": "test-lifecycle-03",
                  "description": "Uygulama tamamen kapandığında ApplicationStopped event i tetiklenmeli",
                  "input": "Uygulama kapanır",
                  "expectedOutput": "ApplicationStopped log mesajı görünmeli"
                }
              ],
              "evaluationTips": [
                "IHostApplicationLifetime, host tan resolve edilebilir",
                "ApplicationStarted, ApplicationStopping ve ApplicationStopped event lerini dinle",
                "CancellationToken ı background service lerde kullan",
                "Console.CancelKeyPress event ini de kullanabilirsin"
              ]
            },
            {
              "id": "activity-arch-10-reflection",
              "type": "reflection",
              "title": "Runtime Mimarisi Üzerine Düşünme",
              "estimatedMinutes": 10,
              "prompts": [
                "CLR, BCL ve assembly yapısının birbirleriyle nasıl etkileşime girdiğini düşün. Hangi bileşen hangi bileşene bağımlı?",
                "Garbage Collection un uygulama performansına etkisini değerlendir. Hangi senaryolarda GC optimizasyonu kritik olur?",
                "JIT compilation ın avantaj ve dezavantajlarını düşün. AOT compilation ne zaman tercih edilmeli?",
                "Host builder patterninin dependency injection ve configuration yönetimindeki rolünü değerlendir. Alternatif yaklaşımlar neler olabilir?"
              ],
              "expectedTakeaways": [
                "Runtime bileşenlerinin birbirleriyle nasıl entegre olduğunu anlamak",
                "Performans optimizasyonu için runtime mekanizmalarını doğru kullanmak",
                "Uygulama mimarisinde host patterninin önemini kavramak"
              ]
            }
          ],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Core%20Mimarisi",
            "description": "CLR, host ve servis yaşam döngüsünü görselleyen içerikleri incele."
          },
          "relatedTopics": [
            {
              "label": "CLR Yaşam Döngüsü",
              "href": "/education/lessons/dotnet/runtime/clr-lifecycle",
              "description": "Uygulama başlatma, JIT ve GC süreçlerini ayrıntılı incele."
            },
            {
              "label": "Generic Host Yapılandırması",
              "href": "/education/lessons/dotnet/runtime/generic-host",
              "description": "Host builder ve servis kayıtlarını pratik olarak uygula."
            },
            {
              "label": "Konfigürasyon Pipeline ı",
              "href": "/education/lessons/dotnet/runtime/configuration-pipeline",
              "description": "Çok katmanlı konfigürasyon kaynaklarını sırayla yükle."
            },
            {
              "label": "Assembly Loading ve Reflection",
              "href": "/education/lessons/dotnet/runtime/assembly-loading-reflection",
              "description": "Assembly leri dinamik yükleme ve reflection ile runtime da tip bilgilerine erişim.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Assembly.Load ve Assembly.LoadFrom ile dinamik yükleme yapabilirsin",
                "Reflection ile runtime da tip, metot ve property bilgilerine erişebilirsin",
                "Activator.CreateInstance ile dinamik nesne oluşturabilirsin",
                "Metadata ve attribute ları reflection ile okuyabilirsin",
                "Assembly loading stratejileri performansı etkiler"
              ],
              "sections": [
                {
                  "id": "assembly-loading",
                  "title": "Assembly Yükleme Stratejileri",
                  "summary": "Assembly leri farklı yöntemlerle yükleme.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Assembly leri dinamik olarak yüklemek için farklı yöntemler vardır: Assembly.Load, Assembly.LoadFrom, Assembly.LoadFile. Her birinin farklı kullanım senaryoları vardır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Reflection; n n// Assembly.Load: Assembly name ile yükleme nAssembly assembly1 = Assembly.Load("MyLibrary "); n n// Assembly.LoadFrom: Dosya yolu ile yükleme nAssembly assembly2 = Assembly.LoadFrom(@"C:  MyApp  MyLibrary.dll "); n n// Assembly.LoadFile: Dosyayı doğrudan yükleme (context yok) nAssembly assembly3 = Assembly.LoadFile(@"C:  MyApp  MyLibrary.dll "); n n// Mevcut assembly yi al nAssembly currentAssembly = Assembly.GetExecutingAssembly();",
                      "explanation": "Farklı assembly yükleme yöntemleri. Load, LoadFrom ve LoadFile farklı context lerde çalışır."
                    }
                  ]
                },
                {
                  "id": "reflection-basics",
                  "title": "Reflection Temelleri",
                  "summary": "Tip bilgilerine runtime da erişim.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Reflection, runtime da tip bilgilerine erişmeyi sağlar. Type sınıfı, metotlar, property ler ve field lar hakkında bilgi verir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Reflection; n nType type = typeof(MyClass); n n// Metotları al nMethodInfo[] methods = type.GetMethods(); nforeach (var method in methods) n{ n    Console.WriteLine($ \"Method: {method.Name}\"); n} n n// Propertyleri al nPropertyInfo[] properties = type.GetProperties(); nforeach (var prop in properties) n{ n    Console.WriteLine($ \"Property: {prop.Name}, Type: {prop.PropertyType} "); n} n n// Attribute ları al nvar attributes = type.GetCustomAttributes();",
                      "explanation": "Reflection ile tip bilgilerine erişim örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-assembly-load",
                  "question": "Assembly.Load ve Assembly.LoadFrom arasındaki fark nedir?",
                  "options": [
                    "LoadFrom daha hızlıdır",
                    "Load assembly name ile, LoadFrom dosya yolu ile yükler",
                    "Hiçbir fark yoktur",
                    "Load sadece .exe dosyaları için kullanılır"
                  ],
                  "answer": "Load assembly name ile, LoadFrom dosya yolu ile yükler",
                  "rationale": "Assembly.Load assembly name (FQN) ile yükleme yapar, Assembly.LoadFrom ise dosya yolu ile yükleme yapar."
                }
              ],
              "resources": [
                {
                  "id": "resource-reflection-docs",
                  "label": "Microsoft Docs: Reflection",
                  "href": "https://learn.microsoft.com/dotnet/csharp/programming-guide/concepts/reflection",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Reflection konusunda detaylı dokümantasyon."
                }
              ],
              "practice": [
                {
                  "id": "practice-reflection",
                  "title": "Reflection ile Dinamik Nesne Oluşturma",
                  "description": "Reflection kullanarak dinamik nesne oluştur ve metot çağır.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Bir sınıf tanımla",
                    "Activator.CreateInstance ile nesne oluştur",
                    "MethodInfo ile metot bilgisini al",
                    "Invoke ile metodu çağır"
                  ]
                }
              ]
            },
            {
              "label": "Garbage Collection Stratejileri ve Optimizasyonu",
              "href": "/education/lessons/dotnet/runtime/gc-strategies-optimization",
              "description": "GC mekanizmalarını derinlemesine öğren ve performans optimizasyonu yap.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Workstation GC ve Server GC arasındaki farkları anlayabilirsin",
                "GC generation sistemini (0, 1, 2) optimize edebilirsin",
                "IDisposable patternini doğru uygulayabilirsin",
                "Large Object Heap (LOH) kullanımını optimize edebilirsin",
                "GC latency mode larını senaryoya göre seçebilirsin"
              ],
              "sections": [
                {
                  "id": "gc-strategies",
                  "title": "GC Stratejileri",
                  "summary": "Workstation vs Server GC.",
                  "content": [
                    {
                      "type": "text",
                      "body": "GC nin iki ana stratejisi vardır: Workstation GC (client uygulamalar için) ve Server GC (sunucu uygulamaları için). Server GC çoklu thread kullanır ve daha yüksek throughput sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System; n n// GC stratejisi kontrolü nbool isServerGC = GCSettings.IsServerGC; nConsole.WriteLine($ \"Server GC: {isServerGC}\"); n n// GC latency mode nGCLatencyMode mode = GCSettings.LatencyMode; nConsole.WriteLine($ \"Latency Mode: {mode} "); n n// Latency mode değiştirme (dikkatli kullan) n// GCSettings.LatencyMode = GCLatencyMode.LowLatency;",
                      "explanation": "GC stratejisi ve latency mode kontrolü."
                    }
                  ]
                },
                {
                  "id": "gc-optimization",
                  "title": "GC Optimizasyonu",
                  "summary": "Performans için GC optimizasyon teknikleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "GC optimizasyonu için: IDisposable pattern kullan, büyük nesnelerden kaçın, string concatenation yerine StringBuilder kullan, event handler ları unsubscribe et."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// IDisposable pattern örneği npublic class ResourceManager : IDisposable n{ n    private bool disposed = false; n     n    public void Dispose() n    { n        Dispose(true); n        GC.SuppressFinalize(this); n    } n     n    protected virtual void Dispose(bool disposing) n    { n        if (!disposed) n        { n            if (disposing) n            { n                // Managed kaynakları temizle n            } n            // Unmanaged kaynakları temizle n            disposed = true; n        } n    } n}",
                      "explanation": "IDisposable pattern implementasyonu."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-gc-strategies",
                  "question": "Server GC ne zaman kullanılmalıdır?",
                  "options": [
                    "Tüm uygulamalarda",
                    "Sunucu uygulamalarında yüksek throughput gerektiğinde",
                    "Sadece desktop uygulamalarında",
                    "Hiçbir zaman"
                  ],
                  "answer": "Sunucu uygulamalarında yüksek throughput gerektiğinde",
                  "rationale": "Server GC çoklu thread kullanır ve sunucu uygulamalarında daha yüksek throughput sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-gc-docs",
                  "label": "Microsoft Docs: Garbage Collection",
                  "href": "https://learn.microsoft.com/dotnet/standard/garbage-collection/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "GC hakkında detaylı dokümantasyon."
                }
              ],
              "practice": [
                {
                  "id": "practice-gc-optimization",
                  "title": "GC Optimizasyonu",
                  "description": "IDisposable pattern implementasyonu yap ve GC performansını ölç.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "IDisposable interface ini implement et",
                    "Using statement ile kaynak yönetimi yap",
                    "GC istatistiklerini ölç ve karşılaştır"
                  ]
                }
              ]
            },
            {
              "label": "JIT Compilation Süreçleri ve Tiered Compilation",
              "href": "/education/lessons/dotnet/runtime/jit-tiered-compilation",
              "description": "JIT compilation mekanizmasını ve tiered compilation stratejisini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "JIT compiler IL kodunu native koda çevirir",
                "Tiered compilation performans ve başlatma süresi arasında denge sağlar",
                "Tier 0 (Quick JIT) hızlı başlatma sağlar",
                "Tier 1 (Optimized JIT) hot path ler için optimize edilmiş kod üretir",
                "AOT compilation başlatma süresini azaltır"
              ],
              "sections": [
                {
                  "id": "jit-process",
                  "title": "JIT Compilation Süreci",
                  "summary": "IL den native koda dönüşüm.",
                  "content": [
                    {
                      "type": "text",
                      "body": "JIT compiler, IL (Intermediate Language) kodunu çalışma zamanında native makine koduna çevirir. Bu süreç metod ilk çağrıldığında gerçekleşir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// JIT compilation otomatik olarak gerçekleşir n// İlk çağrıda metod derlenir ve cache lenir npublic class MyClass n{ n    public void MyMethod() n    { n        // Bu metod ilk çağrıldığında JIT tarafından derlenir n        Console.WriteLine("Hello from JIT compiled method "); n    } n}",
                      "explanation": "JIT compilation otomatik olarak gerçekleşir, ilk metod çağrısında."
                    }
                  ]
                },
                {
                  "id": "tiered-compilation",
                  "title": "Tiered Compilation",
                  "summary": "İki seviyeli derleme stratejisi.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Tiered compilation, iki seviyeli derleme stratejisidir: Tier 0 (Quick JIT) hızlı başlatma, Tier 1 (Optimized JIT) performans optimizasyonu sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Tiered compilation varsayılan olarak açıktır (.NET Core 2.1+) n// Runtime.json ile yapılandırılabilir: n// { n//  "runtimeOptions ": { n//    "TieredCompilation ": true n//   } n// }",
                      "explanation": "Tiered compilation varsayılan olarak açıktır."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-jit-tiered",
                  "question": "Tiered compilation ın avantajı nedir?",
                  "options": [
                    "Sadece hızlı başlatma sağlar",
                    "Başlatma süresi ve performans arasında denge sağlar",
                    "Sadece performans sağlar",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Başlatma süresi ve performans arasında denge sağlar",
                  "rationale": "Tiered compilation, Tier 0 ile hızlı başlatma, Tier 1 ile performans optimizasyonu sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-jit-docs",
                  "label": "Microsoft Docs: Tiered Compilation",
                  "href": "https://learn.microsoft.com/dotnet/core/runtime-config/compilation",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Tiered compilation dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-jit",
                  "title": "JIT Compilation Analizi",
                  "description": "JIT compilation sürecini gözlemle ve tiered compilation etkisini ölç.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Metod çağrı sürelerini ölç",
                    "İlk çağrı vs sonraki çağrıları karşılaştır",
                    "Tiered compilation etkisini gözlemle"
                  ]
                }
              ]
            },
            {
              "label": "Base Class Library (BCL) Kullanımı",
              "href": "/education/lessons/dotnet/runtime/bcl-usage",
              "description": "BCLın temel namespace lerini ve kullanım senaryolarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Başlangıç",
              "keyTakeaways": [
                "BCLın ana namespace lerini (System, System.Collections.Generic, System.Linq) tanıyabilirsin",
                "Generic koleksiyonların avantajlarını anlayabilirsin",
                "LINQ ile koleksiyon sorgulama yapabilirsin",
                "System.Threading ile async/await kullanabilirsin",
                "System.Text ile string işlemleri yapabilirsin"
              ],
              "sections": [
                {
                  "id": "bcl-namespaces",
                  "title": "BCL Namespace leri",
                  "summary": "Temel namespace ler ve kullanımları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "BCL, .NET Core un temel sınıf kütüphanesidir. System, System.Collections.Generic, System.Linq, System.Threading, System.Text gibi namespace ler içerir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System; nusing System.Collections.Generic; nusing System.Linq; nusing System.Threading.Tasks; n n// Generic Collections nvar list = new List<int> { 1, 2, 3, 4, 5 }; nvar dict = new Dictionary<string, int>(); n n// LINQ nvar evens = list.Where(x => x % 2 == 0).ToList(); n n// Async/Await nawait Task.Delay(1000);",
                      "explanation": "BCLın temel namespace lerinin kullanımı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-bcl",
                  "question": "BCL nedir?",
                  "options": [
                    "Sadece System namespace i",
                    ".NET Core un temel sınıf kütüphanesi",
                    "Sadece koleksiyonlar",
                    "Sadece LINQ"
                  ],
                  "answer": ".NET Core un temel sınıf kütüphanesi",
                  "rationale": "BCL (Base Class Library), .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-bcl-docs",
                  "label": "Microsoft Docs: .NET API Reference",
                  "href": "https://learn.microsoft.com/dotnet/api/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "BCL API referansı."
                }
              ],
              "practice": [
                {
                  "id": "practice-bcl",
                  "title": "BCL Kullanımı",
                  "description": "Farklı BCL namespace lerini kullanarak örnek uygulama yap.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Kolay",
                  "instructions": [
                    "Generic koleksiyonlar kullan",
                    "LINQ sorguları yaz",
                    "Async/await kullan",
                    "String işlemleri yap"
                  ]
                }
              ]
            },
            {
              "label": "Runtime Hosting Modelleri",
              "href": "/education/lessons/dotnet/runtime/runtime-hosting-models",
              "description": "Farklı runtime hosting modellerini ve kullanım senaryolarını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Self-contained ve framework-dependent deployment modellerini anlayabilirsin",
                "Single-file deployment avantajlarını öğrenebilirsin",
                "ReadyToRun (R2R) compilation kullanabilirsin",
                "Native AOT deployment modelini anlayabilirsin",
                "Deployment model seçimini senaryoya göre yapabilirsin"
              ],
              "sections": [
                {
                  "id": "hosting-models",
                  "title": "Hosting Modelleri",
                  "summary": "Farklı deployment modelleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": ".NET Core farklı hosting modelleri sunar: Framework-dependent (FDD), Self-contained (SCD), Single-file, ReadyToRun (R2R) ve Native AOT."
                    },
                    {
                      "type": "code",
                      "language": "bash",
                      "code": "# Framework-dependent deployment n# .NET runtime sistemde yüklü olmalı ndotnet publish -c Release n n# Self-contained deployment n# .NET runtime uygulamayla birlikte gelir ndotnet publish -c Release --self-contained true n n# Single-file deployment ndotnet publish -c Release -p:PublishSingleFile=true n n# ReadyToRun ndotnet publish -c Release -p:PublishReadyToRun=true",
                      "explanation": "Farklı deployment modelleri için publish komutları."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-hosting",
                  "question": "Self-contained deployment in avantajı nedir?",
                  "options": [
                    "Daha küçük dosya boyutu",
                    ".NET runtime ın sistemde yüklü olması gerekmez",
                    "Daha hızlı başlatma",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": ".NET runtime ın sistemde yüklü olması gerekmez",
                  "rationale": "Self-contained deployment, .NET runtime ı uygulamayla birlikte paketler, bu yüzden sistemde .NET yüklü olması gerekmez."
                }
              ],
              "resources": [
                {
                  "id": "resource-hosting-docs",
                  "label": "Microsoft Docs: .NET Deployment",
                  "href": "https://learn.microsoft.com/dotnet/core/deploying/",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Deployment modelleri dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-hosting",
                  "title": "Deployment Model Karşılaştırması",
                  "description": "Farklı deployment modellerini test et ve karşılaştır.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "FDD ve SCD modellerini test et",
                    "Dosya boyutlarını karşılaştır",
                    "Başlatma sürelerini ölç"
                  ]
                }
              ]
            },
            {
              "label": "Memory Management Best Practices",
              "href": "/education/lessons/dotnet/runtime/memory-management-best-practices",
              "description": "Bellek yönetimi için en iyi uygulamaları öğren ve performansı optimize et.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Stack ve heap kullanımını anlayabilirsin",
                "Value type vs reference type farklarını kavrayabilirsin",
                "IDisposable patternini doğru uygulayabilirsin",
                "Memory leak leri önleyebilirsin",
                "Large Object Heap (LOH) kullanımını optimize edebilirsin"
              ],
              "sections": [
                {
                  "id": "memory-basics",
                  "title": "Bellek Temelleri",
                  "summary": "Stack ve heap kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "C# dilinde value typelar stack te, reference type lar heap te saklanır. Stack hızlı ama sınırlı, heap yavaş ama büyük."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Value type (stack) nint number = 42; nbool flag = true; n n// Reference type (heap) nstring text ="Hello "; nList<int> list = new List<int>(); n n// Struct (value type, stack) nstruct Point n{ n    public int X; n    public int Y; n} n n// Class (reference type, heap) nclass Person n{ n    public string Name; n}",
                      "explanation": "Value type ve reference type örnekleri."
                    }
                  ]
                },
                {
                  "id": "memory-optimization",
                  "title": "Bellek Optimizasyonu",
                  "summary": "En iyi uygulamalar.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Bellek optimizasyonu için: IDisposable kullan, büyük nesnelerden kaçın, string concatenation yerine StringBuilder kullan, event handler ları unsubscribe et, using statement kullan."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Using statement ile otomatik dispose nusing (var stream = new FileStream("file.txt ", FileMode.Open)) n{ n    // Stream kullanımı n} n// Stream otomatik dispose edilir n n// StringBuilder kullanımı nvar sb = new StringBuilder(); nfor (int i = 0; i < 1000; i++) n{ n    sb.Append(i.ToString()); n} nstring result = sb.ToString();",
                      "explanation": "Bellek optimizasyonu örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-memory",
                  "question": "Value typelar nerede saklanır?",
                  "options": [
                    "Heap te",
                    "Stack te",
                    "Her ikisinde de",
                    "Hiçbirinde"
                  ],
                  "answer": "Stack te",
                  "rationale": "Value typelar (int, bool, struct) stack te saklanır ve değerleri doğrudan taşınır."
                }
              ],
              "resources": [
                {
                  "id": "resource-memory-docs",
                  "label": "Microsoft Docs: Memory Management",
                  "href": "https://learn.microsoft.com/dotnet/standard/garbage-collection/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Bellek yönetimi dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-memory",
                  "title": "Bellek Optimizasyonu",
                  "description": "IDisposable pattern kullan ve bellek kullanımını optimize et.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "IDisposable implement et",
                    "Using statement kullan",
                    "Bellek kullanımını ölç ve optimize et"
                  ]
                }
              ]
            },
            {
              "label": "Platform Abstraction Layer (PAL)",
              "href": "/education/lessons/dotnet/runtime/platform-abstraction-layer",
              "description": "PAL ın rolünü ve platform bağımsızlığını nasıl sağladığını öğren.",
              "estimatedDurationMinutes": 35,
              "level": "İleri",
              "keyTakeaways": [
                "PAL ın .NET Core un platform bağımsızlığını nasıl sağladığını anlayabilirsin",
                "Platform-specific API lerin nasıl abstract edildiğini öğrenebilirsin",
                "RuntimeIdentifier (RID) kavramını anlayabilirsin",
                "Cross-platform geliştirme prensiplerini kavrayabilirsin",
                "Platform detection API lerini kullanabilirsin"
              ],
              "sections": [
                {
                  "id": "pal-overview",
                  "title": "PAL Genel Bakış",
                  "summary": "Platform bağımsızlık katmanı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "PAL (Platform Abstraction Layer), .NET Core un platform bağımsızlığını sağlar. Platform-specific API leri abstract eder ve cross-platform çalışmayı mümkün kılar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Runtime.InteropServices; n n// Platform detection nif (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) n{ n    Console.WriteLine("Windows platform "); n} nelse if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)) n{ n    Console.WriteLine("Linux platform "); n} nelse if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX)) n{ n    Console.WriteLine("macOS platform "); n} n n// Architecture nConsole.WriteLine($ \"Architecture: {RuntimeInformation.ProcessArchitecture} ");",
                      "explanation": "Platform detection örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-pal",
                  "question": "PAL ın amacı nedir?",
                  "options": [
                    "Sadece Windows desteği",
                    "Platform bağımsızlığı sağlamak",
                    "Sadece Linux desteği",
                    "Hiçbir şey"
                  ],
                  "answer": "Platform bağımsızlığı sağlamak",
                  "rationale": "PAL (Platform Abstraction Layer), .NET Core un farklı platformlarda çalışmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-pal-docs",
                  "label": "Microsoft Docs: Cross-platform",
                  "href": "https://learn.microsoft.com/dotnet/core/deploying/",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Cross-platform geliştirme dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-pal",
                  "title": "Platform Detection",
                  "description": "Platform detection API lerini kullan ve platform-specific kod yaz.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "RuntimeInformation kullan",
                    "Platform detection yap",
                    "Platform-specific kod yaz"
                  ]
                }
              ]
            }
          ]
        }$$::jsonb AS module
)
UPDATE "courses"
SET "content" = jsonb_set(
  "content",
  '{modules}',
  COALESCE(("content"->'modules'), '[]'::jsonb) || (SELECT module FROM new_module)
)
WHERE "id" = 'course-dotnet-roadmap'
  AND NOT EXISTS (
    SELECT 1 
    FROM jsonb_array_elements("content"->'modules') AS m
    WHERE m->>'id' = (SELECT module->>'id' FROM new_module)
  );


INSERT INTO "quizzes" (
    "id",
    "courseId",
    "title",
    "description",
    "topic",
    "type",
    "level",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
)
VALUES
        'course-dotnet-roadmap',
        'Mini Test: Assembly Loading ve Reflection',
        'Assembly yükleme ve reflection konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-reflection-1",
            "question": "Assembly.Load ve Assembly.LoadFrom arasındaki fark nedir?",
            "options": [
              "LoadFrom daha hızlıdır",
              "Load assembly name ile, LoadFrom dosya yolu ile yükler",
              "Hiçbir fark yoktur",
              "Load sadece .exe dosyaları için kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "Assembly.Load assembly name (FQN) ile yükleme yapar, Assembly.LoadFrom ise dosya yolu ile yükleme yapar."
          },
          {
            "id": "mini-reflection-2",
            "question": "Reflection ile ne yapılabilir?",
            "options": [
              "Sadece tip bilgilerini okuma",
              "Tip bilgilerini okuma, dinamik nesne oluşturma ve metot çağırma",
              "Sadece metot çağırma",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Reflection ile tip bilgilerini okuyabilir, dinamik nesne oluşturabilir (Activator.CreateInstance) ve metot çağırabilirsin (MethodInfo.Invoke)."
          },
          {
            "id": "mini-reflection-3",
            "question": "Activator.CreateInstance ne işe yarar?",
            "options": [
              "Sadece tip bilgisi alır",
              "Dinamik olarak nesne oluşturur",
              "Sadece metot çağırır",
              "Assembly yükler"
            ],
            "correctAnswer": 1,
            "explanation": "Activator.CreateInstance, reflection kullanarak runtime da dinamik olarak nesne oluşturur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/assembly-loading-reflection',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-gc-strategies-optimization',
        'course-dotnet-roadmap',
        'Mini Test: Garbage Collection Stratejileri',
        'GC mekanizmaları ve optimizasyon tekniklerini test et.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-gc-1",
            "question": "Server GC ne zaman kullanılmalıdır?",
            "options": [
              "Tüm uygulamalarda",
              "Sunucu uygulamalarında yüksek throughput gerektiğinde",
              "Sadece desktop uygulamalarında",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Server GC çoklu thread kullanır ve sunucu uygulamalarında daha yüksek throughput sağlar."
          },
          {
            "id": "mini-gc-2",
            "question": "GC generation sisteminde kaç generation vardır?",
            "options": [
              "1",
              "2",
              "3",
              "4"
            ],
            "correctAnswer": 2,
            "explanation": "GC generation sistemi 3 seviyeden oluşur: Generation 0 (yeni nesneler), Generation 1 (orta ömürlü), Generation 2 (uzun ömürlü)."
          },
          {
            "id": "mini-gc-3",
            "question": "IDisposable patterninin amacı nedir?",
            "options": [
              "Sadece bellek temizleme",
              "Managed ve unmanaged kaynakların kontrollü temizlenmesi",
              "Sadece unmanaged kaynak temizleme",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "IDisposable pattern, hem managed hem de unmanaged kaynakların kontrollü şekilde temizlenmesini sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/gc-strategies-optimization',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-jit-tiered-compilation',
        'course-dotnet-roadmap',
        'Mini Test: JIT ve Tiered Compilation',
        'JIT compilation ve tiered compilation konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-jit-1",
            "question": "JIT compiler ne zaman çalışır?",
            "options": [
              "Derleme zamanında",
              "Çalışma zamanında, metod ilk çağrıldığında",
              "Uygulama yüklendiğinde",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "JIT compiler, metod ilk çağrıldığında IL kodunu native koda çevirir. Bu  just-in-time  yaklaşımıdır."
          },
          {
            "id": "mini-jit-2",
            "question": "Tiered compilation ın avantajı nedir?",
            "options": [
              "Sadece hızlı başlatma sağlar",
              "Başlatma süresi ve performans arasında denge sağlar",
              "Sadece performans sağlar",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Tiered compilation, Tier 0 ile hızlı başlatma, Tier 1 ile performans optimizasyonu sağlar."
          },
          {
            "id": "mini-jit-3",
            "question": "AOT compilation ın avantajı nedir?",
            "options": [
              "Daha yavaş başlatma",
              "Daha hızlı başlatma ve daha küçük footprint",
              "Sadece daha küçük footprint",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "AOT (Ahead-of-Time) compilation, uygulamanın önceden derlenmesini sağlar, bu da daha hızlı başlatma ve daha küçük footprint sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/jit-tiered-compilation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-bcl-usage',
        'course-dotnet-roadmap',
        'Mini Test: Base Class Library Kullanımı',
        'BCL namespace leri ve kullanım senaryolarını test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-bcl-1",
            "question": "BCL nedir?",
            "options": [
              "Sadece System namespace i",
              ".NET Core un temel sınıf kütüphanesi",
              "Sadece koleksiyonlar",
              "Sadece LINQ"
            ],
            "correctAnswer": 1,
            "explanation": "BCL (Base Class Library), .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır."
          },
          {
            "id": "mini-bcl-2",
            "question": "System.Linq namespace i ne için kullanılır?",
            "options": [
              "Sadece koleksiyon oluşturma",
              "Koleksiyonlar üzerinde sorgulama ve dönüşüm işlemleri",
              "Sadece string işlemleri",
              "Sadece async işlemler"
            ],
            "correctAnswer": 1,
            "explanation": "System.Linq namespace i LINQ (Language Integrated Query) için kullanılır ve koleksiyonlar üzerinde sorgulama ve dönüşüm işlemleri sağlar."
          },
          {
            "id": "mini-bcl-3",
            "question": "Generic koleksiyonların avantajı nedir?",
            "options": [
              "Sadece daha hızlıdır",
              "Type-safe ve performanslıdır",
              "Sadece type-safe dir",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Generic koleksiyonlar (List<T>, Dictionary<TKey, TValue>) hem type-safe hem de performanslıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/bcl-usage',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-runtime-hosting-models',
        'course-dotnet-roadmap',
        'Mini Test: Runtime Hosting Modelleri',
        'Deployment modelleri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-hosting-1",
            "question": "Self-contained deployment in avantajı nedir?",
            "options": [
              "Daha küçük dosya boyutu",
              ".NET runtime ın sistemde yüklü olması gerekmez",
              "Daha hızlı başlatma",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Self-contained deployment, .NET runtime ı uygulamayla birlikte paketler, bu yüzden sistemde .NET yüklü olması gerekmez."
          },
          {
            "id": "mini-hosting-2",
            "question": "ReadyToRun (R2R) compilation nedir?",
            "options": [
              "Sadece IL kodu",
              "Önceden derlenmiş native kod",
              "Sadece JIT compilation",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ReadyToRun (R2R) compilation, uygulamanın önceden native koda derlenmesini sağlar, bu da daha hızlı başlatma sağlar."
          },
          {
            "id": "mini-hosting-3",
            "question": "Single-file deployment in avantajı nedir?",
            "options": [
              "Sadece daha küçük dosya boyutu",
              "Tek bir dosya olarak dağıtım ve daha kolay deployment",
              "Sadece daha hızlı başlatma",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Single-file deployment, tüm uygulamayı tek bir dosya olarak paketler, bu da dağıtımı kolaylaştırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/runtime-hosting-models',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-memory-management-best-practices',
        'course-dotnet-roadmap',
        'Mini Test: Memory Management Best Practices',
        'Bellek yönetimi en iyi uygulamalarını test et.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-memory-1",
            "question": "Value type lar nerede saklanır?",
            "options": [
              "Heap te",
              "Stack te",
              "Her ikisinde de",
              "Hiçbirinde"
            ],
            "correctAnswer": 1,
            "explanation": "Value type lar (int, bool, struct) stack te saklanır ve değerleri doğrudan taşınır."
          },
          {
            "id": "mini-memory-2",
            "question": "String concatenation yerine ne kullanılmalıdır?",
            "options": [
              "Sadece string",
              "StringBuilder",
              "Sadece List<string>",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "String concatenation yerine StringBuilder kullanılmalıdır, özellikle döngülerde çünkü daha performanslıdır."
          },
          {
            "id": "mini-memory-3",
            "question": "Using statement ın amacı nedir?",
            "options": [
              "Sadece dosya okuma",
              "IDisposable nesnelerin otomatik dispose edilmesi",
              "Sadece bellek temizleme",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Using statement, IDisposable interface ini implement eden nesnelerin otomatik olarak dispose edilmesini sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/memory-management-best-practices',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-platform-abstraction-layer',
        'course-dotnet-roadmap',
        'Mini Test: Platform Abstraction Layer',
        'PAL ve cross-platform geliştirme konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-pal-1",
            "question": "PAL ın amacı nedir?",
            "options": [
              "Sadece Windows desteği",
              "Platform bağımsızlığı sağlamak",
              "Sadece Linux desteği",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "PAL (Platform Abstraction Layer), .NET Core un farklı platformlarda çalışmasını sağlar."
          },
          {
            "id": "mini-pal-2",
            "question": "RuntimeInformation.IsOSPlatform ne için kullanılır?",
            "options": [
              "Sadece platform adını almak",
              "Platform detection yapmak",
              "Sadece mimariyi öğrenmek",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RuntimeInformation.IsOSPlatform, çalışılan platformu tespit etmek için kullanılır (Windows, Linux, macOS)."
          },
          {
            "id": "mini-pal-3",
            "question": "RID (Runtime Identifier) nedir?",
            "options": [
              "Sadece platform adı",
              "Platform ve mimariyi tanımlayan benzersiz tanımlayıcı",
              "Sadece mimari",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RID (Runtime Identifier), platform ve mimariyi tanımlayan benzersiz tanımlayıcıdır (örn: win-x64, linux-x64)."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/platform-abstraction-layer',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (

COMMIT;
