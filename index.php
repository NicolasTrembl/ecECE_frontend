<?php
$request = $_SERVER['REQUEST_URI'];
$file = __DIR__ . $request;



// ✅ Laisser passer les fichiers PHP (ex: load-template.php)
if (strpos($request, "/load-template.php") === 0) {
    require __DIR__ . "/load-template.php";
    exit;
}

// ✅ Servir les fichiers statiques normalement (CSS, JS, images, etc.)
if (file_exists($file) && !is_dir($file)) {
    return false;
}

// ✅ Sinon, toujours renvoyer index.html (mode SPA)
require __DIR__ . "/index.html";
