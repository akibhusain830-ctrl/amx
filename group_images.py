import os
from PIL import Image
import imagehash
from collections import defaultdict

img_dir = r"c:\Users\akib\Desktop\amx\product listing"

# Grouping by exact hash might be too strict due to small compression artifacts, 
# so we group by hash difference < threshold
threshold = 8

hashes = []
for filename in os.listdir(img_dir):
    if filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
        filepath = os.path.join(img_dir, filename)
        try:
            with Image.open(filepath) as img:
                # Use dhash which is good at identifying similar images even if resized
                h = imagehash.dhash(img)
                hashes.append((filename, h))
        except Exception as e:
            print(f"Error reading {filename}: {e}")

# Clustering
clusters = [] # list of lists of filenames
for filename, h in hashes:
    added = False
    for cluster in clusters:
        # Check against the first item in the cluster
        rep_filename = cluster[0]
        rep_h = next(hash_val for name, hash_val in hashes if name == rep_filename)
        if h - rep_h <= threshold:
            cluster.append(filename)
            added = True
            break
    if not added:
        clusters.append([filename])

print(f"Found {len(clusters)} unique visual clusters among {len(hashes)} images:")
for i, cluster in enumerate(clusters, 1):
    print(f"\nCluster {i} ({len(cluster)} images):")
    for name in cluster:
        print(f"  - {name}")
