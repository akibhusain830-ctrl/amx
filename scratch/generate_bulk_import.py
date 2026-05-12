import re
import json

# Configuration
MANIFEST_PATH = r'c:\Users\akib\Desktop\amx\final_sku_manifest.md'
IMAGE_BASE_URL = "https://vyuhmlyqciamgxkepbcq.supabase.co/storage/v1/object/public/products/product-images/"

def parse_manifest():
    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by product headings
    products_raw = re.split(r'\n## (\d+)\.', content)[1:]
    
    products = []
    for i in range(0, len(products_raw), 2):
        sku_num = products_raw[i].strip()
        data = products_raw[i+1]
        
        # Extract title and description
        title_match = re.search(r'^ (.*?)\n> (.*?)\n', data, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else f"Product {sku_num}"
        description = title_match.group(2).strip() if title_match else ""
        
        # Extract slug
        slug_match = re.search(r'- \*\*Slug:\*\* `(.*?)`', data)
        slug = slug_match.group(1) if slug_match else f"sku-{sku_num}"
        
        # Extract category
        cat_match = re.search(r'- \*\*Category:\*\* `(.*?)`', data)
        category = cat_match.group(1).lower() if cat_match else "aesthetic"
        
        # Extract badge
        badge_match = re.search(r'- \*\*Badge:\*\* `(.*?)`', data)
        badge = badge_match.group(1) if badge_match else None
        
        # Extract features
        features = re.findall(r'  - (.*?)\n', data)
        
        # Extract Pricing & Variants
        pricing_data = {}
        # Improved regex to catch "Small", "Regular", "Medium", "Large" and optional stars
        price_lines = re.findall(r'- (Small|Regular|Medium|Large)(?: ⭐)? \((.*?)\): ₹([\d,]+) \(Original: ₹([\d,]+)\)', data)
        
        prices = []
        original_prices = []
        
        for size, dims, price, orig in price_lines:
            # Map "Small" and "Regular" to "regular" for frontend compatibility
            key = "regular" if size in ["Small", "Regular"] else size.lower()
            p = int(price.replace(',', ''))
            o = int(orig.replace(',', ''))
            pricing_data[key] = {
                "price": p,
                "dimensions": dims.replace('×', ' x ')
            }
            prices.append(p)
            original_prices.append(o)

        # Base price is the minimum available price
        main_price = min(prices) if prices else 0
        main_original_price = min(original_prices) if original_prices else 0

        # Extract Images
        image_files = re.findall(r'- `(.*?)`', data)
        
        if not image_files:
            continue
            
        primary_image = f"{IMAGE_BASE_URL}{image_files[0]}"
        gallery = [f"{IMAGE_BASE_URL}{img}" for img in image_files]

        products.append({
            "id": f"sku-{sku_num}",
            "slug": slug,
            "title": title,
            "category": category,
            "description": description,
            "price": main_price,
            "original_price": main_original_price,
            "features": features,
            "badge": badge,
            "image_url": primary_image,
            "images": gallery,
            "variants": pricing_data,
            "rating": 0,
            "review_count": 0,
            "is_trending": badge == "BEST SELLER"
        })
        
    return products

def generate_sql(products):
    sql_lines = []
    sql_lines.append("INSERT INTO public.products (id, slug, title, category, description, price, original_price, features, badge, image_url, images, variants, rating, review_count, is_trending) VALUES")
    
    values = []
    for p in products:
        title_esc = p['title'].replace("'", "''")
        desc_esc = p['description'].replace("'", "''")
        
        features_list = ["'" + f.replace("'", "''") + "'" for f in p['features']]
        features_sql = "ARRAY[" + ",".join(features_list) + "]"
        
        images_list = ["'" + img + "'" for img in p['images']]
        images_sql = "ARRAY[" + ",".join(images_list) + "]"
        
        variants_sql = "'" + json.dumps(p['variants']) + "'::jsonb"
        badge_sql = f"'{p['badge']}'" if p['badge'] else "NULL"
        
        line = f"('{p['id']}', '{p['slug']}', '{title_esc}', '{p['category']}', '{desc_esc}', {p['price']}, {p['original_price']}, {features_sql}, {badge_sql}, '{p['image_url']}', {images_sql}, {variants_sql}, {p['rating']}, {p['review_count']}, {str(p['is_trending']).lower()})"
        values.append(line)
    
    sql_lines.append(",\n".join(values))
    sql_lines.append("ON CONFLICT (id) DO UPDATE SET")
    sql_lines.append("slug = EXCLUDED.slug, title = EXCLUDED.title, category = EXCLUDED.category, description = EXCLUDED.description, price = EXCLUDED.price, original_price = EXCLUDED.original_price, features = EXCLUDED.features, badge = EXCLUDED.badge, image_url = EXCLUDED.image_url, images = EXCLUDED.images, variants = EXCLUDED.variants, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, is_trending = EXCLUDED.is_trending;")
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    products = parse_manifest()
    sql = generate_sql(products)
    
    with open('bulk_import_products.sql', 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"Generated SQL for {len(products)} products with fixed 'Regular' size mapping.")
