
import os
import re

mapping_path = r'c:\Users\akib\Desktop\amx\product_image_mapping.md'
dir_path = r'c:\Users\akib\Desktop\amx\product listing'

with open(mapping_path, 'r') as f:
    content = f.read()

dir_files = set(os.listdir(dir_path))
mapped_files = set()

# Extract all filenames from the mapping anywhere they appear
all_mentioned_files = set()
for f_name in dir_files:
    if f_name in content:
        all_mentioned_files.add(f_name)

print(f"Total files in directory: {len(dir_files)}")
print(f"Total directory files mentioned in mapping: {len(all_mentioned_files)}")

unmentioned = dir_files - all_mentioned_files
if unmentioned:
    print(f"Unmentioned files ({len(unmentioned)}):")
    for f in unmentioned:
        print(f"  - {f}")
else:
    print("All directory files are mentioned in the mapping.")

# Count unique products
# A unique product is defined as a numbered entry (### X. Name) that has at least one unique image or is a distinct design.
products = re.findall(r'### (\d+)\. (.*)', content)
valid_products = []
for num, name in products:
    # Check if this product block has any image filenames
    # We define the block as starting from this ### until the next ### or end of file/section
    block_pattern = f'### {num}\\. {re.escape(name)}' + r'(.*?)((?=###)|(?=---)|$)'
    block_match = re.search(block_pattern, content, re.DOTALL)
    has_images = False
    if block_match:
        block_text = block_match.group(1)
        for f_name in dir_files:
            if f_name in block_text:
                has_images = True
                break
    
    if has_images:
        valid_products.append((num, name))
    else:
        print(f"Product {num} ({name.strip()}) has NO images assigned.")

print(f"\nTotal products with assigned images: {len(valid_products)}")
for num, name in valid_products:
    pass # print(f"{num}. {name.strip()}")

# Check for shared images between valid products
image_to_prods = {}
for f_name in dir_files:
    found_in = []
    for num, name in valid_products:
        block_pattern = f'### {num}\\. {re.escape(name)}' + r'(.*?)((?=###)|(?=---)|$)'
        block_match = re.search(block_pattern, content, re.DOTALL)
        if block_match and f_name in block_match.group(1):
            found_in.append(num)
    if len(found_in) > 1:
        print(f"Image {f_name} is shared by products: {found_in}")
