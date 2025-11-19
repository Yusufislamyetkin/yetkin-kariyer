-- Node.js Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-node-bug-%03s', gs),
	'course-node-api',
	FORMAT('Node Bug Fix #%s', gs),
	'Async/await ve middleware hatalarını düzelt.',
	'Node.js',
	'BUG_FIX',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('bf-node-%03s', gs),
			'scenario', FORMAT('Unhandled promise rejection ve error handler eksikliği: #%s', gs),
			'givenCode', '// express handler without try/catch and next(err)',
			'failingTests', jsonb_build_array('should-handle-errors','should-return-500'),
			'hint', 'async error handling ve centralized error middleware ekle',
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

