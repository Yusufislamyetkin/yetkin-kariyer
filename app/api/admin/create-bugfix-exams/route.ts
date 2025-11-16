import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { upsertQuiz, Quiz } from "@/lib/admin/seed-data";

// 50 farklı C# bugfix senaryosu template'leri
function generateBugfixTemplates(): Array<{
  id: string;
  title: string;
  description: string;
  level: string;
  buggyCode: string;
  hints?: string[];
  acceptanceCriteria?: string[];
}> {
  return [
    {
      id: "bugfix-001",
      title: "Null Reference Exception",
      description: "Aşağıdaki kodda null reference exception hatası var. Kodu düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class UserService
{
    public string GetUserName(string userId)
    {
        var user = GetUser(userId);
        return user.Name; // Null reference hatası
    }
    
    private User GetUser(string userId)
    {
        // Kullanıcı bulunamazsa null döner
        return null;
    }
}

public class User
{
    public string Name { get; set; }
}`,
      hints: ["Null kontrolü yapmayı unutmayın", "Null-conditional operator (?) kullanabilirsiniz"],
      acceptanceCriteria: ["Null reference exception oluşmamalı", "Kullanıcı bulunamazsa uygun bir mesaj dönmeli"]
    },
    {
      id: "bugfix-002",
      title: "Array Index Out of Bounds",
      description: "Dizi sınırları dışına çıkma hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class ArrayProcessor
{
    public int GetLastElement(int[] numbers)
    {
        return numbers[numbers.Length]; // Index out of bounds
    }
}`,
      hints: ["Dizi indeksleri 0'dan başlar", "Son eleman için Length - 1 kullanın"],
      acceptanceCriteria: ["Index out of bounds hatası olmamalı", "Son eleman doğru dönmeli"]
    },
    {
      id: "bugfix-003",
      title: "Infinite Loop",
      description: "Sonsuz döngü problemi var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class Counter
{
    public void CountToTen()
    {
        int i = 0;
        while (i < 10)
        {
            Console.WriteLine(i);
            // i artırılmıyor - sonsuz döngü
        }
    }
}`,
      hints: ["Döngü değişkenini artırmayı unutmayın", "i++ ekleyin"],
      acceptanceCriteria: ["Döngü 10 kez çalışmalı", "0'dan 9'a kadar sayılar yazdırılmalı"]
    },
    {
      id: "bugfix-004",
      title: "String Comparison Bug",
      description: "String karşılaştırma hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class StringValidator
{
    public bool IsValid(string input)
    {
        return input == "admin"; // Büyük/küçük harf duyarlı
    }
}`,
      hints: ["String karşılaştırmada büyük/küçük harf duyarlılığına dikkat edin", "Equals metodunu kullanın"],
      acceptanceCriteria: ["Büyük/küçük harf fark etmeksizin karşılaştırma yapmalı", "'Admin' ve 'admin' aynı kabul edilmeli"]
    },
    {
      id: "bugfix-005",
      title: "Division by Zero",
      description: "Sıfıra bölme hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class Calculator
{
    public double Divide(double a, double b)
    {
        return a / b; // Sıfıra bölme hatası
    }
}`,
      hints: ["Bölen sıfır olup olmadığını kontrol edin", "Exception fırlatabilir veya özel değer dönebilirsiniz"],
      acceptanceCriteria: ["Sıfıra bölme durumunda uygun hata yönetimi yapılmalı", "Exception fırlatılmalı veya uygun mesaj dönmeli"]
    },
    {
      id: "bugfix-006",
      title: "Off-by-One Error",
      description: "Off-by-one hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class RangeProcessor
{
    public void ProcessRange(int start, int end)
    {
        for (int i = start; i <= end; i++)
        {
            Console.WriteLine(i);
        }
        // end değeri dahil edilmiyor
    }
}`,
      hints: ["Döngü sınırlarını kontrol edin", "<= veya < kullanımına dikkat edin"],
      acceptanceCriteria: ["Tüm aralık işlenmeli", "start ve end dahil olmalı"]
    },
    {
      id: "bugfix-007",
      title: "Uninitialized Variable",
      description: "Başlatılmamış değişken hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class SumCalculator
{
    public int CalculateSum(int[] numbers)
    {
        int sum;
        foreach (var num in numbers)
        {
            sum += num; // sum başlatılmamış
        }
        return sum;
    }
}`,
      hints: ["Değişkenleri kullanmadan önce başlatın", "sum = 0 ile başlatın"],
      acceptanceCriteria: ["Tüm sayıların toplamı doğru hesaplanmalı", "Derleme hatası olmamalı"]
    },
    {
      id: "bugfix-008",
      title: "Missing Return Statement",
      description: "Return ifadesi eksik. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class MathHelper
{
    public int Add(int a, int b)
    {
        int result = a + b;
        // return eksik
    }
}`,
      hints: ["Metodun dönüş tipi varsa return ifadesi olmalı", "result değerini döndürün"],
      acceptanceCriteria: ["Metod doğru değeri döndürmeli", "Derleme hatası olmamalı"]
    },
    {
      id: "bugfix-009",
      title: "Logic Error in Condition",
      description: "Koşul ifadesinde mantık hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class AgeValidator
{
    public bool IsAdult(int age)
    {
        return age > 18 && age < 18; // Mantık hatası
    }
}`,
      hints: ["Koşul mantığını gözden geçirin", "&& yerine || kullanılmalı mı?"],
      acceptanceCriteria: ["18 yaş ve üzeri true dönmeli", "18 yaş altı false dönmeli"]
    },
    {
      id: "bugfix-010",
      title: "Memory Leak - Event Handler",
      description: "Event handler memory leak'i var. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;

public class EventPublisher
{
    public event EventHandler<string> OnMessage;
    
    public void Subscribe(EventHandler<string> handler)
    {
        OnMessage += handler; // Unsubscribe yok
    }
}`,
      hints: ["Event handler'ları unsubscribe etmeyi unutmayın", "IDisposable pattern kullanın"],
      acceptanceCriteria: ["Event handler düzgün şekilde unsubscribe edilmeli", "Memory leak olmamalı"]
    },
    {
      id: "bugfix-011",
      title: "Race Condition",
      description: "Thread safety problemi var. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;

public class Counter
{
    private int count = 0;
    
    public void Increment()
    {
        count++; // Thread-safe değil
    }
    
    public int GetCount()
    {
        return count;
    }
}`,
      hints: ["Thread-safe operasyonlar kullanın", "lock veya Interlocked kullanabilirsiniz"],
      acceptanceCriteria: ["Thread-safe olmalı", "Concurrent access'te doğru sonuç vermeli"]
    },
    {
      id: "bugfix-012",
      title: "String Immutability Issue",
      description: "String birleştirme performans problemi var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class StringBuilder
{
    public string BuildString(int count)
    {
        string result = "";
        for (int i = 0; i < count; i++)
        {
            result += i.ToString(); // Performans problemi
        }
        return result;
    }
}`,
      hints: ["String birleştirme için StringBuilder kullanın", "Çok sayıda string birleştirmede + operatörü verimsizdir"],
      acceptanceCriteria: ["StringBuilder kullanılmalı", "Performans iyileştirilmeli"]
    },
    {
      id: "bugfix-013",
      title: "Missing Null Check",
      description: "Null kontrolü eksik. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class UserProcessor
{
    public void ProcessUser(User user)
    {
        Console.WriteLine(user.Name); // Null check yok
        Console.WriteLine(user.Email);
    }
}

public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
}`,
      hints: ["Null kontrolü yapın", "Null-conditional operator kullanabilirsiniz"],
      acceptanceCriteria: ["Null reference exception olmamalı", "Null durumunda uygun mesaj gösterilmeli"]
    },
    {
      id: "bugfix-014",
      title: "Incorrect Loop Condition",
      description: "Döngü koşulu yanlış. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class LoopExample
{
    public void PrintNumbers()
    {
        for (int i = 1; i > 10; i++) // Koşul yanlış
        {
            Console.WriteLine(i);
        }
    }
}`,
      hints: ["Döngü koşulunu kontrol edin", "< veya <= kullanın"],
      acceptanceCriteria: ["1'den 10'a kadar sayılar yazdırılmalı", "Döngü çalışmalı"]
    },
    {
      id: "bugfix-015",
      title: "Wrong Comparison Operator",
      description: "Karşılaştırma operatörü yanlış. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class Validator
{
    public bool IsPositive(int number)
    {
        return number < 0; // Operatör yanlış
    }
}`,
      hints: ["Karşılaştırma operatörünü kontrol edin", "< yerine > kullanın"],
      acceptanceCriteria: ["Pozitif sayılar için true dönmeli", "Negatif sayılar için false dönmeli"]
    },
    {
      id: "bugfix-016",
      title: "Missing Break in Switch",
      description: "Switch-case'de break eksik. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class SwitchExample
{
    public string GetDayName(int day)
    {
        switch (day)
        {
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            default:
                return "Unknown";
        }
    }
}`,
      hints: ["Switch-case'de break kullanmayı unutmayın", "Return kullanıyorsanız break gerekmez"],
      acceptanceCriteria: ["Her case doğru değeri döndürmeli", "Fall-through olmamalı"]
    },
    {
      id: "bugfix-017",
      title: "Incorrect Array Initialization",
      description: "Dizi başlatma hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class ArrayExample
{
    public int[] CreateArray(int size)
    {
        int[] arr = new int[size];
        for (int i = 0; i <= size; i++) // <= yerine < olmalı
        {
            arr[i] = i;
        }
        return arr;
    }
}`,
      hints: ["Dizi indekslerini kontrol edin", "0'dan size-1'e kadar"],
      acceptanceCriteria: ["Index out of bounds hatası olmamalı", "Dizi doğru şekilde doldurulmalı"]
    },
    {
      id: "bugfix-018",
      title: "Missing Exception Handling",
      description: "Exception handling eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.IO;

public class FileReader
{
    public string ReadFile(string path)
    {
        return File.ReadAllText(path); // Exception handling yok
    }
}`,
      hints: ["Try-catch bloğu ekleyin", "File işlemlerinde exception handling önemlidir"],
      acceptanceCriteria: ["Exception durumunda uygun hata mesajı dönmeli", "Try-catch kullanılmalı"]
    },
    {
      id: "bugfix-019",
      title: "Incorrect Modulo Usage",
      description: "Modulo operatörü yanlış kullanılmış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class NumberChecker
{
    public bool IsEven(int number)
    {
        return number % 2 == 1; // Yanlış kontrol
    }
}`,
      hints: ["Modulo operatörünü doğru kullanın", "Çift sayı için % 2 == 0 olmalı"],
      acceptanceCriteria: ["Çift sayılar için true dönmeli", "Tek sayılar için false dönmeli"]
    },
    {
      id: "bugfix-020",
      title: "Incorrect String Formatting",
      description: "String formatlama hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class Formatter
{
    public string FormatMessage(string name, int age)
    {
        return string.Format("Name: {0}, Age: {1}", name); // Eksik parametre
    }
}`,
      hints: ["String.Format parametrelerini kontrol edin", "Tüm placeholder'lar için parametre gerekli"],
      acceptanceCriteria: ["Tüm parametreler doğru formatlanmalı", "Format exception olmamalı"]
    },
    {
      id: "bugfix-021",
      title: "Missing Dispose Pattern",
      description: "IDisposable pattern eksik. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.IO;

public class FileProcessor
{
    public void ProcessFile(string path)
    {
        var stream = new FileStream(path, FileMode.Open);
        // Dispose edilmiyor
        var reader = new StreamReader(stream);
        string content = reader.ReadToEnd();
    }
}`,
      hints: ["IDisposable nesneleri using ile kullanın", "Dispose pattern uygulayın"],
      acceptanceCriteria: ["Resource leak olmamalı", "Using statement kullanılmalı"]
    },
    {
      id: "bugfix-022",
      title: "Incorrect DateTime Comparison",
      description: "DateTime karşılaştırması yanlış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class DateValidator
{
    public bool IsFutureDate(DateTime date)
    {
        return date > DateTime.Now; // Timezone problemi olabilir
    }
}`,
      hints: ["DateTime karşılaştırmasında UTC kullanmayı düşünün", "DateTime.UtcNow kullanın"],
      acceptanceCriteria: ["Gelecek tarihler doğru tespit edilmeli", "Timezone sorunları olmamalı"]
    },
    {
      id: "bugfix-023",
      title: "Missing Validation",
      description: "Input validation eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class EmailValidator
{
    public bool IsValid(string email)
    {
        return email.Contains("@"); // Yetersiz validation
    }
}`,
      hints: ["Daha kapsamlı validation yapın", "Regex veya EmailAddressAttribute kullanın"],
      acceptanceCriteria: ["Geçerli email formatı kontrol edilmeli", "Geçersiz email'ler reddedilmeli"]
    },
    {
      id: "bugfix-024",
      title: "Incorrect LINQ Usage",
      description: "LINQ sorgusu yanlış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Linq;

public class DataProcessor
{
    public int GetMaxValue(int[] numbers)
    {
        return numbers.OrderByDescending(x => x).First(); // Null reference riski
    }
}`,
      hints: ["LINQ sorgularında null/empty kontrolü yapın", "FirstOrDefault kullanabilirsiniz"],
      acceptanceCriteria: ["Boş dizi durumunda uygun hata yönetimi olmalı", "Null reference exception olmamalı"]
    },
    {
      id: "bugfix-025",
      title: "Missing Async/Await",
      description: "Async/await kullanımı eksik. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.Net.Http;
using System.Threading.Tasks;

public class ApiClient
{
    public string GetData(string url)
    {
        var client = new HttpClient();
        var response = client.GetStringAsync(url); // await eksik
        return response.Result; // Deadlock riski
    }
}`,
      hints: ["Async metodlarda await kullanın", "Result kullanmak yerine await kullanın"],
      acceptanceCriteria: ["Async/await doğru kullanılmalı", "Deadlock riski olmamalı"]
    },
    {
      id: "bugfix-026",
      title: "Incorrect Dictionary Access",
      description: "Dictionary erişim hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Collections.Generic;

public class DictionaryExample
{
    public string GetValue(Dictionary<string, string> dict, string key)
    {
        return dict[key]; // KeyNotFoundException riski
    }
}`,
      hints: ["Dictionary'de key kontrolü yapın", "TryGetValue veya ContainsKey kullanın"],
      acceptanceCriteria: ["Key yoksa uygun hata yönetimi olmalı", "KeyNotFoundException olmamalı"]
    },
    {
      id: "bugfix-027",
      title: "Incorrect Recursion Base Case",
      description: "Rekürsif fonksiyonda base case eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class RecursionExample
{
    public int Factorial(int n)
    {
        return n * Factorial(n - 1); // Base case yok
    }
}`,
      hints: ["Rekürsif fonksiyonlarda base case mutlaka olmalı", "n <= 1 durumunu kontrol edin"],
      acceptanceCriteria: ["Base case doğru tanımlanmalı", "Stack overflow olmamalı"]
    },
    {
      id: "bugfix-028",
      title: "Missing Null Coalescing",
      description: "Null coalescing operatörü kullanılmalı. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class NullHandler
{
    public string GetValue(string input)
    {
        if (input == null)
        {
            return "default";
        }
        return input; // Null coalescing kullanılabilir
    }
}`,
      hints: ["Null coalescing operatörü (??) kullanın", "Kodu sadeleştirin"],
      acceptanceCriteria: ["Null coalescing operatörü kullanılmalı", "Kod daha sade olmalı"]
    },
    {
      id: "bugfix-029",
      title: "Incorrect Boolean Logic",
      description: "Boolean mantık hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class PermissionChecker
{
    public bool CanAccess(bool isAdmin, bool isOwner)
    {
        return isAdmin && isOwner; // Mantık hatası
    }
}`,
      hints: ["Boolean mantığını gözden geçirin", "&& yerine || gerekebilir"],
      acceptanceCriteria: ["Admin veya owner erişebilmeli", "Mantık doğru olmalı"]
    },
    {
      id: "bugfix-030",
      title: "Missing Using Statement",
      description: "Using statement eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.IO;

public class FileHandler
{
    public void WriteFile(string path, string content)
    {
        var writer = new StreamWriter(path);
        writer.Write(content);
        // writer.Close() eksik
    }
}`,
      hints: ["Using statement kullanın", "IDisposable nesneleri otomatik dispose edilir"],
      acceptanceCriteria: ["Using statement kullanılmalı", "Resource leak olmamalı"]
    },
    {
      id: "bugfix-031",
      title: "Incorrect Type Casting",
      description: "Type casting hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class TypeConverter
{
    public int ConvertToInt(object value)
    {
        return (int)value; // InvalidCastException riski
    }
}`,
      hints: ["Type casting'de güvenli yöntemler kullanın", "as operatörü veya is kontrolü yapın"],
      acceptanceCriteria: ["Güvenli type casting yapılmalı", "InvalidCastException olmamalı"]
    },
    {
      id: "bugfix-032",
      title: "Missing Null Check in Property",
      description: "Property'de null kontrolü eksik. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class User
{
    private string _name;
    
    public string Name
    {
        get { return _name; }
        set { _name = value; } // Null kontrolü yok
    }
}`,
      hints: ["Property setter'da null kontrolü yapın", "String.IsNullOrEmpty kontrolü ekleyin"],
      acceptanceCriteria: ["Null veya empty string atanmamalı", "Uygun exception fırlatılmalı"]
    },
    {
      id: "bugfix-033",
      title: "Incorrect Loop Variable Scope",
      description: "Döngü değişkeni scope hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class LoopScope
{
    public void ProcessItems()
    {
        int i;
        for (i = 0; i < 10; i++)
        {
            // i döngü dışında tanımlı
        }
        Console.WriteLine(i); // i hala erişilebilir
    }
}`,
      hints: ["Döngü değişkenini döngü içinde tanımlayın", "for (int i = 0; ...) kullanın"],
      acceptanceCriteria: ["Döngü değişkeni doğru scope'ta olmalı", "Best practice'e uygun olmalı"]
    },
    {
      id: "bugfix-034",
      title: "Missing Equals Override",
      description: "Equals override eksik. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    // Equals override yok
}`,
      hints: ["Value type karşılaştırması için Equals override edin", "GetHashCode da override edilmeli"],
      acceptanceCriteria: ["Equals ve GetHashCode override edilmeli", "Doğru karşılaştırma yapılmalı"]
    },
    {
      id: "bugfix-035",
      title: "Incorrect Exception Type",
      description: "Yanlış exception tipi kullanılmış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class Validator
{
    public void Validate(int value)
    {
        if (value < 0)
        {
            throw new NullReferenceException(); // Yanlış exception tipi
        }
    }
}`,
      hints: ["Uygun exception tipi kullanın", "ArgumentOutOfRangeException veya ArgumentException kullanın"],
      acceptanceCriteria: ["Doğru exception tipi kullanılmalı", "Exception mesajı anlamlı olmalı"]
    },
    {
      id: "bugfix-036",
      title: "Missing Null Check in Extension Method",
      description: "Extension method'da null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public static class StringExtensions
{
    public static string Reverse(this string str)
    {
        char[] chars = str.ToCharArray(); // Null check yok
        Array.Reverse(chars);
        return new string(chars);
    }
}`,
      hints: ["Extension method'larda null kontrolü yapın", "Null ise uygun değer döndürün"],
      acceptanceCriteria: ["Null string için uygun handling olmalı", "Null reference exception olmamalı"]
    },
    {
      id: "bugfix-037",
      title: "Incorrect Regex Pattern",
      description: "Regex pattern yanlış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Text.RegularExpressions;

public class PatternMatcher
{
    public bool IsValidPhone(string phone)
    {
        return Regex.IsMatch(phone, @"\d{3}-\d{3}-\d{4}"); // Eksik validation
    }
}`,
      hints: ["Regex pattern'i kontrol edin", "Başlangıç ve bitiş anchor'ları ekleyin"],
      acceptanceCriteria: ["Sadece geçerli format kabul edilmeli", "^ ve $ anchor'ları kullanılmalı"]
    },
    {
      id: "bugfix-038",
      title: "Missing IDisposable Implementation",
      description: "IDisposable implementasyonu eksik. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.IO;

public class ResourceManager
{
    private FileStream _stream;
    
    public ResourceManager(string path)
    {
        _stream = new FileStream(path, FileMode.Open);
    }
    
    // Dispose metodu yok
}`,
      hints: ["IDisposable interface'ini implement edin", "Dispose pattern uygulayın"],
      acceptanceCriteria: ["IDisposable implement edilmeli", "Dispose metodu doğru çalışmalı"]
    },
    {
      id: "bugfix-039",
      title: "Incorrect Async Void",
      description: "Async void kullanımı yanlış. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.Threading.Tasks;

public class EventHandler
{
    public async void OnEvent(object sender, EventArgs e)
    {
        await Task.Delay(1000); // async void kullanımı
    }
}`,
      hints: ["Async void sadece event handler'larda kullanılmalı", "Task döndüren metod kullanın"],
      acceptanceCriteria: ["Async void yerine Task kullanılmalı", "Exception handling doğru olmalı"]
    },
    {
      id: "bugfix-040",
      title: "Missing Null Check in Constructor",
      description: "Constructor'da null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class Service
{
    private readonly IRepository _repository;
    
    public Service(IRepository repository)
    {
        _repository = repository; // Null check yok
    }
}

public interface IRepository { }`,
      hints: ["Constructor parametrelerinde null kontrolü yapın", "Null ise ArgumentNullException fırlatın"],
      acceptanceCriteria: ["Null parametre için exception fırlatılmalı", "ArgumentNullException kullanılmalı"]
    },
    {
      id: "bugfix-041",
      title: "Incorrect Collection Modification",
      description: "Collection modification hatası var. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Collections.Generic;

public class CollectionProcessor
{
    public void RemoveItems(List<int> numbers)
    {
        foreach (var num in numbers)
        {
            if (num < 0)
            {
                numbers.Remove(num); // Collection modified exception
            }
        }
    }
}`,
      hints: ["Foreach içinde collection'ı değiştirmeyin", "Reverse for loop veya ToList() kullanın"],
      acceptanceCriteria: ["Collection modification exception olmamalı", "Öğeler doğru şekilde kaldırılmalı"]
    },
    {
      id: "bugfix-042",
      title: "Missing Null Check in LINQ",
      description: "LINQ sorgusunda null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Linq;

public class DataFilter
{
    public List<string> GetNames(List<User> users)
    {
        return users.Select(u => u.Name).ToList(); // Null reference riski
    }
}

public class User
{
    public string Name { get; set; }
}`,
      hints: ["LINQ sorgularında null kontrolü yapın", "Where ile null'ları filtreleyin"],
      acceptanceCriteria: ["Null reference exception olmamalı", "Null değerler filtrelenmeli"]
    },
    {
      id: "bugfix-043",
      title: "Incorrect String Interpolation",
      description: "String interpolation hatası var. Düzeltin.",
      level: "beginner",
      buggyCode: `using System;

public class MessageFormatter
{
    public string FormatMessage(string name, int age)
    {
        return $"Name: {name}, Age: {age}"; // Null reference riski
    }
}`,
      hints: ["String interpolation'da null kontrolü yapın", "Null-conditional veya null coalescing kullanın"],
      acceptanceCriteria: ["Null değerler için uygun handling olmalı", "Null reference exception olmamalı"]
    },
    {
      id: "bugfix-044",
      title: "Missing ConfigureAwait",
      description: "ConfigureAwait eksik. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.Net.Http;
using System.Threading.Tasks;

public class ApiClient
{
    public async Task<string> GetDataAsync(string url)
    {
        var client = new HttpClient();
        var response = await client.GetStringAsync(url); // ConfigureAwait yok
        return response;
    }
}`,
      hints: ["Library kodlarında ConfigureAwait(false) kullanın", "Deadlock riskini azaltır"],
      acceptanceCriteria: ["ConfigureAwait(false) kullanılmalı", "Deadlock riski azaltılmalı"]
    },
    {
      id: "bugfix-045",
      title: "Incorrect Equality Comparison",
      description: "Eşitlik karşılaştırması yanlış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class ValueComparer
{
    public bool AreEqual(string a, string b)
    {
        return a == b; // Reference equality
    }
}`,
      hints: ["String karşılaştırmasında Equals kullanın", "StringComparison parametresi ekleyin"],
      acceptanceCriteria: ["String.Equals kullanılmalı", "StringComparison parametresi olmalı"]
    },
    {
      id: "bugfix-046",
      title: "Missing Null Check in Indexer",
      description: "Indexer'da null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class Collection
{
    private string[] _items = new string[10];
    
    public string this[int index]
    {
        get { return _items[index]; } // Null check yok
        set { _items[index] = value; }
    }
}`,
      hints: ["Indexer'da bounds checking yapın", "Index out of range kontrolü ekleyin"],
      acceptanceCriteria: ["Index out of range exception olmamalı", "Uygun exception fırlatılmalı"]
    },
    {
      id: "bugfix-047",
      title: "Incorrect Task Usage",
      description: "Task kullanımı yanlış. Düzeltin.",
      level: "advanced",
      buggyCode: `using System;
using System.Threading.Tasks;

public class TaskExample
{
    public void ProcessData()
    {
        var task = Task.Run(() => DoWork());
        task.Wait(); // Deadlock riski
    }
    
    private void DoWork() { }
}`,
      hints: ["Async metodlarda Wait() kullanmayın", "await kullanın"],
      acceptanceCriteria: ["Wait() yerine await kullanılmalı", "Deadlock riski olmamalı"]
    },
    {
      id: "bugfix-048",
      title: "Missing Null Check in Delegate",
      description: "Delegate'de null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class EventPublisher
{
    public event Action<string> OnMessage;
    
    public void Publish(string message)
    {
        OnMessage(message); // Null check yok
    }
}`,
      hints: ["Event invoke etmeden önce null kontrolü yapın", "?.Invoke() kullanabilirsiniz"],
      acceptanceCriteria: ["Null reference exception olmamalı", "Null-conditional operator kullanılmalı"]
    },
    {
      id: "bugfix-049",
      title: "Incorrect StringBuilder Usage",
      description: "StringBuilder kullanımı yanlış. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;
using System.Text;

public class StringBuilderExample
{
    public string BuildString(int count)
    {
        var sb = new StringBuilder();
        for (int i = 0; i < count; i++)
        {
            sb.Append(i);
        }
        return sb.ToString(); // Capacity ayarlanmamış
    }
}`,
      hints: ["StringBuilder'da initial capacity ayarlayın", "Performans için capacity belirleyin"],
      acceptanceCriteria: ["Initial capacity ayarlanmalı", "Performans iyileştirilmeli"]
    },
    {
      id: "bugfix-050",
      title: "Missing Null Check in Property Chain",
      description: "Property chain'de null kontrolü eksik. Düzeltin.",
      level: "intermediate",
      buggyCode: `using System;

public class PropertyChain
{
    public string GetUserName(User user)
    {
        return user.Profile.Name; // Null reference riski
    }
}

public class User
{
    public Profile Profile { get; set; }
}

public class Profile
{
    public string Name { get; set; }
}`,
      hints: ["Property chain'de null-conditional operator kullanın", "user?.Profile?.Name kullanın"],
      acceptanceCriteria: ["Null-conditional operator kullanılmalı", "Null reference exception olmamalı"]
    }
  ];
}

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const templates = generateBugfixTemplates();
    const courseId = "course-dotnet-roadmap";
    const created: string[] = [];
    const errors: string[] = [];

    // Batch işleme için concurrent limit (aynı anda max 5 işlem)
    const BATCH_SIZE = 5;
    
    // Her template için quiz oluştur - batch processing ile
    for (let i = 0; i < templates.length; i += BATCH_SIZE) {
      const batch = templates.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (template) => {
        try {
          const quizId = `bugfix-csharp-${template.id}`;
          
          const quiz: Quiz = {
            id: quizId,
            courseId: courseId,
            title: `C# Bugfix: ${template.title}`,
            description: template.description,
            topic: "C#",
            type: "BUG_FIX",
            level: template.level,
            questions: [
              {
                id: template.id,
                title: template.title,
                description: template.description,
                languages: ["csharp"],
                buggyCode: {
                  csharp: template.buggyCode
                },
                hints: template.hints || [],
                acceptanceCriteria: template.acceptanceCriteria || []
              }
            ],
            passingScore: 60,
            lessonSlug: null
          };

          const result = await upsertQuiz(quiz);
          
          if (result.success) {
            return { success: true, quizId, error: null };
          } else {
            return { success: false, quizId: null, error: `${template.id}: ${result.error || 'Unknown error'}` };
          }
        } catch (error: any) {
          return { success: false, quizId: null, error: `${template.id}: ${error.message || 'Unknown error'}` };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach((result) => {
        if (result.success && result.quizId) {
          created.push(result.quizId);
        } else if (result.error) {
          errors.push(result.error);
        }
      });
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      message: `${created.length} adet bugfix sınavı başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating bugfix exams:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "Bugfix sınavları oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

