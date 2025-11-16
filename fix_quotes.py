#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SQL dosyasındaki kesme işaretlerini düzeltir.
SQL'de string içindeki kesme işaretleri '' (iki tane) ile escape edilmelidir.
"""

import re

def fix_sql_quotes(content):
    """
    SQL string literal içindeki kesme işaretlerini düzeltir.
    SQL'de ' karakteri '' ile escape edilmelidir.
    """
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # SQL string literal'larını bul ve içindeki kesme işaretlerini düzelt
        # Basit yaklaşım: ' ile başlayan ve ' ile biten string'leri bul
        # Ancak içinde kesme işareti varsa, onu '' ile değiştir
        
        # State machine ile string literal'ları işle
        result = []
        i = 0
        in_string = False
        
        while i < len(line):
            char = line[i]
            
            if char == "'":
                if not in_string:
                    # String başlangıcı
                    in_string = True
                    result.append(char)
                    i += 1
                else:
                    # String içindeyiz, bir sonraki karaktere bak
                    if i + 1 < len(line):
                        next_char = line[i+1]
                        # Eğer sonraki karakter de ' ise, zaten escape edilmiş
                        if next_char == "'":
                            result.append("''")
                            i += 2
                        # Eğer sonraki karakter string sonu işareti ise (virgül, parantez, boşluk, vb.)
                        elif next_char in [",", ")", "}", "]", " ", "\t", "\n"] or i + 1 == len(line) - 1:
                            # String sonu
                            in_string = False
                            result.append(char)
                            i += 1
                        else:
                            # String içinde kesme işareti - escape et
                            result.append("''")
                            i += 1
                    else:
                        # Satır sonu, string sonu
                        in_string = False
                        result.append(char)
                        i += 1
            else:
                result.append(char)
                i += 1
        
        fixed_line = ''.join(result)
        fixed_lines.append(fixed_line)
    
    return '\n'.join(fixed_lines)

# Dosyayı oku
print("Dosya okunuyor...")
with open('database-seed.sql', 'r', encoding='utf-8') as f:
    content = f.read()

print("Kesme işaretleri düzeltiliyor...")
# Düzelt
fixed_content = fix_sql_quotes(content)

# Dosyaya yaz
print("Dosyaya yazılıyor...")
with open('database-seed.sql', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Kesme işaretleri başarıyla düzeltildi!")
