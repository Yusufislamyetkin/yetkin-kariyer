-- React Bugfix Seed
-- Bugfix challenges for React course
BEGIN;

-- BUG_FIX quizzes (100 challenges)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-bug-%03s', gs),
	'course-react-roadmap',
	FORMAT('React Bug Fix #%s', gs),
	'Render ve state hatalarını gider.',
	'React.js',
	'BUG_FIX',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('bf-react-%03s', gs),
			'scenario', FORMAT('Re-render döngüsünü kır ve performansı düzelt: #%s', gs),
			'givenCode', '/* component code with useEffect dependency issue */',
			'failingTests', jsonb_build_array('should-not-re-render-infinitely','should-keep-state-consistent'),
			'hint', 'Dependency array ve memoization kontrol et',
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

