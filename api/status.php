<?php
    $testResultResponses = [
        7111 => [200, 'ALL_ENDPOINTS_WORKING']
    ];
    // TODO: Run test(s) then send status
    // TODO: Retrieve test results from Postman tests
    $testResponse = 7111;
    $testsList = 'https://' . API_HOST . '/tests/list';
    $response = [
        'id' => $testResponse,
        'status' => $testResultResponses[$testResponse][0],
        'code' => $testResultResponses[$testResponse][1],
        'meta' => [
            'testsList' => $testsList
        ],
    ];
    http_response_code($testResultResponses[$testResponse][0]);
    header('Content-Type: application/vnd.api+json');
    logTestEvent();
    echo json_encode($response);
    exit();
	function logTestEvent()
	{
        [$mysqli, $countryCode, $IPAddress, $browser] = initDBxCommons();
        $eventCode = 7001;
		$endpoint = '/status';
        $params = empty($_GET) ? '' : json_encode($_GET);
        // TODO: Make new Stored Procedure to log test events
		$queryToLogSuccessEvent = "CALL asze_success_events_p0_add('$countryCode', '$IPAddress', '$browser', $eventCode, '$endpoint', '$_SERVER[REQUEST_URI]', '$params')";
		if (!$mysqli->connect_errno) {
			if (!$mysqli->query($queryToLogSuccessEvent)) {
				$error = "SPError: ($mysqli->errno) $mysqli->error";
				saveToFile(201, $error, $queryToLogSuccessEvent);
			}
		}
    }
