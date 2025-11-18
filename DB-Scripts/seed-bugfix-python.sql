-- Python Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-python-bug-%03s', gs),
	'course-python-apis',
	FORMAT('Python Bug Fix #%s', gs),
	'Validation, serialization ve test hatalarını düzelt.',
	'Python',
	'BUG_FIX',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('bf-python-%03s', gs),
			'scenario', FORMAT('Pydantic model validation hatası: #%s', gs),
			'givenCode', '# invalid pydantic model / field alias mismatch',
			'failingTests', jsonb_build_array('should-validate','should-serialize'),
			'hint', 'field types ve validators kontrol et',
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

