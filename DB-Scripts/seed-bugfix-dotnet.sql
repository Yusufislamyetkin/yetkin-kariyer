-- .NET Core Bugfix Seed
BEGIN;

INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT FORMAT('quiz-dotnet-bug-%03s', gs),'course-dotnet-roadmap',FORMAT('.NET Bug Fix #%s', gs),'DI ve middleware hatalarını düzelt.','.NET Core','BUG_FIX','intermediate',
	jsonb_build_array(jsonb_build_object('id',FORMAT('bf-dotnet-%03s',gs),'scenario',FORMAT('Scoped service yanlış kullanımı: #%s',gs),'givenCode','// AddScoped yerine AddSingleton','failingTests',jsonb_build_array('should-respect-scope'),'hint','lifecycle düzelt','weight',50)),
	75,NULL::text,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM generate_series(1,100) gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;

