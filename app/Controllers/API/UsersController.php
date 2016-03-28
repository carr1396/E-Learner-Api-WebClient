<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:20 AM
 */

namespace Learner\Controllers\API;

use Learner\Validation\UserValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller as BaseController;
use Learner\Models\User;

class UsersController extends BaseController
{
    public function index(Request $request, Response $response, $args)
    {
        return $response->withJson(User::with('roles')->get());
    }
    public function me(Request $request, Response $response, $args)
    {
        return $response->withJson($this->auth->profile());
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
        return $response->withJson(User::with('roles')->where('id', $args['id'])->first());
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
        $user = User::with('roles')->where('id', $args['id'])->first();
        $user->delete();
        return $response->withJson(array("code"=>200, "deleted"=>true));
    }
    public function changePassword(Request $request, Response $response, $args)
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
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $password   = $data['password'];
            $passwordConfirm = $data['confirmPassword'];
            $v = new UserValidator(new User);
            $v->validate([
                'password'  => [$password, 'required|min(8)'],
                'password_confirm' => [$passwordConfirm, 'required|matches(password)']
            ]);
            $user = User::with('roles')->where('id', $args['id'])->first();
            $user->password=$password;
            $saved =$user->save();
            if(!$saved)
            {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some thing Went Wrong While Saving User';
                return  $this->jsonRender->render($response, 400, $data);
            }else{
                return $response->withJson($user);
            }

        }
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
        $email      = isset($data['email'])?$data['email']:null;
        $username   = isset($data['username'])?$data['username']:null;
        $roles = isset($data['rolesCheckModel'])?$data['rolesCheckModel']:array();
        $roleIDs=array();
        foreach($roles as $r){
            if($r['checked'])
            {
                array_push($roleIDs, $r['id']);
            }
        }

        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $username = strtolower($username);
            $v = new UserValidator(new User());
            $v->validate([
                'email'     => [$email, 'required|email|uniqueEmailRoute('.$args['id'].')'],
                'username'  => [$username, 'required|alnumDash|max(20)|min(6)|uniqueUsernameRoute('.$args['id'].')'],
            ]);
            if(!$v->passes()){

                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $user = User::where('id', $args['id'])->first();
                if(!is_null($username))
                {
                    $user->username= $username;
                }
                if(!is_null($email))
                {
                    $user->email = $email;
                }
                $user->roles()->sync($roleIDs);
                $saved = $user->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving User';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
//                    $data =array();
//                    $data['user']=$user;
//                    $data['code']=200;
//                    $data['success']=true;
//                    $response = $this->jsonRender->render($response, 200, $data);
//                    return $response;
                    return $response->withJson(User::with('roles')->where('id', $args['id'])->first());
                }
            }
        }

    }

}