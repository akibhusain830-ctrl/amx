import os
import json

directory = r"c:\Users\akib\Desktop\amx\product listing"
files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

mapping = {
    "Pizza Slice": ["Pizza", "on_wall_202605121245"],
    "Burger": ["Burger", "on_wall_202605121241"], # Need to be careful with Fries
    "French Fries": ["Fries", "on_wall_202605121241 (1)"],
    "Fast Food Combo": ["behind_person_202605121611"],
    "Akatsuki Cloud (Red)": ["dark_wall_202605121642"],
    "Akatsuki Cloud (Outline)": ["on_wall_202605121626"],
    "Peaks & Sunset (Horizontal)": ["floor_202605121721", "holding_neon_sign_202605121721"],
    "Peaks & Sunset (Round)": ["floor_202605121726", "bedroom_wall_202605121726", "holding_neon_sign_202605121724", "dark_background_202605121724"],
    "Leaf in Circle": ["dark_wall_202605121728", "holding_neon_sign_202605121731 (1)"],
    "Moon, Cloud & Star": ["dark_wall_202605121729", "holding_neon_sign_202605121731"],
    "Infinity Love": ["dark_wall_202605121707"],
    "You & Me (Heart)": ["dark_wall_202605121709", "holding_neon_sign_202605121710"],
    "Home Sweet Home (House)": ["dark_wall_202605121712", "holding_neon_sign_202605121717", "glowing_bedroom_wall_202605121717"],
    "Rainbow Arch (3-Line)": ["floor_202605121719"],
    "Diya / Oil Lamp (Double)": ["against_wall_202605121640"],
    "Dripping Heart": ["behind_girl_202605121649", "against_wall_202605121643", "holding_neon_sign_202605121714"],
    "XOXO with Hearts": ["holding_neon_sign_202605121703", "holding_neon_sign_202605121731 (2)"],
    "Broken Heart": ["on_wall_202605121547"], # Need to be careful with Heart Classic
    "Heart (Classic)": ["on_wall_202605121547 (1)"],
    "Angel Wings (Large)": ["person_with_neon_sign_202605121606"],
    "Devil Wings (Full)": ["behind_person_202605121615 (2)", "behind_person_202605121615 (3)"],
    "Angel & Devil (Split)": ["behind_person_202605121621 (1)"],
    "Controller (Classic)": ["on_wall_202605121632"],
    "Controller (Detailed)": ["on_wall_202605111313"], # Not including (1)
    "Game Over": ["on_wall_202605121622"],
    "Porsche 911 (Rain)": ["Porsche"],
    "BMW M4 (Front)": ["BMW", "as_the_main_202605121252", "remove_the_frame", "remove_the_n_logo"],
    "Silverstone Circuit": ["202605121316"], # Careful with Monza
    "Monza Circuit": ["202605121316 (1)"],
    "Spa-Francorchamps": ["202605121319"],
    "Circuit de la Sarthe": ["202605121319 (1)"],
    "Red Bull Ring": ["on_wall_202605121321"],
    "Interlagos": ["on_wall_202605121321 (1)"],
    "COTA": ["on_wall_202605121326"],
    "Suzuka Circuit": ["on_wall_202605121326 (1)"],
    "Marina Bay": ["main_subject_202605121306"],
    "Yas Marina": ["on_wall_202605111313 (1)"],
    "Zandvoort": ["bedroom_wall_202605121252"],
    "Good Vibes Only": ["vibes", "above_bed_202605111310"],
    "Humble Hustle": ["Hustle", "image_33464eda"],
    "This Must Be The Place": ["Must_Be_The_Place"],
    "Follow Your DREAM": ["DREAM"],
    "Don't Quit / Do It": ["behind_person_202605121615"], # Be careful with (2), (3)
    "Open (Oval)": ["Open", "IMG_9023"],
    "Hello": ["Hello"],
    "Welcome": ["Welcome"],
    "Rainbow (Simple)": ["on_wall_202605121636"],
    "Crown": ["Crown"]
}

# Special handling for substrings that might overlap
result = {name: [] for name in mapping}
unmapped = []

# Sort keys by specificity (longer strings first)
for f in files:
    matched = False
    
    # Priority matches for exact SKUs
    if "on_wall_202605121241 (1)" in f:
        result["French Fries"].append(f)
        matched = True
    elif "on_wall_202605121241" in f:
        result["Burger"].append(f)
        matched = True
    elif "on_wall_202605121547 (1)" in f:
        result["Heart (Classic)"].append(f)
        matched = True
    elif "on_wall_202605121547" in f:
        result["Broken Heart"].append(f)
        matched = True
    elif "behind_person_202605121615 (2)" in f or "behind_person_202605121615 (3)" in f:
        result["Devil Wings (Full)"].append(f)
        matched = True
    elif "behind_person_202605121615" in f:
        result["Don't Quit / Do It"].append(f)
        matched = True
    elif "on_wall_202605111313 (1)" in f:
        result["Yas Marina"].append(f)
        matched = True
    elif "on_wall_202605111313" in f:
        result["Controller (Detailed)"].append(f)
        matched = True
    elif "202605121316 (1)" in f:
        result["Monza Circuit"].append(f)
        matched = True
    elif "202605121316" in f:
        result["Silverstone Circuit"].append(f)
        matched = True
    elif "202605121319 (1)" in f:
        result["Circuit de la Sarthe"].append(f)
        matched = True
    elif "202605121319" in f:
        result["Spa-Francorchamps"].append(f)
        matched = True
    elif "on_wall_202605121321 (1)" in f:
        result["Interlagos"].append(f)
        matched = True
    elif "on_wall_202605121321" in f:
        result["Red Bull Ring"].append(f)
        matched = True
    elif "on_wall_202605121326 (1)" in f:
        result["Suzuka Circuit"].append(f)
        matched = True
    elif "on_wall_202605121326" in f:
        result["COTA"].append(f)
        matched = True
    
    if matched: continue
    
    # General matches
    for name, patterns in mapping.items():
        for p in patterns:
            if p in f:
                result[name].append(f)
                matched = True
                break
        if matched: break
    
    if not matched:
        unmapped.append(f)

# Clean up results (remove duplicates)
for name in result:
    result[name] = sorted(list(set(result[name])))

print(json.dumps({"mapped": result, "unmapped": unmapped}, indent=2))
