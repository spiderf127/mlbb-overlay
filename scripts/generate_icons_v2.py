import os
import glob
import cv2
import numpy as np
from PIL import Image
import argparse

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def get_face_bbox(gray_img):
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml'
    if not os.path.exists(cascade_path):
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray_img, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
    if len(faces) > 0:
        # Return largest face
        return max(faces, key=lambda rect: rect[2] * rect[3])
    return None

def get_saliency_bbox_and_map(image_cv):
    try:
        saliency = cv2.saliency.StaticSaliencySpectralResidual_create()
        (success, saliencyMap) = saliency.computeSaliency(image_cv)
        if success:
            saliencyMap = (saliencyMap * 255).astype("uint8")
            # Threshold to find main salient region
            threshMap = cv2.threshold(saliencyMap, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            contours, _ = cv2.findContours(threshMap, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if contours:
                # Find largest contour by area
                largest_contour = max(contours, key=cv2.contourArea)
                x, y, w, h = cv2.boundingRect(largest_contour)
                if w > 10 and h > 10:
                    return (x, y, w, h), saliencyMap
            return None, saliencyMap
    except Exception:
        pass
    return None, None

def refine_bbox(x, y, w, h, img_w, img_h):
    cx = x + w / 2
    cy = y + h / 2
    
    # Expand by 20%
    new_w = w * 1.2
    new_h = h * 1.2
    
    # Make square
    size = max(new_w, new_h)
    
    # Cap size to min image dimension
    max_size = min(img_w, img_h)
    if size > max_size:
        size = max_size
        
    half_size = size / 2
    
    left = cx - half_size
    right = cx + half_size
    top = cy - half_size
    bottom = cy + half_size
    
    # Adjust boundaries to keep inside image
    if left < 0:
        right += abs(left)
        left = 0
    elif right > img_w:
        left -= (right - img_w)
        right = img_w
        
    if top < 0:
        bottom += abs(top)
        top = 0
    elif bottom > img_h:
        top -= (bottom - img_h)
        bottom = img_h
        
    return int(left), int(top), int(right), int(bottom)

def fallback_crop(img_w, img_h):
    size = min(img_w, img_h)
    half_size = size / 2
    
    cx = img_w / 2
    cy = img_h / 2 - (img_h * 0.125) # 12.5% bias upward
    
    left = cx - half_size
    right = cx + half_size
    top = cy - half_size
    bottom = cy + half_size
    
    if left < 0:
        right += abs(left)
        left = 0
    elif right > img_w:
        left -= (right - img_w)
        right = img_w
        
    if top < 0:
        bottom += abs(top)
        top = 0
    elif bottom > img_h:
        top -= (bottom - img_h)
        bottom = img_h
        
    return int(left), int(top), int(right), int(bottom)

def process_image(src_path, dst_path, debug_dir, hero_name, force):
    if not force and os.path.exists(dst_path):
        return "Skipped", None
        
    try:
        pil_img = Image.open(src_path)
        img_w, img_h = pil_img.size
        
        # Make a solid background for CV algorithms to ignore transparency
        if pil_img.mode == 'RGBA':
            bg = Image.new("RGB", pil_img.size, (255, 255, 255))
            mask = pil_img.split()[3]
            bg.paste(pil_img, mask=mask)
            cv_img = np.array(bg)
        else:
            cv_img = np.array(pil_img)
            
        cv_img_bgr = cv_img[:, :, ::-1].copy()
        gray = cv2.cvtColor(cv_img_bgr, cv2.COLOR_BGR2GRAY)
        
        # 1. Face
        face_box = get_face_bbox(gray)
        # 2. Saliency
        saliency_box, saliency_map = get_saliency_bbox_and_map(cv_img_bgr)
        
        method = "Fallback"
        raw_box = None
        
        if face_box is not None:
            method = "Face"
            raw_box = face_box
        elif saliency_box is not None:
            method = "Saliency"
            raw_box = saliency_box
            
        if raw_box is not None:
            l, t, r, b = refine_bbox(raw_box[0], raw_box[1], raw_box[2], raw_box[3], img_w, img_h)
        else:
            l, t, r, b = fallback_crop(img_w, img_h)
            
        # Crop & Resize
        cropped_img = pil_img.crop((l, t, r, b))
        final_img = cropped_img.resize((512, 512), Image.Resampling.LANCZOS)
        
        # Save Icon
        final_img.save(dst_path, format="PNG")
        
        # Debug Outputs
        if saliency_map is not None:
            heatmap = cv2.applyColorMap(saliency_map, cv2.COLORMAP_JET)
            cv2.imwrite(os.path.join(debug_dir, f"{hero_name}_saliency.png"), heatmap)
            
        debug_overlay = cv_img_bgr.copy()
        if raw_box is not None:
            rx, ry, rw, rh = raw_box
            # Raw box in blue
            cv2.rectangle(debug_overlay, (int(rx), int(ry)), (int(rx+rw), int(ry+rh)), (255, 0, 0), 2)
            
        # Final crop box in green
        cv2.rectangle(debug_overlay, (l, t), (r, b), (0, 255, 0), 3)
        cv2.imwrite(os.path.join(debug_dir, f"{hero_name}_bbox.png"), debug_overlay)
        final_img.save(os.path.join(debug_dir, f"{hero_name}_final.png"))
        
        return method, (l, t, r-l, b-t)
        
    except Exception as e:
        print(f"Error processing {hero_name}: {e}")
        return "Error", None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Force recreate existing icons")
    args = parser.parse_args()
    
    in_dir = "portrait"
    out_dir = "icon"
    debug_dir = "debug"
    
    ensure_dir(out_dir)
    ensure_dir(debug_dir)
    
    files = glob.glob(os.path.join(in_dir, "*.png"))
    total = len(files)
    
    stats = {
        "Total Processed": 0,
        "Success": 0,
        "Skipped": 0,
        "Failed": 0,
        "Methods": {"Face": 0, "Saliency": 0, "Fallback": 0}
    }
    
    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        hero_name = os.path.splitext(filename)[0]
        dst_path = os.path.join(out_dir, filename)
        
        method, box = process_image(file_path, dst_path, debug_dir, hero_name, args.force)
        
        if method == "Skipped":
            stats["Skipped"] += 1
            print(f"[{i}/{total}] Processing {hero_name} - Skipped (exists)")
        elif method == "Error":
            stats["Failed"] += 1
            print(f"[{i}/{total}] Processing {hero_name} - FAILED")
        else:
            stats["Total Processed"] += 1
            stats["Success"] += 1
            stats["Methods"][method] += 1
            
            x, y, w, h = box
            print(f"[{i}/{total}] Processing {hero_name}")
            print(f"   - Method used: {method}")
            print(f"   - Bounding box: {x},{y},{w},{h}")
            
    print("\n" + "="*30)
    print("SUMMARY OUTPUT")
    print("="*30)
    print(f"Total images processed: {stats['Total Processed']}")
    print(f"Successfully generated icons: {stats['Success']}")
    print(f"Skipped (already exists): {stats['Skipped']}")
    print(f"Failures: {stats['Failed']}")
    print("\nMethod distribution:")
    print(f"  Face: {stats['Methods']['Face']}")
    print(f"  Saliency: {stats['Methods']['Saliency']}")
    print(f"  Fallback: {stats['Methods']['Fallback']}")

if __name__ == "__main__":
    main()
