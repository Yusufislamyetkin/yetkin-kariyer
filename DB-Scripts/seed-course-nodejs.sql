-- Node.js Course Structure Seed
BEGIN;

INSERT INTO "courses" (
	"id",
	"title",
	"description",
	"category",
	"field",
	"subCategory",
	"expertise",
	"topic",
	"topicContent",
	"difficulty",
	"content",
	"estimatedDuration",
	"createdAt",
	"updatedAt"
)
VALUES (
	'course-node-api',
	'Node.js & Express API Mastery',
	'Node.js ve Express ile üretim seviyesinde REST API geliştirme.',
	'software-development',
	'backend',
	'node',
	'backend',
	'Node.js',
	'Node.js API',
	'intermediate',
	$$
	{
	  "overview": {
	    "description": "Express, auth, logging ve test ile sağlam API mimarisi.",
	    "skills": ["Express", "JWT", "Testing", "Performance"],
	    "estimatedDurationMinutes": 3000
	  },
	  "modules": [
	    {
	      "id":"node-routing",
	      "title":"Routing ve Middleware",
	      "summary":"Express router ve middleware zinciri.",
	      "durationMinutes":210,
	      "objectives":["Router tasarımı","Hata yakalama"],
	      "lessons":[
	        {"id":"node-lesson-01","title":"Router Mimarisi","type":"reading","durationMinutes":25,"slug":"router-architecture","resources":[]},
	        {"id":"node-lesson-02","title":"Middleware Zinciri","type":"coding","durationMinutes":40,"slug":"middleware-chain","resources":[]},
	        {"id":"node-lesson-03","title":"Error Handling","type":"video","durationMinutes":35,"slug":"error-handling","resources":[]},
	        {"id":"node-lesson-04","title":"Request Validation","type":"coding","durationMinutes":30,"slug":"request-validation","resources":[]},
	        {"id":"node-lesson-05","title":"Route Parameters","type":"reading","durationMinutes":20,"slug":"route-params","resources":[]},
	        {"id":"node-lesson-06","title":"Query Parameters","type":"video","durationMinutes":25,"slug":"query-params","resources":[]},
	        {"id":"node-lesson-07","title":"Body Parsing","type":"coding","durationMinutes":30,"slug":"body-parsing","resources":[]},
	        {"id":"node-lesson-08","title":"CORS Configuration","type":"reading","durationMinutes":25,"slug":"cors","resources":[]},
	        {"id":"node-lesson-09","title":"Rate Limiting","type":"coding","durationMinutes":35,"slug":"rate-limiting","resources":[]},
	        {"id":"node-lesson-10","title":"Security Headers","type":"video","durationMinutes":30,"slug":"security-headers","resources":[]},
	        {"id":"node-lesson-11","title":"Middleware Best Practices","type":"reading","durationMinutes":25,"slug":"middleware-best-practices","resources":[]},
	        {"id":"node-lesson-12","title":"Custom Middleware","type":"coding","durationMinutes":40,"slug":"custom-middleware","resources":[]}
	      ]
	    }
	  ]
	}
	$$::jsonb,
	3000,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"description" = EXCLUDED."description",
	"content" = EXCLUDED."content",
	"updatedAt" = CURRENT_TIMESTAMP;

COMMIT;

