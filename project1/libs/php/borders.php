<?php

$executionStartTime = microtime(true);

$countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);
$countryCode = $_POST['country'];

$country = [];

foreach ($countryData['features'] as $feature) {
  if ($feature['properties']['iso_a2'] === $countryCode) {
    $temp = [
      'code' => $feature['properties']['iso_a2'],
      'border' => $feature['geometry']
    ];
    array_push($country, $temp);
  }
}

$output = [
  'status' => [
    'code' => '200',
    'name' => 'ok',
    'description' => 'success',
    'executedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms'
  ],
  'data' => $country
];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>