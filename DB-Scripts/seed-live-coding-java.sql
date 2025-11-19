-- Java Spring Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-java-live-%03s', gs),'course-java-spring',FORMAT('Java Spring Live Coding #%s', gs),'Controller/service/repository odaklı canlı kodlama.','Java Spring','LIVE_CODING','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('lc-java-%03s',gs),'challenge',FORMAT('REST endpoint ve service yaz: #%s',gs),'difficulty',CASE WHEN gs<=33 THEN 'easy' WHEN gs<=66 THEN 'medium' ELSE 'hard' END,'tags',jsonb_build_array('spring','rest'),'weight',50)),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

