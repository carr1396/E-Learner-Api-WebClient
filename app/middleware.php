<?php
// Application middleware
use Learner\System\JSONRenderer;
use Learner\System\JWTHelper;

$app->add($app->getContainer()->get('csrf'));
$app->add(/**
 * @param $request
 * @param $response
 * @param $next
 * @return mixed
 */
	function( \Psr\Http\Message\RequestInterface $request, \Psr\Http\Message\ResponseInterface $response, $next){
        $headers = $request->getHeaders();
        $token = '';
        unset($_SESSION['token']);
        if(!empty($headers));
        {
            $authenticated = array_has($headers, 'HTTP_AUTHORIZATION');
            if($authenticated){

                $t = JWTHelper::get_token_from_header($headers);
                $parsed = JWTHelper::verify_token($t);
                $parseFailed = is_null($parsed);
                if(!$parseFailed)
                {
                    $parseFailed = !$parsed;
                    if(!$parseFailed){
                        $_SESSION['token']=$t;
                        $token=$t;

                    }
                }
            }
        }
	switch ($request->getUri()->getPath()) {
		case '/':
            break;
		case '/login':
            break;
		case '/register':
            break;
        case '/logout':
		  break;
        default:{
            $starts= starts_with($request->getUri()->getPath(), '/api/v1');
            if($starts){

                if(!$authenticated){
                    if(strlen($token)<=0)
                    {
                        //$_SESSION = array();
                        return (new JSONRenderer())->render($response, 440, ['code'=>440, 'error'=>'Token Invalid, Or Token Expired']);
                    }
                }
            }
            break;
        }
	}
	$response = $next($request, $response);
	return $response;
});

function startsWith($haystack,$needle,$case=true) {
    if($case){return (strcmp(substr($haystack, 0, strlen($needle)),$needle)===0);}
    return (strcasecmp(substr($haystack, 0, strlen($needle)),$needle)===0);
}
