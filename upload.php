<?php
header('Content-Type: application/json');

$uploaded = $_FILES['file'] ?? $_FILES['image'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $uploaded) {
    $type = $_POST['type'] ?? 'players';

    // Normalize legacy/singular type aliases
    $typeAliases = ['team' => 'teams', 'player' => 'players', 'hero' => 'heroes'];
    if (isset($typeAliases[$type])) $type = $typeAliases[$type];

    // Ensure valid directory
    if (!in_array($type, ['players', 'teams', 'heroes', 'icon', 'portrait', 'splash'])) {
        $type = 'players';
    }

    $targetDir = "assets/" . $type . "/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileTmpPath = $uploaded['tmp_name'];
    $fileName = $uploaded['name'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg');

    if (in_array($fileExtension, $allowedfileExtensions)) {
        // Prefer an explicit name (e.g. hero name) so the file lands under that name in its folder.
        $requestedName = trim($_POST['name'] ?? '');
        if ($requestedName !== '') {
            // Strip characters that are unsafe in filenames, keep spaces/apostrophes/hyphens.
            $safeName = preg_replace('/[\\/:*?"<>|]/', '', $requestedName);
            $safeName = trim($safeName);
        } else {
            $safeName = preg_replace("/[^a-zA-Z0-9_\-\.]/", "", $fileNameCmps[0]);
        }
        if (empty($safeName)) $safeName = "img";

        // Overwrites any existing file for this name/type.
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
