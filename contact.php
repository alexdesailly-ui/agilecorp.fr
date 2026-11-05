<?php
// AgileCorp - réception du formulaire de contact (hébergement Hostinger, PHP natif)
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false]);
  exit;
}

// Anti-spam : champ piège invisible + délai minimal de remplissage
if (!empty($_POST['site_web']) || (isset($_POST['t']) && (time() - intdiv((int)$_POST['t'], 1000)) < 3)) {
  echo json_encode(['ok' => true]); // on fait croire au robot que c'est passé
  exit;
}

function field($k, $max = 200) {
  $v = isset($_POST[$k]) ? trim((string)$_POST[$k]) : '';
  $v = str_replace(["\r", "\0"], '', $v);
  return mb_substr($v, 0, $max);
}

$prenom    = field('prenom');
$nom       = field('nom');
$email     = field('email');
$telephone = field('telephone', 40);
$societe   = field('societe');
$objet     = field('objet', 40);
$message   = field('message', 5000);
$source    = field('source', 300);

if ($prenom === '' || $nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'invalid']);
  exit;
}

$to      = 'alexandre@agilecorp.fr';
$subject = '=?UTF-8?B?' . base64_encode('[AgileCorp] ' . $objet . ' - ' . $prenom . ' ' . $nom) . '?=';
$body    = "Nom : $prenom $nom\nEmail : $email\nTéléphone : $telephone\nSociété : $societe\nObjet : $objet\nPage d'origine : $source\n\nMessage :\n$message\n";
$headers = implode("\r\n", [
  'From: AgileCorp Site <contact@agilecorp.fr>',
  'Reply-To: ' . str_replace(["\n", "\r"], '', $email),
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
]);

$ok = mail($to, $subject, $body, $headers, '-fcontact@agilecorp.fr');
http_response_code($ok ? 200 : 500);
echo json_encode(['ok' => $ok]);
