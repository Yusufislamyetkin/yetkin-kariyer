-- Go Tests Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-go-test-%03s', gs),'course-go-backend',FORMAT('Go Test #%s', gs),'Go kavramları bilgi testi.','Go','TEST','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('q-go-%03s',gs),'question',FORMAT('Goroutine nedir? (%s)',gs),'options',jsonb_build_array('Hafif thread','CSS','ORM','Router'), 'answer',0,'category','concurrency')),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

