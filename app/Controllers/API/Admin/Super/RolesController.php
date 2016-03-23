<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:20 AM
 */

namespace Learner\Controllers\API\Admin\Super;

use Learner\Validation\RoleValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller as BaseController;
use Learner\Models\Role;

class RolesController extends BaseController
{
    public function index(Request $request, Response $response, $args)
    {
//        return $this->jsonRender->render($response, 200,[
//            'roles'=> Role::all()
//        ] );
        return $response->withJson(Role::all());
    }

    public function show(Request $request, Response $response, $args)
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
        return $response->withJson(Role::where('id', $args['id'])->first());
    }
    public function update(Request $request, Response $response, $args)
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
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();
        $identifier   = isset($data['name'])?$data['name']:null;
        $description   = isset($data['description'])?$data['description']:null;
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $identifier = strtolower($identifier);
            $v = new RoleValidator(new Role());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueNameRoute(4)|min(3)|max(16)'],
                'description'      => [$description, 'max(40)']
            ]);
            if(!$v->passes()){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $role = Role::where('id', $args['id'])->first();
                if(!is_null($identifier))
                {
                    $role->name= $identifier;
                }
                if(!is_null($description))
                {
                    $role->description = $description;
                }

                $saved = $role->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving Role';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
//                    $data =array();
//                    $data['role']=$role;
//                    $data['code']=200;
//                    $data['success']=true;
//                    $response = $this->jsonRender->render($response, 200, $data);
//                    return $response;
                    return $response->withJson(Role::where('id', $args['id'])->first());
                }
            }
        }

    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function store(Request $request, Response $response, $args)
    {
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();
        $identifier   = isset($data['name'])?$data['name']:null;
        $description   = isset($data['description'])?$data['description']:null;
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $identifier = strtolower($identifier);
            $v = new RoleValidator(new Role());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueName|min(3)|max(16)'],
                'description'      => [$description, 'max(40)']
            ]);
            if(!$v->passes()){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $role = new Role();
                $role->name    = $identifier;
                if(!is_null($description))
                {
                    $role->description = $description;
                }

                $saved = $role->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving Role';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
                    $data =array();
                    $data['role']=$role;
                    $data['code']=200;
                    $data['success']=true;
                    $response = $this->jsonRender->render($response, 200, $data);
                    return $response;
                }
            }
        }
    }

}