<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getDepartmentDetails.php?departmentID=1

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

	// query to get department details based on department id

	$query = 'SELECT d.id as departmentID, d.name as departmentName, l.id as locationID, l.name as location FROM department d JOIN location l ON d.locationID = l.id WHERE d.id = ?';
	$stmt = $conn->prepare($query);
	$stmt->bind_param("i", $_GET['departmentID']);
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
   
   	$departmentDetails = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($departmentDetails, $row);

	} 

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['departmentDetails'] = $departmentDetails;
	
	mysqli_close($conn);

	echo json_encode($output); 

?> 
