import json
import os

# Modül başlıkları
modules = [
    'SQL Temelleri ve MSSQL\'e Giriş',
    'Veri Tipleri ve Tablo Tasarımı',
    'CRUD İşlemleri',
    'SELECT Sorguları ve Filtreleme',
    'JOIN İşlemleri',
    'Aggregate Functions ve Grouping',
    'Subqueries ve CTE',
    'Stored Procedures',
    'Functions (Scalar, Table-valued)',
    'Triggers',
    'Indexes ve Performance',
    'Views ve Materialized Views',
    'Transactions ve Concurrency',
    'Security ve User Management',
    'Backup, Recovery ve Maintenance'
]

# Her modül için ders başlıkları (her modülde 15 ders)
lesson_templates = {
    1: ['MSSQL Nedir?', 'MSSQL Kurulumu', 'SQL Server Management Studio (SSMS)', 'Veritabanı Oluşturma', 'SQL Sözdizimi Temelleri', 'Veritabanı Yapısını Anlama', 'T-SQL\'e Giriş', 'Veritabanı Dosya Yapısı', 'Sistem Veritabanları', 'Veritabanı Yedekleme Temelleri', 'Güvenlik Temelleri', 'Veritabanı Özellikleri', 'Sorgu Penceresi Kullanımı', 'Hata Ayıklama Temelleri', 'Modül Özeti ve Değerlendirme'],
    2: ['Veri Tipleri Nedir?', 'Sayısal Veri Tipleri', 'Karakter Veri Tipleri', 'Tarih ve Zaman Veri Tipleri', 'Binary ve Diğer Veri Tipleri', 'NULL Değerler', 'Tablo Oluşturma (CREATE TABLE)', 'Sütun Özellikleri', 'Primary Key Tanımlama', 'Foreign Key Tanımlama', 'CHECK Constraint', 'UNIQUE Constraint', 'DEFAULT Constraint', 'Tablo Değiştirme (ALTER TABLE)', 'Modül Özeti'],
    3: ['INSERT Komutu', 'UPDATE Komutu', 'DELETE Komutu', 'SELECT Komutu Temelleri', 'WHERE Filtreleme', 'ORDER BY Sıralama', 'TOP ve OFFSET-FETCH', 'Bulk Insert', 'MERGE Komutu', 'TRUNCATE TABLE', 'CRUD İşlemleri Best Practices', 'Transaction ile CRUD', 'Hata Yönetimi', 'Performans Optimizasyonu', 'Modül Özeti'],
    4: ['SELECT Temelleri', 'WHERE Koşulları', 'AND, OR, NOT Operatörleri', 'IN ve NOT IN', 'LIKE ve Wildcards', 'BETWEEN Operatörü', 'IS NULL ve IS NOT NULL', 'DISTINCT Kullanımı', 'Alias Kullanımı', 'CASE WHEN İfadesi', 'CAST ve CONVERT', 'String Fonksiyonları', 'Tarih Fonksiyonları', 'Matematik Fonksiyonları', 'Modül Özeti'],
    5: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'Self JOIN', 'Multiple JOINs', 'JOIN ile WHERE', 'JOIN Performansı', 'JOIN vs Subquery', 'JOIN Best Practices', 'Complex JOIN Senaryoları', 'JOIN Hatalarını Önleme', 'JOIN Optimizasyonu', 'Modül Özeti'],
    6: ['COUNT Fonksiyonu', 'SUM Fonksiyonu', 'AVG Fonksiyonu', 'MIN ve MAX', 'GROUP BY Kullanımı', 'HAVING Filtreleme', 'Aggregate Fonksiyonlar Kombinasyonu', 'DISTINCT ile Aggregate', 'Window Functions', 'ROLLUP ve CUBE', 'GROUPING SETS', 'Aggregate Best Practices', 'Performans Optimizasyonu', 'Complex Aggregations', 'Modül Özeti'],
    7: ['Subquery Nedir?', 'Scalar Subquery', 'Correlated Subquery', 'EXISTS ve NOT EXISTS', 'IN ve NOT IN ile Subquery', 'ANY ve ALL', 'Common Table Expressions (CTE)', 'Recursive CTE', 'CTE vs Subquery', 'CTE Best Practices', 'Window Functions ile CTE', 'Multiple CTEs', 'CTE Performansı', 'Complex CTE Senaryoları', 'Modül Özeti'],
    8: ['Stored Procedure Nedir?', 'Stored Procedure Oluşturma', 'Parametreli Stored Procedures', 'Return Değerleri', 'Output Parametreleri', 'Error Handling', 'Transaction Yönetimi', 'Dynamic SQL', 'Stored Procedure Best Practices', 'Stored Procedure Performansı', 'Nested Procedures', 'System Stored Procedures', 'Stored Procedure Debugging', 'Deployment Stratejileri', 'Modül Özeti'],
    9: ['Function Nedir?', 'Scalar Functions', 'Table-Valued Functions', 'Inline Table-Valued Functions', 'Multi-Statement Table-Valued Functions', 'Function Parametreleri', 'Function vs Stored Procedure', 'Deterministic Functions', 'Function Best Practices', 'Function Performansı', 'System Functions', 'User-Defined Functions', 'Function Limitations', 'Function Testing', 'Modül Özeti'],
    10: ['Trigger Nedir?', 'AFTER Triggers', 'INSTEAD OF Triggers', 'DML Triggers', 'DDL Triggers', 'Trigger Execution Order', 'Trigger içinde INSERTED ve DELETED', 'Nested Triggers', 'Recursive Triggers', 'Trigger Best Practices', 'Trigger Performansı', 'Trigger Debugging', 'Trigger Güvenliği', 'Trigger Alternatifleri', 'Modül Özeti'],
    11: ['Index Nedir?', 'Clustered Index', 'Non-Clustered Index', 'Composite Index', 'Covering Index', 'Index Fragmentation', 'Index Maintenance', 'Index Statistics', 'Query Optimizer', 'Index Best Practices', 'Index Performans Analizi', 'Missing Index Suggestions', 'Index Design Patterns', 'Index Monitoring', 'Modül Özeti'],
    12: ['View Nedir?', 'View Oluşturma', 'Simple Views', 'Complex Views', 'Indexed Views', 'View ile DML', 'View Best Practices', 'View Performansı', 'View Güvenliği', 'System Views', 'Dynamic Management Views', 'View Maintenance', 'View vs Table', 'View Senaryoları', 'Modül Özeti'],
    13: ['Transaction Nedir?', 'ACID Properties', 'BEGIN TRANSACTION', 'COMMIT ve ROLLBACK', 'Savepoints', 'Transaction Isolation Levels', 'Locking', 'Deadlocks', 'Concurrency Control', 'Transaction Best Practices', 'Nested Transactions', 'Distributed Transactions', 'Transaction Log', 'Recovery Models', 'Modül Özeti'],
    14: ['Security Model', 'Login Oluşturma', 'User Oluşturma', 'Roles', 'Permissions', 'Schema Security', 'Row-Level Security', 'Dynamic Data Masking', 'Encryption', 'Auditing', 'Security Best Practices', 'Compliance', 'Security Monitoring', 'Security Troubleshooting', 'Modül Özeti'],
    15: ['Backup Türleri', 'Full Backup', 'Differential Backup', 'Transaction Log Backup', 'Backup Stratejileri', 'Restore İşlemleri', 'Point-in-Time Recovery', 'Database Maintenance Plans', 'Index Maintenance', 'Statistics Update', 'Database Consistency Check', 'Automated Maintenance', 'Monitoring ve Alerting', 'Disaster Recovery', 'Modül Özeti']
}

# JSON yapısını oluştur
course_data = {
    'version': '1.0',
    'totalLessons': 225,
    'courseId': 'course-mssql-roadmap',
    'courseTitle': 'MSSQL Kursu',
    'description': 'Microsoft SQL Server veritabanı yönetimi ve geliştirme konularında kapsamlı bir kurs. SQL temellerinden ileri seviye konulara kadar her şeyi öğreneceksiniz.',
    'modules': []
}

for module_num in range(1, 16):
    module_id = f'module-{module_num:02d}'
    module_title = modules[module_num - 1]
    lessons = []
    
    for lesson_num in range(1, 16):
        lesson_label = f'Ders {lesson_num}: {lesson_templates[module_num][lesson_num - 1]}'
        lesson_href = f'/education/lessons/mssql/{module_id}/lesson-{lesson_num:02d}'
        lesson_title = lesson_templates[module_num][lesson_num - 1]
        
        # Seviye belirleme
        if module_num <= 5:
            level = 'Başlangıç'
        elif module_num <= 10:
            level = 'Orta'
        else:
            level = 'İleri'
        
        lesson = {
            'label': lesson_label,
            'href': lesson_href,
            'description': f'{lesson_title} konusunda detaylı bilgi ve uygulamalar.',
            'estimatedDurationMinutes': 30,
            'level': level,
            'keyTakeaways': [
                f'{lesson_title} konusunu öğreneceksin',
                'Pratik örnekler ile konuyu pekiştireceksin',
                'Best practices ve yaygın hataları öğreneceksin'
            ],
            'sections': [
                {
                    'id': f'{module_id}-lesson-{lesson_num:02d}-intro',
                    'title': 'Giriş',
                    'summary': f'{lesson_title} konusuna giriş.',
                    'content': [
                        {
                            'type': 'text',
                            'body': f'{lesson_title} konusu MSSQL veritabanı yönetimi ve geliştirme için önemli bir konudur. Bu derste bu konuyu detaylı olarak öğreneceksin.'
                        },
                        {
                            'type': 'code',
                            'language': 'sql',
                            'code': f'-- {lesson_title} örnek kodu\nSELECT * FROM INFORMATION_SCHEMA.TABLES;',
                            'explanation': f'{lesson_title} için temel örnek kod.'
                        }
                    ]
                }
            ]
        }
        lessons.append(lesson)
    
    module = {
        'moduleId': module_id,
        'moduleTitle': module_title,
        'lessons': lessons
    }
    course_data['modules'].append(module)

# JSON dosyasına yaz
output_path = os.path.join('data', 'lesson-contents', 'mssql-course.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(course_data, f, ensure_ascii=False, indent=2)

print('MSSQL kursu JSON dosyası başarıyla oluşturuldu!')
print(f'Toplam modül: {len(course_data["modules"])}')
print(f'Toplam ders: {course_data["totalLessons"]}')
print(f'Dosya yolu: {output_path}')

