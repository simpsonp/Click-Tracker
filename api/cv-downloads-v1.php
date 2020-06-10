<?php
    $fileRequestMap = [
        '/v1/downloads/cv/latest/pdf' => ['DUMMY-CV.pdf', 2221],
        '/v1/downloads/cv/recommendations/1' => ['DUMMY-RECOMMENDATION-LETTER.pdf', 2222]
    ];
    if (!array_key_exists($request,$fileRequestMap)) {
        sendErrorResponse(4221);
	}
	
	$responseCode = validateRequest();
	if($responseCode != 200) {
		sendErrorResponse($responseCode);
	}
	function validateRequest()
	{
		if (empty($_GET)) {
			return 4101;
		}
		if (!isset($_GET['r']) || empty($_GET['r'])) {
			return 4222;
		}
		if ($_GET['r'] == 'cv') {
			$requestValidationArguments = [
				'r' => '',
				'cvv' => '^2020(0[1-8])-[1-5]$', // e.g. value
				'cvf' => ''
			];
			$validFromValues = [
				// github documentation 
				'ghdoc',
				// postman documentation
				'pmdoc',
				// linkedin 
				'linkedin',
			];
			foreach ($requestValidationArguments as $key => $value)
			{
				if (!isset($_GET[$key]) || empty($_GET[$key])){
					return 4103;
				}
			}
			if (!empty(array_diff_key($_GET, $requestValidationArguments))) {
				return 4102;
			}
			if (!in_array($_GET['cvf'],$validFromValues)) {
				return 4223;
			}
			if (!preg_match("/{$requestValidationArguments['cvv']}/", $_GET['cvv'])){
				return 4104;
			}
		} else {
			return 4222;
		}
		return 200;
	}
	$filename = $fileRequestMap[$request][0]; 
	$file = __DIR__ . "/../repository/$filename";
	if (file_exists($file)) {
		header('Content-Description: PDF Download');
		header('Content-Type: application/pdf');
		header("Content-Disposition: attachment; filename=\"$filename\"");
		header('Cache-Control: max-age=172800, must-revalidate');
		header('Content-Length: ' . filesize($file));
		readfile($file);
		ob_start(); 
		logSuccessEvent($fileRequestMap[$request][1]);
		ob_end_clean();
		exit();
	}
	if (!headers_sent()) {
		header_remove();
	}
	sendErrorResponse(5102);
	function logSuccessEvent(int $eventCode)
	{
		[$mysqli, $countryCode, $IPAddress, $browser] = initDBxCommons();
		$endpoint = '/v1/downloads/cv/';
		$params = array_replace(array_flip(array('r', 'cvv', 'cvf')), $_GET);
		$params = json_encode($params);
		$queryToLogSuccessEvent = "CALL asze_success_events_p0_add('$countryCode', '$IPAddress', '$browser', $eventCode, '$endpoint', '$_SERVER[REQUEST_URI]', '$params')";
		if (!$mysqli->connect_errno) {
			if (!$mysqli->query($queryToLogSuccessEvent)) {
				$error = "SPError: ($mysqli->errno) $mysqli->error";
				saveToFile(221, $error, $queryToLogSuccessEvent);
			}
		}
	}
	