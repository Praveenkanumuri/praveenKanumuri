<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// start timer for measuring execution time
$executionStartTime = microtime(true);

// build API URL
$url = 'http://api.geonames.org/searchJSON?country=' . $_POST['country'] . '&q=airport&username=praveenkanumuri&maxRows=100';

// initialize cURL session
$ch = curl_init();

// set cURL options
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// execute cURL request and get response
$result = curl_exec($ch);

// close cURL session
curl_close($ch);

// decode JSON response into PHP array
$decode = json_decode($result, true);

// prepare output data
$output = [
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms',
    ],
    'data' => $decode['geonames'],
];

// set response header
header('Content-Type: application/json; charset=UTF-8');

// output JSON data
echo json_encode($output);

?>
