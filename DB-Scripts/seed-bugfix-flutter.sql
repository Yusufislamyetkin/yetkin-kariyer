-- Flutter Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-bug-%03s', gs),
	'course-flutter-roadmap',
	FORMAT('Flutter Bug Fix #%s', gs),
	'Widget lifecycle ve state hatalarını düzelt.',
	'Flutter',
	'BUG_FIX',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('bf-flutter-%03s', gs),
			'scenario', FORMAT('setState yanlış kullanımı ve memory leak: #%s', gs),
			'givenCode', '// sample StatefulWidget with setState misuse',
			'failingTests', jsonb_build_array('should-not-leak','should-update-ui-once'),
			'hint', 'dispose ve state yönetimini gözden geçir',
			'weight', 50
		)
	),
	75,
	NULL::text,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 100) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

