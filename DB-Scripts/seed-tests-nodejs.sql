-- Node.js Tests Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-node-test-%03s', gs),
	'course-node-api',
	FORMAT('Node Test #%s', gs),
	'Node/Express konseptleri için bilgi testi.',
	'Node.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-node-%03s', gs),
			'question', FORMAT('Express middleware sırası neden önemlidir? (%s)', gs),
			'options', jsonb_build_array('Doğru akış ve hata yakalama','Performans otomatik artışı','Veritabanı şeması oluşturma','UI render etme'),
			'answer', 0,
			'category', 'middleware'
		)
	),
	70,
	NULL::text,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 100) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

