-- Vue.js Course Structure Seed
BEGIN;

INSERT INTO "courses" ("id","title","description","category","field","subCategory","expertise","topic","topicContent","difficulty","content","estimatedDuration","createdAt","updatedAt")
VALUES (
	'course-vue-roadmap','Vue.js Frontend Roadmap','Vue 3 Composition API ile modern geliştirme.',
	'software-development','frontend','vue','frontend','Vue.js','Vue.js Roadmap','intermediate',
	$$ {"overview":{"description":"Composition API, Router, Pinia","estimatedDurationMinutes":3000},"modules":[
		{"id":"vue-basics","title":"Vue Temelleri","summary":"Reactivity ve components","durationMinutes":220,"objectives":["Reactivity","Components"],"lessons":[
			{"id":"vue-lesson-01","title":"Reactivity","type":"reading","durationMinutes":20,"slug":"vue-reactivity","resources":[]},
			{"id":"vue-lesson-02","title":"Composition API","type":"coding","durationMinutes":40,"slug":"vue-composition","resources":[]},
			{"id":"vue-lesson-03","title":"Template Syntax","type":"video","durationMinutes":30,"slug":"template-syntax","resources":[]},
			{"id":"vue-lesson-04","title":"Computed Properties","type":"coding","durationMinutes":35,"slug":"computed","resources":[]},
			{"id":"vue-lesson-05","title":"Watchers","type":"reading","durationMinutes":25,"slug":"watchers","resources":[]},
			{"id":"vue-lesson-06","title":"Lifecycle Hooks","type":"video","durationMinutes":30,"slug":"lifecycle","resources":[]},
			{"id":"vue-lesson-07","title":"Components","type":"coding","durationMinutes":40,"slug":"components","resources":[]},
			{"id":"vue-lesson-08","title":"Props ve Emits","type":"reading","durationMinutes":25,"slug":"props-emits","resources":[]},
			{"id":"vue-lesson-09","title":"Slots","type":"video","durationMinutes":30,"slug":"slots","resources":[]},
			{"id":"vue-lesson-10","title":"Provide/Inject","type":"coding","durationMinutes":35,"slug":"provide-inject","resources":[]},
			{"id":"vue-lesson-11","title":"Vue Router","type":"reading","durationMinutes":30,"slug":"vue-router","resources":[]},
			{"id":"vue-lesson-12","title":"Pinia State","type":"video","durationMinutes":40,"slug":"pinia","resources":[]}
		]}]} $$::jsonb,
	3000,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"description" = EXCLUDED."description",
	"content" = EXCLUDED."content",
	"updatedAt" = CURRENT_TIMESTAMP;

COMMIT;

