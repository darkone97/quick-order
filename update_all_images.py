import os
import shutil
import time
import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

images_dir = r"d:\website\images"
os.makedirs(images_dir, exist_ok=True)
brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\868b9bd9-6425-4027-bb5e-0a199de0fec8"

# 1. Copy the 4 high-end bespoke AI generated images
ai_copies = {
    "veg_momo_steamed_1788786485915.jpg": "veg_momo.jpg",
    "veg_chowmein_dish_1788786516205.jpg": "veg_chowmein.jpg",
    "crispy_fried_momo_1788786555748.jpg": "fried_momo.jpg",
    "chilli_paneer_dish_1788786612250.jpg": "chilli_paneer.jpg"
}

for src_name, dest_name in ai_copies.items():
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(images_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dest_path)
        print(f"Copied AI asset {src_name} -> {dest_name} ({os.path.getsize(dest_path)} bytes)")

# 2. Verified Wikimedia titles for authentic Indian dishes
wiki_files = {
    "paneer_momo.jpg": "Steamed_Momos_-_KOLKATA.jpg",
    "fried_paneer_momo.jpg": "Fried_momos_of_Salem.jpg",
    "chicken_momo.jpg": "A_plate_of_Chicken_Momos_with_soup.jpg",
    "chilli_momo.jpg": "Manchurian_Momos.jpg",
    "maggie.jpg": "Veg_Maggi_2.jpg",
    "egg_maggie.jpg": "Spicy_noodles_with_eggs.jpg",
    "egg_chowmein.jpg": "Buff_Chowmein.jpg",
    "veg_soup.jpg": "Chinese_noodles_and_manchow_soup.jpg",
    "kadak_chai.jpg": "Masala_Chai.JPG",
    "coffee.jpg": "Latte_art.jpg",
    "peanut_chaat.jpg": "Peanut_Salad_Recipe_by_Sonia_Goyal.jpg",
    "chana_chaat.jpg": "Aloo_Chana_Chaat.jpg",
    "spring_roll.jpg": "Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg",
    "veg_kabab.jpg": "Hara_bhara_kabab-.JPG",
    "fried_rice.jpg": "Kerala_vegetable_fried_rice_2.jpg",
    "chicken_dish.jpg": "Chicken_ghee_roast.jpg",
    "mutton_dish.jpg": "Mutton_Rogan_Josh_curry.jpg"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VelvetHourCafeBot/1.0 (contact: admin@velvethourcafe.com)"}

def get_thumb_url(filename):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r:
        data = json.loads(r.read())
        pages = data.get("query", {}).get("pages", {})
        for k, v in pages.items():
            ii = v.get("imageinfo", [{}])[0]
            return ii.get("thumburl") or ii.get("url")

for target_name, wiki_title in wiki_files.items():
    dest_path = os.path.join(images_dir, target_name)
    try:
        thumb_url = get_thumb_url(wiki_title)
        if not thumb_url:
            print(f"Could not get thumb URL for {wiki_title}")
            continue
        req = urllib.request.Request(thumb_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()
            with open(dest_path, "wb") as f:
                f.write(data)
        print(f"Saved {target_name} ({len(data)} bytes) from {wiki_title}")
        time.sleep(0.5)
    except Exception as e:
        print(f"Error updating {target_name}: {e}")

print("All images processed!")
