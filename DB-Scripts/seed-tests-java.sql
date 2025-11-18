-- Java Spring Tests Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-java-test-%03s', gs),'course-java-spring',FORMAT('Java Spring Test #%s', gs),'Spring kavramları bilgi testi.','Java Spring','TEST','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('q-java-%03s',gs),'question',FORMAT('IOC Container ne sağlar? (%s)',gs),'options',jsonb_build_array('Bağımlılık yönetimi','UI','CSS','Docker'), 'answer',0,'category','spring-core')),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

