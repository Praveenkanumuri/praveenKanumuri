<?php

// Start timer for execution time
$executionStartTime = microtime(true);

// Load country data from file
$countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

// Extract country code and name from the loaded data
$countries = array_map(function ($feature) {
    return [
        'code' => $feature['properties']['iso_a2'],
        'name' => $feature['properties']['name'],
    ];
}, $countryData['features']);

// Sort countries by name
usort($countries, function ($a, $b) {
    return $a['name'] <=> $b['name'];
});

// Prepare response data
$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
        'executedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms',
    ],
    'data' => $countries,
];

// Set response header
header('Content-Type: application/json; charset=UTF-8');

// Output response data as JSON
echo json_encode($output);

?>
