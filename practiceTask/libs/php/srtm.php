<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $urlsrtm='http://api.geonames.org/srtm3JSON?formatted=true&lat=' . $_REQUEST['lat'] .  '&lng=' . $_REQUEST['lng'] . '&maxRows=5&username=praveenkanumuri&style=full';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $urlsrtm);

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);

    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $output['data'] = $decode;

        
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);

?>