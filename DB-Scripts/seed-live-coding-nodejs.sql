-- Node.js Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-node-live-%03s', gs),
	'course-node-api',
	FORMAT('Node Live Coding #%s', gs),
	'Express ve middleware odaklı canlı kodlama.',
	'Node.js',
	'LIVE_CODING',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('lc-node-%03s', gs),
			'challenge', FORMAT('REST endpoint ve middleware yaz: #%s', gs),
			'difficulty', CASE WHEN gs <= 33 THEN 'easy' WHEN gs <= 66 THEN 'medium' ELSE 'hard' END,
			'tags', jsonb_build_array('node','express','rest'),
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

