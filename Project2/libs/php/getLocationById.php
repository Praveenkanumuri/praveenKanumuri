<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/getLocationDetails.php?locationID=1

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {

        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }   

    // query to get location details based on location id

    $query = 'SELECT id as locationID, name as locationName FROM location WHERE id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $_GET['locationID']);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";  
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 

        exit;

    }

    $locationDetails = [];

    while ($row = mysqli_fetch_assoc($result)) {

        array_push($locationDetails, $row);

    } 

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['locationDetails'] = $locationDetails;

    mysqli_close($conn);

    echo json_encode($output); 

?>
