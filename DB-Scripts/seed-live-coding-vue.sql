-- Vue Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-vue-live-%03s', gs),'course-vue-roadmap',FORMAT('Vue Live Coding #%s', gs),'Vue component ve state odaklı canlı kodlama.','Vue.js','LIVE_CODING','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('lc-vue-%03s',gs),'challenge',FORMAT('Composition API ile component yaz: #%s',gs),'difficulty',CASE WHEN gs<=33 THEN 'easy' WHEN gs<=66 THEN 'medium' ELSE 'hard' END,'tags',jsonb_build_array('vue','composition'),'weight',50)),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

