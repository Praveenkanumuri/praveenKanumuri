<?php
    // Displaying all errors
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Start timer
    $executionStartTime = microtime(true);

    // Construct the API endpoint URL with country code
    $url = 'https://api-bdc.net/data/country-info?code=' . $_POST['country'] . '&key=bdc_31880b322fd04efa979f18db5eb82faa';

    // Initiate a new curl session
    $ch = curl_init();

    // Set curl options
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Execute curl session and store the response
    $result = curl_exec($ch);

    // Close the curl session
    curl_close($ch);

    // Decode the response JSON
    $decode = json_decode($result, true);

    // Create an output array with API status and data
    $output = [
        'status' => [
            'code' => '200',
            'name' => 'ok',
            'description' => 'success',
            'returnedIn' => intval((microtime(true) - $executionStartTime) * 1000) . ' ms'
        ],
        'data' => $decode
    ];

    // Set response header and return the output as JSON
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output); 
?>
