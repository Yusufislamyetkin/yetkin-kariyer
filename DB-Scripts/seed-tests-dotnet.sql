-- .NET Core Tests Seed
-- Course ile aynı 15 modül yapısı, her modülde 10+ test içeriği
BEGIN;

-- Modül 1: .NET Core Tanıyalım Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod01-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('1. .NET Core Tanıyalım Testleri - Test %s', gs),
	'.NET Core ekosistemi ve temel kavramlar hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod01-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN '.NET Core nedir ve ne için kullanılır?'
				WHEN gs = 2 THEN '.NET Framework ve .NET Core arasındaki temel fark nedir?'
				WHEN gs = 3 THEN 'CLR (Common Language Runtime) ne işe yarar?'
				WHEN gs = 4 THEN 'SDK ve Runtime arasındaki fark nedir?'
				WHEN gs = 5 THEN 'Cross-platform geliştirme ne demektir?'
				WHEN gs = 6 THEN 'dotnet CLI komutu ne işe yarar?'
				WHEN gs = 7 THEN 'NuGet paket sistemi nedir?'
				WHEN gs = 8 THEN '.NET Core proje yapısında Program.cs ne işe yarar?'
				WHEN gs = 9 THEN 'BCL (Base Class Library) nedir?'
				WHEN gs = 10 THEN 'Visual Studio Code ile .NET Core geliştirme mümkün müdür?'
				ELSE FORMAT('.NET Core temel kavramları hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Açık kaynaklı, cross-platform framework','Sadece Windows için framework','Sadece web geliştirme aracı','Veritabanı yönetim sistemi')
				WHEN gs = 2 THEN jsonb_build_array('.NET Core cross-platform, Framework sadece Windows','Hiçbir fark yok','Framework daha hızlı','Core sadece web için')
				WHEN gs = 3 THEN jsonb_build_array('Kodun çalışma zamanında yönetilmesi','Veritabanı bağlantısı','UI render etme','Network işlemleri')
				ELSE jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D')
			END,
			'answer', 0,
			'category', 'basics',
			'explanation', 'Temel .NET Core kavramları hakkında bilgi testi'
		)
	),
	70,
	'dotnet-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 2: C# Temelleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod02-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('2. C# Temelleri Testleri - Test %s', gs),
	'C# programlama dili temel kavramları hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod02-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'C# hangi programlama paradigmasını destekler?'
				WHEN gs = 2 THEN 'Değer tipi (value type) ve referans tipi (reference type) farkı nedir?'
				WHEN gs = 3 THEN 'var keyword ne zaman kullanılır?'
				WHEN gs = 4 THEN 'foreach döngüsü hangi durumlarda kullanılır?'
				WHEN gs = 5 THEN 'Exception handling için hangi bloklar kullanılır?'
				WHEN gs = 6 THEN 'String ve StringBuilder arasındaki fark nedir?'
				WHEN gs = 7 THEN 'Nullable type nedir?'
				WHEN gs = 8 THEN 'Array ve List arasındaki fark nedir?'
				WHEN gs = 9 THEN 'Method overloading nedir?'
				WHEN gs = 10 THEN 'Namespace ne işe yarar?'
				ELSE FORMAT('C# temel kavramları hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'csharp-basics',
			'explanation', 'C# programlama dili temel kavramları hakkında bilgi testi'
		)
	),
	70,
	'csharp-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 3: Proje Yapısı ve Dependency Injection Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod03-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('3. Proje Yapısı ve Dependency Injection Testleri - Test %s', gs),
	'Proje yapısı, DI ve configuration yönetimi hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod03-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Dependency Injection nedir?'
				WHEN gs = 2 THEN 'Service lifetime türleri nelerdir?'
				WHEN gs = 3 THEN 'Singleton, Scoped ve Transient arasındaki fark nedir?'
				WHEN gs = 4 THEN 'IServiceCollection ne işe yarar?'
				WHEN gs = 5 THEN 'appsettings.json dosyası ne için kullanılır?'
				WHEN gs = 6 THEN 'Startup.cs ve Program.cs farkı nedir?'
				WHEN gs = 7 THEN 'Middleware pipeline nedir?'
				WHEN gs = 8 THEN 'Options Pattern nedir?'
				WHEN gs = 9 THEN 'Katmanlı mimari nedir?'
				WHEN gs = 10 THEN 'Repository Pattern ne işe yarar?'
				ELSE FORMAT('Proje yapısı ve DI hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'architecture',
			'explanation', 'Proje yapısı ve Dependency Injection hakkında bilgi testi'
		)
	),
	70,
	'project-structure',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 4: ASP.NET Core MVC Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod04-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('4. ASP.NET Core MVC Testleri - Test %s', gs),
	'MVC pattern, Razor ve model binding hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod04-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'MVC pattern nedir?'
				WHEN gs = 2 THEN 'Controller ne işe yarar?'
				WHEN gs = 3 THEN 'Model Binding nedir?'
				WHEN gs = 4 THEN 'Razor syntax nedir?'
				WHEN gs = 5 THEN 'ViewBag, ViewData ve TempData farkı nedir?'
				WHEN gs = 6 THEN 'Partial View ne için kullanılır?'
				WHEN gs = 7 THEN 'TagHelper nedir?'
				WHEN gs = 8 THEN 'ViewComponent nedir?'
				WHEN gs = 9 THEN 'Data Annotations ne işe yarar?'
				WHEN gs = 10 THEN 'ModelState nedir?'
				ELSE FORMAT('MVC hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'mvc',
			'explanation', 'ASP.NET Core MVC hakkında bilgi testi'
		)
	),
	70,
	'aspnet-mvc',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 5: Web API Geliştirme Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod05-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('5. Web API Geliştirme Testleri - Test %s', gs),
	'RESTful API, Swagger ve API geliştirme hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod05-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'RESTful API nedir?'
				WHEN gs = 2 THEN 'HTTP metotları nelerdir?'
				WHEN gs = 3 THEN 'Minimal API nedir?'
				WHEN gs = 4 THEN 'Swagger ne işe yarar?'
				WHEN gs = 5 THEN 'API versioning nedir?'
				WHEN gs = 6 THEN 'DTO (Data Transfer Object) nedir?'
				WHEN gs = 7 THEN 'CORS nedir?'
				WHEN gs = 8 THEN 'Rate limiting nedir?'
				WHEN gs = 9 THEN 'Response wrapper nedir?'
				WHEN gs = 10 THEN 'API authentication yöntemleri nelerdir?'
				ELSE FORMAT('Web API hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'api',
			'explanation', 'Web API geliştirme hakkında bilgi testi'
		)
	),
	70,
	'web-api',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 6: Middleware ve Pipeline Yönetimi Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod06-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('6. Middleware ve Pipeline Yönetimi Testleri - Test %s', gs),
	'Middleware pipeline ve request/response handling hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod06-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Middleware nedir?'
				WHEN gs = 2 THEN 'Request pipeline nedir?'
				WHEN gs = 3 THEN 'Middleware sırası neden önemlidir?'
				WHEN gs = 4 THEN 'Use, Run ve Map middleware farkı nedir?'
				WHEN gs = 5 THEN 'Custom middleware nasıl oluşturulur?'
				WHEN gs = 6 THEN 'Terminal middleware nedir?'
				WHEN gs = 7 THEN 'Middleware ile exception handling nasıl yapılır?'
				WHEN gs = 8 THEN 'Conditional middleware nedir?'
				WHEN gs = 9 THEN 'Middleware dependency injection nasıl çalışır?'
				WHEN gs = 10 THEN 'Pipeline branching nedir?'
				ELSE FORMAT('Middleware hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'middleware',
			'explanation', 'Middleware ve Pipeline yönetimi hakkında bilgi testi'
		)
	),
	70,
	'middleware',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 7: Authentication & Authorization Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod07-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('7. Authentication & Authorization Testleri - Test %s', gs),
	'Authentication, authorization ve güvenlik hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod07-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Authentication ve Authorization farkı nedir?'
				WHEN gs = 2 THEN 'JWT token nedir?'
				WHEN gs = 3 THEN 'ASP.NET Core Identity nedir?'
				WHEN gs = 4 THEN 'Role-based authorization nedir?'
				WHEN gs = 5 THEN 'Policy-based authorization nedir?'
				WHEN gs = 6 THEN 'Claims nedir?'
				WHEN gs = 7 THEN 'OAuth2 nedir?'
				WHEN gs = 8 THEN 'Token refresh mekanizması nedir?'
				WHEN gs = 9 THEN 'Password hashing nedir?'
				WHEN gs = 10 THEN 'MFA (Multi-Factor Authentication) nedir?'
				ELSE FORMAT('Authentication hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'auth',
			'explanation', 'Authentication & Authorization hakkında bilgi testi'
		)
	),
	70,
	'authentication',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 8: Logging ve Exception Handling Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod08-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('8. Logging ve Exception Handling Testleri - Test %s', gs),
	'Logging frameworkleri ve exception handling hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod08-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'ILogger interface nedir?'
				WHEN gs = 2 THEN 'Serilog nedir?'
				WHEN gs = 3 THEN 'Log levels nelerdir?'
				WHEN gs = 4 THEN 'Structured logging nedir?'
				WHEN gs = 5 THEN 'Exception middleware nedir?'
				WHEN gs = 6 THEN 'Global exception handler nedir?'
				WHEN gs = 7 THEN 'Application Insights nedir?'
				WHEN gs = 8 THEN 'Log aggregation nedir?'
				WHEN gs = 9 THEN 'Error tracking nedir?'
				WHEN gs = 10 THEN 'Log retention nedir?'
				ELSE FORMAT('Logging hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'logging',
			'explanation', 'Logging ve Exception Handling hakkında bilgi testi'
		)
	),
	70,
	'logging',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 9: Configuration Management Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod09-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('9. Configuration Management Testleri - Test %s', gs),
	'Configuration yönetimi ve options pattern hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod09-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'appsettings.json nedir?'
				WHEN gs = 2 THEN 'Options Pattern nedir?'
				WHEN gs = 3 THEN 'IOptions, IOptionsSnapshot, IOptionsMonitor farkı nedir?'
				WHEN gs = 4 THEN 'Configuration binding nedir?'
				WHEN gs = 5 THEN 'User Secrets nedir?'
				WHEN gs = 6 THEN 'Azure Key Vault nedir?'
				WHEN gs = 7 THEN 'Environment variables nasıl kullanılır?'
				WHEN gs = 8 THEN 'Configuration validation nedir?'
				WHEN gs = 9 THEN 'Hot reload configuration nedir?'
				WHEN gs = 10 THEN 'Multi-environment configuration nedir?'
				ELSE FORMAT('Configuration hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'configuration',
			'explanation', 'Configuration Management hakkında bilgi testi'
		)
	),
	70,
	'configuration',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 10: Unit Test ve Integration Test Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod10-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('10. Unit Test ve Integration Test Testleri - Test %s', gs),
	'Test türleri, TDD ve test frameworkleri hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod10-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Unit test nedir?'
				WHEN gs = 2 THEN 'Integration test nedir?'
				WHEN gs = 3 THEN 'TDD (Test-Driven Development) nedir?'
				WHEN gs = 4 THEN 'xUnit nedir?'
				WHEN gs = 5 THEN 'Mocking nedir?'
				WHEN gs = 6 THEN 'Moq framework nedir?'
				WHEN gs = 7 THEN 'Test coverage nedir?'
				WHEN gs = 8 THEN 'InMemory database test nedir?'
				WHEN gs = 9 THEN 'Test fixtures nedir?'
				WHEN gs = 10 THEN 'Parameterized tests nedir?'
				ELSE FORMAT('Testing hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'testing',
			'explanation', 'Unit Test ve Integration Test hakkında bilgi testi'
		)
	),
	70,
	'testing',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 11: Performans ve Caching Teknikleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod11-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('11. Performans ve Caching Teknikleri Testleri - Test %s', gs),
	'Performans optimizasyonu ve caching stratejileri hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod11-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Caching nedir?'
				WHEN gs = 2 THEN 'Memory cache nedir?'
				WHEN gs = 3 THEN 'Distributed cache nedir?'
				WHEN gs = 4 THEN 'Redis nedir?'
				WHEN gs = 5 THEN 'Response caching nedir?'
				WHEN gs = 6 THEN 'Cache invalidation nedir?'
				WHEN gs = 7 THEN 'Performance profiling nedir?'
				WHEN gs = 8 THEN 'Query optimization nedir?'
				WHEN gs = 9 THEN 'Health checks nedir?'
				WHEN gs = 10 THEN 'Benchmarking nedir?'
				ELSE FORMAT('Performance hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'performance',
			'explanation', 'Performans ve Caching Teknikleri hakkında bilgi testi'
		)
	),
	70,
	'performance',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 12: Asenkron Programlama Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod12-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('12. Asenkron Programlama Testleri - Test %s', gs),
	'Async/await, Task ve threading hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod12-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Async/await nedir?'
				WHEN gs = 2 THEN 'Task nedir?'
				WHEN gs = 3 THEN 'Task.Run nedir?'
				WHEN gs = 4 THEN 'ConfigureAwait nedir?'
				WHEN gs = 5 THEN 'CancellationToken nedir?'
				WHEN gs = 6 THEN 'IAsyncEnumerable nedir?'
				WHEN gs = 7 THEN 'Deadlock nedir?'
				WHEN gs = 8 THEN 'Task.WhenAll nedir?'
				WHEN gs = 9 THEN 'Parallel processing nedir?'
				WHEN gs = 10 THEN 'Thread safety nedir?'
				ELSE FORMAT('Async programming hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'async',
			'explanation', 'Asenkron Programlama hakkında bilgi testi'
		)
	),
	70,
	'async-programming',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 13: Docker ile Containerization Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod13-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('13. Docker ile Containerization Testleri - Test %s', gs),
	'Docker, containerization ve deployment hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod13-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Docker nedir?'
				WHEN gs = 2 THEN 'Container nedir?'
				WHEN gs = 3 THEN 'Dockerfile nedir?'
				WHEN gs = 4 THEN 'Docker Compose nedir?'
				WHEN gs = 5 THEN 'Multi-stage build nedir?'
				WHEN gs = 6 THEN 'Docker volume nedir?'
				WHEN gs = 7 THEN 'Docker Hub nedir?'
				WHEN gs = 8 THEN 'Container networking nedir?'
				WHEN gs = 9 THEN 'Docker Swarm nedir?'
				WHEN gs = 10 THEN 'Container security nedir?'
				ELSE FORMAT('Docker hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'docker',
			'explanation', 'Docker ile Containerization hakkında bilgi testi'
		)
	),
	70,
	'docker',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 14: CI/CD ve Deployment Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod14-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('14. CI/CD ve Deployment Testleri - Test %s', gs),
	'CI/CD pipeline ve deployment stratejileri hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod14-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'CI/CD nedir?'
				WHEN gs = 2 THEN 'GitHub Actions nedir?'
				WHEN gs = 3 THEN 'Azure DevOps nedir?'
				WHEN gs = 4 THEN 'Pipeline nedir?'
				WHEN gs = 5 THEN 'Blue-green deployment nedir?'
				WHEN gs = 6 THEN 'Rollback nedir?'
				WHEN gs = 7 THEN 'Azure App Service nedir?'
				WHEN gs = 8 THEN 'Database migration in CI/CD nedir?'
				WHEN gs = 9 THEN 'Environment-specific deployment nedir?'
				WHEN gs = 10 THEN 'Deployment automation nedir?'
				ELSE FORMAT('CI/CD hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'cicd',
			'explanation', 'CI/CD ve Deployment hakkında bilgi testi'
		)
	),
	70,
	'cicd',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 15: Microservices Mimarisi Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-dotnet-mod15-test-%02s', gs),
	'course-dotnet-roadmap',
	FORMAT('15. Microservices Mimarisi Testleri - Test %s', gs),
	'Microservices, API Gateway ve distributed systems hakkında bilgi testi.',
	'.NET Core',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-dotnet-mod15-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Microservices nedir?'
				WHEN gs = 2 THEN 'Monolith vs Microservice farkı nedir?'
				WHEN gs = 3 THEN 'API Gateway nedir?'
				WHEN gs = 4 THEN 'Service discovery nedir?'
				WHEN gs = 5 THEN 'Message broker nedir?'
				WHEN gs = 6 THEN 'Event-driven architecture nedir?'
				WHEN gs = 7 THEN 'Saga pattern nedir?'
				WHEN gs = 8 THEN 'Circuit breaker pattern nedir?'
				WHEN gs = 9 THEN 'gRPC nedir?'
				WHEN gs = 10 THEN 'Distributed cache nedir?'
				ELSE FORMAT('Microservices hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'microservices',
			'explanation', 'Microservices Mimarisi hakkında bilgi testi'
		)
	),
	70,
	'microservices',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;
