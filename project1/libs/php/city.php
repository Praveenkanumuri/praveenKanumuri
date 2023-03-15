<?php

// Set error reporting level and display errors
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Start timer
$executionStartTime = microtime(true);

// Build URL for API request
$url = 'http://api.geonames.org/searchJSON?country=' . $_POST['country'] . '&cities=cities15000&username=praveenkanumuri&maxRows=100';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disables SSL verification for convenience, should be enabled in production
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Returns the response as a string
curl_setopt($ch, CURLOPT_URL, $url); // Sets the URL to request

// Execute cURL session and capture response
$result = curl_exec($ch);

// Close cURL session
curl_close($ch);

// Decode the JSON response into a PHP associative array
$data = json_decode($result, true);

// Prepare output array
$output = [
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms'
    ],
    'data' => $data['geonames']
];

// Set response headers
header('Content-Type: application/json; charset=UTF-8');

// Send output as JSON
echo json_encode($output);

?>
