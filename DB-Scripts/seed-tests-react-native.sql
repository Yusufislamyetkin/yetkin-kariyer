-- React Native Tests Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-rn-test-%03s', gs),'course-react-native',FORMAT('React Native Test #%s', gs),'RN kavramları bilgi testi.','React Native','TEST','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('q-rn-%03s',gs),'question',FORMAT('RN StyleSheet amaçları? (%s)',gs),'options',jsonb_build_array('Performanslı stil','DB şema','CI/CD','Docker'), 'answer',0,'category','style')),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

