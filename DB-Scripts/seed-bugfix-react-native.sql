-- React Native Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-rn-bug-%03s', gs),'course-react-native',FORMAT('React Native Bug Fix #%s', gs),'RN state ve lifecycle hatalarını düzelt.','React Native','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-rn-%03s',gs),'scenario',FORMAT('FlatList performans problemi: #%s',gs),'givenCode','// missing keyExtractor / memo','failingTests',jsonb_build_array('should-render-performant'),'hint','memoization ve keyExtractor ekle','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

