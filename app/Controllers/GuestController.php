<?php
/**
 * Guest Controller
 * For All actions accessible by The guest user
 * User: farid
 * Date: 3/15/2016
 * Time: 5:45 PM
 */

namespace Learner\Controllers;


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Models\User;


class GuestController extends Controller
{
    /**
     * index method GET
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function index(Request $request, Response $response, $args)
    {
        $this->logger->info("Home Page");
        User::all();
        $this->view->render($response, 'index.phtml',[
            'user' =>[],
            'title'=>'Welcome'
        ]);
        return $response;
    }


}