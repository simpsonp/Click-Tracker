<?php
    $fileRequestMap = [
        '/logs/1/view' => 'error.log',
        '/logs/2/view' => 'error_query.log'
    ];
    if (!array_key_exists($request,$fileRequestMap)) {
        sendErrorResponse(4033);
	}
	date_default_timezone_set('Antarctica/Troll');
	// DELETED AUTHENTICATION LOGIC FROM REPOSITORY SOURCE FOR SECURITY
	$file = __DIR__ . "/../private/$fileRequestMap[$request]";
	if (file_exists($file)) {
		header('Content-Type: text/plain');
		header('Cache-Control: max-age=172800, must-revalidate');
		header('Content-Length: ' . filesize($file));
		readfile($file);
		exit();
	}
	if (!headers_sent()) {
		header_remove();
	}
	sendErrorResponse(5101);
