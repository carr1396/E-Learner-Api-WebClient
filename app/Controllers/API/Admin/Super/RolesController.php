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
        return $response->withJson(Role::with('permissions')->get());
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
        return $response->withJson(Role::with('permissions')->where('id', $args['id'])->first());
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
        $role = Role::where('id', $args['id'])->first();
        $role->delete();
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
        $permissions = isset($data['permissionsOut'])?$data['permissionsOut']:[];
        $permissionsID =array();
        foreach($permissions as $p){
//            var_dump( $p);
            array_push($permissionsID, $p['id']);
        }
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
            $validateArray = array();
            if(!is_null($identifier)){
                $validateArray[ 'name'] = [$identifier, 'required|uniqueNameRoute('.$args['id'].')|min(4)|max(16)'];
            }
            if(!is_null($description)){
                $validateArray ['description'] = [$description, 'max(40)'];
            }
            $v->validate($validateArray);
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
                $role->permissions()->sync($permissionsID);
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
                    return $response->withJson(Role::with('permissions')->where('id', $args['id'])->first());
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
                'name'    => [$identifier, 'required|uniqueName|min(4)|max(16)'],
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
                    $data['role']=Role::with('permissions')->where('id', $role->id)->first();
                    $data['code']=200;
                    $data['success']=true;
                    $response = $this->jsonRender->render($response, 200, $data);
                    return $response;
                }
            }
        }
    }

}