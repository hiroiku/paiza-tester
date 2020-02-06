<?php

$line = trim(fgets(STDIN));
$numbers = explode(' ', $line);
$numbers = array_map('intval', $numbers);
$result = array_sum($numbers);

echo $result.PHP_EOL;
