<?php
// Handles uploaded images from webcam
if (!isset($_FILES['webcam'])) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
    exit;
}

// Store by IP Address
$path = dirname(__FILE__) . '/logs/' . $_SERVER['REMOTE_ADDR'];
if (!file_exists($path)) {
    mkdir($path, 0777, true);
}

$filename = $path . '/' . time() . '.png';
if (FALSE !== @move_uploaded_file($_FILES['webcam']['tmp_name'], $filename)) {
    echo 'true';
} else {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
    exit;
}
