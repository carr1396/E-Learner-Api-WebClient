<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:20 AM
 */

namespace Learner\Controllers\API\Admin\Super;

use Learner\Validation\PermissionValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller as BaseController;
use Learner\Models\Permission;

class PermissionsController extends BaseController
{
    public function index(Request $request, Response $response, $args)
    {
        return $response->withJson(Permission::all());
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
        return $response->withJson(Permission::where('id', $args['id'])->first());
    }
    public function destroy(Request $request, Response $response, $args)
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
        $permission = Permission::where('id', $args['id'])->first();
        $permission->delete();
        return $response->withJson(array("code"=>200, "deleted"=>true));
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
            $v = new PermissionValidator(new Permission());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueNameRoute('.$args['id'].')|min(4)|max(16)'],
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
                $permission = Permission::where('id', $args['id'])->first();
                if(!is_null($identifier))
                {
                    $permission->name= $identifier;
                }
                if(!is_null($description))
                {
                    $permission->description = $description;
                }

                $saved = $permission->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving Permission';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
//                    $data =array();
//                    $data['permission']=$permission;
//                    $data['code']=200;
//                    $data['success']=true;
//                    $response = $this->jsonRender->render($response, 200, $data);
//                    return $response;
                    return $response->withJson(Permission::where('id', $args['id'])->first());
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
            $v = new PermissionValidator(new Permission());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueName|nameFormat|min(4)|max(16)'],
                'description'      => [$description, 'max(40)']
            ]);
            if(!$v->passes()){
//                preg_match("/^([a-z]{4,16})(:)([a-z]{4,16})$/", $identifier, $matches);
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $permission = new Permission();
                $permission->name    = $identifier;
                if(!is_null($description))
                {
                    $permission->description = $description;
                }

                $saved = $permission->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving Permission';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
                    $data =array();
                    $data['permission']=$permission;
                    $data['code']=200;
                    $data['success']=true;
                    $response = $this->jsonRender->render($response, 200, $data);
                    return $response;
                }
            }
        }
    }

}