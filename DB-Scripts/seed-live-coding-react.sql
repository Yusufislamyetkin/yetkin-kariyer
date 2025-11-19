-- React Live Coding Seed
-- Live coding challenges for React course
BEGIN;

-- LIVE_CODING quizzes (100 challenges)
INSERT INTO "quizzes" (
	"id",
	"courseId",
	"title",
	"description",
	"topic",
	"type",
	"level",
	"questions",
	"passingScore",
	"lessonSlug",
	"createdAt",
	"updatedAt"
)
SELECT
	FORMAT('quiz-react-live-%03s', gs) AS id,
	'course-react-roadmap' AS courseId,
	FORMAT('React Live Coding #%s', gs) AS title,
	'Bileşen ve state odaklı canlı kodlama görevi.' AS description,
	'React.js' AS topic,
	'LIVE_CODING' AS type,
	'intermediate' AS level,
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('lc-react-%03s', gs),
			'challenge', FORMAT('Hooks ve props ile component inşa et: #%s', gs),
			'difficulty', CASE WHEN gs <= 33 THEN 'easy' WHEN gs <= 66 THEN 'medium' ELSE 'hard' END,
			'tags', jsonb_build_array('react','hooks','state'),
			'weight', 50
		)
	) AS questions,
	70 AS passingScore,
	NULL::text AS lessonSlug,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 100) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

