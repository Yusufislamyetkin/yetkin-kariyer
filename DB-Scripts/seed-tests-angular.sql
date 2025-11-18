-- Angular Tests Seed
-- Course ile aynı 15 modül yapısı, her modülde 10+ test içeriği
BEGIN;

-- Modül 1: Angular Tanıyalım Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod01-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('1. Angular Tanıyalım Testleri - Test %s', gs),
	'Angular ekosistemi ve temel kavramlar hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod01-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Angular nedir?'
				WHEN gs = 2 THEN 'Angular''ın temel avantajları nelerdir?'
				WHEN gs = 3 THEN 'Angular CLI nedir?'
				WHEN gs = 4 THEN 'Angular vs React farkı nedir?'
				WHEN gs = 5 THEN 'Angular module nedir?'
				WHEN gs = 6 THEN 'Component nedir?'
				WHEN gs = 7 THEN 'Dependency Injection nedir?'
				WHEN gs = 8 THEN 'Angular versiyonları nelerdir?'
				WHEN gs = 9 THEN 'Angular DevTools ne işe yarar?'
				WHEN gs = 10 THEN 'Angular architecture nedir?'
				ELSE FORMAT('Angular temel kavramları hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('TypeScript tabanlı full-stack framework, component-based architecture','Sadece bir kütüphane','Sadece bir build tool','Sadece bir test framework')
				WHEN gs = 2 THEN jsonb_build_array('TypeScript, DI, routing, forms built-in, opinionated structure','Sadece hızlı olması','Sadece küçük projeler için','Sadece web için')
				WHEN gs = 3 THEN jsonb_build_array('Angular projeleri oluşturmak ve yönetmek için command-line tool','Sadece bir text editor','Sadece bir package manager','Sadece bir deployment tool')
				WHEN gs = 4 THEN jsonb_build_array('Angular full framework, React kütüphane; Angular opinionated, React flexible','Hiçbir fark yok','Angular sadece mobil için','React sadece web için')
				WHEN gs = 5 THEN jsonb_build_array('İlgili component, directive, service''leri gruplayan yapı','Sadece bir component','Sadece bir service','Sadece bir directive')
				WHEN gs = 6 THEN jsonb_build_array('UI''ın yeniden kullanılabilir parçaları, template ve logic içerir','Sadece bir template','Sadece bir class','Sadece bir service')
				WHEN gs = 7 THEN jsonb_build_array('Bağımlılıkları otomatik inject etme sistemi, test edilebilirlik','Sadece bir import mekanizması','Sadece bir export mekanizması','Sadece bir module sistemi')
				WHEN gs = 8 THEN jsonb_build_array('Angular 2+, major version updates, breaking changes','Sadece AngularJS','Sadece Angular 1','Sadece no versions')
				WHEN gs = 9 THEN jsonb_build_array('Angular uygulamalarını debug etmek için browser extension','Sadece bir text editor','Sadece bir package manager','Sadece bir build tool')
				WHEN gs = 10 THEN jsonb_build_array('Component-based, module-based, DI, unidirectional data flow','Sadece MVC pattern','Sadece MVVM pattern','Sadece no architecture')
				WHEN gs = 11 THEN jsonb_build_array('Angular''da TypeScript kullanımı, type safety, better tooling','Sadece JavaScript kullanmak','Sadece Dart kullanmak','Sadece no language')
				WHEN gs = 12 THEN jsonb_build_array('Angular''da AOT compilation, build-time optimization','Sadece JIT compilation','Sadece no compilation','Sadece manual compilation')
				WHEN gs = 13 THEN jsonb_build_array('Angular''da change detection, zone.js, automatic updates','Sadece manual updates','Sadece no updates','Sadece event-based')
				WHEN gs = 14 THEN jsonb_build_array('Angular''da lazy loading, code splitting, performance','Sadece eager loading','Sadece no loading','Sadece manual loading')
				ELSE jsonb_build_array('Angular temel kavramları ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'Angular temel kavramları hakkında bilgi testi'
		)
	),
	70,
	'angular-basics',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 2: TypeScript Temelleri Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod02-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('2. TypeScript Temelleri Testleri - Test %s', gs),
	'TypeScript programlama dili hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod02-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'TypeScript nedir?'
				WHEN gs = 2 THEN 'Type annotations nedir?'
				WHEN gs = 3 THEN 'Interfaces nedir?'
				WHEN gs = 4 THEN 'Classes nedir?'
				WHEN gs = 5 THEN 'Generics nedir?'
				WHEN gs = 6 THEN 'Decorators nedir?'
				WHEN gs = 7 THEN 'Enums nedir?'
				WHEN gs = 8 THEN 'Type guards nedir?'
				WHEN gs = 9 THEN 'Utility types nedir?'
				WHEN gs = 10 THEN 'TypeScript best practices nelerdir?'
				ELSE FORMAT('TypeScript hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript''e type safety ekleyen superset, compile-time type checking','Sadece bir framework','Sadece bir library','Sadece bir build tool')
				WHEN gs = 2 THEN jsonb_build_array('Değişkenlere type belirtme, :type syntax, compile-time checking','Sadece runtime checking','Sadece no checking','Sadece manual checking')
				WHEN gs = 3 THEN jsonb_build_array('Object shape tanımlama, contract specification, type safety','Sadece bir class','Sadece bir type alias','Sadece bir enum')
				WHEN gs = 4 THEN jsonb_build_array('OOP class yapısı, inheritance, encapsulation','Sadece bir interface','Sadece bir type','Sadece bir function')
				WHEN gs = 5 THEN jsonb_build_array('Reusable type parameters, <T> syntax, type flexibility','Sadece bir type','Sadece bir interface','Sadece bir class')
				WHEN gs = 6 THEN jsonb_build_array('Metadata ekleme, @decorator syntax, Angular''da yaygın','Sadece bir annotation','Sadece bir comment','Sadece bir attribute')
				WHEN gs = 7 THEN jsonb_build_array('Named constant set, enum keyword, type safety','Sadece bir object','Sadece bir array','Sadece bir string')
				WHEN gs = 8 THEN jsonb_build_array('Runtime type checking, typeof, instanceof, type narrowing','Sadece compile-time checking','Sadece no checking','Sadece manual checking')
				WHEN gs = 9 THEN jsonb_build_array('Built-in type utilities, Partial, Pick, Omit, Record','Sadece custom types','Sadece basic types','Sadece no types')
				WHEN gs = 10 THEN jsonb_build_array('Strict mode, explicit types, avoid any, use interfaces','Sadece any kullanmak','Sadece implicit types','Sadece no types')
				WHEN gs = 11 THEN jsonb_build_array('TypeScript''te readonly modifier, immutability','Sadece mutable properties','Sadece no modifier','Sadece const modifier')
				WHEN gs = 12 THEN jsonb_build_array('TypeScript''te union types, | operator, multiple types','Sadece single type','Sadece no type','Sadece any type')
				WHEN gs = 13 THEN jsonb_build_array('TypeScript''te intersection types, & operator, combine types','Sadece union types','Sadece no combination','Sadece any type')
				WHEN gs = 14 THEN jsonb_build_array('TypeScript''te type inference, automatic type detection','Sadece explicit types','Sadece no inference','Sadece manual types')
				ELSE jsonb_build_array('TypeScript ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'typescript',
			'explanation', 'TypeScript hakkında bilgi testi'
		)
	),
	70,
	'typescript',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 3: Components Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod03-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('3. Components Testleri - Test %s', gs),
	'Angular components hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod03-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Component nedir?'
				WHEN gs = 2 THEN 'Component decorator nedir?'
				WHEN gs = 3 THEN 'Lifecycle hooks nedir?'
				WHEN gs = 4 THEN 'ngOnInit nedir?'
				WHEN gs = 5 THEN '@Input nedir?'
				WHEN gs = 6 THEN '@Output nedir?'
				WHEN gs = 7 THEN 'ViewChild nedir?'
				WHEN gs = 8 THEN 'Content projection nedir?'
				WHEN gs = 9 THEN 'Component communication nedir?'
				WHEN gs = 10 THEN 'Component best practices nelerdir?'
				ELSE FORMAT('Components hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('UI''ın yeniden kullanılabilir parçaları, template ve logic içerir','Sadece bir template','Sadece bir class','Sadece bir service')
				WHEN gs = 2 THEN jsonb_build_array('@Component decorator, metadata tanımlama, selector, template','Sadece bir class','Sadece bir function','Sadece bir interface')
				WHEN gs = 3 THEN jsonb_build_array('Component lifecycle''da çalışan hook''lar, ngOnInit, ngOnDestroy','Sadece bir method','Sadece bir property','Sadece bir event')
				WHEN gs = 4 THEN jsonb_build_array('Component initialize olduğunda çalışan lifecycle hook','Sadece bir constructor','Sadece bir method','Sadece bir property')
				WHEN gs = 5 THEN jsonb_build_array('Parent''tan child''a veri geçirme, property binding','Sadece bir output','Sadece bir service','Sadece bir event')
				WHEN gs = 6 THEN jsonb_build_array('Child''tan parent''a event gönderme, EventEmitter','Sadece bir input','Sadece bir service','Sadece bir property')
				WHEN gs = 7 THEN jsonb_build_array('Template içindeki element''e erişim, DOM query','Sadece bir input','Sadece bir output','Sadece bir service')
				WHEN gs = 8 THEN jsonb_build_array('ng-content ile child content projection, transclusion','Sadece bir template','Sadece bir component','Sadece bir directive')
				WHEN gs = 9 THEN jsonb_build_array('Component''ler arası veri paylaşımı, @Input/@Output, services','Sadece props','Sadece state','Sadece events')
				WHEN gs = 10 THEN jsonb_build_array('OnPush strategy, change detection optimization, smart/dumb components','Sadece default strategy','Sadece no optimization','Sadece manual detection')
				WHEN gs = 11 THEN jsonb_build_array('Component''leri küçük tutmak, single responsibility, reusability','Sadece büyük component''ler','Sadece monolithic structure','Sadece no structure')
				WHEN gs = 12 THEN jsonb_build_array('Component''leri test etmek, TestBed, unit testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 13 THEN jsonb_build_array('Component''leri organize etmek, feature modules, lazy loading','Sadece single module','Sadece no organization','Sadece random structure')
				WHEN gs = 14 THEN jsonb_build_array('Component''leri optimize etmek, OnPush, trackBy, pure pipes','Sadece default strategy','Sadece no optimization','Sadece manual optimization')
				ELSE jsonb_build_array('Components ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'Components hakkında bilgi testi'
		)
	),
	70,
	'components',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 4: Templates ve Data Binding Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod04-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('4. Templates ve Data Binding Testleri - Test %s', gs),
	'Angular templates ve data binding hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod04-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Template nedir?'
				WHEN gs = 2 THEN 'Interpolation nedir?'
				WHEN gs = 3 THEN 'Property binding nedir?'
				WHEN gs = 4 THEN 'Event binding nedir?'
				WHEN gs = 5 THEN 'Two-way data binding nedir?'
				WHEN gs = 6 THEN 'Template expressions nedir?'
				WHEN gs = 7 THEN 'Safe navigation operator nedir?'
				WHEN gs = 8 THEN 'Change detection nedir?'
				WHEN gs = 9 THEN 'Template reference variables nedir?'
				WHEN gs = 10 THEN 'Template best practices nelerdir?'
				ELSE FORMAT('Templates ve Data Binding hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Component''in HTML view''ı, Angular template syntax','Sadece bir HTML file','Sadece bir CSS file','Sadece bir JavaScript file')
				WHEN gs = 2 THEN jsonb_build_array('{{ }} syntax ile değer gösterme, double curly braces','Sadece single braces','Sadece square brackets','Sadece parentheses')
				WHEN gs = 3 THEN jsonb_build_array('[property]="value" syntax, component''ten template''e veri','Sadece interpolation','Sadece event binding','Sadece two-way binding')
				WHEN gs = 4 THEN jsonb_build_array('(event)="handler" syntax, template''ten component''e event','Sadece property binding','Sadece interpolation','Sadece two-way binding')
				WHEN gs = 5 THEN jsonb_build_array('[(ngModel)] syntax, component ve template arasında iki yönlü bağlama','Sadece property binding','Sadece event binding','Sadece interpolation')
				WHEN gs = 6 THEN jsonb_build_array('Template içinde JavaScript expressions, {{ expression }}','Sadece string literals','Sadece numbers','Sadece booleans')
				WHEN gs = 7 THEN jsonb_build_array('?. operator, null/undefined kontrolü, safe property access','Sadece . operator','Sadece [] operator','Sadece () operator')
				WHEN gs = 8 THEN jsonb_build_array('Angular''ın değişiklikleri tespit etme mekanizması, zone.js','Sadece manual updates','Sadece no detection','Sadece event-based')
				WHEN gs = 9 THEN jsonb_build_array('#variable syntax, template içinde element referansı','Sadece interpolation','Sadece property binding','Sadece event binding')
				WHEN gs = 10 THEN jsonb_build_array('Safe navigation, avoid complex expressions, OnPush strategy','Sadece complex expressions','Sadece no optimization','Sadece default strategy')
				WHEN gs = 11 THEN jsonb_build_array('Template''te pipe kullanımı, data transformation, | operator','Sadece direct transformation','Sadece no transformation','Sadece manual transformation')
				WHEN gs = 12 THEN jsonb_build_array('Template''te *ngIf, *ngFor gibi structural directives','Sadece attribute directives','Sadece no directives','Sadece custom directives')
				WHEN gs = 13 THEN jsonb_build_array('Template''te trackBy function, *ngFor optimization','Sadece no tracking','Sadece index tracking','Sadece manual tracking')
				WHEN gs = 14 THEN jsonb_build_array('Template''te async pipe, observable handling, automatic subscription','Sadece manual subscription','Sadece no subscription','Sadece promise handling')
				ELSE jsonb_build_array('Templates ve Data Binding ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'templates',
			'explanation', 'Templates ve Data Binding hakkında bilgi testi'
		)
	),
	70,
	'templates',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 5: Directives Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod05-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('5. Directives Testleri - Test %s', gs),
	'Angular directives hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod05-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Directive nedir?'
				WHEN gs = 2 THEN 'Structural directives nedir?'
				WHEN gs = 3 THEN 'Attribute directives nedir?'
				WHEN gs = 4 THEN 'ngClass nedir?'
				WHEN gs = 5 THEN 'ngStyle nedir?'
				WHEN gs = 6 THEN 'Custom directives nasıl oluşturulur?'
				WHEN gs = 7 THEN 'HostListener nedir?'
				WHEN gs = 8 THEN 'HostBinding nedir?'
				WHEN gs = 9 THEN 'Directive vs Component farkı nedir?'
				WHEN gs = 10 THEN 'Directive best practices nelerdir?'
				ELSE FORMAT('Directives hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('DOM element''lerine davranış ekleyen yapı, @Directive decorator','Sadece bir component','Sadece bir service','Sadece bir pipe')
				WHEN gs = 2 THEN jsonb_build_array('DOM yapısını değiştiren directive''ler, *ngIf, *ngFor','Sadece attribute directives','Sadece components','Sadece services')
				WHEN gs = 3 THEN jsonb_build_array('Element attribute''lerini değiştiren directive''ler, ngClass, ngStyle','Sadece structural directives','Sadece components','Sadece services')
				WHEN gs = 4 THEN jsonb_build_array('CSS class''larını dinamik olarak ekleme/çıkarma, [ngClass]','Sadece static classes','Sadece inline styles','Sadece no classes')
				WHEN gs = 5 THEN jsonb_build_array('Inline style''ları dinamik olarak ayarlama, [ngStyle]','Sadece static styles','Sadece CSS classes','Sadece no styles')
				WHEN gs = 6 THEN jsonb_build_array('@Directive decorator, selector, HostListener/HostBinding','Sadece @Component','Sadece @Injectable','Sadece @Pipe')
				WHEN gs = 7 THEN jsonb_build_array('Host element event''lerini dinleme, @HostListener decorator','Sadece @HostBinding','Sadece @Input','Sadece @Output')
				WHEN gs = 8 THEN jsonb_build_array('Host element property''lerini bağlama, @HostBinding decorator','Sadece @HostListener','Sadece @Input','Sadece @Output')
				WHEN gs = 9 THEN jsonb_build_array('Directive davranış ekler, Component template içerir','Hiçbir fark yok','Directive template içerir','Component davranış ekler')
				WHEN gs = 10 THEN jsonb_build_array('Reusable directive''ler, single responsibility, performance','Sadece complex directives','Sadece no reusability','Sadece no optimization')
				WHEN gs = 11 THEN jsonb_build_array('Directive''leri test etmek, TestBed, unit testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 12 THEN jsonb_build_array('Directive''leri organize etmek, shared module, feature module','Sadece single module','Sadece no organization','Sadece random structure')
				WHEN gs = 13 THEN jsonb_build_array('Directive''leri optimize etmek, OnPush, change detection','Sadece default strategy','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 14 THEN jsonb_build_array('Directive''lerde selector specificity, attribute vs element','Sadece element selector','Sadece class selector','Sadece no selector')
				ELSE jsonb_build_array('Directives ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'directives',
			'explanation', 'Directives hakkında bilgi testi'
		)
	),
	70,
	'directives',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 6: Services ve Dependency Injection Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod06-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('6. Services ve Dependency Injection Testleri - Test %s', gs),
	'Services ve DI hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod06-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Service nedir?'
				WHEN gs = 2 THEN 'Dependency Injection nedir?'
				WHEN gs = 3 THEN 'Injectable decorator nedir?'
				WHEN gs = 4 THEN 'Provider types nelerdir?'
				WHEN gs = 5 THEN 'Singleton services nedir?'
				WHEN gs = 6 THEN 'Hierarchical DI nedir?'
				WHEN gs = 7 THEN 'InjectionToken nedir?'
				WHEN gs = 8 THEN 'Optional dependencies nedir?'
				WHEN gs = 9 THEN 'Service patterns nelerdir?'
				WHEN gs = 10 THEN 'Service best practices nelerdir?'
				ELSE FORMAT('Services ve DI hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Business logic ve data işlemleri için kullanılan class, @Injectable','Sadece bir component','Sadece bir directive','Sadece bir pipe')
				WHEN gs = 2 THEN jsonb_build_array('Bağımlılıkları otomatik inject etme sistemi, constructor injection','Sadece manual injection','Sadece no injection','Sadece property injection')
				WHEN gs = 3 THEN jsonb_build_array('Service''i DI sistemine dahil eden decorator, @Injectable()','Sadece @Component','Sadece @Directive','Sadece @Pipe')
				WHEN gs = 4 THEN jsonb_build_array('providedIn: root, module, component, hierarchical','Sadece root','Sadece module','Sadece component')
				WHEN gs = 5 THEN jsonb_build_array('Uygulama genelinde tek instance, providedIn: root','Sadece multiple instances','Sadece no instance','Sadece lazy instance')
				WHEN gs = 6 THEN jsonb_build_array('Module ve component seviyesinde DI hierarchy, child injectors','Sadece root level','Sadece no hierarchy','Sadece flat structure')
				WHEN gs = 7 THEN jsonb_build_array('Non-class dependency injection için token, interface injection','Sadece class injection','Sadece no injection','Sadece manual injection')
				WHEN gs = 8 THEN jsonb_build_array('@Optional decorator, dependency yoksa null, error önleme','Sadece required dependencies','Sadece no optional','Sadece always error')
				WHEN gs = 9 THEN jsonb_build_array('Repository pattern, facade pattern, singleton pattern','Sadece no patterns','Sadece single pattern','Sadece random patterns')
				WHEN gs = 10 THEN jsonb_build_array('Single responsibility, testable services, providedIn: root','Sadece multiple responsibilities','Sadece no testing','Sadece component level')
				WHEN gs = 11 THEN jsonb_build_array('Service''leri organize etmek, feature services, shared services','Sadece single service','Sadece no organization','Sadece random structure')
				WHEN gs = 12 THEN jsonb_build_array('Service''leri test etmek, TestBed, mocking, unit testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 13 THEN jsonb_build_array('Service''lerde async operations, RxJS, observables','Sadece sync operations','Sadece promises','Sadece callbacks')
				WHEN gs = 14 THEN jsonb_build_array('Service''lerde error handling, try-catch, error observables','Sadece no error handling','Sadece manual handling','Sadece console.error')
				ELSE jsonb_build_array('Services ve DI ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'services',
			'explanation', 'Services ve Dependency Injection hakkında bilgi testi'
		)
	),
	70,
	'services',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 7: Routing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod07-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('7. Routing Testleri - Test %s', gs),
	'Angular Router hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod07-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Angular Router nedir?'
				WHEN gs = 2 THEN 'Routes configuration nedir?'
				WHEN gs = 3 THEN 'Route parameters nedir?'
				WHEN gs = 4 THEN 'Query parameters nedir?'
				WHEN gs = 5 THEN 'Nested routes nedir?'
				WHEN gs = 6 THEN 'Lazy loading routes nedir?'
				WHEN gs = 7 THEN 'Route guards nedir?'
				WHEN gs = 8 THEN 'CanActivate nedir?'
				WHEN gs = 9 THEN 'Programmatic navigation nedir?'
				WHEN gs = 10 THEN 'Routing best practices nelerdir?'
				ELSE FORMAT('Routing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Angular için client-side routing, RouterModule, navigation','Sadece bir HTTP client','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 2 THEN jsonb_build_array('Routes array, path, component mapping, RouterModule.forRoot','Sadece manual routing','Sadece no routing','Sadece server-side routing')
				WHEN gs = 3 THEN jsonb_build_array('URL path''teki dinamik değerler, :id, ActivatedRoute','Sadece query params','Sadece hash','Sadece anchor')
				WHEN gs = 4 THEN jsonb_build_array('URL''de ? ile başlayan parametreler, queryParams, ActivatedRoute','Sadece path params','Sadece hash','Sadece anchor')
				WHEN gs = 5 THEN jsonb_build_array('Route içinde route, children property, router-outlet','Sadece flat routes','Sadece single level','Sadece no nesting')
				WHEN gs = 6 THEN jsonb_build_array('Route module''lerini ihtiyaç duyulduğunda yükleme, loadChildren','Sadece eager loading','Sadece no loading','Sadece manual loading')
				WHEN gs = 7 THEN jsonb_build_array('Route erişimini kontrol eden interface''ler, CanActivate, CanDeactivate','Sadece route component','Sadece route path','Sadece route name')
				WHEN gs = 8 THEN jsonb_build_array('Route activation kontrolü, boolean veya Observable, guard','Sadece route component','Sadece route path','Sadece route name')
				WHEN gs = 9 THEN jsonb_build_array('Router.navigate() ile kod içinden yönlendirme','Sadece routerLink directive','Sadece href attribute','Sadece window.location')
				WHEN gs = 10 THEN jsonb_build_array('Lazy loading, route guards, route data, preloading strategy','Sadece eager loading','Sadece no guards','Sadece no strategy')
				WHEN gs = 11 THEN jsonb_build_array('Route path''lerini semantic yapmak, RESTful convention','Sadece random paths','Sadece numeric paths','Sadece short paths')
				WHEN gs = 12 THEN jsonb_build_array('Route resolver, data preloading, route activation öncesi','Sadece no resolver','Sadece manual loading','Sadece no preloading')
				WHEN gs = 13 THEN jsonb_build_array('Route error handling, 404 page, wildcard route','Sadece try-catch','Sadece console.log','Sadece alert')
				WHEN gs = 14 THEN jsonb_build_array('Route transition animation, smooth navigation, animations','Sadece instant navigation','Sadece no navigation','Sadece manual animation')
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

-- Modül 8: Forms Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod08-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('8. Forms Testleri - Test %s', gs),
	'Angular forms hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod08-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Template-driven forms nedir?'
				WHEN gs = 2 THEN 'Reactive forms nedir?'
				WHEN gs = 3 THEN 'NgModel nedir?'
				WHEN gs = 4 THEN 'FormBuilder nedir?'
				WHEN gs = 5 THEN 'FormControl nedir?'
				WHEN gs = 6 THEN 'FormGroup nedir?'
				WHEN gs = 7 THEN 'FormArray nedir?'
				WHEN gs = 8 THEN 'Form validation nedir?'
				WHEN gs = 9 THEN 'Custom validators nedir?'
				WHEN gs = 10 THEN 'Form best practices nelerdir?'
				ELSE FORMAT('Forms hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Template içinde form yönetimi, NgModel, FormsModule','Sadece reactive forms','Sadece no forms','Sadece manual forms')
				WHEN gs = 2 THEN jsonb_build_array('TypeScript içinde form yönetimi, FormBuilder, ReactiveFormsModule','Sadece template-driven','Sadece no forms','Sadece manual forms')
				WHEN gs = 3 THEN jsonb_build_array('Two-way data binding directive, [(ngModel)], template-driven forms','Sadece FormControl','Sadece FormGroup','Sadece FormArray')
				WHEN gs = 4 THEN jsonb_build_array('Form oluşturma helper service, FormBuilder.group(), reactive forms','Sadece manual FormGroup','Sadece NgModel','Sadece no builder')
				WHEN gs = 5 THEN jsonb_build_array('Tek form field kontrolü, FormControl class, reactive forms','Sadece FormGroup','Sadece FormArray','Sadece NgModel')
				WHEN gs = 6 THEN jsonb_build_array('Form field''larını gruplayan yapı, FormGroup class','Sadece FormControl','Sadece FormArray','Sadece NgModel')
				WHEN gs = 7 THEN jsonb_build_array('Dinamik form field listesi, FormArray class, array handling','Sadece FormControl','Sadece FormGroup','Sadece NgModel')
				WHEN gs = 8 THEN jsonb_build_array('Form verilerinin doğruluğunu kontrol etme, validators, errors','Sadece no validation','Sadece manual check','Sadece server-side only')
				WHEN gs = 9 THEN jsonb_build_array('Kendi validator fonksiyonlarınızı oluşturma, Validators.compose','Sadece built-in validators','Sadece no validators','Sadece manual validation')
				WHEN gs = 10 THEN jsonb_build_array('Reactive forms kullanmak, custom validators, error handling','Sadece template-driven only','Sadece no validation','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('Form state management, touched, dirty, pristine, valid','Sadece no state','Sadece manual state','Sadece server state')
				WHEN gs = 12 THEN jsonb_build_array('Form submission handling, preventDefault, async submit','Sadece default submit','Sadece no submit','Sadece manual submit')
				WHEN gs = 13 THEN jsonb_build_array('Form field dependencies, conditional validation, cross-field','Sadece independent fields','Sadece no dependencies','Sadece manual handling')
				WHEN gs = 14 THEN jsonb_build_array('Form testing, TestBed, form interaction test, validation test','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Forms ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'explanation', 'Forms hakkında bilgi testi'
		)
	),
	70,
	'forms',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 9: HTTP Client Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod09-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('9. HTTP Client Testleri - Test %s', gs),
	'Angular HttpClient hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod09-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'HttpClient nedir?'
				WHEN gs = 2 THEN 'GET request nasıl yapılır?'
				WHEN gs = 3 THEN 'POST request nasıl yapılır?'
				WHEN gs = 4 THEN 'HttpInterceptor nedir?'
				WHEN gs = 5 THEN 'Error handling nedir?'
				WHEN gs = 6 THEN 'Request headers nedir?'
				WHEN gs = 7 THEN 'Response handling nedir?'
				WHEN gs = 8 THEN 'Custom interceptors nedir?'
				WHEN gs = 9 THEN 'Loading states nedir?'
				WHEN gs = 10 THEN 'HTTP best practices nelerdir?'
				ELSE FORMAT('HTTP Client hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Angular HTTP client service, Observable-based, HttpClientModule','Sadece fetch API','Sadece XMLHttpRequest','Sadece jQuery')
				WHEN gs = 2 THEN jsonb_build_array('http.get(url), Observable döner, subscribe ile handle','Sadece http.post','Sadece http.put','Sadece http.delete')
				WHEN gs = 3 THEN jsonb_build_array('http.post(url, body), Observable döner, subscribe ile handle','Sadece http.get','Sadece http.put','Sadece http.delete')
				WHEN gs = 4 THEN jsonb_build_array('HTTP request/response middleware, intercept, transform','Sadece bir HTTP client','Sadece bir service','Sadece bir component')
				WHEN gs = 5 THEN jsonb_build_array('catchError operator, error handling, retry logic','Sadece no error handling','Sadece try-catch','Sadece console.error')
				WHEN gs = 6 THEN jsonb_build_array('HttpHeaders, request headers ekleme, authorization, content-type','Sadece no headers','Sadece default headers','Sadece manual headers')
				WHEN gs = 7 THEN jsonb_build_array('Observable operators, map, tap, catchError, response transformation','Sadece raw response','Sadece no transformation','Sadece manual transformation')
				WHEN gs = 8 THEN jsonb_build_array('HttpInterceptor interface implement, intercept method, provideHTTP_INTERCEPTORS','Sadece built-in interceptors','Sadece no interceptors','Sadece manual interceptors')
				WHEN gs = 9 THEN jsonb_build_array('Loading state yönetimi, BehaviorSubject, async pipe','Sadece no loading state','Sadece manual state','Sadece component state')
				WHEN gs = 10 THEN jsonb_build_array('Error handling, retry logic, timeout, interceptors','Sadece basic requests','Sadece no error handling','Sadece manual handling')
				WHEN gs = 11 THEN jsonb_build_array('HTTP request cancellation, unsubscribe, takeUntil','Sadece her zaman subscribe','Sadece no cancellation','Sadece manual cancellation')
				WHEN gs = 12 THEN jsonb_build_array('HTTP response caching, shareReplay, cache interceptor','Sadece no caching','Sadece manual caching','Sadece server caching')
				WHEN gs = 13 THEN jsonb_build_array('HTTP authentication, token interceptor, refresh token','Sadece no auth','Sadece basic auth','Sadece manual auth')
				WHEN gs = 14 THEN jsonb_build_array('HTTP testing, HttpClientTestingModule, mock responses','Sadece manual testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('HTTP Client ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'http',
			'explanation', 'HTTP Client hakkında bilgi testi'
		)
	),
	70,
	'http-client',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 10: RxJS Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod10-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('10. RxJS Testleri - Test %s', gs),
	'RxJS observables ve operators hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod10-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'RxJS nedir?'
				WHEN gs = 2 THEN 'Observables nedir?'
				WHEN gs = 3 THEN 'Operators nedir?'
				WHEN gs = 4 THEN 'map operator nedir?'
				WHEN gs = 5 THEN 'switchMap nedir?'
				WHEN gs = 6 THEN 'Subject nedir?'
				WHEN gs = 7 THEN 'BehaviorSubject nedir?'
				WHEN gs = 8 THEN 'AsyncPipe nedir?'
				WHEN gs = 9 THEN 'Memory leaks önleme nedir?'
				WHEN gs = 10 THEN 'RxJS best practices nelerdir?'
				ELSE FORMAT('RxJS hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Reactive Extensions for JavaScript, Observable-based programming','Sadece bir HTTP client','Sadece bir state management','Sadece bir UI library')
				WHEN gs = 2 THEN jsonb_build_array('Asenkron veri stream''leri, lazy execution, subscribe pattern','Sadece Promise','Sadece callback','Sadece event')
				WHEN gs = 3 THEN jsonb_build_array('Observable transformation fonksiyonları, pipe, map, filter','Sadece methods','Sadece properties','Sadece events')
				WHEN gs = 4 THEN jsonb_build_array('Value transformation operator, map(value => transformed)','Sadece filter','Sadece reduce','Sadece tap')
				WHEN gs = 5 THEN jsonb_build_array('Higher-order mapping operator, inner observable switch, cancel previous','Sadece map','Sadece mergeMap','Sadece concatMap')
				WHEN gs = 6 THEN jsonb_build_array('Multicast observable, next() ile değer gönderme, both Observable ve Observer','Sadece Observable','Sadece Observer','Sadece Promise')
				WHEN gs = 7 THEN jsonb_build_array('Subject with initial value, current value tutar, getValue()','Sadece Subject','Sadece ReplaySubject','Sadece AsyncSubject')
				WHEN gs = 8 THEN jsonb_build_array('Template pipe, observable subscribe/unsubscribe otomatik, async pipe','Sadece manual subscription','Sadece no subscription','Sadece promise handling')
				WHEN gs = 9 THEN jsonb_build_array('Unsubscribe, takeUntil, async pipe, OnDestroy lifecycle','Sadece always subscribe','Sadece no unsubscribe','Sadece manual leak')
				WHEN gs = 10 THEN jsonb_build_array('Unsubscribe, operator chaining, error handling, shareReplay','Sadece no unsubscribe','Sadece no chaining','Sadece no error handling')
				WHEN gs = 11 THEN jsonb_build_array('RxJS operators, filter, debounceTime, distinctUntilChanged','Sadece basic operators','Sadece no operators','Sadece manual filtering')
				WHEN gs = 12 THEN jsonb_build_array('RxJS error handling, catchError, retry, retryWhen','Sadece no error handling','Sadece manual handling','Sadece console.error')
				WHEN gs = 13 THEN jsonb_build_array('RxJS testing, marble testing, TestScheduler','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 14 THEN jsonb_build_array('RxJS performance, shareReplay, debounceTime, throttleTime','Sadece no optimization','Sadece manual optimization','Sadece no performance')
				ELSE jsonb_build_array('RxJS ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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
			'category', 'rxjs',
			'explanation', 'RxJS hakkında bilgi testi'
		)
	),
	70,
	'rxjs',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
FROM generate_series(1, 15) AS gs
ON CONFLICT ("id") DO NOTHING;

-- Modül 11: State Management Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod11-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('11. State Management Testleri - Test %s', gs),
	'NgRx ve state management hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod11-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'State management nedir?'
				WHEN gs = 2 THEN 'NgRx nedir?'
				WHEN gs = 3 THEN 'NgRx Store nedir?'
				WHEN gs = 4 THEN 'Actions nedir?'
				WHEN gs = 5 THEN 'Reducers nedir?'
				WHEN gs = 6 THEN 'Selectors nedir?'
				WHEN gs = 7 THEN 'Effects nedir?'
				WHEN gs = 8 THEN 'NgRx Entity nedir?'
				WHEN gs = 9 THEN 'State patterns nelerdir?'
				WHEN gs = 10 THEN 'State management best practices nelerdir?'
				ELSE FORMAT('State Management hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Uygulama state''ini merkezi olarak yönetme, predictable updates','Sadece local state','Sadece component state','Sadece no state')
				WHEN gs = 2 THEN jsonb_build_array('Angular için Redux pattern implementation, reactive state management','Sadece bir HTTP client','Sadece bir routing library','Sadece bir UI library')
				WHEN gs = 3 THEN jsonb_build_array('NgRx state container, single source of truth, Store service','Sadece bir component','Sadece bir service','Sadece bir directive')
				WHEN gs = 4 THEN jsonb_build_array('State değişikliklerini tetikleyen event''ler, Action class','Sadece Reducer','Sadece Selector','Sadece Effect')
				WHEN gs = 5 THEN jsonb_build_array('State güncelleme fonksiyonları, pure functions, immutable updates','Sadece Action','Sadece Selector','Sadece Effect')
				WHEN gs = 6 THEN jsonb_build_array('State''ten veri seçme fonksiyonları, memoized, createSelector','Sadece Action','Sadece Reducer','Sadece Effect')
				WHEN gs = 7 THEN jsonb_build_array('Side effect yönetimi, async operations, @Effect decorator','Sadece Action','Sadece Reducer','Sadece Selector')
				WHEN gs = 8 THEN jsonb_build_array('Entity collection yönetimi, adapter pattern, CRUD operations','Sadece basic state','Sadece no entities','Sadece manual entities')
				WHEN gs = 9 THEN jsonb_build_array('Flux pattern, unidirectional data flow, action-reducer-store','Sadece bidirectional flow','Sadece no pattern','Sadece manual pattern')
				WHEN gs = 10 THEN jsonb_build_array('State normalize etmek, selectors kullanmak, effects organize etmek','Sadece denormalize state','Sadece no selectors','Sadece no effects')
				WHEN gs = 11 THEN jsonb_build_array('NgRx DevTools kullanmak, time-travel debugging, state inspection','Sadece console.log','Sadece no debugging','Sadece manual debugging')
				WHEN gs = 12 THEN jsonb_build_array('NgRx state structure, feature state, root state','Sadece single state','Sadece no structure','Sadece random structure')
				WHEN gs = 13 THEN jsonb_build_array('NgRx testing, action testing, reducer testing, effect testing','Sadece manual testing','Sadece no testing','Sadece visual testing')
				WHEN gs = 14 THEN jsonb_build_array('NgRx performance, selectors memoization, OnPush strategy','Sadece no optimization','Sadece manual optimization','Sadece no performance')
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

-- Modül 12: Testing Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod12-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('12. Testing Testleri - Test %s', gs),
	'Angular testing teknikleri hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod12-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Jasmine nedir?'
				WHEN gs = 2 THEN 'Karma nedir?'
				WHEN gs = 3 THEN 'Component testing nasıl yapılır?'
				WHEN gs = 4 THEN 'Service testing nasıl yapılır?'
				WHEN gs = 5 THEN 'Mocking nedir?'
				WHEN gs = 6 THEN 'Async testing nasıl yapılır?'
				WHEN gs = 7 THEN 'E2E testing nedir?'
				WHEN gs = 8 THEN 'Test coverage nedir?'
				WHEN gs = 9 THEN 'Testing patterns nelerdir?'
				WHEN gs = 10 THEN 'Testing best practices nelerdir?'
				ELSE FORMAT('Testing hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('JavaScript test framework, BDD syntax, describe/it blocks','Sadece bir build tool','Sadece bir package manager','Sadece bir linter')
				WHEN gs = 2 THEN jsonb_build_array('Test runner, multiple browser testing, coverage reports','Sadece bir test framework','Sadece bir assertion library','Sadece bir mock library')
				WHEN gs = 3 THEN jsonb_build_array('TestBed, ComponentFixture, component render ve interaction test','Sadece console.log','Sadece manual testing','Sadece visual inspection')
				WHEN gs = 4 THEN jsonb_build_array('TestBed, service injection, HTTP testing, mocking','Sadece component testing','Sadece manual testing','Sadece no testing')
				WHEN gs = 5 THEN jsonb_build_array('Dependency''leri fake implementation ile değiştirme, spyOn, jasmine.createSpy','Sadece real dependencies','Sadece no dependencies','Sadece manual mock')
				WHEN gs = 6 THEN jsonb_build_array('fakeAsync, tick, flush, async/await, done callback','Sadece synchronous test','Sadece no async test','Sadece manual wait')
				WHEN gs = 7 THEN jsonb_build_array('End-to-end test, Protractor, Cypress, tüm uygulama flow','Sadece unit test','Sadece integration test','Sadece manual test')
				WHEN gs = 8 THEN jsonb_build_array('Test edilen kod yüzdesi, Istanbul, coverage reports','Sadece test sayısı','Sadece test süresi','Sadece test başarı oranı')
				WHEN gs = 9 THEN jsonb_build_array('AAA pattern, arrange-act-assert, test isolation','Sadece no pattern','Sadece random test','Sadece manual pattern')
				WHEN gs = 10 THEN jsonb_build_array('Test isolation, beforeEach/afterEach, maintainable tests','Sadece shared state','Sadece global state','Sadece no cleanup')
				WHEN gs = 11 THEN jsonb_build_array('Test''leri organize etmek, describe blocks, test structure','Sadece tek bir test file','Sadece no organization','Sadece random test')
				WHEN gs = 12 THEN jsonb_build_array('Test data setup, TestBed.configureTestingModule, providers','Sadece hard-coded data','Sadece no setup','Sadece manual setup')
				WHEN gs = 13 THEN jsonb_build_array('Test utilities, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA','Sadece full schema','Sadece no schema','Sadece manual schema')
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
	FORMAT('quiz-angular-mod13-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('13. Performance Testleri - Test %s', gs),
	'Angular performans optimizasyonu hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod13-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Change detection nedir?'
				WHEN gs = 2 THEN 'OnPush strategy nedir?'
				WHEN gs = 3 THEN 'TrackBy function nedir?'
				WHEN gs = 4 THEN 'Lazy loading nedir?'
				WHEN gs = 5 THEN 'AOT compilation nedir?'
				WHEN gs = 6 THEN 'Tree shaking nedir?'
				WHEN gs = 7 THEN 'Bundle optimization nedir?'
				WHEN gs = 8 THEN 'Memory leaks önleme nedir?'
				WHEN gs = 9 THEN 'Performance profiling nedir?'
				WHEN gs = 10 THEN 'Performance best practices nelerdir?'
				ELSE FORMAT('Performance hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('Angular''ın değişiklikleri tespit etme mekanizması, zone.js, automatic','Sadece manual updates','Sadece no detection','Sadece event-based')
				WHEN gs = 2 THEN jsonb_build_array('Change detection strategy, sadece @Input değiştiğinde check, OnPush','Sadece default strategy','Sadece no strategy','Sadece manual strategy')
				WHEN gs = 3 THEN jsonb_build_array('*ngFor optimization, trackBy function, DOM element reuse','Sadece no tracking','Sadece index tracking','Sadece manual tracking')
				WHEN gs = 4 THEN jsonb_build_array('Module''leri ihtiyaç duyulduğunda yükleme, loadChildren, code splitting','Sadece eager loading','Sadece no loading','Sadece manual loading')
				WHEN gs = 5 THEN jsonb_build_array('Ahead-of-Time compilation, build-time compilation, smaller bundle','Sadece JIT compilation','Sadece no compilation','Sadece manual compilation')
				WHEN gs = 6 THEN jsonb_build_array('Kullanılmayan kod''u kaldırma, dead code elimination, production build','Sadece tüm kod''u tutmak','Sadece no shaking','Sadece manual removal')
				WHEN gs = 7 THEN jsonb_build_array('Bundle boyutunu küçültmek, minification, compression, code splitting','Sadece daha fazla kod eklemek','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 8 THEN jsonb_build_array('Unsubscribe, OnDestroy, async pipe, takeUntil, memory leak önleme','Sadece always subscribe','Sadece no unsubscribe','Sadece manual leak')
				WHEN gs = 9 THEN jsonb_build_array('Performance ölçümü, Angular DevTools, Chrome DevTools, profiling','Sadece manual testing','Sadece no profiling','Sadece console.log')
				WHEN gs = 10 THEN jsonb_build_array('OnPush strategy, lazy loading, AOT, tree shaking, trackBy','Sadece default strategy','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 11 THEN jsonb_build_array('Change detection optimization, detach, markForCheck, detectChanges','Sadece always check','Sadece no optimization','Sadece manual optimization')
				WHEN gs = 12 THEN jsonb_build_array('Bundle analysis, webpack-bundle-analyzer, bundle size monitoring','Sadece no analysis','Sadece manual analysis','Sadece no monitoring')
				WHEN gs = 13 THEN jsonb_build_array('Performance metrics, Lighthouse, Web Vitals, Core Web Vitals','Sadece manual testing','Sadece no metrics','Sadece console.log')
				WHEN gs = 14 THEN jsonb_build_array('Performance monitoring, production profiling, error tracking','Sadece development profiling','Sadece no monitoring','Sadece manual check')
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

-- Modül 14: Advanced Topics Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod14-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('14. Advanced Topics Testleri - Test %s', gs),
	'İleri seviye Angular konuları hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod14-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Angular modules nedir?'
				WHEN gs = 2 THEN 'Feature modules nedir?'
				WHEN gs = 3 THEN 'Shared modules nedir?'
				WHEN gs = 4 THEN 'Pipes nedir?'
				WHEN gs = 5 THEN 'Custom pipes nedir?'
				WHEN gs = 6 THEN 'Angular animations nedir?'
				WHEN gs = 7 THEN 'i18n nedir?'
				WHEN gs = 8 THEN 'Angular Elements nedir?'
				WHEN gs = 9 THEN 'Micro-frontends nedir?'
				WHEN gs = 10 THEN 'Advanced topics best practices nelerdir?'
				ELSE FORMAT('Advanced Topics hakkında soru %s', gs)
			END,
			'options', CASE 
				WHEN gs = 1 THEN jsonb_build_array('İlgili component, directive, service''leri gruplayan yapı, @NgModule','Sadece bir component','Sadece bir service','Sadece bir directive')
				WHEN gs = 2 THEN jsonb_build_array('Feature-specific module''ler, lazy loading, feature organization','Sadece root module','Sadece shared module','Sadece no modules')
				WHEN gs = 3 THEN jsonb_build_array('Paylaşılan component, directive, pipe''lar, SharedModule','Sadece feature module','Sadece root module','Sadece no modules')
				WHEN gs = 4 THEN jsonb_build_array('Template''te data transformation, | operator, pure/impure pipes','Sadece component methods','Sadece services','Sadece directives')
				WHEN gs = 5 THEN jsonb_build_array('Kendi pipe''larınızı oluşturma, @Pipe decorator, transform method','Sadece built-in pipes','Sadece no pipes','Sadece manual transformation')
				WHEN gs = 6 THEN jsonb_build_array('Angular animation API, @angular/animations, transition, trigger','Sadece CSS animations','Sadece JavaScript animations','Sadece no animations')
				WHEN gs = 7 THEN jsonb_build_array('Internationalization, çoklu dil desteği, @angular/localize','Sadece single language','Sadece no i18n','Sadece manual translation')
				WHEN gs = 8 THEN jsonb_build_array('Angular component''lerini custom element''lere dönüştürme, Web Components','Sadece Angular components','Sadece no elements','Sadece manual elements')
				WHEN gs = 9 THEN jsonb_build_array('Birden fazla frontend uygulamasını birleştirme, module federation','Sadece single app','Sadece no federation','Sadece manual integration')
				WHEN gs = 10 THEN jsonb_build_array('Module organization, lazy loading, code splitting, performance','Sadece single module','Sadece no organization','Sadece no optimization')
				WHEN gs = 11 THEN jsonb_build_array('Angular''da standalone components, module-less components','Sadece module-based','Sadece no standalone','Sadece manual components')
				WHEN gs = 12 THEN jsonb_build_array('Angular''da signals, reactive primitives, fine-grained reactivity','Sadece observables','Sadece no signals','Sadece manual reactivity')
				WHEN gs = 13 THEN jsonb_build_array('Angular''da server-side rendering, Angular Universal, SSR','Sadece client-side only','Sadece no SSR','Sadece manual rendering')
				WHEN gs = 14 THEN jsonb_build_array('Advanced topics testing, integration testing, E2E testing','Sadece unit testing','Sadece no testing','Sadece visual testing')
				ELSE jsonb_build_array('Advanced Topics ile ilgili doğru cevap','Yanlış seçenek 1','Yanlış seçenek 2','Yanlış seçenek 3')
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

-- Modül 15: Deployment Testleri (15 test)
INSERT INTO "quizzes" ("id","courseId","title","description","topic","type","level","questions","passingScore","lessonSlug","createdAt","updatedAt")
SELECT
	FORMAT('quiz-angular-mod15-test-%02s', gs),
	'course-angular-roadmap',
	FORMAT('15. Deployment Testleri - Test %s', gs),
	'Angular uygulamalarının deployment süreçleri hakkında bilgi testi.',
	'Angular',
	'TEST',
	'intermediate',
	jsonb_build_array(
		jsonb_build_object(
			'id', FORMAT('q-angular-mod15-%02s', gs),
			'question', CASE 
				WHEN gs = 1 THEN 'Production build nedir?'
				WHEN gs = 2 THEN 'Environment configuration nedir?'
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
				WHEN gs = 1 THEN jsonb_build_array('Optimize edilmiş, minified production bundle, ng build --prod','Sadece development build','Sadece source code','Sadece test build')
				WHEN gs = 2 THEN jsonb_build_array('Environment-specific config, environment.ts files, replace','Sadece hard-coded values','Sadece single config','Sadece no config')
				WHEN gs = 3 THEN jsonb_build_array('Serverless platform, automatic deployments, edge functions','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 4 THEN jsonb_build_array('Static site hosting, serverless functions, form handling','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 5 THEN jsonb_build_array('AWS static hosting, S3 storage, CloudFront CDN','Sadece bir hosting service','Sadece bir build tool','Sadece bir CI/CD tool')
				WHEN gs = 6 THEN jsonb_build_array('Containerization, portable application, Docker image','Sadece bir virtualization','Sadece bir build tool','Sadece bir deployment tool')
				WHEN gs = 7 THEN jsonb_build_array('Continuous Integration/Deployment, automated testing ve deployment','Sadece manual deployment','Sadece no automation','Sadece manual testing')
				WHEN gs = 8 THEN jsonb_build_array('GitHub''ın CI/CD platformu, workflow automation','Sadece bir version control','Sadece bir issue tracker','Sadece bir code review')
				WHEN gs = 9 THEN jsonb_build_array('Production performance tracking, error monitoring, analytics','Sadece development monitoring','Sadece no monitoring','Sadece manual check')
				WHEN gs = 10 THEN jsonb_build_array('Environment separation, rollback strategy, health checks','Sadece direct production','Sadece no strategy','Sadece manual deployment')
				WHEN gs = 11 THEN jsonb_build_array('Build optimization, AOT compilation, tree shaking, code splitting','Sadece no optimization','Sadece JIT compilation','Sadece manual optimization')
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
