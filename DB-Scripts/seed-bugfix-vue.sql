-- Vue Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-vue-bug-%03s', gs),'course-vue-roadmap',FORMAT('Vue Bug Fix #%s', gs),'Reactivity ve watcher hatalarını düzelt.','Vue.js','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-vue-%03s',gs),'scenario',FORMAT('Reactive state güncellenmiyor: #%s',gs),'givenCode','// shallow vs reactive mismatch','failingTests',jsonb_build_array('should-update-reactively'),'hint','toRef/toRefs ve reactive kullanımını düzelt','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

