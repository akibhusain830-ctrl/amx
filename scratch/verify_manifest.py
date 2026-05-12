
import re
from collections import Counter

manifest_path = r'c:\Users\akib\Desktop\amx\product_catalog_manifest.md'

with open(manifest_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract names from tables
# | Name | SKU | Notes |
names = re.findall(r'\| (.*?) \|', content)
# Filter out headers and irrelevant text
filtered_names = []
skip = ['Product Name', '---', 'Visual SKU / Primary File Reference', 'Notes']
for name in names:
    name = name.strip()
    if name and name not in skip and not all(c == '-' for c in name):
        # The regex might capture columns. We want the first column of the rows.
        # Let's refine the extraction.
        pass

# Refined extraction: look for rows with 3 pipes
rows = re.findall(r'\| (.*?) \| (.*?) \| (.*?) \|', content)
all_names = [row[0].strip() for row in rows if row[0].strip() not in skip]

print(f"Total entries in manifest: {len(all_names)}")
counts = Counter(all_names)
duplicates = {name: count for name, count in counts.items() if count > 1}

if duplicates:
    print("\nDuplicate names in manifest:")
    for name, count in duplicates.items():
        print(f"  - {name} ({count} times)")
else:
    print("\nNo duplicate product names in manifest.")

# Check for visual overlaps by looking at the "Primary File Reference"
primary_files = [row[1].strip() for row in rows if row[1].strip() not in skip]
file_counts = Counter(primary_files)
shared_files = {f: count for f, count in file_counts.items() if count > 1}

if shared_files:
    print("\nShared primary files in manifest:")
    for f, count in shared_files.items():
        print(f"  - {f} ({count} products)")
else:
    print("\nNo shared primary files in manifest.")
