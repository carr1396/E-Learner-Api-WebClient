<?php
/**
 * Authentication Middleware
 * User: farid
 * Date: 3/15/2016
 * Time: 6:55 PM
 */

namespace Learner\Middleware;


use Learner\System\Session;

class Auth
{
    public $session;
    public function __construct()
    {
        $this->session = new Session;
    }
    public function __invoke($request, $response, $next)
    {
        var_dump($this->session);
        return $response->withRedirect('login');
    }
}