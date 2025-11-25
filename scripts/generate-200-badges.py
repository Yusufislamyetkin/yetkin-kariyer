import json

# Kategori çarpanları
category_multipliers = {
    "daily_activities": 1.0,
    "score": 1.2,
    "social_interaction": 0.8,
    "streak": 1.5,
    "special": 2.0
}

# Seviye base puanları
tier_base_points = {
    "bronze": 15,
    "silver": 40,
    "gold": 100,
    "platinum": 300
}

# Rarity mapping
tier_rarity = {
    "bronze": "common",
    "silver": "rare",
    "gold": "epic",
    "platinum": "legendary"
}

# Emoji listesi (200 farklı emoji)
emojis = [
    "🎯", "📝", "📚", "📖", "📗", "📘", "📙", "🏆", "✅", "👍",
    "⭐", "🌟", "💯", "📊", "📈", "🎓", "🔥", "📅", "⚡", "📆",
    "🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎮", "🎰", "🎲", "🃏",
    "🀄", "🎴", "🎯", "🎪", "🎨", "🎭", "🎬", "🎤", "🎧", "🎮",
    "🏅", "🥇", "🥈", "🥉", "🏵️", "🎖️", "🎗️", "🎟️", "🎫", "🎪",
    "💎", "🔮", "💍", "👑", "👒", "🎩", "⛑️", "🪖", "🧢", "🎓",
    "🌠", "⭐", "🌟", "✨", "💫", "⚡", "🔥", "💥", "🌈", "☀️",
    "🌙", "⭐", "🌟", "💫", "✨", "🌠", "🎆", "🎇", "🧨", "🎊",
    "🎉", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁", "🍭", "🍬", "🍫",
    "🍪", "🍩", "🍨", "🍧", "🍦", "🥧", "🍰", "🎂", "🧁", "🍭",
    "🚀", "✈️", "🛸", "🛰️", "🌍", "🌎", "🌏", "🌐", "🗺️", "🧭",
    "⛰️", "🏔️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🌅",
    "🌄", "🌆", "🌇", "🌃", "🌉", "🌁", "🌊", "💧", "💦", "☔",
    "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸",
    "🥊", "🥋", "🥌", "⛸️", "🛷", "⛷️", "🏂", "🏋️", "🤼", "🤸",
    "🤺", "⛹️", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣",
    "🧗", "🚵", "🚴", "🏃", "🚶", "🕴️", "👤", "👥", "👣", "🧠",
    "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "👀", "👁️",
    "👅", "👄", "💋", "💘", "💝", "💖", "💗", "💓", "💞", "💕",
    "💟", "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤",
    "🤍", "🤎", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣",
    "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤", "👋", "🤚", "🖐️", "✋",
    "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉"
]

# Kategori isimleri ve açıklamaları
category_info = {
    "daily_activities": {
        "name": "Günlük Aktiviteler",
        "description": "Günlük test, kurs, canlı kod ve bugfix aktiviteleriniz için rozetler"
    },
    "score": {
        "name": "Toplam Başarılar",
        "description": "Toplam başarılarınız için rozetler"
    },
    "social_interaction": {
        "name": "Sosyal Etkileşim",
        "description": "Sosyal aktiviteleriniz için rozetler"
    },
    "streak": {
        "name": "Süreklilik ve Disiplin",
        "description": "Süreklilik ve disiplin rozetleri"
    },
    "special": {
        "name": "Özel Başarılar",
        "description": "Özel başarılarınız için rozetler"
    }
}

# Tier isimleri
tier_names = {
    "bronze": "Başlangıç Seviye",
    "silver": "Orta Seviye",
    "gold": "İleri Seviye",
    "platinum": "Efsanevi"
}

badges = []
emoji_index = 0

# Her kategori için
for cat_idx, category in enumerate(["daily_activities", "score", "social_interaction", "streak", "special"]):
    # Her tier için
    for tier_idx, tier in enumerate(["bronze", "silver", "gold", "platinum"]):
        # Her tier'de 10 rozet
        for badge_idx in range(10):
            badge_num = cat_idx * 40 + tier_idx * 10 + badge_idx + 1
            badge_id = f"badge-{badge_num:03d}"
            badge_key = f"{category}_{tier}_{badge_idx + 1}"
            
            # Puan hesaplama
            base_points = tier_base_points[tier]
            multiplier = category_multipliers[category]
            points = int(base_points * multiplier)
            
            # Rozet isimleri ve açıklamaları
            if category == "daily_activities":
                activity_types = ["test", "kurs", "canlı kod", "bugfix", "ders", "quiz", "canlı kodlama", "hata düzeltme", "eğitim", "pratik"]
                activity_type = activity_types[badge_idx % len(activity_types)]
                if tier == "bronze":
                    count = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1][badge_idx]
                    name = f"İlk {activity_type.capitalize()}" if count == 1 else f"{count} {activity_type.capitalize()}"
                    description = f"Bir günde {count} {activity_type} tamamla"
                elif tier == "silver":
                    count = [5, 6, 7, 5, 6, 7, 5, 6, 7, 5][badge_idx]
                    name = f"{count} {activity_type.capitalize()} Ustası"
                    description = f"Bir günde {count} {activity_type} tamamla"
                elif tier == "gold":
                    count = [10, 12, 15, 10, 12, 15, 10, 12, 15, 10][badge_idx]
                    name = f"{count} {activity_type.capitalize()} Uzmanı"
                    description = f"Bir günde {count} {activity_type} tamamla"
                else:  # platinum
                    count = [20, 25, 30, 20, 25, 30, 20, 25, 30, 20][badge_idx]
                    name = f"{count} {activity_type.capitalize()} Efsanesi"
                    description = f"Bir günde {count} {activity_type} tamamla"
                criteria = {
                    "type": "daily_activity",
                    "activity_type": activity_type,
                    "count": count,
                    "daily": True
                }
            elif category == "score":
                score_types = ["tek test", "ortalama", "toplam", "mükemmel", "yüksek", "tutarlı", "başarılı", "harika", "mükemmel", "efsanevi"]
                score_type = score_types[badge_idx % len(score_types)]
                if tier == "bronze":
                    score_range = [60, 65, 70, 60, 65, 70, 60, 65, 70, 60][badge_idx]
                    name = f"{score_type.capitalize()} {score_range}"
                    description = f"{score_type.capitalize()} skorunuz {score_range} ve üzeri olsun"
                elif tier == "silver":
                    score_range = [80, 82, 85, 80, 82, 85, 80, 82, 85, 80][badge_idx]
                    name = f"{score_type.capitalize()} {score_range}"
                    description = f"{score_type.capitalize()} skorunuz {score_range} ve üzeri olsun"
                elif tier == "gold":
                    score_range = [90, 92, 95, 90, 92, 95, 90, 92, 95, 90][badge_idx]
                    name = f"{score_type.capitalize()} {score_range}"
                    description = f"{score_type.capitalize()} skorunuz {score_range} ve üzeri olsun"
                else:  # platinum
                    score_range = 100
                    name = f"{score_type.capitalize()} Mükemmel"
                    description = f"{score_type.capitalize()} skorunuz {score_range} olsun"
                criteria = {
                    "type": "score",
                    "score_type": score_type,
                    "min_score": score_range
                }
            elif category == "social_interaction":
                social_types = ["post", "beğeni", "yorum", "story", "arkadaş", "takipçi", "paylaşım", "etkileşim", "sosyal", "topluluk"]
                social_type = social_types[badge_idx % len(social_types)]
                if tier == "bronze":
                    count = [10, 15, 20, 10, 15, 20, 10, 15, 20, 10][badge_idx]
                    name = f"İlk {count} {social_type.capitalize()}"
                    description = f"Toplam {count} {social_type} yap"
                elif tier == "silver":
                    count = [50, 75, 100, 50, 75, 100, 50, 75, 100, 50][badge_idx]
                    name = f"{count} {social_type.capitalize()}"
                    description = f"Toplam {count} {social_type} yap"
                elif tier == "gold":
                    count = [200, 300, 500, 200, 300, 500, 200, 300, 500, 200][badge_idx]
                    name = f"{count} {social_type.capitalize()} Ustası"
                    description = f"Toplam {count} {social_type} yap"
                else:  # platinum
                    count = [1000, 1500, 2000, 1000, 1500, 2000, 1000, 1500, 2000, 1000][badge_idx]
                    name = f"{count} {social_type.capitalize()} Efsanesi"
                    description = f"Toplam {count} {social_type} yap"
                criteria = {
                    "type": "social_interaction",
                    "interaction_type": social_type,
                    "count": count
                }
            elif category == "streak":
                streak_types = ["günlük aktivite", "test çözme", "kurs tamamlama", "login", "aktif", "disiplin", "süreklilik", "düzen", "alışkanlık", "ritim"]
                streak_type = streak_types[badge_idx % len(streak_types)]
                if tier == "bronze":
                    days = [3, 5, 7, 3, 5, 7, 3, 5, 7, 3][badge_idx]
                    name = f"{days} Günlük {streak_type.capitalize()}"
                    description = f"{days} gün üst üste {streak_type} yap"
                elif tier == "silver":
                    days = [14, 21, 30, 14, 21, 30, 14, 21, 30, 14][badge_idx]
                    name = f"{days} Günlük {streak_type.capitalize()}"
                    description = f"{days} gün üst üste {streak_type} yap"
                elif tier == "gold":
                    days = [60, 75, 100, 60, 75, 100, 60, 75, 100, 60][badge_idx]
                    name = f"{days} Günlük {streak_type.capitalize()}"
                    description = f"{days} gün üst üste {streak_type} yap"
                else:  # platinum
                    days = [365, 500, 730, 365, 500, 730, 365, 500, 730, 365][badge_idx]
                    name = f"{days} Günlük {streak_type.capitalize()} Efsanesi"
                    description = f"{days} gün üst üste {streak_type} yap"
                criteria = {
                    "type": "streak",
                    "streak_type": streak_type,
                    "days": days
                }
            else:  # special
                special_types = ["ilk test", "ilk kurs", "ilk post", "hızlı tamamlama", "mükemmel performans", "özel kombinasyon", "nadir başarı", "efsanevi an", "tarihi başarı", "benzersiz başarı"]
                special_type = special_types[badge_idx % len(special_types)]
                if tier == "bronze":
                    name = f"İlk {special_type.split()[1] if len(special_type.split()) > 1 else special_type}"
                    description = f"{special_type.capitalize()} başarısını elde et"
                elif tier == "silver":
                    name = f"Hızlı {special_type.split()[1] if len(special_type.split()) > 1 else special_type}"
                    description = f"24 saat içinde {special_type} başarısını elde et"
                elif tier == "gold":
                    name = f"Mükemmel {special_type.split()[1] if len(special_type.split()) > 1 else special_type}"
                    description = f"{special_type.capitalize()} mükemmel performansı göster"
                else:  # platinum
                    name = f"Efsanevi {special_type.split()[1] if len(special_type.split()) > 1 else special_type}"
                    description = f"{special_type.capitalize()} efsanevi başarısını elde et"
                criteria = {
                    "type": "special",
                    "special_type": special_type
                }
            
            # Renk kodları (tier'a göre)
            color_map = {
                "bronze": ["#CD7F32", "#B87333", "#A0522D", "#8B4513", "#654321", "#5C4033", "#4A3728", "#3D2817", "#2F1F14", "#1F140D"],
                "silver": ["#C0C0C0", "#A8A8A8", "#909090", "#787878", "#606060", "#484848", "#303030", "#181818", "#101010", "#080808"],
                "gold": ["#FFD700", "#FFC125", "#FFB347", "#FFA500", "#FF8C00", "#FF7F50", "#FF6347", "#FF4500", "#FF1493", "#FF00FF"],
                "platinum": ["#E5E4E2", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#555555", "#404040", "#2F2F2F", "#1C1C1C"]
            }
            color = color_map[tier][badge_idx % 10]
            
            # Emoji seçimi
            icon = emojis[emoji_index % len(emojis)]
            emoji_index += 1
            
            badge = {
                "id": badge_id,
                "key": badge_key,
                "name": name,
                "description": description,
                "icon": icon,
                "color": color,
                "category": category,
                "tier": tier,
                "rarity": tier_rarity[tier],
                "points": points,
                "criteria": criteria
            }
            badges.append(badge)

# JSON dosyasını oluştur
output = {
    "totalBadges": 200,
    "badges": badges
}

# Dosyaya yaz
with open("public/data/badges.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Success: {len(badges)} badges created!")
print(f"Category distribution:")
for category in ["daily_activities", "score", "social_interaction", "streak", "special"]:
    count = len([b for b in badges if b["category"] == category])
    print(f"   - {category}: {count} badges")

