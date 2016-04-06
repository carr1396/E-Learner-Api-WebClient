<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 4/5/2016
 * Time: 6:02 PM
 */

namespace Learner\Controllers\API\Admin;
use Learner\Models\Category;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use Learner\Controllers\Controller;

class CategoriesController extends Controller
{
    public function index(Request $request, Response $response, $args)
    {
        return $response->withJson(Category::all());
    }
    public function listAll(Request $request, Response $response, $args)
    {
//        Category::lists('id', 'name')
        return $response->withJson(Category::all());
    }
    public function me(Request $request, Response $response, $args)
    {

        return $response->withJson(Category::with('school')->where('user_id', $this->auth->user()->id)->get());
    }

    public function added(Request $request, Response $response, $args)
    {
        if(!isset($args['id']))
        {
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Category::with('school')->where('added_id', $args['id']));

    }
    public function user(Request $request, Response $response, $args)
    {
        if(!isset($args['id']))
        {
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        return $response->withJson(Category::with('added')->where('school_id', $args['id']));

    }

    public function school(Request $request, Response $response, $args)
    {
        if(!isset($args['id']))
        {
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Category::with('added')->where('school_id', $args['id']));

    }

    public function store(Request $request, Response $response, $args){
        
    }



}