-- Vue Tests Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-vue-test-%03s', gs),'course-vue-roadmap',FORMAT('Vue Test #%s', gs),'Vue kavramları bilgi testi.','Vue.js','TEST','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('q-vue-%03s',gs),'question',FORMAT('Computed ile method farkı nedir? (%s)',gs),'options',jsonb_build_array('Memoize değer','CSS uygular','DB sorgular','Router ekler'), 'answer',0,'category','reactivity')),
	70,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

