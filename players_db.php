<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$file = 'players_db.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    file_put_contents($file, $data);
    echo json_encode(['status' => 'success']);
} else {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
}
?>
