-- Java Spring Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-java-bug-%03s', gs),'course-java-spring',FORMAT('Java Spring Bug Fix #%s', gs),'Transaction ve validation hatalarını düzelt.','Java Spring','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-java-%03s',gs),'scenario',FORMAT('Transactional eksikliği: #%s',gs),'givenCode','// missing @Transactional','failingTests',jsonb_build_array('should-rollback'),'hint','@Transactional ekle','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

