
import os
import re
from collections import defaultdict

mapping_path = r'c:\Users\akib\Desktop\amx\product_image_mapping.md'
dir_path = r'c:\Users\akib\Desktop\amx\product listing'

with open(mapping_path, 'r') as f:
    content = f.read()

dir_files = set(os.listdir(dir_path))
image_to_prods = defaultdict(list)

products = re.findall(r'### (\d+)\. (.*)', content)

for num, name in products:
    block_pattern = f'### {num}\\. {re.escape(name)}' + r'(.*?)((?=###)|(?=---)|$)'
    block_match = re.search(block_pattern, content, re.DOTALL)
    if block_match:
        block_text = block_match.group(1)
        for f_name in dir_files:
            # Match strictly if it's in a bullet point or similar
            if f"- {f_name}" in block_text:
                image_to_prods[f_name].append(num)

print("Shared Images Report:")
shared_count = 0
for img, prods in image_to_prods.items():
    if len(prods) > 1:
        print(f"Image '{img}' is used for products: {prods}")
        shared_count += 1

if shared_count == 0:
    print("No images are shared between products.")

# Count images per product
print("\nImages per product:")
for num, name in products:
    count = sum(1 for img, prods in image_to_prods.items() if num in prods)
    print(f"{num}: {count} images")

# Check if #19 is mentioned as shared in the text
if "#19" in content or "Cloud (Minimalist)" in content:
    print("\nProduct #19 notes found.")
