import os, unicodedata

# Allowed high-codepoint chars (not emojis)
ALLOWED = {0x20B9, 0x2022, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D,
           0x2026, 0x2192, 0x2190, 0x2191, 0x2193, 0x2713, 0x2714, 0x2715,
           0xFFFD, 0xFEFF}

found = []
for root, dirs, files in os.walk('frontend/src'):
    for fname in files:
        if not fname.endswith(('.jsx', '.js', '.css')):
            continue
        path = os.path.join(root, fname)
        with open(path, encoding='utf-8', errors='replace') as f:
            for i, line in enumerate(f, 1):
                for ch in line:
                    cp = ord(ch)
                    if cp > 0x27FF and cp not in ALLOWED:
                        name = unicodedata.name(ch, '?')
                        found.append(f'{path}:{i}: U+{cp:04X} ({name})')
                        break

if found:
    for item in found:
        print(item)
else:
    print('No emojis found - all clean!')
