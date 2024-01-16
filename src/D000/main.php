<?php

$line = trim(fgets(STDIN));
$numbers = explode(' ', $line);
$result = array_map(fn ($n) => $n * 2, $numbers);
echo implode(' ', $result);
