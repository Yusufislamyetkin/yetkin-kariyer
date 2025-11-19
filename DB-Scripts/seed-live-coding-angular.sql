-- Angular Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-angular-live-%03s', gs),'course-angular-roadmap',FORMAT('Angular Live Coding #%s', gs),'Angular component/service odaklı canlı kodlama.','Angular','LIVE_CODING','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('lc-angular-%03s',gs),'challenge',FORMAT('Component ve service yaz: #%s',gs),'difficulty',CASE WHEN gs<=33 THEN 'easy' WHEN gs<=66 THEN 'medium' ELSE 'hard' END,'tags',jsonb_build_array('angular','component','service'),'weight',50)),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

