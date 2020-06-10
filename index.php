<?php
	declare(strict_types=1);
    
    // Common Constants
	define('DB_HOST', 'localhost');
	
	// Environment-specific constants
	define('API_HOST', 'VALUE-DELETED'); // e.g. value: demo.api.simz.site
    define('DB_USER', 'VALUE-DELETED'); // e.g. value: mysuperusername
	define('DB_PASS', 'VALUE-DELETED'); // e.g. value: very-difficult-pwd1234567
	define('DB_NAME', 'VALUE-DELETED'); // e.g. value: supercoolapidb
	
	$request = strtok($_SERVER['REQUEST_URI'], '?');
	$errorResponse = [
		'errors' => []
	];
	$routingValue = validateRequestMain($request);
	if(ctype_digit($routingValue)) {
		sendErrorResponse($routingValue);
	}
	require __DIR__ . $routingValue;
	
    function validateRequestMain(string $request)
    {
		$routes = [
			'/v1/redirects/cv' => '/api/cv-redirects-v1.php',
			'/status' => '/api/status.php',
			'/' => 4042
		];
		$routesRegex = [
			'/v1/downloads/cv/' => '/api/cv-downloads-v1.php',
			'/logs/\d/view' => '/api/logs.php',
			'/repository/' => 4032,
			'/private/' => 4031
		];
		if($_SERVER['HTTP_HOST'] != API_HOST) {
            return 5091;
        }
		if (array_key_exists($request, $routes)) {
			return $routes[$request];
		}
		foreach ($routesRegex as $key => $value)
		{	
			if (preg_match("%^$key%", $request)){
				return $value;
			} 
		}
		return 4041;
	}
	
	function sendErrorResponse(int $responseCode)
	{
		global $errorResponse;
		$errorResponseMap = [
			5091 => [400, 'FORBIDDEN_HOSTNAME'],
			5101 => [500, 'ERROR_OPENING_FILE'],
			5102 => [500, 'ERROR_DOWNLOADING_FILE'],
			4040 => [401, 'UNAUTHORIZED'],
			4041 => [401, 'UNAUTHORIZED'],
			4042 => [401, 'UNAUTHORIZED'],
			4031 => [401, 'UNAUTHORIZED'],
			4032 => [401, 'UNAUTHORIZED'],
			4033 => [401, 'UNAUTHORIZED'],
			4101 => [400, 'EMPTY_GET'],
			4102 => [400, 'INVALID_PARAMETERS_PRESENT'],
			4103 => [400, 'MISSING_OR_EMPTY_REQUIRED_KEY'],
			4104 => [400, 'INVALID_VALUE_FOR_KEY'],
			4211 => [400, 'INVALID_VALUE_FOR_SOURCE'],
			4212 => [400, 'INVALID_VALUE_FOR_REDIRECT'],
			4221 => [401, 'UNAUTHORIZED'],
			4222 => [400, 'INVALID_VALUE_FOR_REFERRER'],
			4223 => [400, 'INVALID_VALUE_FOR_SOURCE']
		];
		if (!array_key_exists($responseCode, $errorResponseMap)) {
			$responseCode = 4040;
		}
		$newError =  [
			'id' => $responseCode,
			'status' => $errorResponseMap[$responseCode][0],
			'code' => $errorResponseMap[$responseCode][1]
		];
		array_push($errorResponse['errors'], $newError);
		http_response_code($errorResponseMap[$responseCode][0]);
		header('Content-Type: application/problem+json');
		saveError($responseCode);
		echo json_encode($errorResponse);
		exit();
	}
	
	function saveError(int $errorCode)
	{
		[$mysqli, $countryCode, $IPAddress, $browser] = initDBxCommons();
		$requestSecure = isset($_SERVER['HTTPS']);
		$requestHost = ($errorCode == 5091) ? $_SERVER['HTTP_HOST'] : NULL;
		$requestURI = $_SERVER['REQUEST_URI'];
		$queryToSaveError = "CALL asze_e404_add('$countryCode', '$IPAddress', '$browser', '$errorCode', '$requestSecure', '$requestHost', '$requestURI')";
		if (!$mysqli->connect_errno)
		{
			if (!$mysqli->query($queryToSaveError)) {
				$error = "SPError: ($mysqli->errno) $mysqli->error";
				saveToFile(112, $error, $queryToSaveError);
			}
		}
	}
	
	function initDBxCommons()
	{	
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($mysqli->connect_errno) {
			$error = "Failed to connect to MySQL: ({$mysqli->connect_errno}) $mysqli->connect_error";
			saveToFile(111, $error);
		}
		$countryCode = isset($_SERVER['HTTP_CF_IPCOUNTRY']) ? $_SERVER['HTTP_CF_IPCOUNTRY'] : 'XX';
		$IPAddress = isset($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : $_SERVER['REMOTE_ADDR'];
		// Sanitize user agent header value since it can be modified by requested source
		$browser = mysqli_real_escape_string($mysqli, $_SERVER['HTTP_USER_AGENT']);
		return [$mysqli, $countryCode, $IPAddress, $browser];
	}
	
	function saveToFile(int $dataType, string $data, string $extraData = NULL)
	{
		global $errorResponse;
		$newError =  [
			'id' => $dataType,
			'status' => '500',
			'code' => 'INTERNAL_ERROR'
		];
		array_push($errorResponse['errors'], $newError);
		$errorHeader = "\nERROR: $dataType => " . date('Y-m-d~~H:i:s') . " ==>\n";
		$errorLogfile = 'private/error.log';
		file_put_contents($errorLogfile, $errorHeader . $data . file_get_contents($errorLogfile), LOCK_EX);
		$errorQueryLogfile = 'private/error_query.log';
		file_put_contents($errorQueryLogfile, $errorHeader . $extraData . file_get_contents($errorQueryLogfile), LOCK_EX);
	}
