<?php 
// Turn on error reporting and display all errors
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Start execution timer
$executionStartTime = microtime(true);

// Build API URL with country from POST data
$url = 'https://newsdata.io/api/1/news?apikey=pub_1834699decb54bb7b7869ce1733c45f57b6e2&country=' . $_POST['country'] . '&language=en&category=top';

// Initialize cURL session
$ch = curl_init();

// Set options for cURL session
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute cURL request and store response in $result variable
$result = curl_exec($ch);

// Close cURL session
curl_close($ch);

// Decode JSON response from API and store in $decode variable
$decode = json_decode($result, true);

// Create output array
$output = [
  'status' => [
    'code' => '200',
    'name' => 'ok',
    'description' => 'success',
    'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms'
  ],
  'data' => $decode['results']
];

// Set response header to JSON format
header('Content-Type: application/json; charset=UTF-8');

// Send JSON-encoded output array to client
echo json_encode($output); 

?>