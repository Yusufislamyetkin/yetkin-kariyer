# VERCEL DEPLOYMENT KOD YAZMA KURALLARI

## VERİTABANI
- Prisma Client singleton pattern kullan (`lib/db.ts`), her istekte yeni instance oluşturma
- Connection pooling otomatik (`POSTGRES_PRISMA_URL`), ekstra yapılandırma gerekmez
- N+1 query problem'lerinden kaçın, `include` ve `select` optimize et
- Transaction için `prisma.$transaction()` kullan
- Sadece gerekli field'ları select et, gereksiz relation'lardan kaçın
- Büyük listeler için pagination (`skip`, `take`) kullan

## API ROUTES
- Tüm route'larda try-catch zorunlu
- Authentication: `const session = await auth(); if (!session) return 401`
- Input validation: Tüm input'ları Zod ile validate et
- Response format: `{ success: boolean, data?: any, error?: string }`
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error)
- Validation error'ları kullanıcı dostu mesajlara çevir
- Production'da detaylı error mesajları kullanıcıya gösterilmez, log'a yazılır

## SERVERLESS LIMITS
- Execution time: Max 10 saniye (Hobby plan), 60 saniye (Pro plan)
- Uzun işlemler için streaming response veya işlemi parçalara böl
- Memory: 1024 MB limit, büyük dosyalar Vercel Blob Storage'da
- Request body: Max 4.5 MB, büyük dosyalar için Blob Storage kullan

## COMPONENTS
- Server Component varsayılan, sadece interactivity gerektiğinde Client Component
- `'use client'` sadece hooks, event handlers, browser APIs gerektiğinde
- Client Component'te direkt database query yok, API route kullan
- Server Component'te async component kullan, direkt DB query yapılabilir
- Büyük kütüphaneler için `next/dynamic` lazy loading kullan

## ENVIRONMENT VARIABLES
- Kullanmadan önce kontrol et: `if (!process.env.KEY) throw new Error()`
- Client-side'da sadece `NEXT_PUBLIC_*` prefix'li değişkenler kullanılabilir
- Type-safe kullanım, runtime validation yap

## ERROR HANDLING
- Tüm async operations'da try-catch zorunlu
- API routes, server actions, async functions'da error handling
- React Error Boundaries client components için
- Zod validation error'larını handle et
- Production'da kullanıcıya generic error, detaylar log'a

## TYPE SAFETY
- TypeScript strict mode, `any` type kullanma
- Tüm external input'lar Zod ile validate et
- Prisma type'larını kullan (`Prisma.UserCreateInput`, `Prisma.UserWhereInput`)
- `unknown` kullan ve type guard yap
- Lint hataları olması

## AUTHENTICATION & AUTHORIZATION
- Protected route'lar middleware'de kontrol ediliyor
- API route'larda manuel auth check: `const session = await auth()`
- Role check gerekiyorsa: `session.user.role !== 'admin'` kontrolü yap
- 401 Unauthorized, 403 Forbidden status code'larını doğru kullan

## FILE UPLOADS
- Video ve büyük dosyalar için Vercel Blob Storage kullan
- Upload öncesi file size kontrolü yap
- Sadece izin verilen file type'ları kabul et
- Büyük dosyalar için streaming upload

## PERFORMANCE
- Dynamic import büyük component'ler ve kütüphaneler için
- `next/image` kullan, image optimization
- Code splitting: route-based otomatik, component-based için dynamic import
- Gereksiz import'lardan kaçın, named export tercih et (tree-shaking)
- Database query'leri optimize et, gereksiz data çekme

## PRISMA QUERY PATTERNS
- `select` ile sadece gerekli field'ları çek
- `include` ile gereksiz relation'lardan kaçın
- Index'lenmiş field'ları query'lerde kullan
- Pagination büyük listeler için zorunlu

## REALTIME (Ably)
- Component unmount'ta channel subscription kapat
- Connection error'larını handle et
- Connection drop durumunda reconnection logic

## AI INTEGRATIONS (OpenAI)
- API error'larını handle et, retry logic ekle
- Uzun response'lar için streaming kullan
- Rate limiting'e dikkat et
- Token limit'lerini kontrol et

## KOD STİLİ
- Async/await kullan, promise chain yok
- Early return pattern, nested if'lerden kaçın
- Object/array destructuring kullan
- `const` tercih et, gerektiğinde `let`, `var` yok
- Named export tercih et (tree-shaking için)

## SECURITY
- SQL injection: Prisma otomatik koruyor, raw query'lerde dikkatli ol
- XSS: React otomatik escape yapar, HTML içerik için sanitize et
- Input validation: Tüm user input'ları Zod ile validate et
- Sensitive data: Error mesajlarında, log'larda sensitive bilgi gösterme