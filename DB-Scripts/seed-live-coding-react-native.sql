-- React Native Live Coding Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-rn-live-%03s', gs),'course-react-native',FORMAT('React Native Live Coding #%s', gs),'RN component ve navigation odaklı canlı kodlama.','React Native','LIVE_CODING','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('lc-rn-%03s',gs),'challenge',FORMAT('Stack navigator ile ekran akışı: #%s',gs),'difficulty',CASE WHEN gs<=33 THEN 'easy' WHEN gs<=66 THEN 'medium' ELSE 'hard' END,'tags',jsonb_build_array('react-native','navigation'),'weight',50)),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

