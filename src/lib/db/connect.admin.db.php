<?php

include_once '../install-funcs.inc.php';

$CONFIG_FILE = '../../conf/config.ini';

if (!file_exists($CONFIG_FILE)) {
  throw new Exception('Configuration file does not exist.');
}
$CONFIG = parse_ini_file($CONFIG_FILE);

$adminDsn = configure('adminDsn', $CONFIG['DB_DSN'],
    'Database DSN for administration');
$adminUser = configure('adminUser', 'root',
    'Database administrator username');
$adminPass = configure('adminPass', '',
    'Database administrator password', true);

$db = new PDO($adminDsn, $adminUser, $adminPass);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
if (strpos($adminDsn, 'pgsql') === 0) {
  $db->exec('SET SEARCH_PATH = ' . $CONFIG['DB_SCHEMA']);
}
