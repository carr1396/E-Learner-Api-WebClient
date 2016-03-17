<?php
/**
 * Base Controller Class
 * User: farid
 * Date: 3/15/2016
 * Time: 5:51 PM
 */

namespace Learner\Controllers;
use Learner\System\JSONRenderer;
use Learner\System\JSONRequest;
use Psr\Log\LoggerInterface;
use Slim\Views\PhpRenderer as Renderer;
use Learner\System\Session;
use Slim\Container;
use Learner\System\ACL;



abstract class Controller
{
    protected $logger;
    protected $view;
    protected $session;
    protected $container;
    protected $jsonRequest;
    protected $jsonRender;
    protected $settings;
    protected $auth;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->logger= $this->container->get('logger');
        $this->view= $this->container->get('renderer');
        $this->settings=$this->container->get('settings');
        $this->session 	= $this->container->get('session');
        $this->jsonRequest  = new JsonRequest();
        $this->jsonRender   = new JsonRenderer();
        $this->auth = new ACL();
    }

}