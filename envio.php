<?php
// Guarda los mensajes del formulario en MySQL y responde en JSON.
header('Content-Type: application/json; charset=utf-8');
mysqli_report(MYSQLI_REPORT_OFF);

// ====== TUS DATOS (panel InfinityFree > MySQL Databases) ======
$host = 'sqlXXX.infinityfree.com';
$user = 'if0_XXXXXXXX';
$pass = 'TU_CONTRASEÑA_DE_LA_CUENTA';
$db   = 'if0_XXXXXXXX_portafolio';
// En tu PC (XAMPP) usa la base local:
if (in_array($_SERVER['SERVER_NAME'], ['localhost','127.0.0.1'])) { $host='localhost'; $user='root'; $pass=''; $db='portafolio'; }

function resp($ok,$msg){ echo json_encode(['ok'=>$ok,'msg'=>$msg], JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') resp(false,'Método no permitido.');
if (!empty($_POST['web'])) resp(true,'Mensaje enviado.'); // trampa anti-spam

$nombre = trim($_POST['nombre'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$tel    = trim($_POST['telefono'] ?? '');
$coment = trim($_POST['comentario'] ?? '');
if (strlen($nombre)<2 || !filter_var($correo,FILTER_VALIDATE_EMAIL) || strlen($tel)<7 || strlen($coment)<10)
  resp(false,'Completa correctamente todos los campos.');

$con = mysqli_connect($host,$user,$pass,$db);
if (!$con) resp(false,'No se pudo conectar con la base de datos.');
mysqli_set_charset($con,'utf8mb4');
$st = mysqli_prepare($con,'INSERT INTO formulario (nombre,correo,telefono,comentario) VALUES (?,?,?,?)');
if (!$st) resp(false,'Error al preparar el envío.');
mysqli_stmt_bind_param($st,'ssss',$nombre,$correo,$tel,$coment);
if (mysqli_stmt_execute($st)) resp(true,'¡Gracias! Tu mensaje fue enviado.');
resp(false,'No se pudo guardar el mensaje. Inténtalo más tarde.');
