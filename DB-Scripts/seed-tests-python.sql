-- Python Tests Seed
-- Course ile aynı 15 modül yapısı, her modülde 10+ test içeriği
BEGIN;

-- Modül 1: Python Tanıyalım Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod01-test-%02s', gs),
	'course-python-apis',
	FORMAT('1. Python Tanıyalım Testleri - Test %s', gs),
	'Python ekosistemi ve temel kavramlar hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod01-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Python nedir?'
				WHEN gs = 2 THEN 'Python''ın temel avantajları nelerdir?'
				WHEN gs = 3 THEN 'Virtual environments nedir?'
				WHEN gs = 4 THEN 'pip nedir?'
				WHEN gs = 5 THEN 'Python vs diğer diller farkı nedir?'
				WHEN gs = 6 THEN 'Python versiyonları nelerdir?'
				WHEN gs = 7 THEN 'PEP 8 nedir?'
				WHEN gs = 8 THEN 'Python IDE''leri nelerdir?'
				WHEN gs = 9 THEN 'Python community nedir?'
				WHEN gs = 10 THEN 'Python architecture nedir?'
				ELSE FORMAT('Python temel kavramları hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'basics',
			'explanation', 'Python temel kavramları hakkında bilgi testi'
		)
	),
	70,
	'python-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 2: Python Temelleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod02-test-%02s', gs),
	'course-python-apis',
	FORMAT('2. Python Temelleri Testleri - Test %s', gs),
	'Python syntax ve temel programlama hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod02-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Python syntax nedir?'
				WHEN gs = 2 THEN 'Variables nedir?'
				WHEN gs = 3 THEN 'Data types nelerdir?'
				WHEN gs = 4 THEN 'Operators nedir?'
				WHEN gs = 5 THEN 'Conditional statements nedir?'
				WHEN gs = 6 THEN 'Loops nedir?'
				WHEN gs = 7 THEN 'List comprehensions nedir?'
				WHEN gs = 8 THEN 'Type conversion nedir?'
				WHEN gs = 9 THEN 'Input/output nedir?'
				WHEN gs = 10 THEN 'Python temelleri best practices nelerdir?'
				ELSE FORMAT('Python temelleri hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'basics-detailed',
			'explanation', 'Python temelleri hakkında bilgi testi'
		)
	),
	70,
	'python-fundamentals',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 3: Veri Yapıları Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod03-test-%02s', gs),
	'course-python-apis',
	FORMAT('3. Veri Yapıları Testleri - Test %s', gs),
	'Python veri yapıları hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod03-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Lists nedir?'
				WHEN gs = 2 THEN 'Tuples nedir?'
				WHEN gs = 3 THEN 'Dictionaries nedir?'
				WHEN gs = 4 THEN 'Sets nedir?'
				WHEN gs = 5 THEN 'List methods nelerdir?'
				WHEN gs = 6 THEN 'Dictionary methods nelerdir?'
				WHEN gs = 7 THEN 'Set operations nedir?'
				WHEN gs = 8 THEN 'Nested data structures nedir?'
				WHEN gs = 9 THEN 'Data structure performance nedir?'
				WHEN gs = 10 THEN 'Data structure best practices nelerdir?'
				ELSE FORMAT('Veri Yapıları hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'data-structures',
			'explanation', 'Veri Yapıları hakkında bilgi testi'
		)
	),
	70,
	'data-structures',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 4: Fonksiyonlar ve Modüller Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod04-test-%02s', gs),
	'course-python-apis',
	FORMAT('4. Fonksiyonlar ve Modüller Testleri - Test %s', gs),
	'Python functions ve modules hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod04-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Functions nedir?'
				WHEN gs = 2 THEN 'Function parameters nedir?'
				WHEN gs = 3 THEN '*args nedir?'
				WHEN gs = 4 THEN '**kwargs nedir?'
				WHEN gs = 5 THEN 'Lambda functions nedir?'
				WHEN gs = 6 THEN 'Decorators nedir?'
				WHEN gs = 7 THEN 'Modules nedir?'
				WHEN gs = 8 THEN 'Packages nedir?'
				WHEN gs = 9 THEN 'Import statements nedir?'
				WHEN gs = 10 THEN 'Functions ve modules best practices nelerdir?'
				ELSE FORMAT('Fonksiyonlar ve Modüller hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'functions-modules',
			'explanation', 'Fonksiyonlar ve Modüller hakkında bilgi testi'
		)
	),
	70,
	'functions-modules',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 5: OOP Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod05-test-%02s', gs),
	'course-python-apis',
	FORMAT('5. OOP Testleri - Test %s', gs),
	'Python OOP hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod05-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'OOP nedir?'
				WHEN gs = 2 THEN 'Classes nedir?'
				WHEN gs = 3 THEN 'Objects nedir?'
				WHEN gs = 4 THEN '__init__ nedir?'
				WHEN gs = 5 THEN 'Inheritance nedir?'
				WHEN gs = 6 THEN 'Polymorphism nedir?'
				WHEN gs = 7 THEN 'Encapsulation nedir?'
				WHEN gs = 8 THEN 'Special methods nedir?'
				WHEN gs = 9 THEN 'Properties nedir?'
				WHEN gs = 10 THEN 'OOP best practices nelerdir?'
				ELSE FORMAT('OOP hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'oop',
			'explanation', 'OOP hakkında bilgi testi'
		)
	),
	70,
	'oop',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 6: File I/O Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod06-test-%02s', gs),
	'course-python-apis',
	FORMAT('6. File I/O Testleri - Test %s', gs),
	'Python file I/O hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod06-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'File I/O nedir?'
				WHEN gs = 2 THEN 'Opening files nedir?'
				WHEN gs = 3 THEN 'Reading files nedir?'
				WHEN gs = 4 THEN 'Writing files nedir?'
				WHEN gs = 5 THEN 'Context managers nedir?'
				WHEN gs = 6 THEN 'CSV files nedir?'
				WHEN gs = 7 THEN 'JSON files nedir?'
				WHEN gs = 8 THEN 'File paths nedir?'
				WHEN gs = 9 THEN 'Directory operations nedir?'
				WHEN gs = 10 THEN 'File I/O best practices nelerdir?'
				ELSE FORMAT('File I/O hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'file-io',
			'explanation', 'File I/O hakkında bilgi testi'
		)
	),
	70,
	'file-io',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 7: Exception Handling Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod07-test-%02s', gs),
	'course-python-apis',
	FORMAT('7. Exception Handling Testleri - Test %s', gs),
	'Python exception handling hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod07-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Exception handling nedir?'
				WHEN gs = 2 THEN 'Try-except nedir?'
				WHEN gs = 3 THEN 'Finally block nedir?'
				WHEN gs = 4 THEN 'Raising exceptions nedir?'
				WHEN gs = 5 THEN 'Custom exceptions nedir?'
				WHEN gs = 6 THEN 'Exception hierarchy nedir?'
				WHEN gs = 7 THEN 'Error logging nedir?'
				WHEN gs = 8 THEN 'Assertions nedir?'
				WHEN gs = 9 THEN 'Exception patterns nelerdir?'
				WHEN gs = 10 THEN 'Exception handling best practices nelerdir?'
				ELSE FORMAT('Exception Handling hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'exceptions',
			'explanation', 'Exception Handling hakkında bilgi testi'
		)
	),
	70,
	'exception-handling',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 8: FastAPI/Django Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod08-test-%02s', gs),
	'course-python-apis',
	FORMAT('8. FastAPI/Django Testleri - Test %s', gs),
	'FastAPI ve Django hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod08-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'FastAPI nedir?'
				WHEN gs = 2 THEN 'Django nedir?'
				WHEN gs = 3 THEN 'FastAPI routes nedir?'
				WHEN gs = 4 THEN 'Pydantic models nedir?'
				WHEN gs = 5 THEN 'Django models nedir?'
				WHEN gs = 6 THEN 'Django views nedir?'
				WHEN gs = 7 THEN 'Dependency injection nedir?'
				WHEN gs = 8 THEN 'FastAPI vs Django farkı nedir?'
				WHEN gs = 9 THEN 'Framework patterns nelerdir?'
				WHEN gs = 10 THEN 'Framework best practices nelerdir?'
				ELSE FORMAT('FastAPI/Django hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'frameworks',
			'explanation', 'FastAPI/Django hakkında bilgi testi'
		)
	),
	70,
	'frameworks',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 9: Database Integration Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod09-test-%02s', gs),
	'course-python-apis',
	FORMAT('9. Database Integration Testleri - Test %s', gs),
	'Python database integration hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod09-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Database integration nedir?'
				WHEN gs = 2 THEN 'ORM nedir?'
				WHEN gs = 3 THEN 'SQLAlchemy nedir?'
				WHEN gs = 4 THEN 'Django ORM nedir?'
				WHEN gs = 5 THEN 'Database migrations nedir?'
				WHEN gs = 6 THEN 'Query optimization nedir?'
				WHEN gs = 7 THEN 'Connection pooling nedir?'
				WHEN gs = 8 THEN 'Database testing nedir?'
				WHEN gs = 9 THEN 'NoSQL databases nedir?'
				WHEN gs = 10 THEN 'Database best practices nelerdir?'
				ELSE FORMAT('Database Integration hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'database',
			'explanation', 'Database Integration hakkında bilgi testi'
		)
	),
	70,
	'database',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 10: API Development Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod10-test-%02s', gs),
	'course-python-apis',
	FORMAT('10. API Development Testleri - Test %s', gs),
	'Python API development hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod10-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'RESTful API nedir?'
				WHEN gs = 2 THEN 'HTTP methods nedir?'
				WHEN gs = 3 THEN 'API endpoints nedir?'
				WHEN gs = 4 THEN 'API authentication nedir?'
				WHEN gs = 5 THEN 'API documentation nedir?'
				WHEN gs = 6 THEN 'API versioning nedir?'
				WHEN gs = 7 THEN 'Error handling in APIs nedir?'
				WHEN gs = 8 THEN 'Rate limiting nedir?'
				WHEN gs = 9 THEN 'CORS nedir?'
				WHEN gs = 10 THEN 'API best practices nelerdir?'
				ELSE FORMAT('API Development hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'api',
			'explanation', 'API Development hakkında bilgi testi'
		)
	),
	70,
	'api-development',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 11: Testing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod11-test-%02s', gs),
	'course-python-apis',
	FORMAT('11. Testing Testleri - Test %s', gs),
	'Python testing hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod11-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Testing nedir?'
				WHEN gs = 2 THEN 'unittest nedir?'
				WHEN gs = 3 THEN 'pytest nedir?'
				WHEN gs = 4 THEN 'Test fixtures nedir?'
				WHEN gs = 5 THEN 'Mocking nedir?'
				WHEN gs = 6 THEN 'Test coverage nedir?'
				WHEN gs = 7 THEN 'Integration testing nedir?'
				WHEN gs = 8 THEN 'TDD nedir?'
				WHEN gs = 9 THEN 'Testing patterns nelerdir?'
				WHEN gs = 10 THEN 'Testing best practices nelerdir?'
				ELSE FORMAT('Testing hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'testing',
			'explanation', 'Testing hakkında bilgi testi'
		)
	),
	70,
	'testing',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 12: Async Programming Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod12-test-%02s', gs),
	'course-python-apis',
	FORMAT('12. Async Programming Testleri - Test %s', gs),
	'Python async programming hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod12-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Async programming nedir?'
				WHEN gs = 2 THEN 'asyncio nedir?'
				WHEN gs = 3 THEN 'async/await nedir?'
				WHEN gs = 4 THEN 'Coroutines nedir?'
				WHEN gs = 5 THEN 'Event loop nedir?'
				WHEN gs = 6 THEN 'Tasks nedir?'
				WHEN gs = 7 THEN 'Futures nedir?'
				WHEN gs = 8 THEN 'Async context managers nedir?'
				WHEN gs = 9 THEN 'Async patterns nelerdir?'
				WHEN gs = 10 THEN 'Async best practices nelerdir?'
				ELSE FORMAT('Async Programming hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'async',
			'explanation', 'Async Programming hakkında bilgi testi'
		)
	),
	70,
	'async-programming',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 13: Performance Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod13-test-%02s', gs),
	'course-python-apis',
	FORMAT('13. Performance Testleri - Test %s', gs),
	'Python performans optimizasyonu hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod13-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Performance nedir?'
				WHEN gs = 2 THEN 'Performance profiling nedir?'
				WHEN gs = 3 THEN 'cProfile nedir?'
				WHEN gs = 4 THEN 'Memory profiling nedir?'
				WHEN gs = 5 THEN 'Code optimization nedir?'
				WHEN gs = 6 THEN 'Caching strategies nedir?'
				WHEN gs = 7 THEN 'Query optimization nedir?'
				WHEN gs = 8 THEN 'Concurrency nedir?'
				WHEN gs = 9 THEN 'Performance metrics nedir?'
				WHEN gs = 10 THEN 'Performance best practices nelerdir?'
				ELSE FORMAT('Performance hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'performance',
			'explanation', 'Performance hakkında bilgi testi'
		)
	),
	70,
	'performance',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 14: Deployment Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod14-test-%02s', gs),
	'course-python-apis',
	FORMAT('14. Deployment Testleri - Test %s', gs),
	'Python uygulamalarının deployment süreçleri hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod14-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Deployment nedir?'
				WHEN gs = 2 THEN 'WSGI nedir?'
				WHEN gs = 3 THEN 'ASGI nedir?'
				WHEN gs = 4 THEN 'Gunicorn nedir?'
				WHEN gs = 5 THEN 'Docker nedir?'
				WHEN gs = 6 THEN 'CI/CD nedir?'
				WHEN gs = 7 THEN 'Cloud deployment nedir?'
				WHEN gs = 8 THEN 'Serverless nedir?'
				WHEN gs = 9 THEN 'Monitoring nedir?'
				WHEN gs = 10 THEN 'Deployment best practices nelerdir?'
				ELSE FORMAT('Deployment hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'deployment',
			'explanation', 'Deployment hakkında bilgi testi'
		)
	),
	70,
	'deployment',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 15: Advanced Topics Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-mod15-test-%02s', gs),
	'course-python-apis',
	FORMAT('15. Advanced Topics Testleri - Test %s', gs),
	'İleri seviye Python konuları hakkında bilgi testi.',
	'Python',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-python-mod15-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Generators nedir?'
				WHEN gs = 2 THEN 'Iterators nedir?'
				WHEN gs = 3 THEN 'Metaclasses nedir?'
				WHEN gs = 4 THEN 'Descriptors nedir?'
				WHEN gs = 5 THEN 'Type hints nedir?'
				WHEN gs = 6 THEN 'Multithreading nedir?'
				WHEN gs = 7 THEN 'Multiprocessing nedir?'
				WHEN gs = 8 THEN 'Design patterns nelerdir?'
				WHEN gs = 9 THEN 'Package development nedir?'
				WHEN gs = 10 THEN 'Advanced topics best practices nelerdir?'
				ELSE FORMAT('Advanced Topics hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'advanced',
			'explanation', 'Advanced Topics hakkında bilgi testi'
		)
	),
	70,
	'advanced-topics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;
