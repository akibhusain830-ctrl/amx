
import os
import re

mapping_path = r'c:\Users\akib\Desktop\amx\product_image_mapping.md'
dir_path = r'c:\Users\akib\Desktop\amx\product listing'

with open(mapping_path, 'r') as f:
    lines = f.readlines()

dir_files = set(os.listdir(dir_path))
mapped_files = set()

current_product = None
products_found = []

for line in lines:
    # Identify product headers
    prod_match = re.match(r'### (\d+)\. (.*)', line)
    if prod_match:
        current_product = {
            'num': prod_match.group(1),
            'name': prod_match.group(2).strip(),
            'images': []
        }
        products_found.append(current_product)
        continue
    
    # Identify image bullets
    if line.strip().startswith('-'):
        # Extract filename: everything after '- ' until the first extension + following chars if it's not a space
        # Or more simply: try to match known extensions
        match = re.search(r'- ([\w\s\.()\[\]-]+?\.(?:jpeg|jpg|png|webp))', line)
        if match:
            filename = match.group(1).strip()
            # If the filename is actually a note like "(Shared with...)", skip it
            if filename.startswith('('):
                continue
            
            # Check if this filename is in the directory
            if filename in dir_files:
                mapped_files.add(filename)
                if current_product:
                    current_product['images'].append(filename)
            else:
                # Try to see if it's a partial match due to my regex
                # Let's just look for any file in dir_files that is in the line
                found_in_dir = False
                for f_name in dir_files:
                    if f_name in line:
                        mapped_files.add(f_name)
                        if current_product:
                            current_product['images'].append(f_name)
                        found_in_dir = True
                        break

print(f"Total products listed in mapping: {len(products_found)}")
print(f"Total unique images mapped to products: {len(mapped_files)}")
print(f"Total files in directory: {len(dir_files)}")

unmapped = dir_files - mapped_files
print(f"\nUnmapped files in directory: {len(unmapped)}")
for f in unmapped:
    print(f"  - {f}")

print("\nProduct inventory check:")
for p in products_found:
    img_count = len(p['images'])
    print(f"{p['num']}. {p['name']} -> {img_count} images")

# Special check for products with 0 images
zero_img_prods = [p for p in products_found if len(p['images']) == 0]
if zero_img_prods:
    print("\nProducts with 0 images:")
    for p in zero_img_prods:
        print(f"  - {p['num']}. {p['name']}")
