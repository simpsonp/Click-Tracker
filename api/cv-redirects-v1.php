<?php
	$redirectMap = [
		// redirect to github profile
		'gh-profile' => 'https://github.com/simpsonp',
		// redirect to postman profile
		'pm-profile' => 'https://explore.postman.com/simpsonp',
	];
	$responseCode = validateRequest($redirectMap);
	if($responseCode != 200) {
		sendErrorResponse($responseCode);
	}
	sendSuccessResponse($redirectMap[$_GET['to']]);
	function sendSuccessResponse(string $toValue)
	{
		http_response_code(303);
		header("Location: $toValue");
		echo 'redirecting... hmm... you should have been redirected automatically. No worries.';
		echo "<br>Click here: <a href='$toValue'>$toValue</a>";
		echo '<br>Error Code: 3211';
		logSuccessEvent();
	}
	
	function validateRequest(array $redirectMap)
	{
		$requestValidationArguments = [
			'v' => '^2020(0[1-8])-[1-5]$', // e.g. value
			'from' => 0,
			'to' => 0
		];
		$validFromValues = [
			// github documentation 
			'ghdoc',
			// postman documentation
			'pmdoc',
			// linkedin 
			'linkedin',
		];
		if (empty($_GET)) {
			return 4101;
		}
		if (!empty(array_diff_key($_GET, $requestValidationArguments))) {
			return 4102;
		}
		foreach ($requestValidationArguments as $key => $value)
		{	
			if (!isset($_GET[$key]) || empty($_GET[$key])){
				return 4103;
			}
		}
		if (!preg_match("/{$requestValidationArguments['v']}/", $_GET['v'])){
			return 4104;
		}
		if (!in_array($_GET['from'], $validFromValues)) {
			return 4211;
		}
		if (!array_key_exists($_GET['to'], $redirectMap)) {
			return 4212;
		}
		return 200;
	}
	function logSuccessEvent()
	{
		[$mysqli, $countryCode, $IPAddress, $browser] = initDBxCommons();
		$eventCode = 2211;
		$endpoint = '/v1/redirects/cv';
		$params = array_replace(array_flip(array('v', 'from', 'to')), $_GET);
		$params = json_encode($params);
		$queryToLogSuccessEvent = "CALL asze_success_events_p0_add('$countryCode', '$IPAddress', '$browser', $eventCode, '$endpoint', '$_SERVER[REQUEST_URI]', '$params')";
		if (!$mysqli->connect_errno) {
			if (!$mysqli->query($queryToLogSuccessEvent)) {
				$error = "SPError: ($mysqli->errno) $mysqli->error";
				saveToFile(212, $error, $queryToLogSuccessEvent);
			}
		}
	}
