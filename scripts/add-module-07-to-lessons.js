const fs = require('fs');
const path = require('path');

// Modül 7 içeriklerini oku
const module7Path = path.join(process.cwd(), 'data', 'lesson-contents', 'module-07-content.json');
const module7Data = JSON.parse(fs.readFileSync(module7Path, 'utf-8'));

// Mevcut JSON dosyasını oku (hata varsa düzelt)
const lessonsPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
let lessonsData;

try {
  const content = fs.readFileSync(lessonsPath, 'utf-8');
  // JSON'dan önce ve sonra gereksiz karakterleri temizle
  const cleanedContent = content.trim();
  lessonsData = JSON.parse(cleanedContent);
} catch (error) {
  console.error('JSON parse hatası:', error.message);
  // Dosyanın son kısmını kontrol et
  const content = fs.readFileSync(lessonsPath, 'utf-8');
  const lines = content.split('\n');
  console.log('Son 10 satır:');
  lines.slice(-10).forEach((line, i) => {
    console.log(`${lines.length - 10 + i + 1}: ${line.substring(0, 100)}`);
  });
  process.exit(1);
}

// Modül 7'nin zaten var olup olmadığını kontrol et
const module7Exists = lessonsData.modules.some(m => 
  m.moduleId && (m.moduleId.includes('07') || m.moduleId === 'module-07-auth')
);

if (module7Exists) {
  console.log('Modül 7 zaten mevcut. Güncelleniyor...');
  // Mevcut modül 7'yi bul ve güncelle
  const moduleIndex = lessonsData.modules.findIndex(m => 
    m.moduleId && (m.moduleId.includes('07') || m.moduleId === 'module-07-auth')
  );
  lessonsData.modules[moduleIndex] = module7Data;
} else {
  console.log('Modül 7 ekleniyor...');
  // Modül 7'yi ekle
  lessonsData.modules.push(module7Data);
}

// Toplam ders sayısını güncelle
const totalLessons = lessonsData.modules.reduce((sum, m) => sum + (m.lessons ? m.lessons.length : 0), 0);
lessonsData.totalLessons = totalLessons;

// JSON'u yaz
fs.writeFileSync(lessonsPath, JSON.stringify(lessonsData, null, 2), 'utf-8');

console.log(`✅ Modül 7 başarıyla eklendi/güncellendi!`);
console.log(`✅ Toplam ${lessonsData.modules.length} modül, ${totalLessons} ders içeriği var.`);
console.log(`✅ Modül 7'de ${module7Data.lessons.length} ders var.`);

