
import os
import re
from collections import Counter

dir_path = r'c:\Users\akib\Desktop\amx\product listing'
files = os.listdir(dir_path)

# Common photo-style words to ignore
noise = {'neon', 'sign', 'on', 'wall', 'behind', 'person', 'girl', 'woman', 'holding', 'with', 'shot', 'image', 'chatgpt', 'may', 'am', 'pm', 'poster', 'leaning', 'against', 'bedroom', 'living', 'room', 'dark', 'plain', 'brick', 'concrete', 'floor', 'reflective', 'wood', 'glowing', 'main', 'subject', 'as', 'the', 'exact', 'remove', 'frame', 'from', 'logo', '2k'}

def extract_keywords(filename):
    name = os.path.splitext(filename)[0]
    # Remove non-alpha chars
    words = re.split(r'[^a-zA-Z0-9]', name.lower())
    # Filter out numbers (timestamps/ids) and noise
    keywords = [w for w in words if w and not w.isdigit() and w not in noise]
    return " ".join(keywords)

unique_designs = {}
for f in files:
    kw = extract_keywords(f)
    if kw not in unique_designs:
        unique_designs[kw] = []
    unique_designs[kw].append(f)

print(f"Total Unique Keyword Groups: {len(unique_designs)}")
for kw, f_list in sorted(unique_designs.items()):
    if kw:
        print(f"\nDesign: {kw} ({len(f_list)} images)")
        # for f in f_list: print(f"  - {f}")
    else:
        print(f"\nNo keywords extracted (likely noise-only name): {f_list}")
