-- Flutter Tests Seed
-- Course ile aynı 15 modül yapısı, her modülde 10+ test içeriği
BEGIN;

-- Modül 1: Flutter Tanıyalım Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod01-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('1. Flutter Tanıyalım Testleri - Test %s', gs),
	'Flutter ekosistemi ve temel kavramlar hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod01-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Flutter nedir?'
				WHEN gs = 2 THEN 'Flutter''ın temel avantajları nelerdir?'
				WHEN gs = 3 THEN 'Dart nedir?'
				WHEN gs = 4 THEN 'Flutter vs React Native farkı nedir?'
				WHEN gs = 5 THEN 'Widget nedir?'
				WHEN gs = 6 THEN 'Hot Reload nedir?'
				WHEN gs = 7 THEN 'Flutter SDK nedir?'
				WHEN gs = 8 THEN 'Flutter CLI nedir?'
				WHEN gs = 9 THEN 'Flutter DevTools nedir?'
				WHEN gs = 10 THEN 'Flutter architecture nedir?'
				ELSE FORMAT('Flutter temel kavramları hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Google''ın cross-platform UI framework''ü, Dart ile, native performance','Sadece bir web framework','Sadece bir backend framework','Sadece bir database')
				WHEN gs = 2 THEN jsonb_build_array('Single codebase, native performance, hot reload, rich widgets','Sadece hızlı olması','Sadece küçük projeler için','Sadece web için')
				WHEN gs = 3 THEN jsonb_build_array('Flutter''ın kullandığı programlama dili, object-oriented, null safety','Sadece bir framework','Sadece bir library','Sadece bir tool')
				WHEN gs = 4 THEN jsonb_build_array('Flutter native performance, React Native bridge; Flutter compiled, RN interpreted','Hiçbir fark yok','Flutter sadece web için','React Native sadece mobil için')
				WHEN gs = 5 THEN jsonb_build_array('UI element''leri, her şey widget, composition pattern','Sadece bir component','Sadece bir class','Sadece bir function')
				WHEN gs = 6 THEN jsonb_build_array('Kod değişikliklerini anında görme, state korunur, hızlı development','Sadece bir build tool','Sadece bir debug tool','Sadece bir test tool')
				WHEN gs = 7 THEN jsonb_build_array('Flutter development kit, tools, libraries, framework','Sadece bir IDE','Sadece bir language','Sadece bir package')
				WHEN gs = 8 THEN jsonb_build_array('Command-line interface, flutter create, flutter run, flutter build','Sadece bir text editor','Sadece bir package manager','Sadece bir deployment tool')
				WHEN gs = 9 THEN jsonb_build_array('Flutter uygulamalarını debug etmek için tool suite, performance, memory','Sadece bir text editor','Sadece bir package manager','Sadece bir build tool')
				WHEN gs = 10 THEN jsonb_build_array('Widget-based, reactive, declarative, composition over inheritance','Sadece MVC pattern','Sadece MVVM pattern','Sadece no architecture')
				WHEN gs = 11 THEN jsonb_build_array('Flutter''da Skia rendering engine, custom rendering, no DOM','Sadece DOM rendering','Sadece native rendering','Sadece no rendering')
				WHEN gs = 12 THEN jsonb_build_array('Flutter''da JIT ve AOT compilation, development ve production','Sadece JIT','Sadece AOT','Sadece no compilation')
				WHEN gs = 13 THEN jsonb_build_array('Flutter''da widget tree, element tree, render tree','Sadece single tree','Sadece no tree','Sadece manual tree')
				WHEN gs = 14 THEN jsonb_build_array('Flutter''da platform channels, native code integration','Sadece Dart only','Sadece no native','Sadece manual integration')
				ELSE jsonb_build_array('Flutter temel kavramları ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'basics',
			'explanation', 'Flutter temel kavramları hakkında bilgi testi'
		)
	),
	70,
	'flutter-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 2: Dart Temelleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod02-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('2. Dart Temelleri Testleri - Test %s', gs),
	'Dart programlama dili hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod02-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Dart nedir?'
				WHEN gs = 2 THEN 'Dart syntax nedir?'
				WHEN gs = 3 THEN 'Classes nedir?'
				WHEN gs = 4 THEN 'Mixins nedir?'
				WHEN gs = 5 THEN 'Generics nedir?'
				WHEN gs = 6 THEN 'Async/await nedir?'
				WHEN gs = 7 THEN 'Futures nedir?'
				WHEN gs = 8 THEN 'Streams nedir?'
				WHEN gs = 9 THEN 'Null safety nedir?'
				WHEN gs = 10 THEN 'Dart best practices nelerdir?'
				ELSE FORMAT('Dart hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Google''ın programlama dili, object-oriented, Flutter için','Sadece bir framework','Sadece bir library','Sadece bir tool')
				WHEN gs = 2 THEN jsonb_build_array('JavaScript benzeri syntax, C-style, semicolon optional','Sadece Python syntax','Sadece Java syntax','Sadece no syntax')
				WHEN gs = 3 THEN jsonb_build_array('OOP class yapısı, inheritance, encapsulation, polymorphism','Sadece bir function','Sadece bir variable','Sadece bir type')
				WHEN gs = 4 THEN jsonb_build_array('Multiple inheritance benzeri, with keyword, code reuse','Sadece single inheritance','Sadece no inheritance','Sadece manual inheritance')
				WHEN gs = 5 THEN jsonb_build_array('Reusable type parameters, <T> syntax, type flexibility','Sadece bir type','Sadece bir interface','Sadece bir class')
				WHEN gs = 6 THEN jsonb_build_array('Asenkron kod yazma, await keyword, Future handling','Sadece sync code','Sadece callbacks','Sadece promises')
				WHEN gs = 7 THEN jsonb_build_array('Asenkron işlem sonucu, Future<T>, async operations','Sadece Promise','Sadece callback','Sadece event')
				WHEN gs = 8 THEN jsonb_build_array('Asenkron veri stream''leri, Stream<T>, continuous data','Sadece Future','Sadece callback','Sadece event')
				WHEN gs = 9 THEN jsonb_build_array('Null değerlerin compile-time kontrolü, null safety, ? operator','Sadece runtime check','Sadece no check','Sadece manual check')
				WHEN gs = 10 THEN jsonb_build_array('Null safety kullanmak, explicit types, const constructors','Sadece no null safety','Sadece implicit types','Sadece no const')
				WHEN gs = 11 THEN jsonb_build_array('Dart''ta final ve const, immutability, compile-time constants','Sadece var','Sadece dynamic','Sadece no const')
				WHEN gs = 12 THEN jsonb_build_array('Dart''ta named parameters, optional parameters, {} syntax','Sadece positional only','Sadece no parameters','Sadece manual parameters')
				WHEN gs = 13 THEN jsonb_build_array('Dart''ta cascade operator, .. syntax, method chaining','Sadece . operator','Sadece no chaining','Sadece manual chaining')
				WHEN gs = 14 THEN jsonb_build_array('Dart''ta extension methods, adding methods to existing types','Sadece no extensions','Sadece inheritance only','Sadece manual methods')
				ELSE jsonb_build_array('Dart ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'dart',
			'explanation', 'Dart hakkında bilgi testi'
		)
	),
	70,
	'dart',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 3: Widget Temelleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod03-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('3. Widget Temelleri Testleri - Test %s', gs),
	'Flutter widgets hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod03-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Widget nedir?'
				WHEN gs = 2 THEN 'Widget tree nedir?'
				WHEN gs = 3 THEN 'Stateless widget nedir?'
				WHEN gs = 4 THEN 'Stateful widget nedir?'
				WHEN gs = 5 THEN 'Widget lifecycle nedir?'
				WHEN gs = 6 THEN 'setState nedir?'
				WHEN gs = 7 THEN 'Widget composition nedir?'
				WHEN gs = 8 THEN 'Widget keys nedir?'
				WHEN gs = 9 THEN 'Widget performance nedir?'
				WHEN gs = 10 THEN 'Widget best practices nelerdir?'
				ELSE FORMAT('Widgets hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('UI element''leri, her şey widget, immutable, build method','Sadece bir component','Sadece bir class','Sadece bir function')
				WHEN gs = 2 THEN jsonb_build_array('Widget''ların hiyerarşik yapısı, parent-child relationships','Sadece bir list','Sadece bir array','Sadece bir map')
				WHEN gs = 3 THEN jsonb_build_array('State''i olmayan widget, immutable, build method only','Sadece stateful widget','Sadece stateful component','Sadece stateful class')
				WHEN gs = 4 THEN jsonb_build_array('State''i olan widget, setState ile güncellenir, mutable state','Sadece stateless widget','Sadece stateless component','Sadece stateless class')
				WHEN gs = 5 THEN jsonb_build_array('initState, build, didUpdateWidget, dispose, lifecycle methods','Sadece build method','Sadece no lifecycle','Sadece manual lifecycle')
				WHEN gs = 6 THEN jsonb_build_array('State güncelleme method''u, rebuild tetikler, setState(() {})','Sadece state assignment','Sadece no update','Sadece manual update')
				WHEN gs = 7 THEN jsonb_build_array('Widget''ları birleştirerek karmaşık UI oluşturma, composition','Sadece inheritance','Sadece no composition','Sadece manual composition')
				WHEN gs = 8 THEN jsonb_build_array('Widget identity, rebuild optimization, Key class','Sadece no keys','Sadece manual keys','Sadece random keys')
				WHEN gs = 9 THEN jsonb_build_array('Widget rebuild optimization, const constructors, keys','Sadece always rebuild','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 10 THEN jsonb_build_array('Const widgets kullanmak, keys kullanmak, widget extraction','Sadece no const','Sadece no keys','Sadece no extraction')
				WHEN gs = 11 THEN jsonb_build_array('Widget''ları küçük tutmak, single responsibility, reusability','Sadece büyük widgets','Sadece monolithic structure','Sadece no structure')
				WHEN gs = 12 THEN jsonb_build_array('Widget''ları test etmek, widget testing, unit testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 13 THEN jsonb_build_array('Widget''ları organize etmek, folder structure, feature widgets','Sadece single file','Sadece no organization','Sadece random structure')
				WHEN gs = 14 THEN jsonb_build_array('Widget''ları optimize etmek, const, keys, rebuild minimization','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				ELSE jsonb_build_array('Widgets ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'widgets',
			'explanation', 'Widgets hakkında bilgi testi'
		)
	),
	70,
	'widgets',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 4: Layout ve Styling Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod04-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('4. Layout ve Styling Testleri - Test %s', gs),
	'Flutter layout ve styling hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod04-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Layout nedir?'
				WHEN gs = 2 THEN 'Row ve Column nedir?'
				WHEN gs = 3 THEN 'Stack nedir?'
				WHEN gs = 4 THEN 'ListView nedir?'
				WHEN gs = 5 THEN 'GridView nedir?'
				WHEN gs = 6 THEN 'Material Design nedir?'
				WHEN gs = 7 THEN 'Theming nedir?'
				WHEN gs = 8 THEN 'Responsive design nedir?'
				WHEN gs = 9 THEN 'Constraints nedir?'
				WHEN gs = 10 THEN 'Layout best practices nelerdir?'
				ELSE FORMAT('Layout ve Styling hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Widget''ların konumlandırılması, layout widgets, constraints','Sadece styling','Sadece no layout','Sadece manual layout')
				WHEN gs = 2 THEN jsonb_build_array('Yatay (Row) ve dikey (Column) layout widgets, Flex widgets','Sadece Stack','Sadece Container','Sadece SizedBox')
				WHEN gs = 3 THEN jsonb_build_array('Widget''ları üst üste yerleştirme, Positioned widget, z-index','Sadece Row','Sadece Column','Sadece Container')
				WHEN gs = 4 THEN jsonb_build_array('Scrollable liste widget, ListView.builder, lazy loading','Sadece Column','Sadece Row','Sadece Stack')
				WHEN gs = 5 THEN jsonb_build_array('Grid layout widget, GridView.builder, crossAxisCount','Sadece ListView','Sadece Column','Sadece Row')
				WHEN gs = 6 THEN jsonb_build_array('Google''ın design language, Material widgets, MaterialApp','Sadece Cupertino','Sadece custom design','Sadece no design')
				WHEN gs = 7 THEN jsonb_build_array('Uygulama teması, ThemeData, dark/light mode, colors','Sadece hard-coded colors','Sadece no theme','Sadece manual theme')
				WHEN gs = 8 THEN jsonb_build_array('Farklı ekran boyutlarına uyum, MediaQuery, LayoutBuilder','Sadece fixed size','Sadece desktop only','Sadece mobile only')
				WHEN gs = 9 THEN jsonb_build_array('Widget size constraints, BoxConstraints, min/max width/height','Sadece no constraints','Sadece manual constraints','Sadece fixed constraints')
				WHEN gs = 10 THEN jsonb_build_array('Responsive design, constraints kullanmak, MediaQuery','Sadece fixed layout','Sadece no responsive','Sadece manual layout')
				WHEN gs = 11 THEN jsonb_build_array('Layout performance, const widgets, avoid unnecessary rebuilds','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 12 THEN jsonb_build_array('Layout debugging, Flutter Inspector, layout overflow','Sadece no debugging','Sadece manual debugging','Sadece console.log')
				WHEN gs = 13 THEN jsonb_build_array('Layout organization, reusable layout widgets, composition','Sadece single layout','Sadece no organization','Sadece random structure')
				WHEN gs = 14 THEN jsonb_build_array('Layout testing, widget testing, layout interaction test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Layout ve Styling ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'layout',
			'explanation', 'Layout ve Styling hakkında bilgi testi'
		)
	),
	70,
	'layout',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 5: State Management Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod05-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('5. State Management Testleri - Test %s', gs),
	'Flutter state management hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod05-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'State management nedir?'
				WHEN gs = 2 THEN 'Provider nedir?'
				WHEN gs = 3 THEN 'Bloc pattern nedir?'
				WHEN gs = 4 THEN 'Riverpod nedir?'
				WHEN gs = 5 THEN 'GetX nedir?'
				WHEN gs = 6 THEN 'Global state nedir?'
				WHEN gs = 7 THEN 'State persistence nedir?'
				WHEN gs = 8 THEN 'State patterns nelerdir?'
				WHEN gs = 9 THEN 'State management karşılaştırması nedir?'
				WHEN gs = 10 THEN 'State management best practices nelerdir?'
				ELSE FORMAT('State Management hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Uygulama state''ini yönetme, local ve global state, reactive updates','Sadece local state','Sadece component state','Sadece no state')
				WHEN gs = 2 THEN jsonb_build_array('Popular state management package, ChangeNotifier, Provider widget','Sadece setState','Sadece Bloc','Sadece GetX')
				WHEN gs = 3 THEN jsonb_build_array('Business Logic Component pattern, events, states, bloc library','Sadece Provider','Sadece setState','Sadece GetX')
				WHEN gs = 4 THEN jsonb_build_array('Provider''ın geliştirilmiş versiyonu, compile-time safety, Riverpod','Sadece Provider','Sadece Bloc','Sadece GetX')
				WHEN gs = 5 THEN jsonb_build_array('All-in-one solution, state, routing, dependency injection, GetX','Sadece Provider','Sadece Bloc','Sadece Riverpod')
				WHEN gs = 6 THEN jsonb_build_array('Uygulama genelinde paylaşılan state, Provider, Bloc, GetX','Sadece local state','Sadece component state','Sadece no state')
				WHEN gs = 7 THEN jsonb_build_array('State''i kalıcı hale getirme, SharedPreferences, Hive, SQLite','Sadece memory only','Sadece no persistence','Sadece manual persistence')
				WHEN gs = 8 THEN jsonb_build_array('Provider pattern, Bloc pattern, Redux pattern, MVVM','Sadece no patterns','Sadece single pattern','Sadece random patterns')
				WHEN gs = 9 THEN jsonb_build_array('Provider simple, Bloc complex ama powerful, GetX all-in-one','Hiçbir fark yok','Hepsi aynı','Hepsi farklı ama aynı')
				WHEN gs = 10 THEN jsonb_build_array('State''i normalize etmek, selectors kullanmak, immutable state','Sadece denormalize state','Sadece no selectors','Sadece mutable state')
				WHEN gs = 11 THEN jsonb_build_array('State management testing, mock providers, bloc testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 12 THEN jsonb_build_array('State management organization, feature state, global state','Sadece single state','Sadece no organization','Sadece random structure')
				WHEN gs = 13 THEN jsonb_build_array('State management performance, selectors, rebuild optimization','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 14 THEN jsonb_build_array('State management debugging, DevTools, state inspection','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				ELSE jsonb_build_array('State Management ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'state-mgmt',
			'explanation', 'State Management hakkında bilgi testi'
		)
	),
	70,
	'state-management',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 6: Navigation Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod06-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('6. Navigation Testleri - Test %s', gs),
	'Flutter navigation hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod06-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Navigation nedir?'
				WHEN gs = 2 THEN 'Navigator nedir?'
				WHEN gs = 3 THEN 'Named routes nedir?'
				WHEN gs = 4 THEN 'Route parameters nedir?'
				WHEN gs = 5 THEN 'Navigator 2.0 nedir?'
				WHEN gs = 6 THEN 'go_router nedir?'
				WHEN gs = 7 THEN 'Deep linking nedir?'
				WHEN gs = 8 THEN 'Route guards nedir?'
				WHEN gs = 9 THEN 'Bottom navigation nedir?'
				WHEN gs = 10 THEN 'Navigation best practices nelerdir?'
				ELSE FORMAT('Navigation hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Sayfalar arası geçiş, screen navigation, route management','Sadece bir routing library','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 2 THEN jsonb_build_array('Navigation yönetimi için widget, Navigator.push/pop, route stack','Sadece bir route','Sadece bir screen','Sadece bir page')
				WHEN gs = 3 THEN jsonb_build_array('Route isimlendirme, MaterialApp routes, '/home' gibi','Sadece anonymous routes','Sadece no routes','Sadece manual routes')
				WHEN gs = 4 THEN jsonb_build_array('Route''a parametre geçirme, arguments, ModalRoute settings','Sadece no parameters','Sadece hard-coded','Sadece manual parameters')
				WHEN gs = 5 THEN jsonb_build_array('Yeni navigation API, declarative routing, Router widget','Sadece Navigator 1.0','Sadece no navigation','Sadece manual navigation')
				WHEN gs = 6 THEN jsonb_build_array('Declarative routing package, go_router, URL-based navigation','Sadece Navigator','Sadece no router','Sadece manual router')
				WHEN gs = 7 THEN jsonb_build_array('URL''den uygulama içi sayfaya yönlendirme, deep links','Sadece internal navigation','Sadece no linking','Sadece manual linking')
				WHEN gs = 8 THEN jsonb_build_array('Route erişim kontrolü, authentication check, route protection','Sadece no guards','Sadece manual guards','Sadece no protection')
				WHEN gs = 9 THEN jsonb_build_array('Alt navigasyon bar, BottomNavigationBar, tab navigation','Sadece top navigation','Sadece side navigation','Sadece no navigation')
				WHEN gs = 10 THEN jsonb_build_array('Named routes kullanmak, route guards, deep linking','Sadece anonymous routes','Sadece no guards','Sadece no linking')
				WHEN gs = 11 THEN jsonb_build_array('Navigation stack yönetimi, push/pop, back button handling','Sadece no stack','Sadece manual stack','Sadece no back button')
				WHEN gs = 12 THEN jsonb_build_array('Navigation animation, page transitions, custom transitions','Sadece no animation','Sadece default only','Sadece manual animation')
				WHEN gs = 13 THEN jsonb_build_array('Navigation testing, route testing, navigation flow test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 14 THEN jsonb_build_array('Navigation organization, route organization, feature routes','Sadece single route','Sadece no organization','Sadece random structure')
				ELSE jsonb_build_array('Navigation ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'navigation',
			'explanation', 'Navigation hakkında bilgi testi'
		)
	),
	70,
	'navigation',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 7: Forms ve Input Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod07-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('7. Forms ve Input Testleri - Test %s', gs),
	'Flutter forms hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod07-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Form handling nedir?'
				WHEN gs = 2 THEN 'TextFormField nedir?'
				WHEN gs = 3 THEN 'Form validation nedir?'
				WHEN gs = 4 THEN 'FormField nedir?'
				WHEN gs = 5 THEN 'Custom validators nedir?'
				WHEN gs = 6 THEN 'Checkbox nedir?'
				WHEN gs = 7 THEN 'Radio buttons nedir?'
				WHEN gs = 8 THEN 'Date picker nedir?'
				WHEN gs = 9 THEN 'File picker nedir?'
				WHEN gs = 10 THEN 'Form best practices nelerdir?'
				ELSE FORMAT('Forms ve Input hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Form verilerini yönetme, Form widget, GlobalKey<FormState>','Sadece no form','Sadece manual form','Sadece server-side only')
				WHEN gs = 2 THEN jsonb_build_array('Text input field, validation, decoration, TextFormField widget','Sadece TextField','Sadece no field','Sadece manual field')
				WHEN gs = 3 THEN jsonb_build_array('Form verilerinin doğruluğunu kontrol etme, validators, error messages','Sadece no validation','Sadece manual check','Sadece server-side only')
				WHEN gs = 4 THEN jsonb_build_array('Generic form field, FormField<T>, custom form fields','Sadece TextFormField only','Sadece no form fields','Sadece manual fields')
				WHEN gs = 5 THEN jsonb_build_array('Kendi validator fonksiyonlarınızı oluşturma, String? Function(String?)','Sadece built-in validators','Sadece no validators','Sadece manual validation')
				WHEN gs = 6 THEN jsonb_build_array('Checkbox widget, bool value, Checkbox widget','Sadece Radio','Sadece Switch','Sadece no checkbox')
				WHEN gs = 7 THEN jsonb_build_array('Radio button widget, single selection, Radio widget','Sadece Checkbox','Sadece Switch','Sadece no radio')
				WHEN gs = 8 THEN jsonb_build_array('Tarih seçme widget, showDatePicker, DatePickerDialog','Sadece manual date','Sadece no date picker','Sadece text input')
				WHEN gs = 9 THEN jsonb_build_array('Dosya seçme widget, file_picker package, FilePicker','Sadece manual file','Sadece no file picker','Sadece text input')
				WHEN gs = 10 THEN jsonb_build_array('Form validation, error handling, user feedback, accessibility','Sadece no validation','Sadece no error handling','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('Form state management, FormState, save, validate methods','Sadece no state','Sadece manual state','Sadece server state')
				WHEN gs = 12 THEN jsonb_build_array('Form submission handling, onSaved, form submission','Sadece no submission','Sadece manual submission','Sadece no handling')
				WHEN gs = 13 THEN jsonb_build_array('Form field dependencies, conditional validation, cross-field','Sadece independent fields','Sadece no dependencies','Sadece manual handling')
				WHEN gs = 14 THEN jsonb_build_array('Form testing, widget testing, form interaction test, validation test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Forms ve Input ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'forms',
			'explanation', 'Forms ve Input hakkında bilgi testi'
		)
	),
	70,
	'forms',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 8: Networking Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod08-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('8. Networking Testleri - Test %s', gs),
	'Flutter networking hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod08-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Networking nedir?'
				WHEN gs = 2 THEN 'http package nedir?'
				WHEN gs = 3 THEN 'Dio package nedir?'
				WHEN gs = 4 THEN 'GET request nedir?'
				WHEN gs = 5 THEN 'POST request nedir?'
				WHEN gs = 6 THEN 'Error handling nedir?'
				WHEN gs = 7 THEN 'JSON serialization nedir?'
				WHEN gs = 8 THEN 'Caching strategies nedir?'
				WHEN gs = 9 THEN 'Offline support nedir?'
				WHEN gs = 10 THEN 'Networking best practices nelerdir?'
				ELSE FORMAT('Networking hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('HTTP istekleri, API çağrıları, server communication','Sadece local storage','Sadece no networking','Sadece manual networking')
				WHEN gs = 2 THEN jsonb_build_array('Dart HTTP client package, http.get, http.post, basic HTTP','Sadece Dio','Sadece no package','Sadece manual HTTP')
				WHEN gs = 3 THEN jsonb_build_array('Advanced HTTP client, interceptors, cancel token, Dio package','Sadece http package','Sadece no package','Sadece manual HTTP')
				WHEN gs = 4 THEN jsonb_build_array('Veri çekme isteği, http.get(url), Future<Response>','Sadece POST','Sadece PUT','Sadece DELETE')
				WHEN gs = 5 THEN jsonb_build_array('Veri gönderme isteği, http.post(url, body), Future<Response>','Sadece GET','Sadece PUT','Sadece DELETE')
				WHEN gs = 6 THEN jsonb_build_array('HTTP hatalarını yönetme, try-catch, error handling','Sadece no error handling','Sadece manual handling','Sadece console.error')
				WHEN gs = 7 THEN jsonb_build_array('JSON veri dönüşümü, jsonEncode, jsonDecode, json_serializable','Sadece manual serialization','Sadece no serialization','Sadece string only')
				WHEN gs = 8 THEN jsonb_build_array('Response caching, cache headers, local caching, dio_cache_interceptor','Sadece no caching','Sadece manual caching','Sadece server caching')
				WHEN gs = 9 THEN jsonb_build_array('İnternet olmadan çalışma, local storage, sync when online','Sadece online only','Sadece no offline','Sadece manual offline')
				WHEN gs = 10 THEN jsonb_build_array('Error handling, retry logic, timeout, interceptors','Sadece basic requests','Sadece no error handling','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('HTTP request cancellation, cancel token, Dio cancel token','Sadece her zaman request','Sadece no cancellation','Sadece manual cancellation')
				WHEN gs = 12 THEN jsonb_build_array('HTTP authentication, token management, interceptors','Sadece no auth','Sadece basic auth','Sadece manual auth')
				WHEN gs = 13 THEN jsonb_build_array('HTTP testing, mock HTTP, http_mock_adapter, test responses','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 14 THEN jsonb_build_array('HTTP performance, connection pooling, request batching','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				ELSE jsonb_build_array('Networking ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'networking',
			'explanation', 'Networking hakkında bilgi testi'
		)
	),
	70,
	'networking',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 9: Local Storage Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod09-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('9. Local Storage Testleri - Test %s', gs),
	'Flutter local storage hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod09-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Local storage nedir?'
				WHEN gs = 2 THEN 'SharedPreferences nedir?'
				WHEN gs = 3 THEN 'SQLite nedir?'
				WHEN gs = 4 THEN 'sqflite nedir?'
				WHEN gs = 5 THEN 'Hive nedir?'
				WHEN gs = 6 THEN 'File storage nedir?'
				WHEN gs = 7 THEN 'Data encryption nedir?'
				WHEN gs = 8 THEN 'Data migration nedir?'
				WHEN gs = 9 THEN 'Storage patterns nelerdir?'
				WHEN gs = 10 THEN 'Storage best practices nelerdir?'
				ELSE FORMAT('Local Storage hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Cihazda veri saklama, local database, file system','Sadece cloud storage','Sadece no storage','Sadece manual storage')
				WHEN gs = 2 THEN jsonb_build_array('Key-value storage, SharedPreferences, simple data','Sadece SQLite','Sadece Hive','Sadece no storage')
				WHEN gs = 3 THEN jsonb_build_array('Relational database, SQL queries, sqflite package','Sadece SharedPreferences','Sadece Hive','Sadece no database')
				WHEN gs = 4 THEN jsonb_build_array('SQLite Flutter package, sqflite, database operations','Sadece SharedPreferences','Sadece Hive','Sadece no package')
				WHEN gs = 5 THEN jsonb_build_array('Lightweight NoSQL database, Hive, fast key-value storage','Sadece SharedPreferences','Sadece SQLite','Sadece no storage')
				WHEN gs = 6 THEN jsonb_build_array('File system storage, path_provider, File API','Sadece database only','Sadece no file storage','Sadece manual file')
				WHEN gs = 7 THEN jsonb_build_array('Veri şifreleme, encryption, sensitive data protection','Sadece no encryption','Sadece plain text','Sadece manual encryption')
				WHEN gs = 8 THEN jsonb_build_array('Database schema değişiklikleri, migration, version upgrade','Sadece no migration','Sadece manual migration','Sadece no version')
				WHEN gs = 9 THEN jsonb_build_array('Repository pattern, data access layer, abstraction','Sadece no patterns','Sadece single pattern','Sadece random patterns')
				WHEN gs = 10 THEN jsonb_build_array('Data encryption, migration handling, error handling','Sadece no encryption','Sadece no migration','Sadece no error handling')
				WHEN gs = 11 THEN jsonb_build_array('Storage testing, mock storage, test database','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 12 THEN jsonb_build_array('Storage organization, data models, storage abstraction','Sadece single storage','Sadece no organization','Sadece random structure')
				WHEN gs = 13 THEN jsonb_build_array('Storage performance, indexing, query optimization','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 14 THEN jsonb_build_array('Storage debugging, database inspection, data validation','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				ELSE jsonb_build_array('Local Storage ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'storage',
			'explanation', 'Local Storage hakkında bilgi testi'
		)
	),
	70,
	'local-storage',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 10: Animations Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod10-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('10. Animations Testleri - Test %s', gs),
	'Flutter animations hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod10-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Animations nedir?'
				WHEN gs = 2 THEN 'Implicit animations nedir?'
				WHEN gs = 3 THEN 'Explicit animations nedir?'
				WHEN gs = 4 THEN 'AnimationController nedir?'
				WHEN gs = 5 THEN 'Tween nedir?'
				WHEN gs = 6 THEN 'Hero animations nedir?'
				WHEN gs = 7 THEN 'Page transitions nedir?'
				WHEN gs = 8 THEN 'Animation performance nedir?'
				WHEN gs = 9 THEN 'Custom animations nedir?'
				WHEN gs = 10 THEN 'Animation best practices nelerdir?'
				ELSE FORMAT('Animations hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('UI geçiş efektleri, smooth transitions, user experience','Sadece static UI','Sadece no animations','Sadece manual animations')
				WHEN gs = 2 THEN jsonb_build_array('Otomatik animasyonlar, AnimatedContainer, AnimatedOpacity','Sadece explicit animations','Sadece no animations','Sadece manual animations')
				WHEN gs = 3 THEN jsonb_build_array('Manuel kontrol edilen animasyonlar, AnimationController, custom control','Sadece implicit animations','Sadece no animations','Sadece automatic animations')
				WHEN gs = 4 THEN jsonb_build_array('Animation kontrolü, AnimationController, forward, reverse, duration','Sadece no controller','Sadece manual control','Sadece automatic control')
				WHEN gs = 5 THEN jsonb_build_array('Değer aralığı, Tween<T>, begin ve end values, interpolation','Sadece no tween','Sadece manual tween','Sadece automatic tween')
				WHEN gs = 6 THEN jsonb_build_array('Widget geçiş animasyonu, Hero widget, shared element transition','Sadece no hero','Sadece manual hero','Sadece automatic hero')
				WHEN gs = 7 THEN jsonb_build_array('Sayfa geçiş animasyonları, PageRouteBuilder, custom transitions','Sadece no transitions','Sadece default only','Sadece manual transitions')
				WHEN gs = 8 THEN jsonb_build_array('Animation performansı, 60fps, rebuild optimization, const widgets','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 9 THEN jsonb_build_array('Kendi animasyonlarınızı oluşturma, CustomPainter, custom animations','Sadece built-in only','Sadece no custom','Sadece manual custom')
				WHEN gs = 10 THEN jsonb_build_array('Performance optimization, const widgets, animation curves','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 11 THEN jsonb_build_array('Animation curves, Curves class, easing functions','Sadece linear only','Sadece no curves','Sadece manual curves')
				WHEN gs = 12 THEN jsonb_build_array('Animation testing, animation controller testing, widget testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 13 THEN jsonb_build_array('Animation organization, reusable animations, animation widgets','Sadece single animation','Sadece no organization','Sadece random structure')
				WHEN gs = 14 THEN jsonb_build_array('Animation debugging, Flutter DevTools, animation inspector','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				ELSE jsonb_build_array('Animations ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'animations',
			'explanation', 'Animations hakkında bilgi testi'
		)
	),
	70,
	'animations',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 11: Platform Channels Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod11-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('11. Platform Channels Testleri - Test %s', gs),
	'Platform channels hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod11-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Platform channels nedir?'
				WHEN gs = 2 THEN 'Method channels nedir?'
				WHEN gs = 3 THEN 'Event channels nedir?'
				WHEN gs = 4 THEN 'Native code integration nedir?'
				WHEN gs = 5 THEN 'Plugin development nedir?'
				WHEN gs = 6 THEN 'Platform-specific code nedir?'
				WHEN gs = 7 THEN 'Native APIs nedir?'
				WHEN gs = 8 THEN 'Channels best practices nelerdir?'
				WHEN gs = 9 THEN 'Channels performance nedir?'
				WHEN gs = 10 THEN 'Channels testing nedir?'
				ELSE FORMAT('Platform Channels hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Flutter ve native code arası iletişim, MethodChannel, EventChannel','Sadece Dart only','Sadece no channels','Sadece manual channels')
				WHEN gs = 2 THEN jsonb_build_array('Method call channel, MethodChannel, invokeMethod, native method call','Sadece EventChannel','Sadece no channels','Sadece manual channels')
				WHEN gs = 3 THEN jsonb_build_array('Event stream channel, EventChannel, native events, stream events','Sadece MethodChannel','Sadece no channels','Sadece manual channels')
				WHEN gs = 4 THEN jsonb_build_array('Native kod entegrasyonu, platform channels, Kotlin/Swift code','Sadece Dart only','Sadece no native','Sadece manual integration')
				WHEN gs = 5 THEN jsonb_build_array('Plugin geliştirme, platform channels, pub.dev package','Sadece no plugins','Sadece built-in only','Sadece manual plugins')
				WHEN gs = 6 THEN jsonb_build_array('Platform-specific kod, Android/iOS specific, conditional compilation','Sadece cross-platform only','Sadece no platform code','Sadece manual platform code')
				WHEN gs = 7 THEN jsonb_build_array('Native platform API''leri, camera, location, sensors, platform channels','Sadece Dart APIs','Sadece no native APIs','Sadece manual APIs')
				WHEN gs = 8 THEN jsonb_build_array('Error handling, type safety, async handling, channel naming','Sadece no error handling','Sadece no type safety','Sadece no async handling')
				WHEN gs = 9 THEN jsonb_build_array('Channel performance, minimize calls, batch operations','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 10 THEN jsonb_build_array('Channel testing, mock channels, integration testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 11 THEN jsonb_build_array('Channel organization, channel naming, channel structure','Sadece single channel','Sadece no organization','Sadece random structure')
				WHEN gs = 12 THEN jsonb_build_array('Channel debugging, channel inspection, error tracking','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				WHEN gs = 13 THEN jsonb_build_array('Channel security, data validation, secure communication','Sadece no security','Sadece no validation','Sadece manual security')
				WHEN gs = 14 THEN jsonb_build_array('Channel documentation, channel contracts, API documentation','Sadece no documentation','Sadece no contracts','Sadece manual documentation')
				ELSE jsonb_build_array('Platform Channels ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'platform-channels',
			'explanation', 'Platform Channels hakkında bilgi testi'
		)
	),
	70,
	'platform-channels',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 12: Testing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod12-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('12. Testing Testleri - Test %s', gs),
	'Flutter testing hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod12-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Testing nedir?'
				WHEN gs = 2 THEN 'Unit testing nedir?'
				WHEN gs = 3 THEN 'Widget testing nedir?'
				WHEN gs = 4 THEN 'Integration testing nedir?'
				WHEN gs = 5 THEN 'Mocking nedir?'
				WHEN gs = 6 THEN 'Golden tests nedir?'
				WHEN gs = 7 THEN 'Test coverage nedir?'
				WHEN gs = 8 THEN 'E2E testing nedir?'
				WHEN gs = 9 THEN 'Testing patterns nelerdir?'
				WHEN gs = 10 THEN 'Testing best practices nelerdir?'
				ELSE FORMAT('Testing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Kod doğrulama, test yazma, quality assurance, automated testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 2 THEN jsonb_build_array('Tek fonksiyon/class testi, test package, unit test','Sadece widget testing','Sadece integration testing','Sadece E2E testing')
				WHEN gs = 3 THEN jsonb_build_array('Widget testi, widget_test package, widget interaction test','Sadece unit testing','Sadece integration testing','Sadece E2E testing')
				WHEN gs = 4 THEN jsonb_build_array('Birden fazla widget/component testi, integration_test package','Sadece unit testing','Sadece widget testing','Sadece E2E testing')
				WHEN gs = 5 THEN jsonb_build_array('Dependency''leri fake implementation ile değiştirme, mockito','Sadece real dependencies','Sadece no dependencies','Sadece manual mock')
				WHEN gs = 6 THEN jsonb_build_array('UI snapshot testi, golden file, visual regression test','Sadece unit test','Sadece no golden','Sadece manual comparison')
				WHEN gs = 7 THEN jsonb_build_array('Test edilen kod yüzdesi, coverage reports, test_coverage','Sadece test sayısı','Sadece test süresi','Sadece test başarı oranı')
				WHEN gs = 8 THEN jsonb_build_array('End-to-end test, tüm uygulama flow, integration_test','Sadece unit test','Sadece widget test','Sadece manual test')
				WHEN gs = 9 THEN jsonb_build_array('AAA pattern, arrange-act-assert, test isolation','Sadece no pattern','Sadece random test','Sadece manual pattern')
				WHEN gs = 10 THEN jsonb_build_array('Test isolation, setUp/tearDown, maintainable tests','Sadece shared state','Sadece global state','Sadece no cleanup')
				WHEN gs = 11 THEN jsonb_build_array('Test''leri organize etmek, test structure, test files','Sadece tek bir test file','Sadece no organization','Sadece random test')
				WHEN gs = 12 THEN jsonb_build_array('Test data setup, test fixtures, test helpers','Sadece hard-coded data','Sadece no setup','Sadece manual setup')
				WHEN gs = 13 THEN jsonb_build_array('Test utilities, test helpers, reusable test code','Sadece no utilities','Sadece manual utilities','Sadece no helpers')
				WHEN gs = 14 THEN jsonb_build_array('CI/CD integration, automated testing, test pipeline','Sadece manual testing','Sadece local testing','Sadece no automation')
				ELSE jsonb_build_array('Testing ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'testing',
			'explanation', 'Testing hakkında bilgi testi'
		)
	),
	70,
	'testing',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 13: Performance Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod13-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('13. Performance Testleri - Test %s', gs),
	'Flutter performans optimizasyonu hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod13-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Performance nedir?'
				WHEN gs = 2 THEN 'Performance profiling nedir?'
				WHEN gs = 3 THEN 'Build optimization nedir?'
				WHEN gs = 4 THEN 'App size optimization nedir?'
				WHEN gs = 5 THEN 'Image optimization nedir?'
				WHEN gs = 6 THEN 'Lazy loading nedir?'
				WHEN gs = 7 THEN 'Memory management nedir?'
				WHEN gs = 8 THEN 'Widget rebuild optimization nedir?'
				WHEN gs = 9 THEN 'Performance metrics nedir?'
				WHEN gs = 10 THEN 'Performance best practices nelerdir?'
				ELSE FORMAT('Performance hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Uygulama performansı, 60fps, smooth animations, fast rendering','Sadece functionality','Sadece no performance','Sadece manual performance')
				WHEN gs = 2 THEN jsonb_build_array('Performance ölçümü, Flutter DevTools, performance overlay','Sadece manual testing','Sadece no profiling','Sadece console.log')
				WHEN gs = 3 THEN jsonb_build_array('Build optimizasyonu, release build, AOT compilation, tree shaking','Sadece debug build','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 4 THEN jsonb_build_array('Uygulama boyutu optimizasyonu, code splitting, asset optimization','Sadece daha fazla kod eklemek','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 5 THEN jsonb_build_array('Image boyutu optimizasyonu, cached_network_image, image compression','Sadece büyük images','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 6 THEN jsonb_build_array('İhtiyaç duyulduğunda yükleme, lazy loading, ListView.builder','Sadece eager loading','Sadece no loading','Sadece manual loading')
				WHEN gs = 7 THEN jsonb_build_array('Memory yönetimi, dispose methods, memory leak önleme','Sadece no memory management','Sadece manual management','Sadece no leak prevention')
				WHEN gs = 8 THEN jsonb_build_array('Widget rebuild optimizasyonu, const widgets, keys, shouldRebuild','Sadece always rebuild','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 9 THEN jsonb_build_array('Performance metrikleri, frame rate, memory usage, build time','Sadece no metrics','Sadece manual metrics','Sadece console.log')
				WHEN gs = 10 THEN jsonb_build_array('Const widgets, lazy loading, image optimization, profiling','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				WHEN gs = 11 THEN jsonb_build_array('Performance monitoring, production profiling, error tracking','Sadece development profiling','Sadece no monitoring','Sadece manual check')
				WHEN gs = 12 THEN jsonb_build_array('Performance testing, benchmark testing, performance regression','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 13 THEN jsonb_build_array('Performance organization, performance budgets, performance goals','Sadece no organization','Sadece no budgets','Sadece no goals')
				WHEN gs = 14 THEN jsonb_build_array('Performance documentation, performance guidelines, best practices','Sadece no documentation','Sadece no guidelines','Sadece manual documentation')
				ELSE jsonb_build_array('Performance ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'performance',
			'explanation', 'Performance hakkında bilgi testi'
		)
	),
	70,
	'performance',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 14: Publishing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod14-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('14. Publishing Testleri - Test %s', gs),
	'Flutter uygulamalarının publishing süreçleri hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod14-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Publishing nedir?'
				WHEN gs = 2 THEN 'Android build nedir?'
				WHEN gs = 3 THEN 'iOS build nedir?'
				WHEN gs = 4 THEN 'App signing nedir?'
				WHEN gs = 5 THEN 'App Bundle (AAB) nedir?'
				WHEN gs = 6 THEN 'APK generation nedir?'
				WHEN gs = 7 THEN 'Google Play Store nedir?'
				WHEN gs = 8 THEN 'Apple App Store nedir?'
				WHEN gs = 9 THEN 'Version management nedir?'
				WHEN gs = 10 THEN 'Publishing best practices nelerdir?'
				ELSE FORMAT('Publishing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Uygulamayı store''a yükleme, app distribution, release process','Sadece development only','Sadece no publishing','Sadece manual publishing')
				WHEN gs = 2 THEN jsonb_build_array('Android için build, flutter build apk/aab, Android build','Sadece iOS build','Sadece no build','Sadece manual build')
				WHEN gs = 3 THEN jsonb_build_array('iOS için build, flutter build ios, Xcode build','Sadece Android build','Sadece no build','Sadece manual build')
				WHEN gs = 4 THEN jsonb_build_array('Uygulama imzalama, keystore, code signing, security','Sadece no signing','Sadece manual signing','Sadece no security')
				WHEN gs = 5 THEN jsonb_build_array('Android App Bundle, optimized distribution, AAB format','Sadece APK only','Sadece no bundle','Sadece manual bundle')
				WHEN gs = 6 THEN jsonb_build_array('APK dosyası oluşturma, flutter build apk, Android package','Sadece AAB only','Sadece no APK','Sadece manual APK')
				WHEN gs = 7 THEN jsonb_build_array('Google''ın Android app store, Play Console, app distribution','Sadece App Store','Sadece no store','Sadece manual distribution')
				WHEN gs = 8 THEN jsonb_build_array('Apple''ın iOS app store, App Store Connect, app distribution','Sadece Play Store','Sadece no store','Sadece manual distribution')
				WHEN gs = 9 THEN jsonb_build_array('Versiyon yönetimi, version code, version name, semantic versioning','Sadece no version','Sadece manual version','Sadece no management')
				WHEN gs = 10 THEN jsonb_build_array('Version management, app signing, store guidelines, testing','Sadece no version management','Sadece no signing','Sadece no guidelines')
				WHEN gs = 11 THEN jsonb_build_array('Publishing testing, store testing, pre-release testing','Sadece no testing','Sadece production only','Sadece manual testing')
				WHEN gs = 12 THEN jsonb_build_array('Publishing documentation, store listing, app description','Sadece no documentation','Sadece no listing','Sadece manual documentation')
				WHEN gs = 13 THEN jsonb_build_array('Publishing security, app signing, security best practices','Sadece no security','Sadece no signing','Sadece manual security')
				WHEN gs = 14 THEN jsonb_build_array('Publishing monitoring, app analytics, crash reporting','Sadece no monitoring','Sadece no analytics','Sadece manual monitoring')
				ELSE jsonb_build_array('Publishing ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
			END,
			'answer', CASE 
				WHEN gs = 1 THEN 0
				WHEN gs = 2 THEN 0
				WHEN gs = 3 THEN 0
				WHEN gs = 4 THEN 0
				WHEN gs = 5 THEN 1
				WHEN gs = 6 THEN 1
				WHEN gs = 7 THEN 1
				WHEN gs = 8 THEN 1
				WHEN gs = 9 THEN 2
				WHEN gs = 10 THEN 2
				WHEN gs = 11 THEN 2
				WHEN gs = 12 THEN 2
				WHEN gs = 13 THEN 3
				WHEN gs = 14 THEN 3
				ELSE 3
			END,
			'category', 'publishing',
			'explanation', 'Publishing hakkında bilgi testi'
		)
	),
	70,
	'publishing',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 15: Advanced Topics Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-flutter-mod15-test-%02s', gs),
	'course-flutter-roadmap',
	FORMAT('15. Advanced Topics Testleri - Test %s', gs),
	'İleri seviye Flutter konuları hakkında bilgi testi.',
	'Flutter',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-flutter-mod15-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Isolates nedir?'
				WHEN gs = 2 THEN 'Custom Paint nedir?'
				WHEN gs = 3 THEN 'Custom Render Objects nedir?'
				WHEN gs = 4 THEN 'Flutter Web nedir?'
				WHEN gs = 5 THEN 'Flutter Desktop nedir?'
				WHEN gs = 6 THEN 'Firebase integration nedir?'
				WHEN gs = 7 THEN 'Architecture patterns nelerdir?'
				WHEN gs = 8 THEN 'i18n nedir?'
				WHEN gs = 9 THEN 'Accessibility nedir?'
				WHEN gs = 10 THEN 'Advanced topics best practices nelerdir?'
				ELSE FORMAT('Advanced Topics hakkında soru %s', gs)
			END,
			'options', jsonb_build_array('Seçenek A','Seçenek B','Seçenek C','Seçenek D'),
			'answer', 0,
			'category', 'advanced',
			'explanation', 'Advanced Topics hakkında bilgi testi'
		)
	),
	70,
	'advanced-topics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;
