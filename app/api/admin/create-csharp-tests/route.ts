import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// C# Test Soruları - Her test 10 soru içerir
const C_SHARP_TEST_QUESTIONS = [
  // Test 1: C# Syntax Temelleri
  {
    id: "csharp-syntax-1",
    question: "C#'ta bir değişken tanımlamak için hangi anahtar kelime kullanılır?",
    options: [
      "var",
      "let",
      "const",
      "variable"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-2",
    question: "C#'ta bir sınıf tanımlamak için hangi anahtar kelime kullanılır?",
    options: [
      "class",
      "object",
      "struct",
      "interface"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-3",
    question: "C#'ta nullable bir değişken nasıl tanımlanır?",
    options: [
      "int? number = null;",
      "int number = null;",
      "nullable<int> number = null;",
      "int number? = null;"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-4",
    question: "C#'ta string interpolation hangi sembol ile yapılır?",
    options: [
      "$",
      "@",
      "#",
      "%"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-5",
    question: "C#'ta bir namespace tanımlamak için hangi anahtar kelime kullanılır?",
    options: [
      "namespace",
      "package",
      "module",
      "using"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-6",
    question: "C#'ta bir metodun parametreleri varsayılan değer alabilir mi?",
    options: [
      "Evet, C# 4.0'dan itibaren",
      "Hayır, hiçbir zaman",
      "Sadece static metodlarda",
      "Sadece async metodlarda"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-7",
    question: "C#'ta bir dizi (array) nasıl tanımlanır?",
    options: [
      "int[] numbers = new int[5];",
      "int numbers[] = new int[5];",
      "array<int> numbers = new array<int>(5);",
      "int numbers = new int[5];"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-8",
    question: "C#'ta bir ifadeyi bir satıra sığdırmak için hangi operatör kullanılır?",
    options: [
      "=>",
      "->",
      "::",
      "++"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-9",
    question: "C#'ta readonly ile const arasındaki fark nedir?",
    options: [
      "readonly runtime'da, const compile-time'da değer alır",
      "const runtime'da, readonly compile-time'da değer alır",
      "Hiçbir fark yok",
      "readonly sadece sınıflarda, const sadece metodlarda kullanılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-syntax-10",
    question: "C#'ta bir property'nin get ve set erişimcilerini özelleştirmek için ne kullanılır?",
    options: [
      "access modifiers (private, protected, vb.)",
      "inheritance",
      "polymorphism",
      "overloading"
    ],
    correctAnswer: 0
  },

  // Test 2: Değişkenler ve Veri Tipleri
  {
    id: "csharp-types-1",
    question: "C#'ta hangi veri tipi en büyük tam sayı değerini saklayabilir?",
    options: [
      "long",
      "int",
      "short",
      "byte"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-2",
    question: "C#'ta decimal tipinin farkı nedir?",
    options: [
      "Yüksek hassasiyetli ondalık sayılar için kullanılır",
      "Sadece tam sayılar için kullanılır",
      "Sadece string için kullanılır",
      "Sadece boolean için kullanılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-3",
    question: "C#'ta object tipi neyi temsil eder?",
    options: [
      "Tüm tiplerin base sınıfı",
      "Sadece sınıfları",
      "Sadece struct'ları",
      "Sadece interface'leri"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-4",
    question: "C#'ta boxing nedir?",
    options: [
      "Value type'ı object tipine dönüştürme",
      "Object tipini value type'a dönüştürme",
      "Bir tipi başka bir tipe cast etme",
      "Bir değişkeni başka bir değişkene atama"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-5",
    question: "C#'ta dynamic tipi ne zaman kullanılır?",
    options: [
      "Runtime'da tip kontrolü yapılmak istendiğinde",
      "Compile-time'da tip kontrolü için",
      "Sadece string işlemleri için",
      "Sadece array işlemleri için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-6",
    question: "C#'ta var anahtar kelimesi ne zaman kullanılır?",
    options: [
      "Tip çıkarımı (type inference) için",
      "Değişken tanımlama için değil",
      "Sadece class değişkenleri için",
      "Sadece method parametreleri için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-7",
    question: "C#'ta string tipi hangi tip?",
    options: [
      "Reference type",
      "Value type",
      "Pointer type",
      "Nullable type"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-8",
    question: "C#'ta struct ve class arasındaki temel fark nedir?",
    options: [
      "struct value type, class reference type",
      "struct reference type, class value type",
      "Hiçbir fark yok",
      "struct sadece primitive tipler için kullanılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-9",
    question: "C#'ta enum nedir?",
    options: [
      "Sabit değerlerin listesi",
      "Bir sınıf türü",
      "Bir interface türü",
      "Bir delegate türü"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-types-10",
    question: "C#'ta Tuple nasıl kullanılır?",
    options: [
      "Birden fazla değeri tek bir nesnede gruplamak için",
      "Sadece iki değeri gruplamak için",
      "Sadece string değerleri için",
      "Sadece numeric değerler için"
    ],
    correctAnswer: 0
  },

  // Test 3: Kontrol Yapıları
  {
    id: "csharp-control-1",
    question: "C#'ta switch expression hangi versiyondan itibaren desteklenir?",
    options: [
      "C# 8.0",
      "C# 7.0",
      "C# 6.0",
      "C# 5.0"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-2",
    question: "C#'ta pattern matching hangi yapılarda kullanılabilir?",
    options: [
      "if, switch, is",
      "Sadece if",
      "Sadece switch",
      "Sadece for"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-3",
    question: "C#'ta foreach döngüsü hangi interface'i kullanan koleksiyonlarda çalışır?",
    options: [
      "IEnumerable",
      "ICollection",
      "IList",
      "IComparable"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-4",
    question: "C#'ta break ve continue arasındaki fark nedir?",
    options: [
      "break döngüyü sonlandırır, continue bir sonraki iterasyona geçer",
      "continue döngüyü sonlandırır, break bir sonraki iterasyona geçer",
      "Hiçbir fark yok",
      "break sadece for, continue sadece while'da kullanılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-5",
    question: "C#'ta goto anahtar kelimesi ne zaman kullanılır?",
    options: [
      "Genellikle kullanılmaz, switch case'lerde bazen",
      "Her zaman kullanılır",
      "Sadece metodlarda",
      "Sadece sınıflarda"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-6",
    question: "C#'ta do-while döngüsü while'dan nasıl farklıdır?",
    options: [
      "do-while en az bir kez çalışır",
      "while en az bir kez çalışır",
      "Hiçbir fark yok",
      "do-while sadece async metodlarda çalışır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-7",
    question: "C#'ta nested if-else yapıları yerine ne kullanılabilir?",
    options: [
      "Switch-case veya pattern matching",
      "Sadece for döngüsü",
      "Sadece while döngüsü",
      "Sadece foreach döngüsü"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-8",
    question: "C#'ta ternary operator (?:) nasıl kullanılır?",
    options: [
      "condition ? valueIfTrue : valueIfFalse",
      "condition : valueIfTrue ? valueIfFalse",
      "valueIfTrue ? condition : valueIfFalse",
      "condition ? valueIfFalse : valueIfTrue"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-9",
    question: "C#'ta null-coalescing operator (??) ne işe yarar?",
    options: [
      "Null değeri kontrol eder ve varsayılan değer döner",
      "Null değeri kontrol eder ve true döner",
      "Null değeri kontrol eder ve false döner",
      "Null değeri kontrol edemez"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-control-10",
    question: "C#'ta switch-case yapısında default case ne zaman çalışır?",
    options: [
      "Hiçbir case eşleşmediğinde",
      "Her zaman ilk çalışır",
      "Her zaman son çalışır",
      "Hiçbir zaman çalışmaz"
    ],
    correctAnswer: 0
  },

  // Test 4: OOP (Class, Object, Inheritance, Polymorphism)
  {
    id: "csharp-oop-1",
    question: "C#'ta inheritance (kalıtım) nasıl sağlanır?",
    options: [
      ": operatörü ile",
      "extends anahtar kelimesi ile",
      "implements anahtar kelimesi ile",
      "inherits anahtar kelimesi ile"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-2",
    question: "C#'ta bir sınıf kaç sınıftan inherit edebilir?",
    options: [
      "Bir sınıftan (single inheritance)",
      "Birden fazla sınıftan",
      "Sınırsız",
      "Hiçbir sınıftan"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-3",
    question: "C#'ta abstract class nedir?",
    options: [
      "Instance'ı oluşturulamayan, sadece inherit edilebilen sınıf",
      "Her zaman instance'ı oluşturulabilen sınıf",
      "Sadece static metodlar içeren sınıf",
      "Sadece property'ler içeren sınıf"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-4",
    question: "C#'ta virtual metod nedir?",
    options: [
      "Override edilebilen metod",
      "Override edilemeyen metod",
      "Sadece static metod",
      "Sadece private metod"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-5",
    question: "C#'ta sealed class ne anlama gelir?",
    options: [
      "Başka sınıflar tarafından inherit edilemeyen sınıf",
      "Her zaman inherit edilebilen sınıf",
      "Sadece interface implement edebilen sınıf",
      "Sadece abstract metod içeren sınıf"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-6",
    question: "C#'ta polymorphism nedir?",
    options: [
      "Aynı interface'i farklı şekillerde implement etme",
      "Sadece inheritance",
      "Sadece encapsulation",
      "Sadece abstraction"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-7",
    question: "C#'ta base anahtar kelimesi ne için kullanılır?",
    options: [
      "Parent class'ın metodlarını veya constructor'ını çağırmak için",
      "Child class'ın metodlarını çağırmak için",
      "Interface metodlarını çağırmak için",
      "Static metodları çağırmak için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-8",
    question: "C#'ta interface ve abstract class arasındaki fark nedir?",
    options: [
      "Interface'de kod implementasyonu olmaz, abstract class'ta olabilir",
      "Abstract class'ta kod implementasyonu olmaz, interface'de olabilir",
      "Hiçbir fark yok",
      "Interface sadece metodlar için, abstract class sadece property'ler için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-9",
    question: "C#'ta encapsulation ne demektir?",
    options: [
      "Verilerin ve metodların bir arada paketlenmesi",
      "Sadece verilerin paketlenmesi",
      "Sadece metodların paketlenmesi",
      "Sadece property'lerin paketlenmesi"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-oop-10",
    question: "C#'ta constructor'ın görevi nedir?",
    options: [
      "Nesne oluşturulduğunda çalışan ve ilk değerleri ayarlayan metod",
      "Nesne silindiğinde çalışan metod",
      "Sadece static değerleri ayarlayan metod",
      "Sadece property'leri ayarlayan metod"
    ],
    correctAnswer: 0
  },

  // Test 5: Collections (List, Dictionary, Array)
  {
    id: "csharp-collections-1",
    question: "C#'ta List<T> ve Array arasındaki temel fark nedir?",
    options: [
      "List dinamik boyutludur, Array sabit boyutludur",
      "Array dinamik boyutludur, List sabit boyutludur",
      "Hiçbir fark yok",
      "List sadece string için, Array sadece int için kullanılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-2",
    question: "C#'ta Dictionary<TKey, TValue> nedir?",
    options: [
      "Key-value çiftlerini saklayan koleksiyon",
      "Sadece value'ları saklayan koleksiyon",
      "Sadece key'leri saklayan koleksiyon",
      "Sıralı bir koleksiyon"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-3",
    question: "C#'ta HashSet<T> ne zaman kullanılır?",
    options: [
      "Benzersiz değerler saklamak için",
      "Sıralı değerler saklamak için",
      "Key-value çiftleri saklamak için",
      "Sadece string değerler için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-4",
    question: "C#'ta Queue<T> hangi veri yapısını temsil eder?",
    options: [
      "FIFO (First In First Out)",
      "LIFO (Last In First Out)",
      "Rastgele erişim",
      "Key-value erişimi"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-5",
    question: "C#'ta Stack<T> hangi veri yapısını temsil eder?",
    options: [
      "LIFO (Last In First Out)",
      "FIFO (First In First Out)",
      "Rastgele erişim",
      "Key-value erişimi"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-6",
    question: "C#'ta LinkedList<T> ne zaman kullanılır?",
    options: [
      "Sık ekleme/çıkarma işlemleri yapıldığında",
      "Sadece arama işlemleri yapıldığında",
      "Sadece sıralama işlemleri yapıldığında",
      "Sadece string veriler için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-7",
    question: "C#'ta ICollection<T> interface'i ne sağlar?",
    options: [
      "Add, Remove, Clear gibi temel koleksiyon işlemleri",
      "Sadece Count property",
      "Sadece iteration",
      "Sadece sorting"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-8",
    question: "C#'ta IList<T> ve ICollection<T> arasındaki fark nedir?",
    options: [
      "IList indeksli erişim sağlar",
      "ICollection indeksli erişim sağlar",
      "Hiçbir fark yok",
      "IList sadece readonly koleksiyonlar için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-9",
    question: "C#'ta SortedDictionary<TKey, TValue> ne sağlar?",
    options: [
      "Key'lere göre sıralı Dictionary",
      "Value'lara göre sıralı Dictionary",
      "Ekleme sırasına göre sıralı Dictionary",
      "Hash tabanlı Dictionary"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-collections-10",
    question: "C#'ta ReadOnlyCollection<T> ne için kullanılır?",
    options: [
      "Değiştirilemeyen koleksiyon wrapper'ı oluşturmak için",
      "Sadece okunabilir array oluşturmak için",
      "Sadece yazılabilir koleksiyon için",
      "Sadece async koleksiyon işlemleri için"
    ],
    correctAnswer: 0
  },

  // Test 6: LINQ (Where, Select, GroupBy)
  {
    id: "csharp-linq-1",
    question: "C#'ta LINQ nedir?",
    options: [
      "Language Integrated Query - veri sorgulama için",
      "Sadece database sorguları için",
      "Sadece XML işlemleri için",
      "Sadece string işlemleri için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-2",
    question: "C#'ta LINQ Where metodu ne yapar?",
    options: [
      "Koleksiyonu filtreler",
      "Koleksiyonu sıralar",
      "Koleksiyonu gruplar",
      "Koleksiyonu birleştirir"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-3",
    question: "C#'ta LINQ Select metodu ne yapar?",
    options: [
      "Koleksiyondaki her elemanı dönüştürür",
      "Koleksiyonu filtreler",
      "Koleksiyonu sıralar",
      "Koleksiyonu gruplar"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-4",
    question: "C#'ta LINQ GroupBy metodu ne yapar?",
    options: [
      "Koleksiyonu belirtilen key'e göre gruplar",
      "Koleksiyonu sıralar",
      "Koleksiyonu filtreler",
      "Koleksiyonu birleştirir"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-5",
    question: "C#'ta LINQ First() ve FirstOrDefault() arasındaki fark nedir?",
    options: [
      "First() bulamazsa exception fırlatır, FirstOrDefault() default değer döner",
      "FirstOrDefault() bulamazsa exception fırlatır, First() default değer döner",
      "Hiçbir fark yok",
      "First() sadece int için, FirstOrDefault() sadece string için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-6",
    question: "C#'ta LINQ OrderBy metodu ne yapar?",
    options: [
      "Koleksiyonu artan sırada sıralar",
      "Koleksiyonu azalan sırada sıralar",
      "Koleksiyonu filtreler",
      "Koleksiyonu gruplar"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-7",
    question: "C#'ta LINQ Any() metodu ne kontrol eder?",
    options: [
      "Koleksiyonda koşula uyan en az bir eleman var mı",
      "Koleksiyonda tüm elemanlar koşula uyuyor mu",
      "Koleksiyon boş mu",
      "Koleksiyon sıralı mı"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-8",
    question: "C#'ta LINQ All() metodu ne kontrol eder?",
    options: [
      "Koleksiyondaki tüm elemanlar koşula uyuyor mu",
      "Koleksiyonda en az bir eleman koşula uyuyor mu",
      "Koleksiyon boş mu",
      "Koleksiyon sıralı mı"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-9",
    question: "C#'ta LINQ Join metodu ne yapar?",
    options: [
      "İki koleksiyonu birleştirir",
      "Koleksiyonu filtreler",
      "Koleksiyonu sıralar",
      "Koleksiyonu gruplar"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-linq-10",
    question: "C#'ta LINQ query syntax ve method syntax arasındaki fark nedir?",
    options: [
      "Sadece yazım şekli farklıdır, derlenince aynı koda dönüşür",
      "Query syntax sadece database için kullanılır",
      "Method syntax sadece in-memory koleksiyonlar için kullanılır",
      "Hiçbir fark yok"
    ],
    correctAnswer: 0
  },

  // Test 7: Async/Await
  {
    id: "csharp-async-1",
    question: "C#'ta async anahtar kelimesi ne için kullanılır?",
    options: [
      "Asenkron metod tanımlamak için",
      "Sadece thread oluşturmak için",
      "Sadece paralel işlem için",
      "Sadece lock işlemleri için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-2",
    question: "C#'ta await anahtar kelimesi ne yapar?",
    options: [
      "Asenkron işlemin tamamlanmasını bekler",
      "Asenkron işlemi iptal eder",
      "Asenkron işlemi başlatır",
      "Asenkron işlemi duraklatır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-3",
    question: "C#'ta Task<T> nedir?",
    options: [
      "T tipinde bir değer döndüren asenkron işlemi temsil eder",
      "Sadece void metodları temsil eder",
      "Sadece senkron işlemleri temsil eder",
      "Sadece thread'leri temsil eder"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-4",
    question: "C#'ta async void ne zaman kullanılır?",
    options: [
      "Sadece event handler'larda",
      "Her zaman kullanılabilir",
      "Hiçbir zaman kullanılmamalı",
      "Sadece constructor'larda"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-5",
    question: "C#'ta Task.Run() ne için kullanılır?",
    options: [
      "CPU-bound işlemleri thread pool'da çalıştırmak için",
      "IO-bound işlemleri çalıştırmak için",
      "Sadece database işlemleri için",
      "Sadece network işlemleri için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-6",
    question: "C#'ta ConfigureAwait(false) ne için kullanılır?",
    options: [
      "SynchronizationContext'e geri dönmemek için (library kodlarında)",
      "SynchronizationContext'e geri dönmek için",
      "Asenkron işlemi iptal etmek için",
      "Asenkron işlemi duraklatmak için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-7",
    question: "C#'ta Task.WhenAll() ne yapar?",
    options: [
      "Birden fazla task'ın tamamlanmasını bekler",
      "Sadece ilk task'ın tamamlanmasını bekler",
      "Task'ları sırayla çalıştırır",
      "Task'ları iptal eder"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-8",
    question: "C#'ta CancellationToken ne için kullanılır?",
    options: [
      "Asenkron işlemleri iptal etmek için",
      "Asenkron işlemleri başlatmak için",
      "Asenkron işlemleri duraklatmak için",
      "Asenkron işlemleri sıralamak için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-9",
    question: "C#'ta async/await ile thread oluşturulur mu?",
    options: [
      "Hayır, task scheduler thread pool'dan thread kullanır",
      "Evet, her await için yeni thread oluşturulur",
      "Evet, her async metod için yeni thread oluşturulur",
      "Sadece CPU-bound işlemlerde thread oluşturulur"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-async-10",
    question: "C#'ta ValueTask<T> ne zaman Task<T> yerine kullanılır?",
    options: [
      "Performans optimizasyonu için, özellikle hot path'lerde",
      "Hiçbir zaman kullanılmamalı",
      "Sadece senkron işlemler için",
      "Sadece void metodlar için"
    ],
    correctAnswer: 0
  },

  // Test 8: Exception Handling
  {
    id: "csharp-exception-1",
    question: "C#'ta try-catch-finally bloğunun sırası nedir?",
    options: [
      "try çalışır, hata varsa catch, her zaman finally",
      "try çalışır, her zaman catch, finally opsiyonel",
      "catch her zaman çalışır, try opsiyonel",
      "finally her zaman ilk çalışır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-2",
    question: "C#'ta Exception sınıfının base sınıfı nedir?",
    options: [
      "System.Exception",
      "System.Object",
      "System.Base",
      "System.Error"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-3",
    question: "C#'ta throw anahtar kelimesi ne yapar?",
    options: [
      "Bir exception fırlatır",
      "Bir exception'ı yakalar",
      "Bir exception'ı işler",
      "Bir exception'ı loglar"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-4",
    question: "C#'ta catch bloğunda exception'ı yeniden fırlatmanın yolu nedir?",
    options: [
      "throw; (mevcut stack trace korunur) veya throw ex;",
      "Sadece throw ex;",
      "Sadece throw;",
      "Yeniden fırlatılamaz"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-5",
    question: "C#'ta when anahtar kelimesi catch'de ne için kullanılır?",
    options: [
      "Koşullu exception yakalama için",
      "Exception'ı işaretlemek için",
      "Exception'ı loglamak için",
      "Exception'ı silmek için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-6",
    question: "C#'ta ArgumentException ne zaman kullanılır?",
    options: [
      "Metod parametresi geçersiz olduğunda",
      "Null reference olduğunda",
      "Index out of range olduğunda",
      "Out of memory olduğunda"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-7",
    question: "C#'ta NullReferenceException ne zaman fırlatılır?",
    options: [
      "Null bir referans üzerinde işlem yapılmaya çalışıldığında",
      "Bir değişken null olduğunda",
      "Bir metod null döndüğünde",
      "Bir property null olduğunda"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-8",
    question: "C#'ta using bloğu exception handling için ne sağlar?",
    options: [
      "IDisposable nesnelerin otomatik dispose edilmesi (try-finally benzeri)",
      "Exception yakalama",
      "Exception fırlatma",
      "Exception loglama"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-9",
    question: "C#'ta AggregateException ne için kullanılır?",
    options: [
      "Birden fazla exception'ı tek bir exception'da toplamak için",
      "Sadece tek bir exception için",
      "Exception'ları silmek için",
      "Exception'ları loglamak için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-exception-10",
    question: "C#'ta finally bloğu ne zaman çalışmaz?",
    options: [
      "Çok nadir durumlarda (out of memory, stack overflow vb.)",
      "Her zaman çalışır",
      "Sadece catch olduğunda çalışır",
      "Sadece exception fırlatıldığında çalışır"
    ],
    correctAnswer: 0
  },

  // Test 9: Generics
  {
    id: "csharp-generics-1",
    question: "C#'ta generic tip parametresi nasıl tanımlanır?",
    options: [
      "<T> şeklinde",
      "{T} şeklinde",
      "[T] şeklinde",
      "(T) şeklinde"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-2",
    question: "C#'ta generic constraint where T : class ne anlama gelir?",
    options: [
      "T bir reference type olmalı",
      "T bir value type olmalı",
      "T bir interface olmalı",
      "T bir struct olmalı"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-3",
    question: "C#'ta generic constraint where T : struct ne anlama gelir?",
    options: [
      "T bir value type olmalı",
      "T bir reference type olmalı",
      "T bir interface olmalı",
      "T bir class olmalı"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-4",
    question: "C#'ta generic constraint where T : new() ne anlama gelir?",
    options: [
      "T parametresiz constructor'a sahip olmalı",
      "T parametreli constructor'a sahip olmalı",
      "T constructor'a sahip olmamalı",
      "T static olmalı"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-5",
    question: "C#'ta generic method nasıl tanımlanır?",
    options: [
      "Metod adından önce <T> yazılır",
      "Metod adından sonra <T> yazılır",
      "Metod parametrelerinden önce <T> yazılır",
      "Metod return type'ından önce <T> yazılır"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-6",
    question: "C#'ta generic type inference nedir?",
    options: [
      "Derleyicinin generic tip parametresini otomatik çıkarması",
      "Generic tip parametresini manuel belirtme",
      "Generic tip parametresini runtime'da belirleme",
      "Generic tip parametresini silme"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-7",
    question: "C#'ta covariance (out keyword) nedir?",
    options: [
      "Daha türetilmiş tipten daha base tipe dönüştürme",
      "Daha base tipten daha türetilmiş tipe dönüştürme",
      "Aynı tip dönüşümü",
      "Tip dönüşümü yok"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-8",
    question: "C#'ta contravariance (in keyword) nedir?",
    options: [
      "Daha base tipten daha türetilmiş tipe dönüştürme",
      "Daha türetilmiş tipten daha base tipe dönüştürme",
      "Aynı tip dönüşümü",
      "Tip dönüşümü yok"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-9",
    question: "C#'ta default(T) ne döndürür?",
    options: [
      "T tipinin default değerini",
      "T tipinin ilk değerini",
      "T tipinin son değerini",
      "T tipinin rastgele değerini"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-generics-10",
    question: "C#'ta generic constraint where T : IComparable ne anlama gelir?",
    options: [
      "T IComparable interface'ini implement etmeli",
      "T bir class olmalı",
      "T bir struct olmalı",
      "T bir enum olmalı"
    ],
    correctAnswer: 0
  },

  // Test 10: Delegates ve Events
  {
    id: "csharp-delegates-1",
    question: "C#'ta delegate nedir?",
    options: [
      "Metod referanslarını saklayan tip güvenli fonksiyon pointer'ı",
      "Sadece event için kullanılan tip",
      "Sadece callback için kullanılan tip",
      "Sadece lambda için kullanılan tip"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-2",
    question: "C#'ta Action<T> delegate'i ne için kullanılır?",
    options: [
      "Parametre alan ama değer döndürmeyen metodlar için",
      "Değer döndüren metodlar için",
      "Parametre almayan metodlar için",
      "Sadece void metodlar için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-3",
    question: "C#'ta Func<T, TResult> delegate'i ne için kullanılır?",
    options: [
      "Parametre alan ve değer döndüren metodlar için",
      "Sadece parametre alan metodlar için",
      "Sadece değer döndüren metodlar için",
      "Sadece void metodlar için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-4",
    question: "C#'ta event nedir?",
    options: [
      "Delege temelli bildirim mekanizması",
      "Sadece bir metod",
      "Sadece bir property",
      "Sadece bir field"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-5",
    question: "C#'ta lambda expression nedir?",
    options: [
      "Anonim metod yazmanın kısa yolu",
      "Sadece delegate için kullanılan syntax",
      "Sadece LINQ için kullanılan syntax",
      "Sadece event için kullanılan syntax"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-6",
    question: "C#'ta += operatörü event'lerde ne yapar?",
    options: [
      "Event handler'ı subscribe eder",
      "Event handler'ı unsubscribe eder",
      "Event'i tetikler",
      "Event'i siler"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-7",
    question: "C#'ta Predicate<T> ne için kullanılır?",
    options: [
      "Boolean döndüren metodlar için",
      "String döndüren metodlar için",
      "Int döndüren metodlar için",
      "Void metodlar için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-8",
    question: "C#'ta multicast delegate nedir?",
    options: [
      "Birden fazla metodu referans eden delegate",
      "Sadece tek bir metodu referans eden delegate",
      "Sadece static metodları referans eden delegate",
      "Sadece instance metodları referans eden delegate"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-9",
    question: "C#'ta event ve delegate arasındaki fark nedir?",
    options: [
      "Event sadece sınıf içinden tetiklenebilir, delegate her yerden",
      "Delegate sadece sınıf içinden tetiklenebilir, event her yerden",
      "Hiçbir fark yok",
      "Event sadece void metodlar için, delegate sadece return değerli metodlar için"
    ],
    correctAnswer: 0
  },
  {
    id: "csharp-delegates-10",
    question: "C#'ta local function nedir?",
    options: [
      "Başka bir metodun içinde tanımlanan metod",
      "Sadece static metod",
      "Sadece private metod",
      "Sadece public metod"
    ],
    correctAnswer: 0
  }
];

// 10 test için soru grupları
const TESTS = [
  {
    title: "C# Test 1",
    description: "C# Syntax Temelleri testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(0, 10)
  },
  {
    title: "C# Test 2",
    description: "Değişkenler ve Veri Tipleri testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(10, 20)
  },
  {
    title: "C# Test 3",
    description: "Kontrol Yapıları testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(20, 30)
  },
  {
    title: "C# Test 4",
    description: "OOP (Class, Object, Inheritance, Polymorphism) testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(30, 40)
  },
  {
    title: "C# Test 5",
    description: "Collections (List, Dictionary, Array) testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(40, 50)
  },
  {
    title: "C# Test 6",
    description: "LINQ (Where, Select, GroupBy) testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(50, 60)
  },
  {
    title: "C# Test 7",
    description: "Async/Await testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(60, 70)
  },
  {
    title: "C# Test 8",
    description: "Exception Handling testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(70, 80)
  },
  {
    title: "C# Test 9",
    description: "Generics testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(80, 90)
  },
  {
    title: "C# Test 10",
    description: "Delegates ve Events testi",
    questions: C_SHARP_TEST_QUESTIONS.slice(90, 100)
  }
];

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // C# için Course oluştur veya mevcut Course'u bul
    let course = await db.course.findFirst({
      where: {
        expertise: "BACKEND",
        topic: "C#",
        topicContent: "C# Konu Testleri"
      },
    });

    if (!course) {
      course = await db.course.create({
        data: {
          title: "C# Programming",
          description: "C# programlama dili konu testleri",
          expertise: "BACKEND",
          topic: "C#",
          topicContent: "C# Konu Testleri",
          difficulty: "intermediate",
          content: {},
        },
      });
    } else {
      course = await db.course.update({
        where: { id: course.id },
        data: {
          title: "C# Programming",
          description: "C# programlama dili konu testleri",
          difficulty: "intermediate",
        },
      });
    }

    const createdTests = [];
    const errors = [];

    // 10 test oluştur
    for (let i = 0; i < TESTS.length; i++) {
      const testData = TESTS[i];
      const quizId = `quiz-csharp-test-${i + 1}`;
      
      try {
        const quiz = await db.quiz.upsert({
          where: { id: quizId },
          update: {
            title: testData.title,
            description: testData.description,
            type: "TEST",
            level: "intermediate",
            questions: testData.questions as any,
            passingScore: 60,
            courseId: course.id,
          },
          create: {
            id: quizId,
            courseId: course.id,
            title: testData.title,
            description: testData.description,
            type: "TEST",
            level: "intermediate",
            questions: testData.questions as any,
            passingScore: 60,
          },
        });

        createdTests.push({
          id: quiz.id,
          title: quiz.title,
          questionCount: testData.questions.length,
        });
      } catch (error: any) {
        errors.push({
          test: testData.title,
          error: error.message || "Bilinmeyen hata",
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: createdTests.length,
      tests: createdTests,
      errors: errors.length > 0 ? errors : undefined,
      message: `${createdTests.length} adet C# testi başarıyla oluşturuldu.`,
    });
  } catch (error: any) {
    console.error("Error creating C# tests:", error);
    return NextResponse.json(
      { error: error.message || "C# testleri oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

