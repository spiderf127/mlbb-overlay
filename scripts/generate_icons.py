import os
import json
import glob
import cv2
import numpy as np
from PIL import Image

def detect_face(image_cv):
    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    
    # Load Haar cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) > 0:
        # Get largest face
        largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
        x, y, w, h = largest_face
        # Return center of the face
        return (x + w // 2, y + h // 2)
    return None

def detect_saliency(image_cv):
    try:
        saliency = cv2.saliency.StaticSaliencySpectralResidual_create()
        (success, saliencyMap) = saliency.computeSaliency(image_cv)
        if success:
            # Find the center of mass of the saliency map
            M = cv2.moments(saliencyMap)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                return (cX, cY)
    except Exception as e:
        pass
    return None

def crop_to_square(image, center_x, center_y):
    width, height = image.size
    
    # Calculate the size of the square crop (min of width or height)
    crop_size = min(width, height)
    half_size = crop_size // 2
    
    # Calculate crop boundaries based on the center point
    left = center_x - half_size
    right = center_x + half_size
    top = center_y - half_size
    bottom = center_y + half_size
    
    # Adjust if boundaries are out of image
    if left < 0:
        right += abs(left)
        left = 0
    elif right > width:
        left -= (right - width)
        right = width
        
    if top < 0:
        bottom += abs(top)
        top = 0
    elif bottom > height:
        top -= (bottom - height)
        bottom = height
        
    return image.crop((left, top, right, bottom))

def process_image(src_path, dst_path):
    try:
        # Open with Pillow to handle transparency
        pil_img = Image.open(src_path)
        
        # Convert to CV2 format for detection (ignoring alpha channel for detection)
        if pil_img.mode == 'RGBA':
            bg = Image.new("RGB", pil_img.size, (255, 255, 255))
            bg.paste(pil_img, mask=pil_img.split()[3])
            cv_img = np.array(bg)
        else:
            cv_img = np.array(pil_img)
            
        cv_img = cv_img[:, :, ::-1].copy() # RGB to BGR
        
        width, height = pil_img.size
        center = detect_face(cv_img)
        
        if not center:
            center = detect_saliency(cv_img)
            
        if not center:
            center = (width // 2, height // 2)
            
        cX, cY = center
        
        # Crop to square
        cropped_img = crop_to_square(pil_img, cX, cY)
        
        # Resize to 512x512
        final_img = cropped_img.resize((512, 512), Image.Resampling.LANCZOS)
        
        # Save
        final_img.save(dst_path, format="PNG")
        return True
    except Exception as e:
        print(f" Error processing {src_path}: {e}")
        return False

def main():
    portrait_dir = "portrait"
    icon_dir = "icon"
    
    if not os.path.exists(icon_dir):
        os.makedirs(icon_dir)
        
    files = glob.glob(os.path.join(portrait_dir, "*.png"))
    total = len(files)
    
    success_count = 0
    fail_count = 0
    
    index_data = {}
    
    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        hero_name = os.path.splitext(filename)[0]
        dst_path = os.path.join(icon_dir, filename)
        
        print(f"[{i}/{total}] {hero_name}")
        
        if process_image(file_path, dst_path):
            success_count += 1
            index_data[hero_name] = {
                "portrait": f"portrait/{filename}",
                "icon": f"icon/{filename}"
            }
        else:
            fail_count += 1
            
    with open(os.path.join(icon_dir, "index.json"), "w") as f:
        json.dump(index_data, f, indent=2)
        
    print("\n--- Final Statistics ---")
    print(f"Total Processed: {total}")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    main()
