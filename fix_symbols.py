import os

count = 0
BASE = os.path.join(os.path.dirname(__file__), 'frontend', 'src')

for root, dirs, files in os.walk(BASE):
    for fname in files:
        if not fname.endswith('.jsx'):
            continue
        path = os.path.join(root, fname)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        orig = content
        # garbled 👋 wave emoji (UTF-8 F0 9F 91 8B misread as latin-1)
        content = content.replace('\xf0\x9f\x91\x8b', '')
        # garbled • bullet (UTF-8 E2 80 A2 misread as latin-1)
        content = content.replace('\xe2\x80\xa2', '\u2022')
        # garbled – en-dash (UTF-8 E2 80 93 misread as latin-1)
        content = content.replace('\xe2\x80\x93', '\u2013')
        if content != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print('Fixed:', fname)

print(f'Total files fixed: {count}')
