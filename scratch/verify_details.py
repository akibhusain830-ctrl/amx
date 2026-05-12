
import re

with open(r'c:\Users\akib\Desktop\amx\product_image_mapping.md', 'r') as f:
    content = f.read()

# Find all lines starting with ### [Number].
products = re.findall(r'### (\d+)\. (.*)', content)
print(f"Number of products listed: {len(products)}")

for num, name in products:
    print(f"Product {num}: {name.strip()}")

# Find images in Reference & Misc
misc_section = re.search(r'## Reference & Misc(.*)', content, re.DOTALL)
misc_images = []
if misc_section:
    misc_images = re.findall(r'- ([\w\s\.()\[\]-]+?\.(?:jpeg|jpg|png|webp))', misc_section.group(1))
    print(f"\nMisc images: {len(misc_images)}")
    for img in misc_images:
        print(f"  - {img}")

# Total files in directory
import os
dir_path = r'c:\Users\akib\Desktop\amx\product listing'
dir_files = os.listdir(dir_path)
print(f"\nTotal files in directory: {len(dir_files)}")

# Check for #19 specifically
prod_19_block = re.search(r'### 19\. Cloud \(Minimalist\).*?(?=###|---)', content, re.DOTALL)
if prod_19_block:
    print(f"\nProduct 19 block found. Content:\n{prod_19_block.group(0)}")
