<?php
    // Displaying all errors
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Start timer
    $executionStartTime = microtime(true);

    // Construct the OpenWeatherMap API endpoint URL with latitude and longitude details
    $cUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' . $_POST['latit'] . '&lon=' . $_POST['long'] . '&appid=8db7e55d2af4fc3167aae1d35d5ce14b';

    // Initiate a new curl session
    $ch = curl_init();

    // Set curl options
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $cUrl);

    // Execute curl session and store the response
    $resultWeather = curl_exec($ch);

    // Close the curl session
    curl_close($ch);

    // Decode the response JSON
    $decode = json_decode($resultWeather, true);

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
