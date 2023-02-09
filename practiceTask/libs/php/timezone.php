<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $urltimezone='http://api.geonames.org/timezoneJSON?formatted=true&lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=praveenkanumuri&style=full';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $urltimezone);

    $result = curl_exec($ch);

    curl_close($ch);

    $decodetimezone = json_decode($result, true);

    $outputtimezone['status']['code'] = '200';
    $outputtimezone['status']['name'] = 'ok';
    $outputtimezone['status']['description'] = 'success';
    $outputtimezone['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $outputtimezone['data'] = $decodetimezone;


    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($outputtimezone);

?>      