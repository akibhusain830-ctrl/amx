
import re

with open(r'c:\Users\akib\Desktop\amx\product_image_mapping.md', 'r') as f:
    content = f.read()

# Find all image filenames in the mapping
mapped_images = re.findall(r'- ([\w\s\.()\[\]]+?\.(?:jpeg|jpg|png|webp))', content)
mapped_images = [img.strip() for img in mapped_images]

print(f"Total mapped images: {len(mapped_images)}")

import os
dir_path = r'c:\Users\akib\Desktop\amx\product listing'
dir_images = os.listdir(dir_path)
print(f"Total images in directory: {len(dir_images)}")

unmapped = set(dir_images) - set(mapped_images)
if unmapped:
    print(f"Unmapped images: {len(unmapped)}")
    for img in unmapped:
        print(f"  - {img}")
else:
    print("All images are mapped.")
