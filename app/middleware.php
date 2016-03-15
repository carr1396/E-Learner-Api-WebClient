<?php
// Application middleware
$app->add($app->getContainer()->get('csrf'));
$app->add(function($request, $response, $next){
	switch ($request->getUri()->getPath()) {
		case '/':
			break;
		case '/login':
		  break;
    case '/api/login':
			break;
		case '/register':
			break;
		case '/logout':
		  break;
	}
	$response = $next($request, $response);
	return $response;
});
