-- React Tests Seed
-- Course ile aynı 15 modül yapısı, her modülde 10+ test içeriği
BEGIN;

-- Modül 1: React Tanıyalım Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod01-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('1. React Tanıyalım Testleri - Test %s', gs),
	'React ekosistemi ve temel kavramlar hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod01-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'React nedir?'
				WHEN gs = 2 THEN 'React''in temel avantajları nelerdir?'
				WHEN gs = 3 THEN 'Virtual DOM nedir?'
				WHEN gs = 4 THEN 'JSX nedir?'
				WHEN gs = 5 THEN 'React vs Angular farkı nedir?'
				WHEN gs = 6 THEN 'Create React App nedir?'
				WHEN gs = 7 THEN 'Vite nedir?'
				WHEN gs = 8 THEN 'Next.js nedir?'
				WHEN gs = 9 THEN 'React Developer Tools ne işe yarar?'
				WHEN gs = 10 THEN 'React component nedir?'
				ELSE FORMAT('React temel kavramları hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript kütüphanesi, kullanıcı arayüzü oluşturmak için','Veritabanı yönetim sistemi','Sunucu tarafı framework','Mobil uygulama geliştirme aracı')
				WHEN gs = 2 THEN jsonb_build_array('Component-based yapı, Virtual DOM, tek yönlü veri akışı','Sadece hızlı olması','Sadece küçük projeler için','Sadece web için')
				WHEN gs = 3 THEN jsonb_build_array('DOM''un hafıza içinde JavaScript temsili, performans optimizasyonu için','Gerçek DOM''un kendisi','Sadece bir kütüphane','CSS framework')
				WHEN gs = 4 THEN jsonb_build_array('JavaScript''e XML benzeri syntax ekleyen syntax extension','Sadece bir template dili','HTML''in kendisi','CSS preprocessor')
				WHEN gs = 5 THEN jsonb_build_array('React kütüphane, Angular tam framework; React daha esnek, Angular daha opinionated','Hiçbir fark yok','React sadece mobil için','Angular sadece web için')
				WHEN gs = 6 THEN jsonb_build_array('React uygulamaları oluşturmak için resmi CLI aracı','Sadece bir text editor','Veritabanı aracı','Deployment platformu')
				WHEN gs = 7 THEN jsonb_build_array('Hızlı build tool ve development server','Sadece bir package manager','Sadece bir test framework','Sadece bir CSS framework')
				WHEN gs = 8 THEN jsonb_build_array('React tabanlı full-stack framework, SSR ve routing sağlar','Sadece bir state management kütüphanesi','Sadece bir build tool','Sadece bir CSS framework')
				WHEN gs = 9 THEN jsonb_build_array('React component''lerini debug etmek ve incelemek için browser extension','Sadece bir text editor','Sadece bir package manager','Sadece bir test tool')
				WHEN gs = 10 THEN jsonb_build_array('UI''ın yeniden kullanılabilir, bağımsız parçaları','Sadece bir fonksiyon','Sadece bir class','Sadece bir değişken')
				WHEN gs = 11 THEN jsonb_build_array('React ekosisteminde popüler bir state management kütüphanesi','Sadece bir build tool','Sadece bir test framework','Sadece bir CSS framework')
				WHEN gs = 12 THEN jsonb_build_array('React''te component lifecycle metodları','Sadece bir event handler','Sadece bir state değişkeni','Sadece bir prop')
				WHEN gs = 13 THEN jsonb_build_array('React''te props''ları parent''tan child''a geçirme','Sadece bir state yönetimi','Sadece bir event handling','Sadece bir styling yöntemi')
				WHEN gs = 14 THEN jsonb_build_array('React''te performans optimizasyonu için kullanılan teknik','Sadece bir routing yöntemi','Sadece bir state management','Sadece bir styling yöntemi')
				ELSE jsonb_build_array('React temel kavramları ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'React temel kavramları hakkında bilgi testi'
		)
	),
	70,
	'react-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 2: JSX ve Rendering Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod02-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('2. JSX ve Rendering Testleri - Test %s', gs),
	'JSX syntax ve rendering mekanizması hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod02-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'JSX nedir?'
				WHEN gs = 2 THEN 'JSX expressions nasıl kullanılır?'
				WHEN gs = 3 THEN 'Virtual DOM nedir?'
				WHEN gs = 4 THEN 'Reconciliation nedir?'
				WHEN gs = 5 THEN 'Fragment nedir?'
				WHEN gs = 6 THEN 'Keys nedir ve neden önemlidir?'
				WHEN gs = 7 THEN 'Conditional rendering nasıl yapılır?'
				WHEN gs = 8 THEN 'React.createElement vs JSX farkı nedir?'
				WHEN gs = 9 THEN 'Rendering optimizasyonu nedir?'
				WHEN gs = 10 THEN 'JSX best practices nelerdir?'
				ELSE FORMAT('JSX ve Rendering hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript''e XML benzeri syntax ekleyen syntax extension','Sadece bir template dili','HTML''in kendisi','CSS preprocessor')
				WHEN gs = 2 THEN jsonb_build_array('Süslü parantez {} içinde JavaScript ifadeleri kullanarak','Sadece string olarak','Sadece number olarak','Sadece boolean olarak')
				WHEN gs = 3 THEN jsonb_build_array('DOM''un hafıza içinde JavaScript temsili, performans için','Gerçek DOM''un kendisi','Sadece bir kütüphane','CSS framework')
				WHEN gs = 4 THEN jsonb_build_array('Virtual DOM değişikliklerini gerçek DOM ile senkronize etme süreci','Sadece bir render yöntemi','Sadece bir state yönetimi','Sadece bir event handling')
				WHEN gs = 5 THEN jsonb_build_array('Birden fazla element''i wrapper olmadan gruplamak için kullanılan React component','Sadece bir div','Sadece bir span','Sadece bir section')
				WHEN gs = 6 THEN jsonb_build_array('List item''ları tanımlamak için kullanılan unique identifier, React''in değişiklikleri takip etmesi için','Sadece bir styling özelliği','Sadece bir class name','Sadece bir id attribute')
				WHEN gs = 7 THEN jsonb_build_array('Ternary operator (? :) veya && operator kullanarak','Sadece if statement ile','Sadece switch case ile','Sadece for loop ile')
				WHEN gs = 8 THEN jsonb_build_array('JSX, React.createElement için syntactic sugar; JSX daha okunabilir','Hiçbir fark yok','JSX daha yavaş','createElement daha okunabilir')
				WHEN gs = 9 THEN jsonb_build_array('Gereksiz render''ları önlemek, memoization kullanmak, code splitting','Sadece daha fazla component kullanmak','Sadece daha fazla state kullanmak','Sadece daha fazla prop kullanmak')
				WHEN gs = 10 THEN jsonb_build_array('Tek bir root element kullanmak, keys kullanmak, conditional rendering','Sadece class component kullanmak','Sadece function component kullanmak','Sadece hooks kullanmak')
				WHEN gs = 11 THEN jsonb_build_array('JSX''te className kullanmak, camelCase attribute isimleri','Sadece HTML attribute isimleri kullanmak','Sadece kebab-case kullanmak','Sadece snake_case kullanmak')
				WHEN gs = 12 THEN jsonb_build_array('JSX''te JavaScript expressions kullanmak için {} kullanılır','Sadece string interpolation','Sadece template literals','Sadece concatenation')
				WHEN gs = 13 THEN jsonb_build_array('JSX''te self-closing tags kullanmak, /> ile kapatmak','Sadece açık tag kullanmak','Sadece kapatılmış tag kullanmak','Sadece comment kullanmak')
				WHEN gs = 14 THEN jsonb_build_array('JSX''te array map kullanarak list render etmek','Sadece for loop kullanmak','Sadece while loop kullanmak','Sadece forEach kullanmak')
				ELSE jsonb_build_array('JSX ve Rendering ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'jsx',
			'explanation', 'JSX ve Rendering hakkında bilgi testi'
		)
	),
	70,
	'jsx-rendering',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 3: Components ve Props Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod03-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('3. Components ve Props Testleri - Test %s', gs),
	'React components ve props kullanımı hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod03-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Function component nedir?'
				WHEN gs = 2 THEN 'Props nedir?'
				WHEN gs = 3 THEN 'Children prop nedir?'
				WHEN gs = 4 THEN 'Component composition nedir?'
				WHEN gs = 5 THEN 'HOC (Higher-Order Component) nedir?'
				WHEN gs = 6 THEN 'Render props pattern nedir?'
				WHEN gs = 7 THEN 'Compound components nedir?'
				WHEN gs = 8 THEN 'Prop drilling nedir?'
				WHEN gs = 9 THEN 'Component reusability nedir?'
				WHEN gs = 10 THEN 'Component best practices nelerdir?'
				ELSE FORMAT('Components ve Props hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript fonksiyonu olarak tanımlanan React component','Sadece bir class','Sadece bir object','Sadece bir array')
				WHEN gs = 2 THEN jsonb_build_array('Parent component''ten child component''e geçirilen veriler','Sadece bir state','Sadece bir method','Sadece bir variable')
				WHEN gs = 3 THEN jsonb_build_array('Component içeriğini temsil eden özel prop','Sadece bir attribute','Sadece bir class','Sadece bir id')
				WHEN gs = 4 THEN jsonb_build_array('Küçük component''leri birleştirerek daha büyük component''ler oluşturma','Sadece bir inheritance','Sadece bir polymorphism','Sadece bir encapsulation')
				WHEN gs = 5 THEN jsonb_build_array('Component alıp yeni component döndüren fonksiyon, logic paylaşımı için','Sadece bir component','Sadece bir hook','Sadece bir utility function')
				WHEN gs = 6 THEN jsonb_build_array('Render prop olarak fonksiyon geçirerek logic paylaşımı','Sadece bir prop geçirme','Sadece bir state geçirme','Sadece bir method geçirme')
				WHEN gs = 7 THEN jsonb_build_array('Birlikte çalışan, state paylaşan component grupları','Sadece bir component','Sadece bir hook','Sadece bir utility')
				WHEN gs = 8 THEN jsonb_build_array('Props''ları gereksiz yere birçok component seviyesinden geçirme problemi','Sadece bir prop kullanımı','Sadece bir state kullanımı','Sadece bir method kullanımı')
				WHEN gs = 9 THEN jsonb_build_array('Component''leri farklı yerlerde tekrar kullanabilme yeteneği','Sadece bir kopyalama','Sadece bir import','Sadece bir export')
				WHEN gs = 10 THEN jsonb_build_array('Küçük, tek sorumluluklu component''ler, prop validation','Sadece büyük component''ler','Sadece class component''ler','Sadece function component''ler')
				WHEN gs = 11 THEN jsonb_build_array('Component''leri props ile configure etmek, default props kullanmak','Sadece hard-coded değerler','Sadece global state','Sadece local state')
				WHEN gs = 12 THEN jsonb_build_array('Component''leri propTypes veya TypeScript ile type check etmek','Sadece runtime check','Sadece manual check','Sadece no check')
				WHEN gs = 13 THEN jsonb_build_array('Component''leri memoization ile optimize etmek, gereksiz render önlemek','Sadece her zaman render etmek','Sadece hiç render etmemek','Sadece conditional render')
				WHEN gs = 14 THEN jsonb_build_array('Component''leri context veya state management ile prop drilling önlemek','Sadece daha fazla prop geçirmek','Sadece global variable kullanmak','Sadece local storage kullanmak')
				ELSE jsonb_build_array('Components ve Props ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'components',
			'explanation', 'Components ve Props hakkında bilgi testi'
		)
	),
	70,
	'components-props',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 4: State Yönetimi Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod04-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('4. State Yönetimi Testleri - Test %s', gs),
	'State yönetimi ve useState/useReducer hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod04-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'State nedir?'
				WHEN gs = 2 THEN 'useState hook nedir?'
				WHEN gs = 3 THEN 'State vs Props farkı nedir?'
				WHEN gs = 4 THEN 'Lifting state up nedir?'
				WHEN gs = 5 THEN 'useReducer hook nedir?'
				WHEN gs = 6 THEN 'Local state vs Global state nedir?'
				WHEN gs = 7 THEN 'State initialization patterns nelerdir?'
				WHEN gs = 8 THEN 'State derivation nedir?'
				WHEN gs = 9 THEN 'State antipatterns nelerdir?'
				WHEN gs = 10 THEN 'State management best practices nelerdir?'
				ELSE FORMAT('State Yönetimi hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Component''in zaman içinde değişebilen verisi','Sadece bir prop','Sadece bir method','Sadece bir constant')
				WHEN gs = 2 THEN jsonb_build_array('State eklemek ve güncellemek için React hook','Sadece bir prop','Sadece bir method','Sadece bir variable')
				WHEN gs = 3 THEN jsonb_build_array('State component içinde, props dışarıdan gelir; state değişebilir, props read-only','Hiçbir fark yok','State sadece class component''te','Props sadece function component''te')
				WHEN gs = 4 THEN jsonb_build_array('State''i ortak parent component''e taşıma, birden fazla child paylaşmak için','Sadece state''i child''a taşımak','Sadece state''i silmek','Sadece state''i kopyalamak')
				WHEN gs = 5 THEN jsonb_build_array('Karmaşık state logic için reducer pattern kullanan hook','Sadece bir useState alternatifi','Sadece bir prop','Sadece bir method')
				WHEN gs = 6 THEN jsonb_build_array('Local state tek component''te, global state birçok component paylaşır','Hiçbir fark yok','Local state her zaman daha iyi','Global state her zaman daha iyi')
				WHEN gs = 7 THEN jsonb_build_array('useState initial value, lazy initialization, function initializer','Sadece hard-coded değerler','Sadece null','Sadece undefined')
				WHEN gs = 8 THEN jsonb_build_array('Mevcut state''ten yeni değer hesaplama, derived state','Sadece state''i kopyalamak','Sadece state''i silmek','Sadece state''i değiştirmek')
				WHEN gs = 9 THEN jsonb_build_array('State''i gereksiz yere global yapmak, mutating state directly','Sadece state kullanmak','Sadece props kullanmak','Sadece methods kullanmak')
				WHEN gs = 10 THEN jsonb_build_array('State''i mümkün olduğunca local tutmak, gereksiz state önlemek','Sadece global state kullanmak','Sadece class component kullanmak','Sadece function component kullanmak')
				WHEN gs = 11 THEN jsonb_build_array('State updates''i functional form kullanmak, önceki state''e bağlıysa','Sadece direct assignment','Sadece mutation','Sadece copy')
				WHEN gs = 12 THEN jsonb_build_array('State''i normalize etmek, nested object yerine flat structure','Sadece nested object kullanmak','Sadece array kullanmak','Sadece primitive kullanmak')
				WHEN gs = 13 THEN jsonb_build_array('State''i bölmek, ilgili state''leri birlikte tutmak','Sadece tek bir state object','Sadece global state','Sadece local state')
				WHEN gs = 14 THEN jsonb_build_array('State updates''i batch etmek, multiple setState calls optimize etmek','Sadece her seferinde bir update','Sadece manual batching','Sadece no batching')
				ELSE jsonb_build_array('State Yönetimi ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'state',
			'explanation', 'State Yönetimi hakkında bilgi testi'
		)
	),
	70,
	'state-management',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 5: Hooks Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod05-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('5. Hooks Testleri - Test %s', gs),
	'React Hooks API hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod05-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Hooks nedir?'
				WHEN gs = 2 THEN 'useEffect hook nedir?'
				WHEN gs = 3 THEN 'useContext hook nedir?'
				WHEN gs = 4 THEN 'useRef hook nedir?'
				WHEN gs = 5 THEN 'useMemo ve useCallback nedir?'
				WHEN gs = 6 THEN 'Custom hooks nedir?'
				WHEN gs = 7 THEN 'Hooks rules nelerdir?'
				WHEN gs = 8 THEN 'useLayoutEffect nedir?'
				WHEN gs = 9 THEN 'Hooks composition nedir?'
				WHEN gs = 10 THEN 'Hooks performance optimizasyonu nedir?'
				ELSE FORMAT('Hooks hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Function component''lere state ve lifecycle özellikleri ekleyen fonksiyonlar','Sadece bir class feature','Sadece bir prop','Sadece bir method')
				WHEN gs = 2 THEN jsonb_build_array('Side effect''leri yönetmek için kullanılan hook, component lifecycle''a bağlanır','Sadece bir state hook','Sadece bir context hook','Sadece bir ref hook')
				WHEN gs = 3 THEN jsonb_build_array('Context değerini okumak için kullanılan hook','Sadece bir state hook','Sadece bir effect hook','Sadece bir ref hook')
				WHEN gs = 4 THEN jsonb_build_array('Mutable reference tutmak için kullanılan hook, DOM element''e erişim için','Sadece bir state hook','Sadece bir effect hook','Sadece bir context hook')
				WHEN gs = 5 THEN jsonb_build_array('Memoization için kullanılan hook''lar, performans optimizasyonu','Sadece bir state hook','Sadece bir effect hook','Sadece bir context hook')
				WHEN gs = 6 THEN jsonb_build_array('Kendi hook''larınızı oluşturma, logic paylaşımı için','Sadece built-in hook kullanmak','Sadece class component kullanmak','Sadece function component kullanmak')
				WHEN gs = 7 THEN jsonb_build_array('Sadece function component''lerde kullan, conditional olarak çağırma','Sadece class component''lerde kullan','Sadece global scope''ta kullan','Sadece loop içinde kullan')
				WHEN gs = 8 THEN jsonb_build_array('useEffect''e benzer ama DOM değişikliklerinden önce senkron çalışır','Sadece bir useEffect alternatifi','Sadece bir useState alternatifi','Sadece bir useContext alternatifi')
				WHEN gs = 9 THEN jsonb_build_array('Birden fazla hook''u birleştirerek karmaşık logic oluşturma','Sadece tek bir hook kullanmak','Sadece class component kullanmak','Sadece function component kullanmak')
				WHEN gs = 10 THEN jsonb_build_array('useMemo, useCallback kullanmak, gereksiz re-render önlemek','Sadece her zaman render etmek','Sadece hiç render etmemek','Sadece conditional render')
				WHEN gs = 11 THEN jsonb_build_array('useEffect dependency array doğru kullanmak, infinite loop önlemek','Sadece boş array kullanmak','Sadece hiç array kullanmamak','Sadece tüm değişkenleri eklemek')
				WHEN gs = 12 THEN jsonb_build_array('useCallback ile function memoization, child component''lere prop geçirirken','Sadece her seferinde yeni function oluşturmak','Sadece global function kullanmak','Sadece arrow function kullanmak')
				WHEN gs = 13 THEN jsonb_build_array('useMemo ile expensive computation memoization, sadece dependency değiştiğinde hesapla','Sadece her render''da hesaplamak','Sadece hiç hesaplamamak','Sadece manual memoization')
				WHEN gs = 14 THEN jsonb_build_array('useRef ile DOM reference, re-render tetiklemeden değer saklama','Sadece state kullanmak','Sadece props kullanmak','Sadece global variable kullanmak')
				ELSE jsonb_build_array('Hooks ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'hooks',
			'explanation', 'Hooks hakkında bilgi testi'
		)
	),
	70,
	'hooks',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 6: Routing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod06-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('6. Routing Testleri - Test %s', gs),
	'React Router ve navigation hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod06-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'React Router nedir?'
				WHEN gs = 2 THEN 'BrowserRouter vs HashRouter farkı nedir?'
				WHEN gs = 3 THEN 'Route parameters nedir?'
				WHEN gs = 4 THEN 'Query parameters nedir?'
				WHEN gs = 5 THEN 'Nested routes nedir?'
				WHEN gs = 6 THEN 'Protected routes nedir?'
				WHEN gs = 7 THEN 'Route guards nedir?'
				WHEN gs = 8 THEN 'Programmatic navigation nedir?'
				WHEN gs = 9 THEN 'Lazy loading routes nedir?'
				WHEN gs = 10 THEN 'Routing best practices nelerdir?'
				ELSE FORMAT('Routing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('React için client-side routing kütüphanesi','Sadece bir state management','Sadece bir HTTP client','Sadece bir UI library')
				WHEN gs = 2 THEN jsonb_build_array('BrowserRouter clean URL, HashRouter hash (#) kullanır','Hiçbir fark yok','BrowserRouter sadece server-side','HashRouter sadece client-side')
				WHEN gs = 3 THEN jsonb_build_array('URL path''teki dinamik değerler, :id gibi','Sadece query string','Sadece hash','Sadece anchor')
				WHEN gs = 4 THEN jsonb_build_array('URL''de ? ile başlayan parametreler, search params','Sadece path params','Sadece hash','Sadece anchor')
				WHEN gs = 5 THEN jsonb_build_array('Route içinde route, parent-child route yapısı','Sadece tek seviye route','Sadece flat route','Sadece nested component')
				WHEN gs = 6 THEN jsonb_build_array('Authentication gerektiren route''lar, yetkisiz erişimi önler','Sadece public route','Sadece private route','Sadece admin route')
				WHEN gs = 7 THEN jsonb_build_array('Route erişimini kontrol eden fonksiyonlar, canActivate gibi','Sadece bir route component','Sadece bir route path','Sadece bir route name')
				WHEN gs = 8 THEN jsonb_build_array('Kod içinden navigate() ile programatik yönlendirme','Sadece link click ile','Sadece form submit ile','Sadece button click ile')
				WHEN gs = 9 THEN jsonb_build_array('Route component''lerini ihtiyaç duyulduğunda yükleme, code splitting','Sadece her zaman yüklemek','Sadece hiç yüklememek','Sadece manual loading')
				WHEN gs = 10 THEN jsonb_build_array('Route''ları organize etmek, lazy loading kullanmak, protected route''lar','Sadece tüm route''ları bir yerde','Sadece nested route kullanmamak','Sadece flat route kullanmak')
				WHEN gs = 11 THEN jsonb_build_array('Route path''lerini semantic yapmak, RESTful convention','Sadece random path kullanmak','Sadece numeric path','Sadece short path')
				WHEN gs = 12 THEN jsonb_build_array('Route component''lerini memoization ile optimize etmek','Sadece her zaman render etmek','Sadece hiç render etmemek','Sadece conditional render')
				WHEN gs = 13 THEN jsonb_build_array('Route error handling, 404 page, error boundary','Sadece try-catch','Sadece console.log','Sadece alert')
				WHEN gs = 14 THEN jsonb_build_array('Route transition animation, smooth navigation','Sadece instant navigation','Sadece no navigation','Sadece manual animation')
				ELSE jsonb_build_array('Routing ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'routing',
			'explanation', 'Routing hakkında bilgi testi'
		)
	),
	70,
	'routing',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 7: Context API Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod07-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('7. Context API Testleri - Test %s', gs),
	'Context API ve global state yönetimi hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod07-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Context API nedir?'
				WHEN gs = 2 THEN 'Context Provider nedir?'
				WHEN gs = 3 THEN 'useContext hook nedir?'
				WHEN gs = 4 THEN 'Multiple contexts nasıl kullanılır?'
				WHEN gs = 5 THEN 'Context ve useReducer kombinasyonu nedir?'
				WHEN gs = 6 THEN 'Context optimization nedir?'
				WHEN gs = 7 THEN 'Context vs Props farkı nedir?'
				WHEN gs = 8 THEN 'Context best practices nelerdir?'
				WHEN gs = 9 THEN 'Context antipatterns nelerdir?'
				WHEN gs = 10 THEN 'Context vs Redux farkı nedir?'
				ELSE FORMAT('Context API hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Prop drilling önlemek için global state yönetimi sağlayan React API','Sadece bir state management library','Sadece bir routing library','Sadece bir UI library')
				WHEN gs = 2 THEN jsonb_build_array('Context değerini sağlayan component, value prop ile','Sadece bir consumer','Sadece bir provider function','Sadece bir context creator')
				WHEN gs = 3 THEN jsonb_build_array('Context değerini okumak için kullanılan hook','Sadece bir state hook','Sadece bir effect hook','Sadece bir ref hook')
				WHEN gs = 4 THEN jsonb_build_array('Birden fazla Provider ile nested yapı, her context ayrı','Sadece tek bir context','Sadece global context','Sadece local context')
				WHEN gs = 5 THEN jsonb_build_array('useReducer ile complex state logic, Context ile global erişim','Sadece useState ile','Sadece useRef ile','Sadece useMemo ile')
				WHEN gs = 6 THEN jsonb_build_array('Context''i bölmek, sadece gerekli değerleri sağlamak, memoization','Sadece tüm değerleri bir context''te','Sadece hiç context kullanmamak','Sadece props kullanmak')
				WHEN gs = 7 THEN jsonb_build_array('Context global erişim, props local geçiş; Context deep tree için','Hiçbir fark yok','Context sadece class component','Props sadece function component')
				WHEN gs = 8 THEN jsonb_build_array('Context''i bölmek, sadece değişen değerleri sağlamak, custom hook kullanmak','Sadece tek bir context kullanmak','Sadece tüm değerleri bir context''te','Sadece props kullanmak')
				WHEN gs = 9 THEN jsonb_build_array('Tüm state''i bir context''te tutmak, sık değişen değerler','Sadece küçük context kullanmak','Sadece static context','Sadece read-only context')
				WHEN gs = 10 THEN jsonb_build_array('Context basit use case, Redux complex state management; Context built-in','Hiçbir fark yok','Context her zaman daha iyi','Redux her zaman daha iyi')
				WHEN gs = 11 THEN jsonb_build_array('Context default value kullanmak, undefined check yapmak','Sadece null kullanmak','Sadece empty object','Sadece no default')
				WHEN gs = 12 THEN jsonb_build_array('Context''i custom hook ile wrap etmek, API abstraction','Sadece direkt useContext kullanmak','Sadece props kullanmak','Sadece global variable')
				WHEN gs = 13 THEN jsonb_build_array('Context''i production''da test etmek, performance monitoring','Sadece development''ta test','Sadece hiç test etmemek','Sadece manual test')
				WHEN gs = 14 THEN jsonb_build_array('Context''i TypeScript ile type etmek, type safety','Sadece JavaScript kullanmak','Sadece any type','Sadece no type')
				ELSE jsonb_build_array('Context API ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'context',
			'explanation', 'Context API hakkında bilgi testi'
		)
	),
	70,
	'context-api',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 8: Performance Optimizasyonu Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod08-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('8. Performance Optimizasyonu Testleri - Test %s', gs),
	'React performans optimizasyonu teknikleri hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod08-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'React.memo nedir?'
				WHEN gs = 2 THEN 'Code splitting nedir?'
				WHEN gs = 3 THEN 'Lazy loading nedir?'
				WHEN gs = 4 THEN 'Virtual scrolling nedir?'
				WHEN gs = 5 THEN 'React Profiler nedir?'
				WHEN gs = 6 THEN 'Bundle size optimization nedir?'
				WHEN gs = 7 THEN 'Debouncing ve throttling nedir?'
				WHEN gs = 8 THEN 'Concurrent features nedir?'
				WHEN gs = 9 THEN 'Suspense nedir?'
				WHEN gs = 10 THEN 'Performance best practices nelerdir?'
				ELSE FORMAT('Performance hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Component''i memoize eden HOC, props değişmediğinde re-render önler','Sadece bir component wrapper','Sadece bir state hook','Sadece bir effect hook')
				WHEN gs = 2 THEN jsonb_build_array('Kodu küçük parçalara bölmek, ihtiyaç duyulduğunda yüklemek','Sadece tüm kodu bir dosyada tutmak','Sadece hiç kod yazmamak','Sadece inline kod')
				WHEN gs = 3 THEN jsonb_build_array('Component''leri ihtiyaç duyulduğunda yükleme, React.lazy ile','Sadece her zaman yüklemek','Sadece hiç yüklememek','Sadece manual loading')
				WHEN gs = 4 THEN jsonb_build_array('Sadece görünür item''ları render etme, büyük listeler için','Sadece tüm item''ları render etmek','Sadece hiç item render etmemek','Sadece first item')
				WHEN gs = 5 THEN jsonb_build_array('React component performansını ölçmek için tool','Sadece bir debug tool','Sadece bir build tool','Sadece bir test tool')
				WHEN gs = 6 THEN jsonb_build_array('Bundle boyutunu küçültmek, tree shaking, minification','Sadece daha fazla kod eklemek','Sadece hiç kod yazmamak','Sadece inline kod')
				WHEN gs = 7 THEN jsonb_build_array('Event handler''ları optimize etme teknikleri, rate limiting','Sadece her event''te çalıştırmak','Sadece hiç event handler kullanmamak','Sadece manual handling')
				WHEN gs = 8 THEN jsonb_build_array('React 18 concurrent rendering, interruptible rendering','Sadece synchronous rendering','Sadece blocking rendering','Sadece manual rendering')
				WHEN gs = 9 THEN jsonb_build_array('Async işlemler için loading state yönetimi, fallback UI','Sadece bir loading component','Sadece bir error component','Sadece bir success component')
				WHEN gs = 10 THEN jsonb_build_array('Memoization kullanmak, code splitting, lazy loading, profiling','Sadece her zaman render etmek','Sadece hiç render etmemek','Sadece manual optimization')
				WHEN gs = 11 THEN jsonb_build_array('useMemo ve useCallback ile expensive computation memoization','Sadece her render''da hesaplamak','Sadece hiç hesaplamamak','Sadece manual memoization')
				WHEN gs = 12 THEN jsonb_build_array('Image optimization, lazy loading images, WebP format','Sadece büyük image kullanmak','Sadece hiç image kullanmamak','Sadece PNG format')
				WHEN gs = 13 THEN jsonb_build_array('Web Workers ile heavy computation, main thread''i bloklamamak','Sadece main thread''te çalıştırmak','Sadece hiç computation yapmamak','Sadece manual computation')
				WHEN gs = 14 THEN jsonb_build_array('Performance monitoring, Lighthouse, Web Vitals','Sadece manual testing','Sadece hiç test etmemek','Sadece console.log')
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
			'explanation', 'Performance Optimizasyonu hakkında bilgi testi'
		)
	),
	70,
	'performance',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 9: Testing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod09-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('9. Testing Testleri - Test %s', gs),
	'React testing teknikleri hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod09-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Jest nedir?'
				WHEN gs = 2 THEN 'React Testing Library nedir?'
				WHEN gs = 3 THEN 'Component testing nasıl yapılır?'
				WHEN gs = 4 THEN 'Hooks testing nasıl yapılır?'
				WHEN gs = 5 THEN 'Async code testing nasıl yapılır?'
				WHEN gs = 6 THEN 'Mocking nedir?'
				WHEN gs = 7 THEN 'Snapshot testing nedir?'
				WHEN gs = 8 THEN 'E2E testing nedir?'
				WHEN gs = 9 THEN 'Test coverage nedir?'
				WHEN gs = 10 THEN 'Testing best practices nelerdir?'
				ELSE FORMAT('Testing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript test framework, unit ve integration test için','Sadece bir build tool','Sadece bir package manager','Sadece bir linter')
				WHEN gs = 2 THEN jsonb_build_array('React component''lerini user-centric şekilde test etmek için library','Sadece bir test runner','Sadece bir assertion library','Sadece bir mock library')
				WHEN gs = 3 THEN jsonb_build_array('render, screen, userEvent ile component render ve interaction test','Sadece console.log','Sadece manual testing','Sadece visual inspection')
				WHEN gs = 4 THEN jsonb_build_array('renderHook ile custom hook test, @testing-library/react-hooks','Sadece component içinde test','Sadece manual test','Sadece no test')
				WHEN gs = 5 THEN jsonb_build_array('waitFor, findBy ile async operation test, act() kullanımı','Sadece synchronous test','Sadece hiç async test','Sadece manual wait')
				WHEN gs = 6 THEN jsonb_build_array('Dependency''leri fake implementation ile değiştirme, jest.fn()','Sadece real dependency kullanmak','Sadece hiç dependency kullanmamak','Sadece manual mock')
				WHEN gs = 7 THEN jsonb_build_array('Component output''unu snapshot olarak kaydetme, değişiklikleri tespit','Sadece manual comparison','Sadece hiç snapshot','Sadece visual test')
				WHEN gs = 8 THEN jsonb_build_array('End-to-end test, tüm uygulama flow''unu test, Cypress gibi','Sadece unit test','Sadece integration test','Sadece manual test')
				WHEN gs = 9 THEN jsonb_build_array('Test edilen kod yüzdesi, coverage raporu, Istanbul','Sadece test sayısı','Sadece test süresi','Sadece test başarı oranı')
				WHEN gs = 10 THEN jsonb_build_array('User-centric test, accessibility test, maintainable test','Sadece implementation detail test','Sadece internal test','Sadece brittle test')
				WHEN gs = 11 THEN jsonb_build_array('Test''leri organize etmek, describe/it blocks, test structure','Sadece tek bir test file','Sadece no organization','Sadece random test')
				WHEN gs = 12 THEN jsonb_build_array('Test data setup, beforeEach/afterEach, test fixtures','Sadece hard-coded data','Sadece no setup','Sadece manual setup')
				WHEN gs = 13 THEN jsonb_build_array('Test isolation, her test bağımsız, cleanup','Sadece shared state','Sadece global state','Sadece no cleanup')
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

-- Modül 10: Styling ve CSS Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod10-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('10. Styling ve CSS Testleri - Test %s', gs),
	'React styling yaklaşımları hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod10-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'CSS Modules nedir?'
				WHEN gs = 2 THEN 'Styled Components nedir?'
				WHEN gs = 3 THEN 'CSS-in-JS nedir?'
				WHEN gs = 4 THEN 'Tailwind CSS nedir?'
				WHEN gs = 5 THEN 'Sass/SCSS nedir?'
				WHEN gs = 6 THEN 'CSS Variables nedir?'
				WHEN gs = 7 THEN 'Theme management nedir?'
				WHEN gs = 8 THEN 'Responsive design nedir?'
				WHEN gs = 9 THEN 'CSS best practices nelerdir?'
				WHEN gs = 10 THEN 'Styling performance nedir?'
				ELSE FORMAT('Styling hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('CSS class''larını local scope''ta tutan modül sistemi','Sadece global CSS','Sadece inline styles','Sadece JavaScript styles')
				WHEN gs = 2 THEN jsonb_build_array('CSS-in-JS library, tagged template literals ile styled component','Sadece bir CSS framework','Sadece bir build tool','Sadece bir linter')
				WHEN gs = 3 THEN jsonb_build_array('CSS''i JavaScript içinde yazma yaklaşımı, runtime generation','Sadece external CSS','Sadece inline styles','Sadece CSS files')
				WHEN gs = 4 THEN jsonb_build_array('Utility-first CSS framework, pre-built class''lar','Sadece bir component library','Sadece bir state management','Sadece bir routing library')
				WHEN gs = 5 THEN jsonb_build_array('CSS preprocessor, variables, nesting, mixins','Sadece bir CSS framework','Sadece bir build tool','Sadece bir linter')
				WHEN gs = 6 THEN jsonb_build_array('CSS custom properties, --variable-name syntax, dynamic values','Sadece bir CSS framework','Sadece bir preprocessor','Sadece bir linter')
				WHEN gs = 7 THEN jsonb_build_array('Tema değerlerini yönetme, dark/light mode, context ile','Sadece hard-coded colors','Sadece inline styles','Sadece CSS files')
				WHEN gs = 8 THEN jsonb_build_array('Farklı ekran boyutlarına uyum, media queries, flexible layout','Sadece fixed width','Sadece desktop only','Sadece mobile only')
				WHEN gs = 9 THEN jsonb_build_array('BEM naming, component-based CSS, maintainable styles','Sadece random class names','Sadece inline styles','Sadece global CSS')
				WHEN gs = 10 THEN jsonb_build_array('CSS-in-JS runtime cost, critical CSS, code splitting','Sadece her zaman tüm CSS yüklemek','Sadece hiç CSS kullanmamak','Sadece inline styles')
				WHEN gs = 11 THEN jsonb_build_array('CSS purging, unused styles kaldırma, production optimization','Sadece tüm CSS''i tutmak','Sadece hiç CSS yazmamak','Sadece manual cleanup')
				WHEN gs = 12 THEN jsonb_build_array('CSS specificity yönetimi, !important kullanmamak','Sadece !important her yerde','Sadece inline styles','Sadece no specificity')
				WHEN gs = 13 THEN jsonb_build_array('CSS organization, file structure, maintainable code','Sadece tek bir CSS file','Sadece no organization','Sadece random files')
				WHEN gs = 14 THEN jsonb_build_array('CSS performance, selector optimization, efficient queries','Sadece complex selectors','Sadece no optimization','Sadece manual optimization')
				ELSE jsonb_build_array('Styling ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'styling',
			'explanation', 'Styling ve CSS hakkında bilgi testi'
		)
	),
	70,
	'styling',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 11: Form Handling Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod11-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('11. Form Handling Testleri - Test %s', gs),
	'Form yönetimi ve validation hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod11-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Controlled components nedir?'
				WHEN gs = 2 THEN 'Uncontrolled components nedir?'
				WHEN gs = 3 THEN 'Form validation nedir?'
				WHEN gs = 4 THEN 'React Hook Form nedir?'
				WHEN gs = 5 THEN 'Formik nedir?'
				WHEN gs = 6 THEN 'Yup validation nedir?'
				WHEN gs = 7 THEN 'Form state management nedir?'
				WHEN gs = 8 THEN 'File upload handling nedir?'
				WHEN gs = 9 THEN 'Form error handling nedir?'
				WHEN gs = 10 THEN 'Form best practices nelerdir?'
				ELSE FORMAT('Form Handling hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Form input''u React state ile kontrol edilen component','Sadece bir input element','Sadece bir form element','Sadece bir button element')
				WHEN gs = 2 THEN jsonb_build_array('Form input''u DOM tarafından kontrol edilen component, useRef ile','Sadece bir controlled component','Sadece bir state component','Sadece bir prop component')
				WHEN gs = 3 THEN jsonb_build_array('Form verilerinin doğruluğunu kontrol etme, client-side validation','Sadece server-side validation','Sadece no validation','Sadece manual check')
				WHEN gs = 4 THEN jsonb_build_array('Performanslı form library, uncontrolled components, minimal re-render','Sadece bir validation library','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 5 THEN jsonb_build_array('Form state management library, controlled components, validation','Sadece bir validation library','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 6 THEN jsonb_build_array('Schema-based validation library, Yup schema ile','Sadece bir form library','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 7 THEN jsonb_build_array('Form state''ini yönetme, useState veya form library ile','Sadece bir prop management','Sadece bir method management','Sadece bir variable management')
				WHEN gs = 8 THEN jsonb_build_array('Dosya yükleme işlemi, File API, FormData kullanımı','Sadece text input','Sadece number input','Sadece email input')
				WHEN gs = 9 THEN jsonb_build_array('Form hatalarını yönetme, error state, user feedback','Sadece success state','Sadece loading state','Sadece no state')
				WHEN gs = 10 THEN jsonb_build_array('Accessible forms, proper labels, error messages, validation','Sadece basic forms','Sadece no validation','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('Form submission handling, preventDefault, async submit','Sadece default submit','Sadece no submit','Sadece manual submit')
				WHEN gs = 12 THEN jsonb_build_array('Form reset, clear form, initial values','Sadece keep values','Sadece no reset','Sadece manual clear')
				WHEN gs = 13 THEN jsonb_build_array('Form field dependencies, conditional validation, dynamic forms','Sadece static forms','Sadece no dependencies','Sadece manual handling')
				WHEN gs = 14 THEN jsonb_build_array('Form testing, user interaction test, validation test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Form Handling ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'Form Handling hakkında bilgi testi'
		)
	),
	70,
	'form-handling',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 12: API Integration Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod12-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('12. API Integration Testleri - Test %s', gs),
	'API çağrıları ve data fetching hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod12-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Fetch API nedir?'
				WHEN gs = 2 THEN 'Axios nedir?'
				WHEN gs = 3 THEN 'React Query nedir?'
				WHEN gs = 4 THEN 'Server state nedir?'
				WHEN gs = 5 THEN 'Caching ve refetching nedir?'
				WHEN gs = 6 THEN 'Mutations nedir?'
				WHEN gs = 7 THEN 'Infinite queries nedir?'
				WHEN gs = 8 THEN 'API error handling nedir?'
				WHEN gs = 9 THEN 'GraphQL nedir?'
				WHEN gs = 10 THEN 'API best practices nelerdir?'
				ELSE FORMAT('API Integration hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Browser native HTTP client API, Promise-based','Sadece bir library','Sadece bir framework','Sadece bir tool')
				WHEN gs = 2 THEN jsonb_build_array('HTTP client library, interceptors, automatic JSON parsing','Sadece bir native API','Sadece bir framework','Sadece bir tool')
				WHEN gs = 3 THEN jsonb_build_array('Server state management library, caching, synchronization','Sadece bir HTTP client','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 4 THEN jsonb_build_array('Server''dan gelen state, cache edilebilir, sync gerektirir','Sadece local state','Sadece component state','Sadece global state')
				WHEN gs = 5 THEN jsonb_build_array('API response''larını cache etme, otomatik refetch, stale-while-revalidate','Sadece her zaman fetch','Sadece hiç cache yok','Sadece manual cache')
				WHEN gs = 6 THEN jsonb_build_array('Server''a veri gönderme işlemleri, POST/PUT/DELETE','Sadece GET request','Sadece read operations','Sadece no operations')
				WHEN gs = 7 THEN jsonb_build_array('Sayfalama için infinite scroll, cursor-based pagination','Sadece single page','Sadece no pagination','Sadece manual pagination')
				WHEN gs = 8 THEN jsonb_build_array('API hatalarını yönetme, try-catch, error boundaries','Sadece success handling','Sadece no handling','Sadece manual handling')
				WHEN gs = 9 THEN jsonb_build_array('Query language, flexible data fetching, single endpoint','Sadece REST API','Sadece SOAP API','Sadece RPC API')
				WHEN gs = 10 THEN jsonb_build_array('Error handling, loading states, retry logic, caching','Sadece basic fetch','Sadece no error handling','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('API request cancellation, AbortController, cleanup','Sadece her zaman fetch','Sadece no cancellation','Sadece manual cancellation')
				WHEN gs = 12 THEN jsonb_build_array('API response transformation, data normalization, type safety','Sadece raw response','Sadece no transformation','Sadece manual transformation')
				WHEN gs = 13 THEN jsonb_build_array('API authentication, token management, refresh tokens','Sadece no auth','Sadece basic auth','Sadece manual auth')
				WHEN gs = 14 THEN jsonb_build_array('API testing, mock service worker, integration test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('API Integration ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'api',
			'explanation', 'API Integration hakkında bilgi testi'
		)
	),
	70,
	'api-integration',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 13: State Management Libraries Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod13-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('13. State Management Libraries Testleri - Test %s', gs),
	'Redux, Zustand gibi state management kütüphaneleri hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod13-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Redux nedir?'
				WHEN gs = 2 THEN 'Redux Toolkit nedir?'
				WHEN gs = 3 THEN 'Zustand nedir?'
				WHEN gs = 4 THEN 'Jotai nedir?'
				WHEN gs = 5 THEN 'Recoil nedir?'
				WHEN gs = 6 THEN 'State management karşılaştırması nedir?'
				WHEN gs = 7 THEN 'When to use state management?'
				WHEN gs = 8 THEN 'State persistence nedir?'
				WHEN gs = 9 THEN 'State management patterns nelerdir?'
				WHEN gs = 10 THEN 'State management best practices nelerdir?'
				ELSE FORMAT('State Management Libraries hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Predictable state container, single source of truth, immutable updates','Sadece bir component library','Sadece bir routing library','Sadece bir HTTP client')
				WHEN gs = 2 THEN jsonb_build_array('Redux için official toolkit, boilerplate azaltır, best practices','Sadece bir Redux alternatifi','Sadece bir component library','Sadece bir routing library')
				WHEN gs = 3 THEN jsonb_build_array('Minimal state management, hooks-based, no boilerplate','Sadece bir Redux alternatifi','Sadece bir component library','Sadece bir routing library')
				WHEN gs = 4 THEN jsonb_build_array('Atomic state management, fine-grained reactivity','Sadece bir Redux alternatifi','Sadece bir component library','Sadece bir routing library')
				WHEN gs = 5 THEN jsonb_build_array('Facebook''un state management library, atoms ve selectors','Sadece bir Redux alternatifi','Sadece bir component library','Sadece bir routing library')
				WHEN gs = 6 THEN jsonb_build_array('Redux complex ama powerful, Zustand simple, Context built-in','Hiçbir fark yok','Hepsi aynı','Hepsi farklı ama aynı')
				WHEN gs = 7 THEN jsonb_build_array('Global state gerektiğinde, prop drilling çok olduğunda, complex state','Sadece her zaman','Sadece hiçbir zaman','Sadece small apps')
				WHEN gs = 8 THEN jsonb_build_array('State''i localStorage veya sessionStorage''a kaydetme, hydration','Sadece memory''de tutmak','Sadece hiç kaydetmemek','Sadece manual save')
				WHEN gs = 9 THEN jsonb_build_array('Flux pattern, unidirectional data flow, action-reducer-store','Sadece bidirectional flow','Sadece no pattern','Sadece manual pattern')
				WHEN gs = 10 THEN jsonb_build_array('State''i normalize etmek, selectors kullanmak, middleware','Sadece denormalize state','Sadece no selectors','Sadece no middleware')
				WHEN gs = 11 THEN jsonb_build_array('Redux DevTools kullanmak, time-travel debugging','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				WHEN gs = 12 THEN jsonb_build_array('State structure design, flat vs nested, normalization','Sadece nested structure','Sadece no structure','Sadece random structure')
				WHEN gs = 13 THEN jsonb_build_array('Async actions, thunks, sagas, RTK Query','Sadece sync actions','Sadece no async','Sadece manual async')
				WHEN gs = 14 THEN jsonb_build_array('State management testing, action testing, reducer testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('State Management Libraries ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'State Management Libraries hakkında bilgi testi'
		)
	),
	70,
	'state-management-libs',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 14: Advanced Patterns Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod14-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('14. Advanced Patterns Testleri - Test %s', gs),
	'İleri seviye React pattern''leri hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod14-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Render props pattern nedir?'
				WHEN gs = 2 THEN 'HOC (Higher-Order Component) nedir?'
				WHEN gs = 3 THEN 'Compound components nedir?'
				WHEN gs = 4 THEN 'Error boundaries nedir?'
				WHEN gs = 5 THEN 'Portal pattern nedir?'
				WHEN gs = 6 THEN 'Ref forwarding nedir?'
				WHEN gs = 7 THEN 'Suspense nedir?'
				WHEN gs = 8 THEN 'Concurrent mode nedir?'
				WHEN gs = 9 THEN 'Server components nedir?'
				WHEN gs = 10 THEN 'Advanced patterns best practices nelerdir?'
				ELSE FORMAT('Advanced Patterns hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Render prop olarak fonksiyon geçirerek logic paylaşımı','Sadece bir prop geçirme','Sadece bir state geçirme','Sadece bir method geçirme')
				WHEN gs = 2 THEN jsonb_build_array('Component alıp yeni component döndüren fonksiyon, logic paylaşımı','Sadece bir component','Sadece bir hook','Sadece bir utility function')
				WHEN gs = 3 THEN jsonb_build_array('Birlikte çalışan, state paylaşan component grupları','Sadece bir component','Sadece bir hook','Sadece bir utility')
				WHEN gs = 4 THEN jsonb_build_array('Component tree''deki hataları yakalayan component, class component gerekli','Sadece bir error handler','Sadece bir try-catch','Sadece bir console.error')
				WHEN gs = 5 THEN jsonb_build_array('Component''i DOM tree''nin farklı yerine render etme, createPortal','Sadece normal render','Sadece conditional render','Sadece no render')
				WHEN gs = 6 THEN jsonb_build_array('Ref''i child component''ten parent''a geçirme, forwardRef','Sadece bir prop geçirme','Sadece bir state geçirme','Sadece bir method geçirme')
				WHEN gs = 7 THEN jsonb_build_array('Async işlemler için loading state yönetimi, fallback UI','Sadece bir loading component','Sadece bir error component','Sadece bir success component')
				WHEN gs = 8 THEN jsonb_build_array('React 18 concurrent rendering, interruptible, priority-based','Sadece synchronous rendering','Sadece blocking rendering','Sadece manual rendering')
				WHEN gs = 9 THEN jsonb_build_array('Next.js 13+ server-side component, zero client bundle','Sadece client component','Sadece hybrid component','Sadece static component')
				WHEN gs = 10 THEN jsonb_build_array('Pattern''leri doğru kullanmak, over-engineering önlemek, maintainability','Sadece her zaman complex pattern','Sadece hiç pattern kullanmamak','Sadece random pattern')
				WHEN gs = 11 THEN jsonb_build_array('Custom hooks ile logic extraction, reusable logic','Sadece component içinde logic','Sadece global function','Sadece no logic')
				WHEN gs = 12 THEN jsonb_build_array('Provider pattern, context ile global state','Sadece props drilling','Sadece global variable','Sadece local state')
				WHEN gs = 13 THEN jsonb_build_array('Compound component pattern, flexible API design','Sadece single component','Sadece no composition','Sadece hard-coded structure')
				WHEN gs = 14 THEN jsonb_build_array('Advanced pattern testing, pattern-specific test strategies','Sadece basic testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Advanced Patterns ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'advanced-patterns',
			'explanation', 'Advanced Patterns hakkında bilgi testi'
		)
	),
	70,
	'advanced-patterns',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 15: Deployment Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-react-mod15-test-%02s', gs),
	'course-react-roadmap',
	FORMAT('15. Deployment Testleri - Test %s', gs),
	'React uygulamalarının deployment süreçleri hakkında bilgi testi.',
	'React.js',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-react-mod15-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Production build nedir?'
				WHEN gs = 2 THEN 'Environment variables nedir?'
				WHEN gs = 3 THEN 'Vercel deployment nedir?'
				WHEN gs = 4 THEN 'Netlify deployment nedir?'
				WHEN gs = 5 THEN 'AWS S3 + CloudFront nedir?'
				WHEN gs = 6 THEN 'Docker containerization nedir?'
				WHEN gs = 7 THEN 'CI/CD pipeline nedir?'
				WHEN gs = 8 THEN 'GitHub Actions nedir?'
				WHEN gs = 9 THEN 'Performance monitoring nedir?'
				WHEN gs = 10 THEN 'Deployment best practices nelerdir?'
				ELSE FORMAT('Deployment hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Optimize edilmiş, minified production bundle, npm run build','Sadece development build','Sadece source code','Sadece test build')
				WHEN gs = 2 THEN jsonb_build_array('Uygulama konfigürasyonu için değişkenler, .env files, process.env','Sadece hard-coded values','Sadece config files','Sadece constants')
				WHEN gs = 3 THEN jsonb_build_array('Serverless platform, automatic deployments, edge functions','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 4 THEN jsonb_build_array('Static site hosting, serverless functions, form handling','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 5 THEN jsonb_build_array('AWS static hosting, S3 storage, CloudFront CDN','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 6 THEN jsonb_build_array('Containerization, portable application, Docker image','Sadece bir virtualization','Sadece bir build tool','Sadece bir deployment tool')
				WHEN gs = 7 THEN jsonb_build_array('Continuous Integration/Deployment, automated testing ve deployment','Sadece manual deployment','Sadece no automation','Sadece manual testing')
				WHEN gs = 8 THEN jsonb_build_array('GitHub''ın CI/CD platformu, workflow automation','Sadece bir version control','Sadece bir issue tracker','Sadece bir code review')
				WHEN gs = 9 THEN jsonb_build_array('Production performance tracking, error monitoring, analytics','Sadece development monitoring','Sadece no monitoring','Sadece manual check')
				WHEN gs = 10 THEN jsonb_build_array('Environment separation, rollback strategy, health checks','Sadece direct production','Sadece no strategy','Sadece manual deployment')
				WHEN gs = 11 THEN jsonb_build_array('Build optimization, code splitting, asset optimization','Sadece no optimization','Sadece single bundle','Sadece manual optimization')
				WHEN gs = 12 THEN jsonb_build_array('Security best practices, environment variables, secrets management','Sadece hard-coded secrets','Sadece no security','Sadece manual security')
				WHEN gs = 13 THEN jsonb_build_array('Deployment testing, staging environment, smoke tests','Sadece no testing','Sadece production only','Sadece manual testing')
				WHEN gs = 14 THEN jsonb_build_array('Deployment documentation, runbooks, incident response','Sadece no documentation','Sadece no runbooks','Sadece manual response')
				ELSE jsonb_build_array('Deployment ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'deployment',
			'explanation', 'Deployment hakkında bilgi testi'
		)
	),
	70,
	'deployment',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

COMMIT;
