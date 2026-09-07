import os
import shutil
import urllib.request
import ssl

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

images_dir = r"d:\website\images"
os.makedirs(images_dir, exist_ok=True)

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\868b9bd9-6425-4027-bb5e-0a199de0fec8"

# 1. Copy generated high-fidelity images if present
generated_copies = [
    ("veg_momo_steamed_1788786485915.jpg", "veg_momo.jpg"),
    ("veg_chowmein_dish_1788786516205.jpg", "veg_chowmein.jpg"),
    ("crispy_fried_momo_1788786555748.jpg", "fried_momo.jpg"),
    ("chilli_paneer_dish_1788786612250.jpg", "chilli_paneer.jpg"),
]

for src_name, dest_name in generated_copies:
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(images_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dest_path)
        print(f"Copied generated asset {src_name} -> {dest_name}")

# 2. Curated high-resolution vibrant images for all other dishes
urls = {
    "egg_chowmein.jpg": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "paneer_momo.jpg": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    "fried_paneer_momo.jpg": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    "chicken_momo.jpg": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    "maggie.jpg": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    "egg_maggie.jpg": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    "veg_soup.jpg": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "kadak_chai.jpg": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    "coffee.jpg": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    "peanut_chaat.jpg": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80",
    "chana_chaat.jpg": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    "spring_roll.jpg": "https://images.unsplash.com/photo-1548507293-9c8693838ca0?auto=format&fit=crop&w=800&q=80",
    "veg_kabab.jpg": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    "chilli_momo.jpg": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "fried_rice.jpg": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "chicken_dish.jpg": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    "mutton_dish.jpg": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
    "velvet_hour_cafe.jpg": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for filename, url in urls.items():
    dest_path = os.path.join(images_dir, filename)
    # If file was already generated and copied above, skip
    if filename in [d for _, d in generated_copies] and os.path.exists(dest_path):
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as response, open(dest_path, "wb") as out_file:
            shutil.copyfileobj(response, out_file)
        print(f"Downloaded {filename} ({os.path.getsize(dest_path)} bytes)")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("All food images updated successfully!")
