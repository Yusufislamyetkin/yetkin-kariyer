import * as fs from 'fs';
import * as path from 'path';

/**
 * Enhance Module 5 content with more detailed and educational explanations
 */

interface LessonContent {
  [key: string]: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
    phase4: string[];
    codeExamples: {
      phase1: string;
      phase2: string;
      phase3: string;
      phase4: string;
    };
  };
}

const detailedContent: LessonContent = {
  'RESTful API Tasarımı': {
    phase1: [
      'REST (Representational State Transfer) nedir? REST, web servisleri için bir mimari stildir ve HTTP protokolü üzerinde çalışan, durumsuz (stateless) bir yapıdır.',
      'RESTful API nedir? RESTful API, REST prensiplerini takip eden web API\'leridir. Bu API\'ler, kaynaklara (resources) URL\'ler üzerinden erişim sağlar ve HTTP metotlarını (GET, POST, PUT, DELETE) kullanarak işlemler gerçekleştirir.',
      'RESTful API\'nin temel prensipleri: Resource-based URLs, HTTP metotları, stateless communication, ve uniform interface prensipleridir.',
      'RESTful API neden kullanılır? RESTful API\'ler, basit, ölçeklenebilir ve bakımı kolay web servisleri oluşturmak için kullanılır. Modern web uygulamalarında ve mobil uygulamalarda veri alışverişi için standart bir yaklaşımdır.',
      'RESTful API\'nin avantajları: Kolay anlaşılabilir, platform bağımsız, ölçeklenebilir, cache\'lenebilir, ve HTTP standartlarını kullanır.'
    ],
    phase2: [
      'RESTful API nasıl tasarlanır? Kaynakları (resources) isimlendirme, HTTP metotlarını doğru kullanma, ve URL yapısını düzenleme ile başlar.',
      'Resource naming (kaynak isimlendirme): Kaynaklar çoğul isimlerle tanımlanır (örnek: /api/users, /api/products). İsimler açıklayıcı ve tutarlı olmalıdır.',
      'HTTP metotları: GET (okuma), POST (oluşturma), PUT (güncelleme), DELETE (silme) metotları kaynaklar üzerinde işlemler gerçekleştirmek için kullanılır.',
      'URL yapısı: RESTful API\'lerde URL\'ler hiyerarşik ve mantıklı olmalıdır. Örnek: /api/users/{id}/orders/{orderId}',
      'Request ve Response formatları: JSON formatı, RESTful API\'lerde en yaygın kullanılan veri formatıdır. Request ve response body\'leri JSON formatında gönderilir ve alınır.'
    ],
    phase3: [
      'Best practices: RESTful API tasarımında dikkat edilmesi gereken best practice\'ler: Versioning, error handling, pagination, filtering, ve sorting.',
      'HATEOAS (Hypermedia as the Engine of Application State): API response\'larında, ilgili kaynaklara linkler eklenerek client\'ın API\'yi keşfetmesi sağlanır.',
      'Performance optimization: Caching stratejileri, response compression, ve async operations ile performans optimize edilir.',
      'Security: Authentication ve authorization mekanizmaları, HTTPS kullanımı, ve input validation ile güvenlik sağlanır.',
      'Documentation: API dokümantasyonu, Swagger/OpenAPI kullanılarak otomatik olarak oluşturulabilir.'
    ],
    phase4: [
      'Gerçek dünya senaryoları: E-ticaret API\'leri, sosyal medya API\'leri, ve payment gateway API\'leri gibi gerçek dünya örneklerinde RESTful API tasarımı nasıl uygulanır?',
      'Microservices mimarisi: RESTful API\'ler, microservices mimarisinde servisler arası iletişim için kullanılır. Service discovery, API gateway, ve load balancing konuları ele alınır.',
      'Troubleshooting: Yaygın problemler ve çözümleri: CORS hataları, authentication hataları, ve rate limiting problemleri nasıl çözülür?',
      'Production considerations: Deployment, monitoring, logging, ve error tracking gibi production ortamında dikkat edilmesi gereken konular.',
      'Case study: Gerçek bir RESTful API projesinin tasarımı, implementasyonu, ve deployment süreci detaylı olarak incelenir.'
    ],
    codeExamples: {
      phase1: `// RESTful API - Temel Kavramlar
// REST, kaynaklar üzerinde işlemler gerçekleştiren bir mimari stildir

namespace WebAPI.Examples
{
    // RESTful API Controller örneği
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // RESTful API, HTTP metotlarını kullanarak kaynaklara erişim sağlar
        // GET /api/users - Tüm kullanıcıları getir
        // GET /api/users/1 - ID\'si 1 olan kullanıcıyı getir
        // POST /api/users - Yeni kullanıcı oluştur
        // PUT /api/users/1 - ID\'si 1 olan kullanıcıyı güncelle
        // DELETE /api/users/1 - ID\'si 1 olan kullanıcıyı sil
    }
}`,
      phase2: `// RESTful API - Pratik Kullanım
// RESTful API tasarımı ve implementasyonu

using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Examples
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        // GET /api/users - Tüm kullanıcıları getir
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            // Resource: users
            // HTTP Method: GET
            // Response: 200 OK with user list
            return Ok(new { users = new[] { new { id = 1, name = "John" } } });
        }
        
        // GET /api/users/{id} - Belirli bir kullanıcıyı getir
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            // Resource: users/{id}
            // HTTP Method: GET
            // Response: 200 OK with user data
            return Ok(new { id, name = "John" });
        }
        
        // POST /api/users - Yeni kullanıcı oluştur
        [HttpPost]
        public IActionResult CreateUser([FromBody] CreateUserRequest request)
        {
            // Resource: users
            // HTTP Method: POST
            // Response: 201 Created with user data
            return CreatedAtAction(nameof(GetUser), new { id = 1 }, new { id = 1, name = request.Name });
        }
    }
}`,
      phase3: `// RESTful API - İleri Seviye
// Best practices ve optimization teknikleri

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;

namespace WebAPI.Advanced
{
    [ApiController]
    [Route("api/v1/users")]
    [ResponseCache(Duration = 300)]
    public class AdvancedUsersController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        
        public AdvancedUsersController(IMemoryCache cache)
        {
            _cache = cache;
        }
        
        // Caching ile performance optimization
        [HttpGet]
        public IActionResult GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var cacheKey = $"users_page_{page}_size_{pageSize}";
            
            if (_cache.TryGetValue(cacheKey, out var cachedUsers))
            {
                return Ok(cachedUsers);
            }
            
            // Pagination ve filtering
            var users = GetUsersFromDatabase(page, pageSize);
            
            _cache.Set(cacheKey, users, TimeSpan.FromMinutes(5));
            
            return Ok(users);
        }
        
        // HATEOAS - Hypermedia links
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = GetUserFromDatabase(id);
            
            if (user == null)
            {
                return NotFound();
            }
            
            // HATEOAS links ekle
            user.Links = new
            {
                self = $"/api/v1/users/{id}",
                orders = $"/api/v1/users/{id}/orders",
                update = $"/api/v1/users/{id}",
                delete = $"/api/v1/users/{id}"
            };
            
            return Ok(user);
        }
        
        private object GetUsersFromDatabase(int page, int pageSize) => new { };
        private object GetUserFromDatabase(int id) => new { id, name = "John" };
    }
}`,
      phase4: `// RESTful API - Gerçek Dünya Senaryosu
// Production-ready RESTful API implementasyonu

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace WebAPI.Production
{
    [ApiController]
    [Route("api/v1/users")]
    public class ProductionUsersController : ControllerBase
    {
        private readonly ILogger<ProductionUsersController> _logger;
        private readonly IDistributedCache _cache;
        
        public ProductionUsersController(
            ILogger<ProductionUsersController> logger,
            IDistributedCache cache)
        {
            _logger = logger;
            _cache = cache;
        }
        
        // Production-ready GET endpoint
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                _logger.LogInformation("Getting user with ID: {UserId}", id);
                
                // Distributed cache kontrolü
                var cacheKey = $"user_{id}";
                var cachedUser = await _cache.GetStringAsync(cacheKey);
                
                if (!string.IsNullOrEmpty(cachedUser))
                {
                    _logger.LogInformation("Cache hit for user ID: {UserId}", id);
                    return Ok(JsonSerializer.Deserialize<object>(cachedUser));
                }
                
                // Database'den veri çekme
                var user = await GetUserFromDatabaseAsync(id);
                
                if (user == null)
                {
                    _logger.LogWarning("User not found with ID: {UserId}", id);
                    return NotFound(new { error = "User not found", id });
                }
                
                // Cache'e kaydetme
                var userJson = JsonSerializer.Serialize(user);
                await _cache.SetStringAsync(cacheKey, userJson, new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });
                
                _logger.LogInformation("User retrieved successfully: {UserId}", id);
                
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user with ID: {UserId}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
        
        private async Task<object> GetUserFromDatabaseAsync(int id)
        {
            await Task.Delay(100); // Simulated database call
            return new { id, name = "John Doe", email = "john@example.com" };
        }
    }
}`
    }
  },
  // Add other lessons here...
};

console.log('Content enhancement definitions created. This file provides templates for detailed content.');

