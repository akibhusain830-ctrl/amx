
import re
from collections import defaultdict

with open(r'c:\Users\akib\Desktop\amx\product_image_mapping.md', 'r') as f:
    lines = f.readlines()

current_product = None
image_to_products = defaultdict(list)
product_to_images = defaultdict(list)

for line in lines:
    # Match "### [Number]. [Name]"
    prod_match = re.match(r'### (\d+)\. (.*)', line)
    if prod_match:
        current_product = f"{prod_match.group(1)}. {prod_match.group(2).strip()}"
        continue
    
    # Match image bullet points
    img_match = re.search(r'- ([\w\s\.()\[\]-]+?\.(?:jpeg|jpg|png|webp))', line)
    if img_match and current_product:
        img_name = img_match.group(1).strip()
        image_to_products[img_name].append(current_product)
        product_to_images[current_product].append(img_name)

print(f"Total Unique Products in numbering: {len(product_to_images)}")

print("\n--- Shared Images ---")
for img, prods in image_to_products.items():
    if len(prods) > 1:
        print(f"Image '{img}' is shared by:")
        for p in prods:
            print(f"  - {p}")

print("\n--- Products with No Images (or failed parsing) ---")
# Manually check #1 to #55
for i in range(1, 56):
    found = False
    for p in product_to_images.keys():
        if p.startswith(f"{i}."):
            found = True
            break
    if not found:
        print(f"Product #{i} missing images in mapping.")
