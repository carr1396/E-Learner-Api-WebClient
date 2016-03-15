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

    public function __construct(Container $container)
    {
        $this->logger= $container->get('logger');
        $this->view= $container->get('renderer');
        $this->session 	=$container->get('session');;
    }

}