import os
from PIL import Image
import glob

def optimize_icons():
    icon_dir = r"c:\xampp\htdocs\mpl\icon"
    files = glob.glob(os.path.join(icon_dir, "*"))
    
    total_original = 0
    total_optimized = 0
    count = 0
    
    for f in files:
        if not os.path.isfile(f):
            continue
            
        ext = os.path.splitext(f)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            continue
            
        try:
            original_size = os.path.getsize(f)
            total_original += original_size
            
            img = Image.open(f)
            
            # Resize if larger than 512x512
            if img.width > 512 or img.height > 512:
                img.thumbnail((512, 512), Image.Resampling.LANCZOS)
                
            if ext in ['.jpg', '.jpeg']:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(f, format='JPEG', quality=85, optimize=True)
            elif ext == '.png':
                img.save(f, format='PNG', optimize=True)
                
            new_size = os.path.getsize(f)
            total_optimized += new_size
            count += 1
            
        except Exception as e:
            print(f"Error on {f}: {e}")
            
    print(f"Processed {count} images.")
    print(f"Original size: {total_original / 1024 / 1024:.2f} MB")
    print(f"Optimized size: {total_optimized / 1024 / 1024:.2f} MB")

if __name__ == '__main__':
    optimize_icons()
