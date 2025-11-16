#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
.NET Core Kapsamlı Test Serisi - 54 test, 540 soru oluşturma scripti
"""

import json

# Modül listesi
modules = [
    ("01-csharp", "C# Temelleri", "beginner"),
    ("02-architecture", ".NET Core Mimarisi ve Yapısı", "intermediate"),
    ("03-project-structure", "Proje Yapısı ve Dependency Injection", "intermediate"),
    ("04-aspnet-mvc", "ASP.NET Core MVC", "intermediate"),
    ("05-web-api", "Web API Geliştirme", "intermediate"),
    ("06-middleware", "Middleware ve Pipeline Yönetimi", "intermediate"),
    ("07-auth", "Authentication & Authorization", "intermediate"),
    ("08-logging", "Logging ve Exception Handling", "intermediate"),
    ("09-configuration", "Configuration Management", "intermediate"),
    ("10-testing", "Unit Test ve Integration Test", "intermediate"),
    ("11-performance", "Performans ve Caching Teknikleri", "advanced"),
    ("12-async", "Asenkron Programlama (Async/Await)", "intermediate"),
    ("13-docker", "Docker ile Containerization", "intermediate"),
    ("14-cicd", "CI/CD ve Deployment Süreçleri", "advanced"),
    ("15-microservices", "Microservices Mimarisi", "advanced"),
    ("16-libraries", "Kütüphaneler", "intermediate"),
    ("17-ef-core", "Entity Framework Core İleri Seviye", "advanced"),
    ("18-docker-k8s", "Docker ve Kubernetes", "advanced"),
]

# Her modül için soru şablonları (her test için 10 soru)
questions_templates = {
    "01-csharp": [
        # Test 1
        [
            {"id": "q1", "question": "C# dilinde değişken tanımlamak için hangi anahtar kelime kullanılır?", "options": ["var", "let", "const", "def"], "correctAnswer": 0, "explanation": "var anahtar kelimesi C# dilinde tip çıkarımı ile değişken tanımlamak için kullanılır."},
            {"id": "q2", "question": "For döngüsünde koşul ifadesi false olduğunda ne olur?", "options": ["Döngü devam eder", "Döngü sonlanır", "Koşul tekrar kontrol edilir", "Hata oluşur"], "correctAnswer": 1, "explanation": "Koşul ifadesi false olduğunda döngü sonlanır ve program akışı döngü dışındaki ilk satıra geçer."},
            {"id": "q3", "question": "C# dilinde string birleştirme için en performanslı yöntem hangisidir?", "options": ["+ operatörü", "String.Concat", "StringBuilder", "string interpolation"], "correctAnswer": 2, "explanation": "StringBuilder, özellikle çok sayıda string birleştirme işleminde en performanslı yöntemdir."},
            {"id": "q4", "question": "C# dilinde bir sınıfın private üyesine dışarıdan erişmek için ne kullanılır?", "options": ["Public property", "Public method", "Protected field", "Hiçbir şekilde erişilemez"], "correctAnswer": 3, "explanation": "Private üyelere sadece aynı sınıf içinden erişilebilir, dışarıdan erişim mümkün değildir."},
            {"id": "q5", "question": "C# dilinde exception yakalamak için hangi yapı kullanılır?", "options": ["try-catch", "if-else", "switch-case", "while"], "correctAnswer": 0, "explanation": "try-catch yapısı exception yakalamak ve hata yönetimi yapmak için kullanılır."},
            {"id": "q6", "question": "C# dilinde bir metotun değer döndürmemesi için hangi anahtar kelime kullanılır?", "options": ["void", "null", "return", "break"], "correctAnswer": 0, "explanation": "void anahtar kelimesi metotun değer döndürmediğini belirtir."},
            {"id": "q7", "question": "C# dilinde List<T> koleksiyonuna eleman eklemek için hangi metot kullanılır?", "options": ["Add", "Insert", "Push", "Append"], "correctAnswer": 0, "explanation": "Add metodu List<T> koleksiyonuna eleman eklemek için kullanılır."},
            {"id": "q8", "question": "C# dilinde LINQ sorgusu yazmak için hangi namespace gereklidir?", "options": ["System.Linq", "System.Collections", "System.IO", "System.Text"], "correctAnswer": 0, "explanation": "System.Linq namespace'i LINQ sorguları için gereklidir."},
            {"id": "q9", "question": "C# dilinde bir sınıfın birden fazla interface implement etmesine ne denir?", "options": ["Inheritance", "Polymorphism", "Multiple inheritance", "Multiple interface implementation"], "correctAnswer": 3, "explanation": "C# dilinde bir sınıf birden fazla interface implement edebilir, buna multiple interface implementation denir."},
            {"id": "q10", "question": "C# dilinde nullable bir değer tipi tanımlamak için hangi sembol kullanılır?", "options": ["?", "!", "*", "&"], "correctAnswer": 0, "explanation": "? sembolü nullable değer tipleri tanımlamak için kullanılır (örn: int?)."},
        ],
        # Test 2 ve Test 3 için de benzer sorular oluşturulacak
        # ... (kısaltılmış, gerçekte her modül için 30 soru olacak)
    ]
}

def escape_sql_string(s):
    """SQL string'ini escape et"""
    return s.replace("'", "''").replace("\\", "\\\\")

def generate_test_insert(module_id, module_title, test_num, level, questions):
    """Bir test için INSERT statement oluştur"""
    test_id = f"test-module-{module_id}-test-{test_num}"
    title = f"{module_title} - Test {test_num}"
    description = f".NET Core Kapsamlı Test Serisi - {module_title} modülü için kapsamlı test"
    
    # Questions JSON'ını oluştur
    questions_json = json.dumps(questions, ensure_ascii=False, indent=2)
    # SQL için escape et
    questions_sql = escape_sql_string(questions_json)
    
    return f"""    (
        '{test_id}',
        'course-dotnet-roadmap',
        '{escape_sql_string(title)}',
        '{escape_sql_string(description)}',
        '.NET Core',
        'TEST',
        '{level}',
        '{questions_sql}'::jsonb,
        70,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )"""

# Tüm testleri oluştur
all_inserts = []
for module_id, module_title, level in modules:
    # Her modül için 3 test oluştur
    for test_num in range(1, 4):
        # Her test için 10 soru oluştur (şimdilik placeholder)
        # Gerçek uygulamada her modül için uygun sorular oluşturulmalı
        questions = [
            {
                "id": f"q{i+1}",
                "question": f"{module_title} - Test {test_num} - Soru {i+1}",
                "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
                "correctAnswer": i % 4,
                "explanation": f"Açıklama {i+1}"
            }
            for i in range(10)
        ]
        insert = generate_test_insert(module_id, module_title, test_num, level, questions)
        all_inserts.append(insert)

# SQL dosyasına yaz
with open("test-inserts.sql", "w", encoding="utf-8") as f:
    f.write("-- .NET Core Kapsamlı Test Serisi - 18 modül × 3 test = 54 test, 540 soru\n")
    f.write("-- Bu INSERT statement'ları database-seed.sql dosyasına eklenecek\n\n")
    f.write(",\n".join(all_inserts))
    f.write(";\n")

print(f"54 test için INSERT statement'ları oluşturuldu!")
print(f"Toplam {len(all_inserts)} test, {len(all_inserts) * 10} soru")














