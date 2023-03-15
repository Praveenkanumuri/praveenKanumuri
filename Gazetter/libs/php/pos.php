<?php

// Set error reporting and display settings
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Start timer for execution time
$executionStartTime = microtime(true);

// Build LocationIQ API URL
$url = 'https://us1.locationiq.com/v1/search?key=pk.e04350adaae7e83e9f6696a634454ff5&q=' . $_POST['country'] . '&format=json';

// Send HTTP request to LocationIQ API
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);
curl_close($ch);

// Decode JSON response
$decode = json_decode($result, true);	

// Prepare response data
$output = [
    'status' => [
        'code' => "200",
        'name' => "ok",
        'description' => "success",
        'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . " ms",
    ],
    'data' => $decode,
];

// Set response header
header('Content-Type: application/json; charset=UTF-8');

// Output response data as JSON
echo json_encode($output);

?>
