<?php
/**
 * Base Controller Class
 * User: farid
 * Date: 3/15/2016
 * Time: 5:51 PM
 */

namespace Learner\Controllers;
use Psr\Log\LoggerInterface;
use Slim\Views\PhpRenderer as Renderer;
use Learner\System\Session;
use Slim\Container;

abstract class Controller
{
    protected $logger;
    protected $view;
    protected $session;
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->logger= $this->container->get('logger');
        $this->view= $this->container->get('renderer');
        $this->session 	= $this->container->get('session');;
    }

}