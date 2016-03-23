<?php
/**
 * Guest Controller
 * For All actions accessible by The guest user
 * User: farid
 * Date: 3/15/2016
 * Time: 5:45 PM
 */

namespace Learner\Controllers\API;


use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller;


class APIController extends Controller
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

        return $this->jsonRender->render($response, 200,[
            'message'=>'Welcome To E-Leaner API V1'
        ] );
    }




}
