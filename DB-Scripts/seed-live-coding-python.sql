-- Python Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-live-%03s', gs),
	'course-python-apis',
	FORMAT('Python Live Coding #%s', gs),
	'FastAPI/Django odaklı canlı kodlama.',
	'Python',
	'LIVE_CODING',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('lc-python-%03s', gs),
			'challenge', FORMAT('API endpoint ve validation yaz: #%s', gs),
			'difficulty', CASE WHEN gs <= 33 THEN 'easy' WHEN gs <= 66 THEN 'medium' ELSE 'hard' END,
			'tags', jsonb_build_array('python','api','validation'),
			'weight', 50
		)
	),
	70,
	NULL::text,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 100) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

