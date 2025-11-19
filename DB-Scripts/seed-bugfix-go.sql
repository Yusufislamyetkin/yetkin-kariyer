-- Go Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-go-bug-%03s', gs),'course-go-backend',FORMAT('Go Bug Fix #%s', gs),'Goroutine, channel ve race condition hatalarını düzelt.','Go','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-go-%03s',gs),'scenario',FORMAT('Race condition: #%s',gs),'givenCode','// missing mutex','failingTests',jsonb_build_array('should-not-race'),'hint','mutex/atomic kullan','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

