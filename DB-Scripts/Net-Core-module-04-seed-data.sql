-- Module 04: ASP.NET Core MVC - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-04-aspnet-mvc",
          "title": "ASP.NET Core MVC",
          "summary": "MVC pattern ile server-rendered uygulamalar geliştir ve view lifecycle ını yönet.",
          "durationMinutes": 240,
          "objectives": [
            "MVC patternin temel bileşenlerini (Model, View, Controller) anlayıp uygulayabileceksin",
            "Routing mekanizmasını (convention-based ve attribute routing) kullanarak URL yapılarını yönetebileceksin",
            "Model binding ve validasyon süreçlerini uçtan uca uygulayabileceksin",
            "Razor view engine ile dinamik HTML içerikleri oluşturabileceksin",
            "View lifecycle ını anlayıp partial views, view components ve tag helpers kullanabileceksin",
            "Action filters ve result filters ile cross-cutting concerns leri yönetebileceksin"
          ],
          "activities": [
            {
              "id": "activity-mvc-pattern-intro",
              "type": "concept",
              "title": "MVC Pattern Temelleri",
              "estimatedMinutes": 20,
              "content": "Model-View-Controller (MVC) pattern, uygulama mantığını üç ana bileşene ayırarak separation of concerns prensibini uygular: n n**Model**: Veri ve iş mantığını temsil eder. Domain modelleri, veri erişim katmanı ve business logic burada yer alır. n n**View**: Kullanıcı arayüzünü temsil eder. Razor view engine ile HTML içerikleri oluşturulur ve model verileri görüntülenir. n n**Controller**: Kullanıcı girişlerini işler, model ile etkileşime girer ve uygun view ı seçer. Action methods HTTP isteklerini işler. n nASP.NET Core MVC de bu bileşenler dependency injection ile gevşek bağlı (loosely coupled) şekilde çalışır.",
              "highlights": [
                "MVC pattern separation of concerns sağlayarak test edilebilirliği artırır",
                "Controller lar action methods içerir ve HTTP isteklerini işler",
                "View lar Razor syntax ile dinamik HTML üretir",
                "Model binding otomatik olarak HTTP verilerini C# nesnelerine dönüştürür"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "HomeController.cs",
                  "code": "using Microsoft.AspNetCore.Mvc; n nnamespace MyApp.Controllers n{ n    public class HomeController : Controller n    { n        public IActionResult Index() n        { n            var model = new { Message ="Hoş geldiniz! \" }; n            return View(model); n        } n    } n}",
                  "explanation": "Basit bir MVC controller örneği. Index action method u bir view döndürür."
                }
              ],
              "checklist": [
                {
                  "id": "check-mvc-components",
                  "label": "MVC nin üç ana bileşenini (Model, View, Controller) anladığını doğrula",
                  "explanation": "Her bileşenin sorumluluğunu açıklayabilmelisin"
                },
                {
                  "id": "check-controller-basics",
                  "label": "Controller sınıfının Controller base class ından türediğini öğren",
                  "explanation": "Controller base class View(), Json(), Redirect() gibi helper method lar sağlar"
                }
              ]
            },
            {
              "id": "activity-controller-actions",
              "type": "guided-exercise",
              "title": "Controller ve Action Methods Oluşturma",
              "estimatedMinutes": 30,
              "description": "Bir MVC controller oluşturup farklı action method türlerini uygulayacaksın.",
              "steps": [
                {
                  "title": "Projeyi hazırla",
                  "detail": "dotnet new mvc -n MvcDemo komutu ile yeni bir MVC projesi oluştur.",
                  "hint": "MVC template i Views, Controllers ve Models klasörlerini otomatik oluşturur"
                },
                {
                  "title": "Yeni controller ekle",
                  "detail": "Controllers klasörüne ProductsController.cs dosyası ekle ve temel CRUD action ları oluştur.",
                  "hint": "Controller isimleri  Controller  ile bitmeli ve Controller base class ından türemeli"
                },
                {
                  "title": "Action method türlerini uygula",
                  "detail": "Index (GET), Create (GET ve POST), Details (GET), Edit (GET ve POST), Delete (GET ve POST) action larını ekle.",
                  "hint": "HTTP verb lerine göre method isimlendirmesi yap: [HttpGet], [HttpPost] attribute larını kullan"
                },
                {
                  "title": "View ları oluştur",
                  "detail": "Her action için Views/Products klasöründe ilgili Razor view dosyalarını oluştur.",
                  "hint": "View() method u Views/{Controller}/{Action}.cshtml dosyasını arar"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "ProductsController.cs",
                "code": "using Microsoft.AspNetCore.Mvc; n nnamespace MvcDemo.Controllers n{ n    public class ProductsController : Controller n    { n        // TODO: Index action method unu ekle n        // TODO: Create (GET ve POST) action larını ekle n        // TODO: Details action ını ekle n    } n}",
                "explanation": "Controller iskeleti. Action method ları ekleyerek tamamla."
              },
              "hints": [
                "Action method lar public ve IActionResult (veya ActionResult) döndürmeli",
                "View() method una model parametresi geçerek view a veri aktarabilirsin",
                "RedirectToAction() ile başka bir action a yönlendirme yapabilirsin"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Tüm action method lar doğru HTTP verb attribute larına sahip",
                  "View lar ilgili action lardan çağrılıyor",
                  "Model verileri view lara doğru şekilde aktarılıyor"
                ]
              }
            },
            {
              "id": "activity-routing-concepts",
              "type": "concept",
              "title": "Routing Mekanizması",
              "estimatedMinutes": 25,
              "content": "Routing, gelen HTTP isteklerini uygun controller action ına yönlendiren mekanizmadır. ASP.NET Core MVC de iki tür routing vardır: n n**Convention-based Routing**: Program.cs veya Startup.cs de MapControllerRoute ile tanımlanır. Varsayılan pattern: `{controller=Home}/{action=Index}/{id?}` n n**Attribute Routing**: Controller ve action method larına [Route] attribute u ile doğrudan tanımlanır. Daha esnek ve açık bir yaklaşımdır. n nRoute constraints ile parametre tiplerini kısıtlayabilir, route values ile dinamik segmentler oluşturabilirsin.",
              "highlights": [
                "Convention-based routing merkezi yönetim sağlar, attribute routing daha esnektir",
                "Route constraints (int, min, max, regex) ile parametre validasyonu yapılabilir",
                "Route order önemlidir - daha spesifik route lar önce tanımlanmalı",
                "Named routes ile URL generation yapılabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "Program.cs",
                  "code": "app.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} \" n);",
                  "explanation": "Varsayılan convention-based route tanımı"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[Route("urunler ")] n[Route("products ")] npublic class ProductsController : Controller n{ n    [Route("liste ")] n    [Route("list ")] n    public IActionResult Index() { ... } n     n    [Route("{id:int} ")] n    public IActionResult Details(int id) { ... } n}",
                  "explanation": "Attribute routing örneği - hem Türkçe hem İngilizce URL desteği"
                }
              ],
              "checklist": [
                {
                  "id": "check-routing-types",
                  "label": "Convention-based ve attribute routing arasındaki farkı anla",
                  "explanation": "Her iki yaklaşımın avantaj ve dezavantajlarını değerlendir"
                },
                {
                  "id": "check-route-constraints",
                  "label": "Route constraints kullanarak tip güvenliği sağla",
                  "explanation": "{id:int} gibi constraint ler ile sadece integer değerler kabul edilir"
                }
              ]
            },
            {
              "id": "activity-routing-practice",
              "type": "guided-exercise",
              "title": "Routing Uygulaması",
              "estimatedMinutes": 25,
              "description": "Hem convention-based hem de attribute routing kullanarak farklı URL pattern leri oluşturacaksın.",
              "steps": [
                {
                  "title": "Custom route tanımla",
                  "detail": "Program.cs de blog yazıları için özel bir route pattern oluştur: blog/{year:int}/{month:int}/{slug}",
                  "hint": "MapControllerRoute ile name, pattern ve defaults parametrelerini kullan"
                },
                {
                  "title": "Attribute routing ekle",
                  "detail": "BlogController a [Route("blog ")] attribute u ekle ve action lara özel route lar tanımla.",
                  "hint": "[Route("{year:int}/{month:int}/{slug} ")] gibi constraint li route lar kullan"
                },
                {
                  "title": "Route test et",
                  "detail": "Farklı URL leri test ederek route ların doğru çalıştığını doğrula.",
                  "hint": "Route debugger veya logging ile route eşleşmelerini gözlemle"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "Program.cs",
                "code": "// TODO: Custom blog route unu ekle napp.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} \" n);",
                "explanation": "Varsayılan route yapılandırması. Blog route unu ekle."
              },
              "validation": {
                "type": "self",
                "criteria": [
                  "Blog route u doğru pattern ile eşleşiyor",
                  "Attribute routing çalışıyor ve constraint ler doğru çalışıyor",
                  "URL generation (Url.Action, Html.ActionLink) doğru route ları üretiyor"
                ]
              }
            },
            {
              "id": "activity-model-binding",
              "type": "concept",
              "title": "Model Binding ve Validasyon",
              "estimatedMinutes": 30,
              "content": "Model binding, HTTP isteğinden gelen verileri (query string, form data, route values, headers) otomatik olarak C# nesnelerine dönüştürür. n n**Binding Sources**: n- Route values: URL segment lerinden n- Query string: ?key=value parametrelerinden n- Form data: POST request body den n- Headers: HTTP header lardan n n**Validasyon**: Data Annotations ([Required], [StringLength], [Range]) veya FluentValidation ile model doğrulama yapılır. ModelState.IsValid ile kontrol edilir. n n**Custom Model Binders**: Özel binding mantığı için IModelBinder interface i implement edilebilir.",
              "highlights": [
                "Model binding otomatik olarak primitive ve complex typeları bind eder",
                "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları binding source u belirtir",
                "ModelState dictionary validation hatalarını içerir",
                "Custom validation attribute ları oluşturulabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "Product.cs",
                  "code": "using System.ComponentModel.DataAnnotations; n npublic class Product n{ n    public int Id { get; set; } n     n    [Required(ErrorMessage ="Ürün adı zorunludur ")] n    [StringLength(100, MinimumLength = 3)] n    public string Name { get; set; } = string.Empty; n     n    [Range(0.01, 10000, ErrorMessage ="Fiyat 0.01 ile 10000 arasında olmalı ")] n    public decimal Price { get; set; } n}",
                  "explanation": "Data Annotations ile model validasyonu"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[HttpPost] npublic IActionResult Create(Product product) n{ n    if (!ModelState.IsValid) n    { n        return View(product); n    } n     n    // Model geçerli, kaydet n    return RedirectToAction(nameof(Index)); n}",
                  "explanation": "ModelState validasyon kontrolü"
                }
              ],
              "checklist": [
                {
                  "id": "check-binding-sources",
                  "label": "Farklı binding source larını ([FromQuery], [FromRoute], vb.) anla",
                  "explanation": "Her source un ne zaman kullanılacağını öğren"
                },
                {
                  "id": "check-validation",
                  "label": "Model validasyonunu uygula ve hata mesajlarını göster",
                  "explanation": "ValidationSummary ve ValidationMessageFor helper larını kullan"
                }
              ]
            },
            {
              "id": "activity-model-binding-practice",
              "type": "guided-exercise",
              "title": "Model Binding ve Validasyon Uygulaması",
              "estimatedMinutes": 35,
              "description": "Form oluşturup model binding ve validasyon sürecini uçtan uca uygulayacaksın.",
              "steps": [
                {
                  "title": "Model sınıfı oluştur",
                  "detail": "RegisterViewModel sınıfı oluştur ve Email, Password, ConfirmPassword alanlarına uygun validation attribute ları ekle.",
                  "hint": "[EmailAddress], [Compare("Password ")] gibi attribute ları kullan"
                },
                {
                  "title": "GET ve POST action ları oluştur",
                  "detail": "AccountController da Register (GET) boş model döndürsün, Register (POST) model i alıp validate etsin.",
                  "hint": "ModelState.IsValid kontrolü yap ve hatalıysa view a geri dön"
                },
                {
                  "title": "View oluştur",
                  "detail": "Register.cshtml view ında Html.BeginForm, Html.TextBoxFor, Html.ValidationMessageFor helper larını kullan.",
                  "hint": "Tag helpers (<form>, <input asp-for>) veya HTML helpers kullanabilirsin"
                },
                {
                  "title": "Client-side validasyon ekle",
                  "detail": "jQuery Unobtrusive Validation script lerini ekleyerek client-side validasyon sağla.",
                  "hint": "_ValidationScriptsPartial.cshtml kullan veya CDN den script leri ekle"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "RegisterViewModel.cs",
                "code": "using System.ComponentModel.DataAnnotations; n npublic class RegisterViewModel n{ n    // TODO: Email, Password, ConfirmPassword propertylerini ekle n    // TODO: Uygun validation attribute larını ekle n}",
                "explanation": "Model sınıfı iskeleti. Propertyleri ve validasyonları ekle."
              },
              "validation": {
                "type": "self",
                "criteria": [
                  "Model binding doğru çalışıyor (form verileri model e aktarılıyor)",
                  "Server-side validasyon çalışıyor ve hata mesajları gösteriliyor",
                  "Client-side validasyon çalışıyor (sayfa yenilenmeden hatalar gösteriliyor)",
                  "Geçerli verilerle form başarıyla submit ediliyor"
                ]
              }
            },
            {
              "id": "activity-razor-views",
              "type": "concept",
              "title": "Razor View Engine",
              "estimatedMinutes": 25,
              "content": "Razor, C# kodunu HTML ile birleştiren bir view engine dir. @ sembolü ile C# kodunu HTML içine gömebilirsin. n n**Razor Syntax**: n- @variable: Değişken değeri yazdırma n- @{ code }: C# kod blokları n- @if, @foreach, @while: Kontrol yapıları n- @model: View ın model tipini belirtme n- @using: Namespace import n n**Layout ve Sections**: n- _Layout.cshtml: Ana sayfa şablonu n- @RenderBody(): İçerik yerleştirme noktası n- @RenderSection(): İsteğe bağlı bölümler (scripts, styles) n n**Partial Views**: Yeniden kullanılabilir view bileşenleri. @Html.Partial() veya <partial> tag helper ile render edilir.",
              "highlights": [
                "Razor syntax @ ile başlar ve HTML ile sorunsuz entegre olur",
                "Layout lar sayfa yapısını standartlaştırır",
                "Partial views kod tekrarını önler",
                "ViewData, ViewBag, TempData ile controller dan view a veri aktarılır"
              ],
              "codeSamples": [
                {
                  "language": "html",
                  "filename": "Index.cshtml",
                  "code": "@model List<Product> n n<h1>Ürünler</h1> n n@if (Model.Any()) n{ n    <ul> n        @foreach (var product in Model) n        { n            <li>@product.Name - @product.Price.ToString("C ")</li> n        } n    </ul> n} nelse n{ n    <p>Henüz ürün yok.</p> n}",
                  "explanation": "Razor syntax ile model verilerini listeleme"
                },
                {
                  "language": "html",
                  "filename": "_ProductCard.cshtml",
                  "code": "@model Product n n<div class="card "> n    <h3>@Model.Name</h3> n    <p>@Model.Price.ToString("C ")</p> n</div>",
                  "explanation": "Partial view örneği - yeniden kullanılabilir bileşen"
                }
              ],
              "checklist": [
                {
                  "id": "check-razor-syntax",
                  "label": "Temel Razor syntax ını (@, @{}, @if, @foreach) öğren",
                  "explanation": "Razor syntax ı ile dinamik içerik oluşturmayı pratik et"
                },
                {
                  "id": "check-layouts",
                  "label": "Layout yapısını anla ve kullan",
                  "explanation": "_Layout.cshtml ve @RenderBody() kullanımını öğren"
                }
              ]
            },
            {
              "id": "activity-view-lifecycle",
              "type": "concept",
              "title": "View Lifecycle ve Execution",
              "estimatedMinutes": 20,
              "content": "View lifecycle, bir view ın render edilmesinden önce ve sonra gerçekleşen süreçleri ifade eder: n n**View Execution Sırası**: n1. Action method çalışır ve ViewResult döndürür n2. View engine uygun view dosyasını bulur (View discovery) n3. View ın model i set edilir n4. View start dosyaları (_ViewStart.cshtml) çalışır n5. Layout belirlenir (_Layout.cshtml) n6. View render edilir n7. Layout içine view içeriği yerleştirilir (@RenderBody) n8. Sections render edilir (@RenderSection) n n**View Discovery**: n- Views/{Controller}/{Action}.cshtml n- Views/Shared/{Action}.cshtml n- Belirtilen path (View("CustomPath ")) n n**View Components**: Daha karmaşık, yeniden kullanılabilir view bileşenleri için kullanılır. Controller dan bağımsız logic içerebilir.",
              "highlights": [
                "View discovery otomatik olarak view dosyasını bulur",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "View Components hem logic hem de view içerebilir",
                "Partial views sadece HTML render eder, View Components daha güçlüdür"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "public IActionResult Index() n{ n    var products = _productService.GetAll(); n    return View(products); // View discovery: Views/Products/Index.cshtml n} n npublic IActionResult Custom() n{ n    return View("SpecialView "); // Views/Products/SpecialView.cshtml n} n npublic IActionResult Shared() n{ n    return View("~/Views/Shared/CustomView.cshtml "); // Tam path n}",
                  "explanation": "Farklı view discovery senaryoları"
                }
              ],
              "checklist": [
                {
                  "id": "check-view-discovery",
                  "label": "View discovery mekanizmasını anla",
                  "explanation": "View() method unun view dosyasını nasıl bulduğunu öğren"
                },
                {
                  "id": "check-view-components",
                  "label": "View Components kavramını öğren",
                  "explanation": "View Components in partial view lerden farkını anla"
                }
              ]
            },
            {
              "id": "activity-tag-helpers",
              "type": "guided-exercise",
              "title": "Tag Helpers ile Form Geliştirme",
              "estimatedMinutes": 30,
              "description": "Tag helpers kullanarak type-safe ve IntelliSense destekli form oluşturacaksın.",
              "steps": [
                {
                  "title": "Tag helper ları etkinleştir",
                  "detail": "_ViewImports.cshtml dosyasına @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers ekle.",
                  "hint": "Tag helpers varsayılan olarak MVC template inde etkindir"
                },
                {
                  "title": "Form oluştur",
                  "detail": "asp-controller, asp-action, asp-route-* attribute larını kullanarak form oluştur.",
                  "hint": "<form asp-controller="Products \" asp-action= "Create \" method= "post"> kullan"
                },
                {
                  "title": "Input tag helpers kullan",
                  "detail": "asp-for attribute u ile model e bağlı input lar oluştur (asp-for="Model.Name ").",
                  "hint": "asp-for otomatik olarak name, id, value ve validation attribute larını ekler"
                },
                {
                  "title": "Validation tag helpers ekle",
                  "detail": "asp-validation-for ve asp-validation-summary tag helper larını kullan.",
                  "hint": "<div asp-validation-summary="All "></div> tüm hataları gösterir"
                }
              ],
              "starterCode": {
                "language": "html",
                "filename": "Create.cshtml",
                "code": "@model Product n n<!-- TODO: Form tag helper ile form oluştur --> n<!-- TODO: Input tag helpers ile alanları ekle --> n<!-- TODO: Validation tag helpers ekle -->",
                "explanation": "Tag helper lar ile form oluşturma iskeleti"
              },
              "hints": [
                "asp-for attribute u model property sine bağlanır ve otomatik validation ekler",
                "Tag helpers IntelliSense desteği sağlar",
                "asp-route-* ile route parameter ları geçilebilir"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Form doğru controller ve action a submit ediyor",
                  "Input lar model e doğru bağlanmış",
                  "Validation mesajları gösteriliyor",
                  "Client-side validasyon çalışıyor"
                ]
              }
            },
            {
              "id": "activity-filters",
              "type": "concept",
              "title": "Action ve Result Filters",
              "estimatedMinutes": 25,
              "content": "Filters, action method ların execution pipeline ına müdahale etmeyi sağlar. Cross-cutting concerns (logging, caching, authorization) için kullanılır. n n**Filter Types**: n- **Authorization Filters**: [Authorize], [AllowAnonymous] - Kimlik doğrulama n- **Action Filters**: [ActionFilter] - Action öncesi/sonrası logic n- **Result Filters**: [ResultFilter] - Result render öncesi/sonrası logic n- **Exception Filters**: [ExceptionFilter] - Hata yakalama n- **Resource Filters**: [ResourceFilter] - Pipeline ın erken aşamalarında çalışır n n**Filter Execution Order**: n1. Authorization Filters n2. Resource Filters (OnResourceExecuting) n3. Model Binding n4. Action Filters (OnActionExecuting) n5. Action Execution n6. Action Filters (OnActionExecuted) n7. Result Filters (OnResultExecuting) n8. Result Execution n9. Result Filters (OnResultExecuted) n10. Resource Filters (OnResourceExecuted)",
              "highlights": [
                "Filters cross-cutting concerns için kullanılır",
                "Filter lar global, controller veya action seviyesinde uygulanabilir",
                "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur",
                "Filter order önemlidir - [Order] attribute ile sıralama yapılabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "LogActionFilter.cs",
                  "code": "using Microsoft.AspNetCore.Mvc.Filters; n npublic class LogActionFilter : IActionFilter n{ n    private readonly ILogger<LogActionFilter> _logger; n     n    public LogActionFilter(ILogger<LogActionFilter> logger) n    { n        _logger = logger; n    } n     n    public void OnActionExecuting(ActionExecutingContext context) n    { n        _logger.LogInformation("Action başlıyor: {Action} ", context.ActionDescriptor.DisplayName); n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        _logger.LogInformation("Action tamamlandı: {Action} ", context.ActionDescriptor.DisplayName); n    } n}",
                  "explanation": "Custom action filter örneği - logging için"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[ServiceFilter(typeof(LogActionFilter))] n[ResponseCache(Duration = 60)] npublic class ProductsController : Controller n{ n    [Authorize] n    [ValidateAntiForgeryToken] n    [HttpPost] n    public IActionResult Create(Product product) { ... } n}",
                  "explanation": "Filter ların controller ve action seviyesinde kullanımı"
                }
              ],
              "checklist": [
                {
                  "id": "check-filter-types",
                  "label": "Farklı filter türlerini ve execution order ını anla",
                  "explanation": "Her filter türünün ne zaman çalıştığını öğren"
                },
                {
                  "id": "check-custom-filters",
                  "label": "Custom filter oluşturmayı öğren",
                  "explanation": "IActionFilter, IResultFilter gibi interface leri implement et"
                }
              ]
            },
            {
              "id": "activity-filters-practice",
              "type": "code-challenge",
              "title": "Custom Filter Geliştirme",
              "estimatedMinutes": 40,
              "description": "Performance monitoring için custom action filter oluşturup action execution süresini ölçeceksin.",
              "acceptanceCriteria": [
                "Filter action execution süresini ölçmeli ve log lamalı",
                "Filter DI container a kayıtlı olmalı",
                "Filter hem controller hem action seviyesinde kullanılabilmeli",
                "Execution süresi belirli bir threshold u aşarsa warning log u yazılmalı"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "PerformanceFilter.cs",
                "code": "using Microsoft.AspNetCore.Mvc.Filters; n n// TODO: IActionFilter interface ini implement et n// TODO: Stopwatch kullanarak execution süresini ölç n// TODO: ILogger ile log yaz npublic class PerformanceFilter n{ n    // TODO: Implementation n}",
                "explanation": "Performance monitoring filter iskeleti"
              },
              "testCases": [
                {
                  "id": "scenario-fast-action",
                  "description": "Hızlı action (< 100ms) normal log yazmalı",
                  "input": "Basit bir action method",
                  "expectedOutput": "Info level log ile execution süresi"
                },
                {
                  "id": "scenario-slow-action",
                  "description": "Yavaş action (> 1000ms) warning log yazmalı",
                  "input": "Thread.Sleep(1500) içeren action",
                  "expectedOutput": "Warning level log ile performance uyarısı"
                }
              ],
              "evaluationTips": [
                "Filter ı Program.cs de services.AddScoped ile kaydet",
                "[ServiceFilter] veya [TypeFilter] attribute larını kullan",
                "Stopwatch sınıfını kullanarak süre ölçümü yap"
              ]
            },
            {
              "id": "activity-view-components",
              "type": "code-challenge",
              "title": "View Component Geliştirme",
              "estimatedMinutes": 45,
              "description": "Yeniden kullanılabilir bir navigation menu view component i oluşturacaksın.",
              "acceptanceCriteria": [
                "ViewComponent sınıfı oluşturulmalı ve Invoke/InvokeAsync method u içermeli",
                "View component in kendi view  ı olmalı (Views/Shared/Components/NavigationMenu/Default.cshtml)",
                "Component DI ile servisleri kullanabilmeli",
                "Component tag helper veya @await Component.InvokeAsync ile kullanılabilmeli"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "NavigationMenuViewComponent.cs",
                "code": "using Microsoft.AspNetCore.Mvc; n n// TODO: ViewComponent base class ından türet n// TODO: Menu item ları dinamik olarak oluştur n// TODO: DI ile IMenuService kullan (opsiyonel) npublic class NavigationMenuViewComponent n{ n    // TODO: Implementation n}",
                "explanation": "View component iskeleti"
              },
              "testCases": [
                {
                  "id": "scenario-render-menu",
                  "description": "View component menu yu render etmeli",
                  "input": "<vc:navigation-menu /> veya @await Component.InvokeAsync("NavigationMenu ")",
                  "expectedOutput": "HTML navigation menu render edilmeli"
                }
              ],
              "evaluationTips": [
                "View component ler Views/Shared/Components/{ComponentName}/Default.cshtml path inde olmalı",
                "Tag helper kullanımı için _ViewImports.cshtml e @addTagHelper ekle",
                "View component ler async method lar içerebilir"
              ]
            },
            {
              "id": "activity-knowledge-check",
              "type": "knowledge-check",
              "title": "MVC Kavramlarını Kontrol Et",
              "estimatedMinutes": 15,
              "questions": [
                {
                  "id": "q1-mvc-components",
                  "question": "MVC patternin üç ana bileşeni nedir?",
                  "options": [
                    "Model, View, Controller",
                    "Middleware, View, Controller",
                    "Model, View, Component",
                    "Module, View, Controller"
                  ],
                  "answer": 0,
                  "explanation": "MVC pattern Model (veri ve iş mantığı), View (kullanıcı arayüzü) ve Controller (kullanıcı girişi ve koordinasyon) olmak üzere üç bileşenden oluşur."
                },
                {
                  "id": "q2-view-lifecycle",
                  "question": "View lifecycle da hangi sırayla işlemler gerçekleşir?",
                  "options": [
                    "Action → View Discovery → Layout → Render",
                    "View Discovery → Action → Render → Layout",
                    "Layout → Action → View Discovery → Render",
                    "Render → Action → View Discovery → Layout"
                  ],
                  "answer": 0,
                  "explanation": "Önce action method çalışır, sonra view engine view dosyasını bulur (view discovery), layout belirlenir ve son olarak view render edilir."
                },
                {
                  "id": "q3-model-binding",
                  "question": "Model binding için hangi attribute kullanılır?",
                  "options": [
                    "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                    "[BindQuery], [BindRoute], [BindForm]",
                    "[QueryParam], [RouteParam], [FormParam]",
                    "[GetFromQuery], [GetFromRoute]"
                  ],
                  "answer": 0,
                  "explanation": "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları model binding source unu belirtir."
                },
                {
                  "id": "q4-filters",
                  "question": "Filter execution order da hangi filter en önce çalışır?",
                  "options": [
                    "Authorization Filters",
                    "Action Filters",
                    "Result Filters",
                    "Exception Filters"
                  ],
                  "answer": 0,
                  "explanation": "Authorization filters en önce çalışır, çünkü kullanıcının yetkisi olmadan diğer işlemler yapılmamalıdır."
                }
              ]
            }
          ],
          "checkpoints": [
            {
              "id": "checkpoint-mvc-project",
              "title": "MVC Projesi Geliştirme",
              "description": "Tüm öğrendiklerini birleştirerek tam özellikli bir MVC uygulaması geliştir.",
              "tasks": [
                {
                  "id": "task-crud-operations",
                  "description": "Bir entity için tam CRUD (Create, Read, Update, Delete) operasyonları oluştur. Model binding, validasyon, routing ve view ları uygula.",
                  "resources": [
                    {
                      "id": "resource-aspnet-mvc-docs",
                      "title": "ASP.NET Core MVC Dokümantasyonu",
                      "url": "https://learn.microsoft.com/aspnet/core/mvc/overview",
                      "type": "documentation"
                    }
                  ],
                  "coachTips": [
                    "Her action method için uygun HTTP verb attribute larını kullan",
                    "Model validasyonunu hem client-side hem server-side uygula",
                    "Partial view ler veya view components kullanarak kod tekrarını önle"
                  ]
                },
                {
                  "id": "task-filters-implementation",
                  "description": "Custom action filter oluşturup logging, performance monitoring veya caching gibi bir cross-cutting concern uygula.",
                  "coachTips": [
                    "Filter ı DI container a kaydetmeyi unutma",
                    "Filter execution order ını göz önünde bulundur",
                    "Async filter lar için IAsyncActionFilter kullan"
                  ]
                }
              ],
              "successCriteria": [
                "CRUD operasyonları tam ve çalışır durumda",
                "Model validasyonu hem client hem server tarafında çalışıyor",
                "Custom filter başarıyla uygulanmış ve çalışıyor",
                "View lar temiz, yeniden kullanılabilir ve maintainable",
                "Routing yapısı mantıklı ve RESTful prensiplere uygun"
              ],
              "estimatedMinutes": 120
            }
          ],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=ASP.NET%20Core%20MVC",
            "description": "Controller, view ve filter pipeline ını uygulamalı şekilde keşfet."
          },
          "relatedTopics": [
            {
              "label": "Attribute Routing ile Çalışma",
              "href": "/education/lessons/aspnet-mvc/routing/attribute-routing",
              "description": "Controller bazlı özel rota tanımlarını uygula.",
              "estimatedDurationMinutes": 30,
              "level": "Orta",
              "keyTakeaways": [
                "[Route] attribute u ile controller ve action seviyesinde routing tanımlanabilir",
                "Route constraints ile parametre tiplerini kısıtlayabilirsin",
                "Attribute routing convention-based routing den daha esnektir",
                "Multiple route attribute ları ile aynı action a farklı URL ler tanımlanabilir"
              ],
              "sections": [
                {
                  "id": "section-attribute-routing-basics",
                  "title": "Attribute Routing Temelleri",
                  "summary": "[Route] attribute u ile controller ve action method larına doğrudan route tanımlama",
                  "content": [
                    {
                      "type": "text",
                      "body": "Attribute routing, route tanımlarını controller ve action method larına doğrudan attribute olarak eklemeni sağlar. Bu yaklaşım convention-based routing den daha esnek ve açıktır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[Route("api/products ")] npublic class ProductsController : Controller n{ n    [Route("list ")] n    public IActionResult Index() { ... } n     n    [Route("{id:int} ")] n    public IActionResult Details(int id) { ... } n}",
                      "explanation": "Controller ve action seviyesinde attribute routing örneği"
                    },
                    {
                      "type": "list",
                      "title": "Attribute Routing Avantajları",
                      "items": [
                        "Route tanımları action method ların yanında, kod okunabilirliği artar",
                        "Her action için özel URL pattern leri tanımlanabilir",
                        "Route constraints doğrudan attribute içinde belirtilebilir",
                        "Multiple route lar aynı action a eklenebilir"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-route-constraints",
                  "title": "Route Constraints",
                  "summary": "Parametre tiplerini ve değer aralıklarını kısıtlama",
                  "content": [
                    {
                      "type": "text",
                      "body": "Route constraints, URL parametrelerinin hangi değerleri alabileceğini kısıtlar. Bu sayede tip güvenliği ve validasyon sağlanır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[Route("blog/{year:int:min(2000)}/{month:int:range(1,12)}/{slug:minlength(5)} ")] npublic IActionResult Post(int year, int month, string slug) { ... }",
                      "explanation": "Route constraints örneği: year 2000 den büyük, month 1-12 arası, slug en az 5 karakter"
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "Yaygın Route Constraints",
                      "body": "int, long, float, double, bool, datetime, guid, minlength(n), maxlength(n), length(n), min(n), max(n), range(min,max), alpha, regex(pattern)"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-attribute-routing",
                  "question": "Aşağıdakilerden hangisi attribute routing in avantajıdır?",
                  "options": [
                    "Route tanımları action method ların yanında yer alır",
                    "Sadece GET istekleri için kullanılabilir",
                    "Convention-based routing den daha yavaştır",
                    "Sadece controller seviyesinde tanımlanabilir"
                  ],
                  "answer": "Route tanımları action method ların yanında yer alır",
                  "rationale": "Attribute routing in en büyük avantajı, route tanımlarının action method ların hemen yanında yer alması ve kod okunabilirliğini artırmasıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-attribute-routing-docs",
                  "label": "ASP.NET Core Attribute Routing Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/routing#attribute-routing",
                  "type": "documentation",
                  "estimatedMinutes": 15
                }
              ],
              "practice": [
                {
                  "id": "practice-custom-routes",
                  "title": "Özel Route lar Oluştur",
                  "description": "Blog yazıları için özel route pattern leri oluştur",
                  "type": "guided",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "BlogController oluştur ve [Route("blog ")] attribute u ekle",
                    "Post action ına [Route("{year:int}/{month:int}/{slug} ")] route u ekle",
                    "Farklı URL pattern leri test et",
                    "Route constraints ekleyerek validasyon sağla"
                  ]
                }
              ]
            },
            {
              "label": "Model Binding ve Validasyon",
              "href": "/education/lessons/aspnet-mvc/model-binding/overview",
              "description": "Form verilerini binding sürecinde doğrulamayı öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Model binding HTTP verilerini otomatik olarak C# nesnelerine dönüştürür",
                "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları binding source unu belirtir",
                "Data Annotations ile model validasyonu yapılır",
                "ModelState.IsValid ile validasyon kontrolü yapılır"
              ],
              "sections": [
                {
                  "id": "section-model-binding-basics",
                  "title": "Model Binding Temelleri",
                  "summary": "HTTP istek verilerinin C# nesnelerine otomatik dönüştürülmesi",
                  "content": [
                    {
                      "type": "text",
                      "body": "Model binding, HTTP isteğinden gelen verileri (query string, form data, route values, headers) otomatik olarak C# nesnelerine dönüştürür. ASP.NET Core MVC bu işlemi otomatik olarak yapar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Query string: ?name=Product&price=100 npublic IActionResult Create(string name, decimal price) { ... } n n// Form data n[HttpPost] npublic IActionResult Create(Product product) { ... } n n// Route parameter n[Route("{id:int} ")] npublic IActionResult Details(int id) { ... }",
                      "explanation": "Farklı binding source larından veri alma örnekleri"
                    },
                    {
                      "type": "list",
                      "title": "Binding Source ları",
                      "items": [
                        "Route values: URL segment lerinden (varsayılan)",
                        "Query string: ?key=value parametrelerinden",
                        "Form data: POST request body den",
                        "Headers: HTTP header lardan ([FromHeader])",
                        "Body: JSON/XML içerikten ([FromBody])"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-data-annotations",
                  "title": "Data Annotations ile Validasyon",
                  "summary": "Model property lerine validation attribute ları ekleme",
                  "content": [
                    {
                      "type": "text",
                      "body": "Data Annotations, model sınıflarına validation attribute ları ekleyerek server-side ve client-side validasyon sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.ComponentModel.DataAnnotations; n npublic class Product n{ n    [Required(ErrorMessage ="Ürün adı zorunludur ")] n    [StringLength(100, MinimumLength = 3)] n    public string Name { get; set; } = string.Empty; n     n    [Range(0.01, 10000, ErrorMessage ="Fiyat 0.01 ile 10000 arasında olmalı ")] n    public decimal Price { get; set; } n     n    [EmailAddress] n    public string ContactEmail { get; set; } = string.Empty; n}",
                      "explanation": "Data Annotations ile model validasyonu"
                    },
                    {
                      "type": "callout",
                      "variant": "info",
                      "title": "Yaygın Validation Attribute ları",
                      "body": "[Required], [StringLength], [Range], [EmailAddress], [Url], [Phone], [CreditCard], [Compare], [RegularExpression], [MinLength], [MaxLength]"
                    }
                  ]
                },
                {
                  "id": "section-modelstate",
                  "title": "ModelState ile Validasyon Kontrolü",
                  "summary": "ModelState.IsValid ile validasyon hatalarını kontrol etme",
                  "content": [
                    {
                      "type": "text",
                      "body": "ModelState dictionary, model binding ve validasyon sürecindeki tüm hataları içerir. ModelState.IsValid ile model in geçerli olup olmadığını kontrol edebilirsin."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[HttpPost] npublic IActionResult Create(Product product) n{ n    if (!ModelState.IsValid) n    { n        // Validasyon hataları var, view a geri dön n        return View(product); n    } n     n    // Model geçerli, kaydet n    _productService.Create(product); n    return RedirectToAction(nameof(Index)); n}",
                      "explanation": "ModelState.IsValid ile validasyon kontrolü"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model Product n n<div asp-validation-summary="All \" class= "text-danger"></div> n n<div class= "form-group"> n    <label asp-for= "Name"></label> n    <input asp-for= "Name \" class= "form-control \" /> n    <span asp-validation-for= "Name \" class= "text-danger"></span> n</div>",
                      "explanation": "View da validation mesajlarını gösterme"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-model-binding",
                  "question": "Model binding için hangi attribute kullanılır?",
                  "options": [
                    "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                    "[BindQuery], [BindRoute], [BindForm]",
                    "[QueryParam], [RouteParam], [FormParam]",
                    "[GetFromQuery], [GetFromRoute]"
                  ],
                  "answer": "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                  "rationale": "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları model binding source unu belirtir."
                }
              ],
              "resources": [
                {
                  "id": "resource-model-binding-docs",
                  "label": "ASP.NET Core Model Binding Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/models/model-binding",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-form-validation",
                  "title": "Form Validasyonu Uygula",
                  "description": "Kayıt formu için model binding ve validasyon uygula",
                  "type": "guided",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "RegisterViewModel sınıfı oluştur (Email, Password, ConfirmPassword)",
                    "Validation attribute ları ekle ([Required], [EmailAddress], [Compare])",
                    "AccountController da Register (GET ve POST) action ları oluştur",
                    "View da validation mesajlarını göster",
                    "Client-side validasyon için jQuery Unobtrusive Validation ekle"
                  ]
                }
              ]
            },
            {
              "label": "Razor View Best Practice leri",
              "href": "/education/lessons/aspnet-mvc/views/razor-best-practices",
              "description": "View bileşenleri ve layout düzenleriyle yeniden kullanılabilirlik sağla.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Razor syntax (@) ile C# kodunu HTML içine gömebilirsin",
                "Layout lar sayfa yapısını standartlaştırır",
                "Partial views kod tekrarını önler",
                "ViewData, ViewBag, TempData ile controller dan view a veri aktarılır"
              ],
              "sections": [
                {
                  "id": "section-razor-syntax",
                  "title": "Razor Syntax Temelleri",
                  "summary": "@ sembolü ile C# kodunu HTML içine gömme",
                  "content": [
                    {
                      "type": "text",
                      "body": "Razor, C# kodunu HTML ile birleştiren bir view engine dir. @ sembolü ile C# kodunu HTML içine gömebilirsin."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model List<Product> n n<h1>Ürünler</h1> n n@if (Model.Any()) n{ n    <ul> n        @foreach (var product in Model) n        { n            <li>@product.Name - @product.Price.ToString("C ")</li> n        } n    </ul> n} nelse n{ n    <p>Henüz ürün yok.</p> n}",
                      "explanation": "Razor syntax ile model verilerini listeleme"
                    },
                    {
                      "type": "list",
                      "title": "Razor Syntax Özellikleri",
                      "items": [
                        "@variable: Değişken değeri yazdırma",
                        "@{ code }: C# kod blokları",
                        "@if, @foreach, @while: Kontrol yapıları",
                        "@model: View ın model tipini belirtme",
                        "@using: Namespace import"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-layouts",
                  "title": "Layout ve Sections",
                  "summary": "Ana sayfa şablonları ve bölümler",
                  "content": [
                    {
                      "type": "text",
                      "body": "Layout lar sayfa yapısını standartlaştırır. _Layout.cshtml ana şablon, @RenderBody() içerik yerleştirme noktası, @RenderSection() ise isteğe bağlı bölümler için kullanılır."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _Layout.cshtml *@ n<!DOCTYPE html> n<html> n<head> n    <title>@ViewData["Title "]</title> n</head> n<body> n    <header>...</header> n    <main>@RenderBody()</main> n    <footer>...</footer> n    @RenderSection("Scripts ", required: false) n</body> n</html>",
                      "explanation": "Layout dosyası yapısı"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Index.cshtml *@ n@{ n    Layout ="_Layout "; n    ViewData["Title "] ="Ana Sayfa "; n} n n<h1>Hoş Geldiniz</h1> n n@section Scripts { n    <script src="custom.js "></script> n}",
                      "explanation": "View da layout ve section kullanımı"
                    }
                  ]
                },
                {
                  "id": "section-partial-views",
                  "title": "Partial Views",
                  "summary": "Yeniden kullanılabilir view bileşenleri",
                  "content": [
                    {
                      "type": "text",
                      "body": "Partial views, yeniden kullanılabilir view bileşenleridir. @Html.Partial() veya <partial> tag helper ile render edilir."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ProductCard.cshtml *@ n@model Product n n<div class="card "> n    <h3>@Model.Name</h3> n    <p>@Model.Price.ToString("C ")</p> n    <a href="/products/@Model.Id ">Detaylar</a> n</div>",
                      "explanation": "Partial view örneği"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Index.cshtml *@ n@model List<Product> n n@foreach (var product in Model) n{ n    <partial name="_ProductCard \" model= "product \" /> n}",
                      "explanation": "Partial view ı kullanma"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-razor",
                  "question": "Razor syntax da C# kodunu HTML içine gömek için hangi sembol kullanılır?",
                  "options": [
                    "@",
                    "#",
                    "$",
                    "%"
                  ],
                  "answer": "@",
                  "rationale": "Razor syntax da @ sembolü C# kodunu HTML içine gömek için kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-razor-docs",
                  "label": "Razor Syntax Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/razor",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-partial-views",
                  "title": "Partial View Oluştur",
                  "description": "Yeniden kullanılabilir bir partial view bileşeni oluştur",
                  "type": "guided",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "_ProductCard.cshtml partial view ı oluştur",
                    "Product model ini kullanarak kart görünümü tasarla",
                    "Index view ında partial view  ı kullan",
                    "Farklı sayfalarda aynı partial view ı kullan"
                  ]
                }
              ]
            },
            {
              "label": "View Lifecycle ve Execution",
              "href": "/education/lessons/aspnet-mvc/views/view-lifecycle",
              "description": "View ların nasıl render edildiğini ve lifecycle ını derinlemesine incele.",
              "estimatedDurationMinutes": 35,
              "level": "İleri",
              "keyTakeaways": [
                "View execution sırası: Action → View Discovery → Layout → Render",
                "View discovery otomatik olarak view dosyasını bulur",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "View Components hem logic hem de view içerebilir"
              ],
              "sections": [
                {
                  "id": "section-view-execution",
                  "title": "View Execution Sırası",
                  "summary": "Bir view ın render edilmesi sırasındaki adımlar",
                  "content": [
                    {
                      "type": "text",
                      "body": "View lifecycle, bir view ın render edilmesinden önce ve sonra gerçekleşen süreçleri ifade eder."
                    },
                    {
                      "type": "list",
                      "title": "View Execution Adımları",
                      "ordered": true,
                      "items": [
                        "Action method çalışır ve ViewResult döndürür",
                        "View engine uygun view dosyasını bulur (View discovery)",
                        "View ın model i set edilir",
                        "View start dosyaları (_ViewStart.cshtml) çalışır",
                        "Layout belirlenir (_Layout.cshtml)",
                        "View render edilir",
                        "Layout içine view içeriği yerleştirilir (@RenderBody)",
                        "Sections render edilir (@RenderSection)"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public IActionResult Index() n{ n    var products = _productService.GetAll(); n    return View(products); // View discovery: Views/Products/Index.cshtml n}",
                      "explanation": "View() method u view discovery yapar"
                    }
                  ]
                },
                {
                  "id": "section-view-discovery",
                  "title": "View Discovery Mekanizması",
                  "summary": "View engine in view dosyasını nasıl bulduğu",
                  "content": [
                    {
                      "type": "text",
                      "body": "View discovery, view engine in uygun view dosyasını bulma sürecidir. ASP.NET Core MVC belirli bir sırayla view dosyalarını arar."
                    },
                    {
                      "type": "list",
                      "title": "View Discovery Sırası",
                      "items": [
                        "Views/{Controller}/{Action}.cshtml",
                        "Views/Shared/{Action}.cshtml",
                        "Belirtilen path (View("CustomPath "))"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Varsayılan view discovery nreturn View(products); // Views/Products/Index.cshtml n n// Özel view belirtme nreturn View("SpecialView "); // Views/Products/SpecialView.cshtml n n// Tam path nreturn View("~/Views/Shared/CustomView.cshtml ");",
                      "explanation": "Farklı view discovery senaryoları"
                    }
                  ]
                },
                {
                  "id": "section-view-components",
                  "title": "View Components",
                  "summary": "Logic içeren yeniden kullanılabilir view bileşenleri",
                  "content": [
                    {
                      "type": "text",
                      "body": "View Components, partial view lerden daha güçlü bir yapıdır. Hem logic hem de view içerebilir ve controller dan bağımsız çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public class NavigationMenuViewComponent : ViewComponent n{ n    private readonly IMenuService _menuService; n     n    public NavigationMenuViewComponent(IMenuService menuService) n    { n        _menuService = menuService; n    } n     n    public IViewComponentResult Invoke() n    { n        var menuItems = _menuService.GetMenuItems(); n        return View(menuItems); n    } n}",
                      "explanation": "View Component örneği"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Views/Shared/Components/NavigationMenu/Default.cshtml *@ n@model List<MenuItem> n n<nav> n    @foreach (var item in Model) n    { n        <a href="@item.Url ">@item.Text</a> n    } n</nav>",
                      "explanation": "View Component view ı"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-view-lifecycle",
                  "question": "View lifecycle da hangi sırayla işlemler gerçekleşir?",
                  "options": [
                    "Action → View Discovery → Layout → Render",
                    "View Discovery → Action → Render → Layout",
                    "Layout → Action → View Discovery → Render",
                    "Render → Action → View Discovery → Layout"
                  ],
                  "answer": "Action → View Discovery → Layout → Render",
                  "rationale": "Önce action method çalışır, sonra view engine view dosyasını bulur (view discovery), layout belirlenir ve son olarak view render edilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-view-lifecycle-docs",
                  "label": "View Lifecycle Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/overview",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ]
            },
            {
              "label": "Action ve Result Filters",
              "href": "/education/lessons/aspnet-mvc/filters/action-filters",
              "description": "Cross-cutting concerns için filter pipeline ını yönet.",
              "estimatedDurationMinutes": 50,
              "level": "İleri",
              "keyTakeaways": [
                "Filters cross-cutting concerns için kullanılır",
                "Filter execution order önemlidir",
                "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur",
                "Filter lar global, controller veya action seviyesinde uygulanabilir"
              ],
              "sections": [
                {
                  "id": "section-filter-types",
                  "title": "Filter Türleri",
                  "summary": "Farklı filter türleri ve kullanım alanları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Filters, action method ların execution pipeline ına müdahale etmeyi sağlar. Cross-cutting concerns (logging, caching, authorization) için kullanılır."
                    },
                    {
                      "type": "list",
                      "title": "Filter Türleri",
                      "items": [
                        "Authorization Filters: [Authorize], [AllowAnonymous] - Kimlik doğrulama",
                        "Action Filters: [ActionFilter] - Action öncesi/sonrası logic",
                        "Result Filters: [ResultFilter] - Result render öncesi/sonrası logic",
                        "Exception Filters: [ExceptionFilter] - Hata yakalama",
                        "Resource Filters: [ResourceFilter] - Pipeline ın erken aşamalarında çalışır"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[ServiceFilter(typeof(LogActionFilter))] n[ResponseCache(Duration = 60)] npublic class ProductsController : Controller n{ n    [Authorize] n    [ValidateAntiForgeryToken] n    [HttpPost] n    public IActionResult Create(Product product) { ... } n}",
                      "explanation": "Filter ların controller ve action seviyesinde kullanımı"
                    }
                  ]
                },
                {
                  "id": "section-filter-execution",
                  "title": "Filter Execution Order",
                  "summary": "Filter ların çalışma sırası",
                  "content": [
                    {
                      "type": "text",
                      "body": "Filter execution order önemlidir. Her filter türü belirli bir sırada çalışır."
                    },
                    {
                      "type": "list",
                      "title": "Filter Execution Sırası",
                      "ordered": true,
                      "items": [
                        "Authorization Filters",
                        "Resource Filters (OnResourceExecuting)",
                        "Model Binding",
                        "Action Filters (OnActionExecuting)",
                        "Action Execution",
                        "Action Filters (OnActionExecuted)",
                        "Result Filters (OnResultExecuting)",
                        "Result Execution",
                        "Result Filters (OnResultExecuted)",
                        "Resource Filters (OnResourceExecuted)"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-custom-filters",
                  "title": "Custom Filter Oluşturma",
                  "summary": "Kendi filter ınızı yazma",
                  "content": [
                    {
                      "type": "text",
                      "body": "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using Microsoft.AspNetCore.Mvc.Filters; n npublic class LogActionFilter : IActionFilter n{ n    private readonly ILogger<LogActionFilter> _logger; n     n    public LogActionFilter(ILogger<LogActionFilter> logger) n    { n        _logger = logger; n    } n     n    public void OnActionExecuting(ActionExecutingContext context) n    { n        _logger.LogInformation("Action başlıyor: {Action} ",  n            context.ActionDescriptor.DisplayName); n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        _logger.LogInformation("Action tamamlandı: {Action} ",  n            context.ActionDescriptor.DisplayName); n    } n}",
                      "explanation": "Custom action filter örneği - logging için"
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "Filter Kaydı",
                      "body": "Filter ı Program.cs de services.AddScoped ile kaydet ve [ServiceFilter] veya [TypeFilter] attribute larını kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-filters",
                  "question": "Filter execution order da hangi filter en önce çalışır?",
                  "options": [
                    "Authorization Filters",
                    "Action Filters",
                    "Result Filters",
                    "Exception Filters"
                  ],
                  "answer": "Authorization Filters",
                  "rationale": "Authorization filters en önce çalışır, çünkü kullanıcının yetkisi olmadan diğer işlemler yapılmamalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-filters-docs",
                  "label": "ASP.NET Core Filters Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/filters",
                  "type": "documentation",
                  "estimatedMinutes": 25
                }
              ],
              "practice": [
                {
                  "id": "practice-custom-filter",
                  "title": "Custom Filter Oluştur",
                  "description": "Performance monitoring için custom action filter oluştur",
                  "type": "code-challenge",
                  "estimatedMinutes": 40,
                  "difficulty": "İleri",
                  "instructions": [
                    "PerformanceFilter sınıfı oluştur (IActionFilter implement et)",
                    "Stopwatch kullanarak action execution süresini ölç",
                    "ILogger ile log yaz (threshold aşılırsa warning)",
                    "Filter ı DI container a kaydet",
                    "Controller veya action seviyesinde kullan"
                  ]
                }
              ]
            },
            {
              "label": "Tag Helpers Kullanımı",
              "href": "/education/lessons/aspnet-mvc/views/tag-helpers",
              "description": "Type-safe ve IntelliSense destekli HTML helper ları kullan.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Tag helpers type-safe ve IntelliSense destekli HTML oluşturur",
                "asp-for attribute u model property sine bağlanır",
                "Tag helpers otomatik validation attribute ları ekler",
                "asp-route-* ile route parameter ları geçilebilir"
              ],
              "sections": [
                {
                  "id": "section-tag-helpers-basics",
                  "title": "Tag Helpers Temelleri",
                  "summary": "Tag helper ları etkinleştirme ve kullanma",
                  "content": [
                    {
                      "type": "text",
                      "body": "Tag helpers, HTML helper ların modern alternatifidir. Type-safe, IntelliSense destekli ve daha okunabilir HTML oluşturur."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ViewImports.cshtml *@ n@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers n n@* Form tag helper *@ n<form asp-controller="Products \" asp-action= "Create \" method= "post"> n    <input asp-for= "Model.Name \" /> n    <span asp-validation-for= "Model.Name"></span> n</form>",
                      "explanation": "Tag helper kullanımı"
                    },
                    {
                      "type": "list",
                      "title": "Yaygın Tag Helpers",
                      "items": [
                        "<form asp-controller="... \" asp-action= "...">: Form oluşturma",
                        "<input asp-for="... ">: Model e bağlı input",
                        "<label asp-for="... ">: Model e bağlı label",
                        "<select asp-for="... \" asp-items= "...">: Dropdown list",
                        "<a asp-controller="... \" asp-action= "...">: Action link",
                        "<div asp-validation-summary="... ">: Validation özeti"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-form-tag-helpers",
                  "title": "Form Tag Helpers",
                  "summary": "Form ve input tag helper ları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Form tag helper ları model binding ve validation için otomatik attribute lar ekler."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model Product n n<form asp-controller="Products \" asp-action= "Create \" method= "post"> n    <div class= "form-group"> n        <label asp-for= "Name"></label> n        <input asp-for= "Name \" class= "form-control \" /> n        <span asp-validation-for= "Name \" class= "text-danger"></span> n    </div> n     n    <div class= "form-group"> n        <label asp-for= "Price"></label> n        <input asp-for= "Price \" class= "form-control \" type= "number \" /> n        <span asp-validation-for= "Price \" class= "text-danger"></span> n    </div> n     n    <button type= "submit">Kaydet</button> n</form>",
                      "explanation": "Form tag helper ları ile model binding"
                    },
                    {
                      "type": "callout",
                      "variant": "info",
                      "title": "Otomatik Özellikler",
                      "body": "asp-for attribute u otomatik olarak name, id, value ve validation attribute larını ekler. Client-side validasyon için jQuery Unobtrusive Validation gerekir."
                    }
                  ]
                },
                {
                  "id": "section-anchor-tag-helpers",
                  "title": "Anchor Tag Helpers",
                  "summary": "Link oluşturma tag helper ları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Anchor tag helper ları URL generation yapar ve route parameter larını otomatik olarak ekler."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Action link *@ n<a asp-controller="Products \" asp-action= "Details \" asp-route-id= "@product.Id"> n    Detaylar n</a> n n@* Route link *@ n<a asp-route= "blog-post \" asp-route-year= "2024 \" asp-route-month= "1 \" asp-route-slug= "my-post"> n    Blog Yazısı n</a>",
                      "explanation": "Anchor tag helper kullanımı"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-tag-helpers",
                  "question": "Tag helper ları etkinleştirmek için hangi dosyaya ne eklenir?",
                  "options": [
                    "_ViewImports.cshtml e @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers",
                    "_Layout.cshtml e @addTagHelper eklenir",
                    "Program.cs de services.AddTagHelpers() çağrılır",
                    "Tag helper lar varsayılan olarak etkindir"
                  ],
                  "answer": "_ViewImports.cshtml e @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers",
                  "rationale": "Tag helper ları _ViewImports.cshtml dosyasına @addTagHelper direktifi eklenerek etkinleştirilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-tag-helpers-docs",
                  "label": "Tag Helpers Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/tag-helpers/intro",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-tag-helpers-form",
                  "title": "Tag Helpers ile Form Oluştur",
                  "description": "Tag helper ları kullanarak tam özellikli bir form oluştur",
                  "type": "guided",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Product model i için Create formu oluştur",
                    "asp-controller ve asp-action attribute larını kullan",
                    "asp-for ile input ları model e bağla",
                    "asp-validation-for ile validation mesajlarını göster",
                    "Client-side validasyon için script leri ekle"
                  ]
                }
              ]
            },
            {
              "label": "TempData ve Session Yönetimi",
              "href": "/education/lessons/aspnet-mvc/state-management/tempdata-session",
              "description": "TempData ve Session ile state yönetimi yap.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "TempData bir sonraki request e kadar veri saklar",
                "Session kullanıcı oturumu boyunca veri saklar",
                "TempData.Keep() ile veriyi koruyabilirsin",
                "Session memory de veya distributed cache te saklanabilir"
              ],
              "sections": [
                {
                  "id": "tempdata-session",
                  "title": "TempData ve Session",
                  "summary": "State yönetimi için TempData ve Session kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "TempData bir sonraki request e kadar veri saklar, Session ise kullanıcı oturumu boyunca veri saklar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// TempData kullanımı npublic IActionResult Create(Product product) n{ n    // ... n    TempData["SuccessMessage "] ="Ürün başarıyla oluşturuldu. "; n    return RedirectToAction("Index "); n} n n// View da n@if (TempData["SuccessMessage "] != null) n{ n    <div class="alert alert-success ">@TempData["SuccessMessage "]</div> n} n n// Session kullanımı nHttpContext.Session.SetString("UserName ", user.Name); nvar userName = HttpContext.Session.GetString("UserName ");",
                      "explanation": "TempData ve Session kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-tempdata",
                  "question": "TempData ne kadar süre veri saklar?",
                  "options": [
                    "Her zaman",
                    "Bir sonraki request e kadar",
                    "Kullanıcı oturumu boyunca",
                    "Hiçbir zaman"
                  ],
                  "answer": "Bir sonraki request e kadar",
                  "rationale": "TempData bir sonraki request e kadar veri saklar."
                }
              ],
              "resources": [
                {
                  "id": "resource-tempdata-docs",
                  "label": "Microsoft Docs: TempData",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/app-state",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "TempData ve Session hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-tempdata",
                  "title": "TempData ve Session Kullanımı",
                  "description": "TempData ve Session ile state yönetimi yap.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "TempData ile mesaj göster",
                    "Session ile kullanıcı bilgisi sakla",
                    "TempData.Keep() kullan"
                  ]
                }
              ]
            },
            {
              "label": "ViewBag, ViewData ve Model Kullanımı",
              "href": "/education/lessons/aspnet-mvc/views/viewbag-viewdata-model",
              "description": "ViewBag, ViewData ve Model arasındaki farkları öğren.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "ViewBag dynamic property ler kullanır",
                "ViewData dictionary kullanır",
                "Model strongly-typed veri aktarımı sağlar",
                "Model tercih edilmelidir"
              ],
              "sections": [
                {
                  "id": "viewbag-viewdata-model",
                  "title": "ViewBag, ViewData ve Model",
                  "summary": "Controller dan view a veri aktarma yöntemleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "ViewBag dynamic property ler kullanır, ViewData dictionary kullanır, Model ise strongly-typed veri aktarımı sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// ViewBag kullanımı nViewBag.Message ="Hoş geldiniz! "; nViewBag.Count = 10; n n// ViewData kullanımı nViewData["Message "] ="Hoş geldiniz! "; nViewData["Count "] = 10; n n// Model kullanımı (tercih edilen) nreturn View(product); n n// View da n@model Product n<h1>@Model.Name</h1>",
                      "explanation": "ViewBag, ViewData ve Model kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-viewbag",
                  "question": "Hangi yöntem tercih edilmelidir?",
                  "options": [
                    "ViewBag",
                    "ViewData",
                    "Model",
                    "Hiçbiri"
                  ],
                  "answer": "Model",
                  "rationale": "Model strongly-typed veri aktarımı sağladığı için tercih edilmelidir."
                }
              ],
              "resources": [
                {
                  "id": "resource-viewbag-docs",
                  "label": "Microsoft Docs: ViewBag, ViewData",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/overview",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "ViewBag, ViewData ve Model hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-viewbag",
                  "title": "ViewBag, ViewData ve Model Kullanımı",
                  "description": "Farklı veri aktarım yöntemlerini kullan.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "ViewBag ile veri aktar",
                    "ViewData ile veri aktar",
                    "Model ile veri aktar ve karşılaştır"
                  ]
                }
              ]
            },
            {
              "label": "Layout ve _ViewStart Yapılandırması",
              "href": "/education/lessons/aspnet-mvc/views/layout-viewstart",
              "description": "Layout ve _ViewStart ile sayfa yapısını standartlaştır.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Layout sayfa yapısını standartlaştırır",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "Sections ile layout a içerik eklenebilir",
                "Nested layout lar oluşturulabilir"
              ],
              "sections": [
                {
                  "id": "layout-viewstart",
                  "title": "Layout ve _ViewStart",
                  "summary": "Sayfa yapısını standartlaştırma.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Layout sayfa yapısını standartlaştırır, _ViewStart.cshtml ise tüm view lar için ortak ayarları içerir."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ViewStart.cshtml *@ n@{ n    Layout ="_Layout "; n} n n@* _Layout.cshtml *@ n<!DOCTYPE html> n<html> n<head> n    <title>@ViewData["Title "]</title> n</head> n<body> n    @RenderBody() n    @RenderSection("Scripts ", required: false) n</body> n</html>",
                      "explanation": "Layout ve _ViewStart yapılandırması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-layout",
                  "question": "_ViewStart.cshtml ne işe yarar?",
                  "options": [
                    "Sadece layout belirler",
                    "Tüm view lar için ortak ayarları içerir",
                    "Sadece script ekler",
                    "Hiçbir şey"
                  ],
                  "answer": "Tüm view lar için ortak ayarları içerir",
                  "rationale": "_ViewStart.cshtml tüm view lar için ortak ayarları içerir."
                }
              ],
              "resources": [
                {
                  "id": "resource-layout-docs",
                  "label": "Microsoft Docs: Layout",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/layout",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Layout ve _ViewStart hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-layout",
                  "title": "Layout ve _ViewStart Yapılandırması",
                  "description": "Layout ve _ViewStart ile sayfa yapısını standartlaştır.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Layout oluştur",
                    "_ViewStart.cshtml yapılandır",
                    "Sections kullan"
                  ]
                }
              ]
            },
            {
              "label": "Action ve Result Filters",
              "href": "/education/lessons/aspnet-mvc/filters/action-result-filters",
              "description": "Action ve Result filters ile cross-cutting concerns yönet.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Action filters action method dan önce/sonra çalışır",
                "Result filters result tan önce/sonra çalışır",
                "IActionFilter ve IResultFilter interface leri kullanılır",
                "Filters authorization, logging, caching için kullanılır"
              ],
              "sections": [
                {
                  "id": "action-result-filters",
                  "title": "Action ve Result Filters",
                  "summary": "Cross-cutting concerns için filters.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Action filters action method dan önce/sonra çalışır, Result filters ise result  tan önce/sonra çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Action Filter npublic class LogActionFilter : IActionFilter n{ n    public void OnActionExecuting(ActionExecutingContext context) n    { n        // Action dan önce n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        // Action dan sonra n    } n} n n// Kullanım n[ServiceFilter(typeof(LogActionFilter))] npublic IActionResult Index() n{ n    return View(); n}",
                      "explanation": "Action filter örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-filters",
                  "question": "Action filter ne zaman çalışır?",
                  "options": [
                    "Sadece action dan önce",
                    "Action dan önce ve sonra",
                    "Sadece action dan sonra",
                    "Hiçbir zaman"
                  ],
                  "answer": "Action dan önce ve sonra",
                  "rationale": "Action filter, OnActionExecuting ve OnActionExecuted metodlarıyla action dan önce ve sonra çalışır."
                }
              ],
              "resources": [
                {
                  "id": "resource-filters-docs",
                  "label": "Microsoft Docs: Filters",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/filters",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Action ve Result filters hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-filters",
                  "title": "Action ve Result Filters",
                  "description": "Action ve Result filters ile cross-cutting concerns yönet.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "İleri",
                  "instructions": [
                    "Action filter oluştur",
                    "Result filter oluştur",
                    "Filters ı kullan"
                  ]
                }
              ]
            },
            {
              "label": "Model Binding ve Validation",
              "href": "/education/lessons/aspnet-mvc/models/model-binding-validation",
              "description": "Model binding ve validation mekanizmalarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Model binding HTTP verilerini C# nesnelerine dönüştürür",
                "Data annotations ile validation yapılır",
                "ModelState.IsValid ile validation kontrol edilir",
                "Client-side ve server-side validation desteklenir"
              ],
              "sections": [
                {
                  "id": "model-binding-validation",
                  "title": "Model Binding ve Validation",
                  "summary": "HTTP verilerini model e dönüştürme ve doğrulama.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Model binding HTTP verilerini C# nesnelerine dönüştürür, validation ise verilerin doğruluğunu kontrol eder."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Model npublic class Product n{ n    [Required] n    [StringLength(100)] n    public string Name { get; set; } n     n    [Range(0, 10000)] n    public decimal Price { get; set; } n} n n// Controller n[HttpPost] npublic IActionResult Create(Product product) n{ n    if (ModelState.IsValid) n    { n        // ... n        return RedirectToAction("Index "); n    } n    return View(product); n}",
                      "explanation": "Model binding ve validation örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-model-binding",
                  "question": "Model binding ne yapar?",
                  "options": [
                    "Sadece validation yapar",
                    "HTTP verilerini C# nesnelerine dönüştürür",
                    "Sadece view oluşturur",
                    "Hiçbir şey"
                  ],
                  "answer": "HTTP verilerini C# nesnelerine dönüştürür",
                  "rationale": "Model binding HTTP verilerini C# nesnelerine dönüştürür."
                }
              ],
              "resources": [
                {
                  "id": "resource-model-binding-docs",
                  "label": "Microsoft Docs: Model Binding",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/models/model-binding",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Model binding ve validation hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-model-binding",
                  "title": "Model Binding ve Validation",
                  "description": "Model binding ve validation mekanizmalarını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Model oluştur",
                    "Data annotations ekle",
                    "Validation kontrol et"
                  ]
                }
              ]
            },
            {
              "label": "Routing Stratejileri",
              "href": "/education/lessons/aspnet-mvc/routing/routing-strategies",
              "description": "Convention-based ve attribute routing stratejilerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Convention-based routing Program.cs de tanımlanır",
                "Attribute routing daha esnek ve açıktır",
                "Route constraints parametre tiplerini kısıtlar",
                "Route values dinamik segmentler oluşturur"
              ],
              "sections": [
                {
                  "id": "routing-strategies",
                  "title": "Routing Stratejileri",
                  "summary": "Convention-based ve attribute routing.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Convention-based routing Program.cs de tanımlanır, attribute routing ise controller ve action lara [Route] attribute u ile doğrudan tanımlanır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Convention-based routing napp.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} "); n n// Attribute routing n[Route("api/[controller] ")] npublic class ProductsController : Controller n{ n    [HttpGet("{id:int} ")] n    public IActionResult Get(int id) n    { n        // ... n    } n}",
                      "explanation": "Convention-based ve attribute routing örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-routing",
                  "question": "Attribute routing in avantajı nedir?",
                  "options": [
                    "Daha yavaştır",
                    "Daha esnek ve açıktır",
                    "Daha az özellik sunar",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Daha esnek ve açıktır",
                  "rationale": "Attribute routing daha esnek ve açık bir yaklaşımdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-routing-docs",
                  "label": "Microsoft Docs: Routing",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/routing",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Routing stratejileri hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-routing",
                  "title": "Routing Stratejileri",
                  "description": "Convention-based ve attribute routing stratejilerini uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Convention-based routing tanımla",
                    "Attribute routing kullan",
                    "Route constraints ekle"
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
        'Mini Test: TempData ve Session Yönetimi',
        'TempData ve Session konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-tempdata-1",
            "question": "TempData ne kadar süre veri saklar?",
            "options": [
              "Her zaman",
              "Bir sonraki request e kadar",
              "Kullanıcı oturumu boyunca",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "TempData bir sonraki request e kadar veri saklar."
          },
          {
            "id": "mini-tempdata-2",
            "question": "Session ne kadar süre veri saklar?",
            "options": [
              "Her zaman",
              "Bir sonraki request e kadar",
              "Kullanıcı oturumu boyunca",
              "Hiçbir zaman"
            ],
            "correctAnswer": 2,
            "explanation": "Session kullanıcı oturumu boyunca veri saklar."
          },
          {
            "id": "mini-tempdata-3",
            "question": "TempData.Keep() ne işe yarar?",
            "options": [
              "TempData yı siler",
              "TempData yı bir sonraki request e kadar korur",
              "Session ı temizler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "TempData.Keep() TempData yı bir sonraki request e kadar korur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/state-management/tempdata-session',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-views-viewbag-viewdata-model',
        'course-dotnet-roadmap',
        'Mini Test: ViewBag, ViewData ve Model',
        'ViewBag, ViewData ve Model konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-viewbag-1",
            "question": "Hangi yöntem tercih edilmelidir?",
            "options": [
              "ViewBag",
              "ViewData",
              "Model",
              "Hiçbiri"
            ],
            "correctAnswer": 2,
            "explanation": "Model strongly-typed veri aktarımı sağladığı için tercih edilmelidir."
          },
          {
            "id": "mini-viewbag-2",
            "question": "ViewBag nasıl çalışır?",
            "options": [
              "Dictionary kullanır",
              "Dynamic property ler kullanır",
              "Strongly-typed kullanır",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "ViewBag dynamic property ler kullanır."
          },
          {
            "id": "mini-viewbag-3",
            "question": "ViewData nasıl çalışır?",
            "options": [
              "Dictionary kullanır",
              "Dynamic property ler kullanır",
              "Strongly-typed kullanır",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 0,
            "explanation": "ViewData dictionary kullanır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/views/viewbag-viewdata-model',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-views-layout-viewstart',
        'course-dotnet-roadmap',
        'Mini Test: Layout ve _ViewStart',
        'Layout ve _ViewStart konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-layout-1",
            "question": "_ViewStart.cshtml ne işe yarar?",
            "options": [
              "Sadece layout belirler",
              "Tüm view lar için ortak ayarları içerir",
              "Sadece script ekler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "_ViewStart.cshtml tüm view lar için ortak ayarları içerir."
          },
          {
            "id": "mini-layout-2",
            "question": "Layout ne işe yarar?",
            "options": [
              "Sadece view oluşturur",
              "Sayfa yapısını standartlaştırır",
              "Sadece script ekler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Layout sayfa yapısını standartlaştırır."
          },
          {
            "id": "mini-layout-3",
            "question": "Sections ile ne yapılabilir?",
            "options": [
              "Sadece layout oluşturulur",
              "Layout a içerik eklenebilir",
              "Sadece view oluşturulur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Sections ile layout a içerik eklenebilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/views/layout-viewstart',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-filters-action-result-filters',
        'course-dotnet-roadmap',
        'Mini Test: Action ve Result Filters',
        'Action ve Result filters konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-filters-1",
            "question": "Action filter ne zaman çalışır?",
            "options": [
              "Sadece action dan önce",
              "Action dan önce ve sonra",
              "Sadece action dan sonra",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Action filter, OnActionExecuting ve OnActionExecuted metodlarıyla action dan önce ve sonra çalışır."
          },
          {
            "id": "mini-filters-2",
            "question": "Result filter ne zaman çalışır?",
            "options": [
              "Sadece result tan önce",
              "Result tan önce ve sonra",
              "Sadece result tan sonra",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Result filter, result tan önce ve sonra çalışır."
          },
          {
            "id": "mini-filters-3",
            "question": "Filters ne için kullanılır?",
            "options": [
              "Sadece logging",
              "Authorization, logging, caching gibi cross-cutting concerns",
              "Sadece caching",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Filters authorization, logging, caching gibi cross-cutting concerns için kullanılır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/filters/action-result-filters',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-models-model-binding-validation',
        'course-dotnet-roadmap',
        'Mini Test: Model Binding ve Validation',
        'Model binding ve validation konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-model-binding-1",
            "question": "Model binding ne yapar?",
            "options": [
              "Sadece validation yapar",
              "HTTP verilerini C# nesnelerine dönüştürür",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Model binding HTTP verilerini C# nesnelerine dönüştürür."
          },
          {
            "id": "mini-model-binding-2",
            "question": "Validation nasıl yapılır?",
            "options": [
              "Sadece client-side",
              "Data annotations ile",
              "Sadece server-side",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Validation data annotations ile yapılır."
          },
          {
            "id": "mini-model-binding-3",
            "question": "ModelState.IsValid ne işe yarar?",
            "options": [
              "Sadece model oluşturur",
              "Validation kontrolü yapar",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ModelState.IsValid validation kontrolü yapar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/models/model-binding-validation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-routing-routing-strategies',
        'course-dotnet-roadmap',
        'Mini Test: Routing Stratejileri',
        'Routing stratejileri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-routing-1",
            "question": "Attribute routing in avantajı nedir?",
            "options": [
              "Daha yavaştır",
              "Daha esnek ve açıktır",
              "Daha az özellik sunar",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Attribute routing daha esnek ve açık bir yaklaşımdır."
          },
          {
            "id": "mini-routing-2",
            "question": "Convention-based routing nerede tanımlanır?",
            "options": [
              "Sadece controller da",
              "Program.cs de",
              "Sadece view da",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Convention-based routing Program.cs de tanımlanır."
          },
          {
            "id": "mini-routing-3",
            "question": "Route constraints ne işe yarar?",
            "options": [
              "Sadece route oluşturur",
              "Parametre tiplerini kısıtlar",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Route constraints parametre tiplerini kısıtlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/routing/routing-strategies',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

COMMIT;
