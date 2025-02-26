<?php
$template = $_GET['template'] ?? '';

$file = __DIR__ . "/template/" . $template . ".html";

if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    http_response_code(404);
    echo "Template introuvable" . $file ;
}
