-- Angular Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-angular-bug-%03s', gs),'course-angular-roadmap',FORMAT('Angular Bug Fix #%s', gs),'Change detection ve RxJS hatalarını düzelt.','Angular','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-angular-%03s',gs),'scenario',FORMAT('Zone.js tetiklenmiyor: #%s',gs),'givenCode','// rxjs subscription unutulmuş','failingTests',jsonb_build_array('should-unsubscribe'),'hint','unsubscribe ve async pipe','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

