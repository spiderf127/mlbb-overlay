<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $type = $_POST['type'] ?? 'players';
    
    // Ensure valid directory
    if (!in_array($type, ['players', 'teams', 'heroes'])) {
        $type = 'players';
    }

    $targetDir = "assets/" . $type . "/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileSize = $_FILES['file']['size'];
    $fileType = $_FILES['file']['type'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg');

    if (in_array($fileExtension, $allowedfileExtensions)) {
        // Sanitize file name to avoid weird characters
        $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", "", $fileNameCmps[0]);
        if(empty($safeName)) $safeName = "img";
        
        // Use the original sanitized filename. If it exists, it will overwrite it.
        $newFileName = $safeName . '.' . $fileExtension;
        
        $dest_path = $targetDir . $newFileName;

        if(move_uploaded_file($fileTmpPath, $dest_path)) {
            echo json_encode([
                'success' => true,
                'path' => $dest_path,
                'message' => 'File uploaded successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error moving file to upload directory. Check permissions.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions)
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No file uploaded or wrong request method'
    ]);
}
?>
