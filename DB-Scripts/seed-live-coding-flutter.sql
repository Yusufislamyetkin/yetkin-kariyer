-- Flutter Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-live-%03s', gs),
	'course-flutter-roadmap',
	FORMAT('Flutter Live Coding #%s', gs),
	'Widget ve state yönetimi odaklı canlı kodlama.',
	'Flutter',
	'LIVE_CODING',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('lc-flutter-%03s', gs),
			'challenge', FORMAT('Widget ve navigation akışını kur: #%s', gs),
			'difficulty', CASE WHEN gs <= 33 THEN 'easy' WHEN gs <= 66 THEN 'medium' ELSE 'hard' END,
			'tags', jsonb_build_array('flutter','widget','state'),
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

