-- React Native Course Structure Seed
BEGIN;

INSERT INTO "courses" ("id","title","description","category","field","subCategory","expertise","topic","topicContent","difficulty","content","estimatedDuration","createdAt","updatedAt")
VALUES (
	'course-react-native','React Native Mobile Roadmap','React Native ile mobil geliştirme.',
	'software-development','mobile','react-native','mobile','React Native','React Native Roadmap','intermediate',
	$$ {"overview":{"description":"RN components, navigation, native modules","estimatedDurationMinutes":3000},"modules":[
		{"id":"rn-basics","title":"RN Temelleri","summary":"Components ve styling","durationMinutes":230,"objectives":["Components","StyleSheet"],"lessons":[
			{"id":"rn-lesson-01","title":"RN Components","type":"reading","durationMinutes":20,"slug":"rn-components","resources":[]},
			{"id":"rn-lesson-02","title":"Navigation","type":"coding","durationMinutes":40,"slug":"rn-navigation","resources":[]},
			{"id":"rn-lesson-03","title":"StyleSheet","type":"video","durationMinutes":30,"slug":"stylesheet","resources":[]},
			{"id":"rn-lesson-04","title":"Flexbox Layout","type":"coding","durationMinutes":35,"slug":"flexbox","resources":[]},
			{"id":"rn-lesson-05","title":"Touchable Components","type":"reading","durationMinutes":25,"slug":"touchable","resources":[]},
			{"id":"rn-lesson-06","title":"ScrollView ve FlatList","type":"video","durationMinutes":40,"slug":"scrollview-flatlist","resources":[]},
			{"id":"rn-lesson-07","title":"Images","type":"coding","durationMinutes":30,"slug":"images","resources":[]},
			{"id":"rn-lesson-08","title":"Text Input","type":"reading","durationMinutes":25,"slug":"text-input","resources":[]},
			{"id":"rn-lesson-09","title":"Platform Specific","type":"video","durationMinutes":30,"slug":"platform-specific","resources":[]},
			{"id":"rn-lesson-10","title":"AsyncStorage","type":"coding","durationMinutes":35,"slug":"asyncstorage","resources":[]},
			{"id":"rn-lesson-11","title":"Networking","type":"reading","durationMinutes":30,"slug":"networking","resources":[]},
			{"id":"rn-lesson-12","title":"Debugging","type":"video","durationMinutes":25,"slug":"debugging","resources":[]}
		]}]} $$::jsonb,
	3000,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"description" = EXCLUDED."description",
	"content" = EXCLUDED."content",
	"updatedAt" = CURRENT_TIMESTAMP;

COMMIT;

