-- Java Spring Course Structure Seed
BEGIN;

INSERT INTO "courses" ("id","title","description","category","field","subCategory","expertise","topic","topicContent","difficulty","content","estimatedDuration","createdAt","updatedAt")
VALUES (
	'course-java-spring','Java Spring Boot Backend','Spring Boot ile ölçeklenebilir API geliştirme.',
	'software-development','backend','java','backend','Java Spring','Java Spring Roadmap','intermediate',
	$$ {"overview":{"description":"REST, Security, Data JPA, Testing","estimatedDurationMinutes":3000},"modules":[
		{"id":"spring-rest","title":"REST ve Controller","summary":"Spring MVC","durationMinutes":260,"objectives":["Controller","Service"],"lessons":[
			{"id":"spring-lesson-01","title":"Spring MVC","type":"reading","durationMinutes":20,"slug":"spring-mvc","resources":[]},
			{"id":"spring-lesson-02","title":"Spring Security","type":"coding","durationMinutes":40,"slug":"spring-security","resources":[]},
			{"id":"spring-lesson-03","title":"REST Controllers","type":"video","durationMinutes":35,"slug":"rest-controllers","resources":[]},
			{"id":"spring-lesson-04","title":"Request Mapping","type":"coding","durationMinutes":30,"slug":"request-mapping","resources":[]},
			{"id":"spring-lesson-05","title":"Path Variables","type":"reading","durationMinutes":25,"slug":"path-variables","resources":[]},
			{"id":"spring-lesson-06","title":"Request Body","type":"video","durationMinutes":30,"slug":"request-body","resources":[]},
			{"id":"spring-lesson-07","title":"Response Entity","type":"coding","durationMinutes":35,"slug":"response-entity","resources":[]},
			{"id":"spring-lesson-08","title":"Exception Handling","type":"reading","durationMinutes":30,"slug":"exception-handling","resources":[]},
			{"id":"spring-lesson-09","title":"Validation","type":"coding","durationMinutes":40,"slug":"validation","resources":[]},
			{"id":"spring-lesson-10","title":"CORS Configuration","type":"video","durationMinutes":25,"slug":"cors","resources":[]},
			{"id":"spring-lesson-11","title":"Content Negotiation","type":"reading","durationMinutes":30,"slug":"content-negotiation","resources":[]},
			{"id":"spring-lesson-12","title":"REST Best Practices","type":"video","durationMinutes":35,"slug":"rest-best-practices","resources":[]}
		]}]} $$::jsonb,
	3000,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"description" = EXCLUDED."description",
	"content" = EXCLUDED."content",
	"updatedAt" = CURRENT_TIMESTAMP;

COMMIT;

