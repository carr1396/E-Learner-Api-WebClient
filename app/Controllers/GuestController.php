<?php
/**
 * Guest Controller
 * For All actions accessible by The guest user
 * User: farid
 * Date: 3/15/2016
 * Time: 5:45 PM
 */

namespace Learner\Controllers;


use Learner\System\JWTHelper;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Models\User;
use Learner\Validation\UserValidator as Validator;

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
        // $this->logger->info("Home Page");
        $name = $request->getAttribute('csrf_name');
        $value = $request->getAttribute('csrf_value');
        $this->view->render($response, 'index.phtml',[
            'BOOTSTRAPUSER' =>$this->auth->profile(),
            'CSRF_NAME'=>$name,
            'CSRF_VALUE'=>$value,
            'title'=>'Welcome'
        ]);
        return $response;
    }

    public function anything(Request $request, Response $response, $args)
    {
        // $this->logger->info("Home Page");
        return $response->withRedirect('/');
    }
    public function logout(Request $request, Response $response, $args)
    {
        $this->session->clear();
        var_dump($_SESSION);
        return $response->withStatus(200, 'User Logged Out');
    }

    public function login(Request $request, Response $response)
    {
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();;

        $identifier   = isset($data['username'])?$data['username']:null;
        $password   = isset($data['password'])?$data['password']:null;
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            //        if ($request->getAttribute('csrf_status') === false) {
//            $data['success']=false;
//            $data['error'] = 'CSRF_TOKEN Verfication failed';
//            $response = $this->jsonRender->render($response, 400, $data);
//            return $response;
//        }
            $v = new Validator(new User);
            $v->validate([
                'username'    => [$identifier, 'required'],
                'password'      => [$password, 'required']
            ]);;
            if(!$v->passes()){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $user = User::where('username', $identifier)->orWhere('email', $identifier)->first();
                if(is_null($user)){
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = "Wrong Username Or Email, $identifier Not Found, Create An Account If You ARe A New User ";
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }
                else if(!$user->password_check($password))
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = "Wrong Password, Username And Password Do Not Match ";
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
                    $data =array();
                    $data['user']=User::with('roles')->find($user->id);
                    $roles = $user->roles;

                    $role='';
                    foreach($roles as $r){
                        $role.=$r->name.'|';
                    }
                    $jwt = $this->settings['jwt'];
                    $builder = new JWTHelper($jwt['iss'],$jwt['private_key'],$user->id, $role, $user->username );
                    $token = $builder->generate_token();
                    $data['code']=200;
                    $data['success']=true;
                    $data['token']=(string)$token;
                    $this->session->set('user_id', $user->id);
                    $response = $this->jsonRender->render($response, 200, $data);
                    return $response;
                }
            }
        }
    }
    public function register(Request $request, Response $response)
    {
//        ob_start();
//        var_dump($request);
//        $debug_dump = ob_get_clean();
//        $this->logger->info($debug_dump);
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();;
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
        }
        else {
            $email      = $data['email'];
            $username   = $data['username'];
            $password   = $data['password'];
            $passwordConfirm = $data['confirmPassword'];
            $v = new Validator(new User);
            $v->validate([
                'email'     => [$email, 'required|email|uniqueEmail'],
                'username'  => [$username, 'required|alnumDash|max(20)|min(6)|uniqueUsername'],
                'password'  => [$password, 'required|min(8)'],
                'password_confirm' => [$passwordConfirm, 'required|matches(password)']
            ]);
            if ($v->passes()) {

                $user = new User();
                $user->email    = $email;
                $user->username = $username;
                $user->password = $password;
                $saved = $user->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving User';
                    $response = $this->jsonRender->render($response, 400, $data);
                }else{
                    $jwt = $this->settings['jwt'];
                    $builder = new JWTHelper($jwt['iss'],$jwt['private_key'],$user->id, 'admin', $user->username );
                    $token = $builder->generate_token();
                    $data =array();
                    $data['user']=User::with('roles')->find($user->id);
                    $data['code']=200;
                    $data['success']=true;
                    $data['token']=(string)$token;
                    $this->session->set('user_id', $user->id);
                    $response = $this->jsonRender->render($response, 200, $data);
                }
            }else{
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
            }

        }

        return $response;
    }

}
