<?php

    // Turn on error reporting
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Start execution timer
    $executionStartTime = microtime(true);

    // Include database configuration file
    include("config.php");

    // Set JSON content type header
    header('Content-Type: application/json; charset=UTF-8');

    // Create database connection
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Check if connection was successful
    if (mysqli_connect_errno()) {
        
        // Set response status to failure
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        // Close database connection
        mysqli_close($conn);

        // Return JSON response
        echo json_encode($output);

        exit;

    }   

    // Construct query to retrieve location name and id
    $query = 'SELECT id, name FROM location';

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    
    
    // Check if query was successful
    if (!$result) {

        // Set response status to query failed
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";    
        $output['data'] = [];

        // Close database connection
        mysqli_close($conn);

        // Return JSON response
        echo json_encode($output); 

        exit;

    }
   
    // Process query result
    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {

        array_push($data, $row);

    }

    // Set response status to success
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;
    
    // Close database connection
    mysqli_close($conn);

    // Return JSON response
    echo json_encode($output); 

?>
