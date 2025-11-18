-- Go Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-go-live-%03s', gs),'course-go-backend',FORMAT('Go Live Coding #%s', gs),'HTTP handlers ve middleware odaklı canlı kodlama.','Go','LIVE_CODING','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('lc-go-%03s',gs),'challenge',FORMAT('net/http ile endpoint: #%s',gs),'difficulty',CASE WHEN gs<=33 THEN 'easy' WHEN gs<=66 THEN 'medium' ELSE 'hard' END,'tags',jsonb_build_array('go','http'),'weight',50)),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

