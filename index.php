<?php
$request = $_SERVER['REQUEST_URI'];
$file = __DIR__ . $request;



if (strpos($request, "/load-template.php") === 0) {
    require __DIR__ . "/load-template.php";
    exit;
}

// ✅ Ne pas intercepter les fichiers statiques (JS, CSS, images, etc.)
if (preg_match("#\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|pdf)$#", $request)) {
    return false;
}


if (file_exists($file) && !is_dir($file)) {
    return false;
}

// ✅ Sinon, renvoyer toujours index.html (SPA)
require __DIR__ . "/index.html";
