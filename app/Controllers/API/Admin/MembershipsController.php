<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 4/4/2016
 * Time: 10:08 AM
 */

namespace Learner\Controllers\API\Admin;

use Learner\Models\Role;
use Learner\Models\Membership;
use Learner\Models\User;
use Learner\Validation\UserValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller as BaseController;


class MembershipsController extends BaseController
{
    public function index(Request $request, Response $response, $args)
    {
        if(!isset($args['schoolId']))
        {
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'School ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Membership::where('school_id', $args['schoolId'])->get());
    }
    
    public function register (Request $request, Response $response, $args)
    {
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
            $school_id   = isset($data['schoolID'])?$data['schoolID']:null;
            if (is_null($school_id)){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'You Did Not Specify The School To Register For';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }

            $fullName = isset($data['first_name'])?$data['first_name']:'';
            $fullName .= isset($data['other_names'])?$data['other_names']:'';
            $fullName .= isset($data['last_name'])?$data['last_name']:'';

            $email = isset($data['email'])?$data['email']:null;

            if(is_null($email)){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'You Did Not Specify An Email';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }
            $student_id = isset($data['student_id'])?$data['student_id']:null;
            $lecturer_id = isset($data['lecturer_id'])?$data['lecturer_id']:null;
            $staff_id = isset($data['staff_id'])?$data['staff_id']:null;
            $active = isset($data['active'])?$data['active']:null;
            $type = isset($data['type'])?$data['type']:null;

            if(is_null($student_id) && is_null($lecturer_id)){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'You Have Neither Specified A Student Nor A Lecturer ID You Need To Specify Either Or Both To Register';
                return $this->jsonRender->render($response, 400, $data);
            }
            $username   = substr($email, 0, strpos($email, '@')).''.($student_id?:$lecturer_id);
            $password   = $username.''.time();
            $v = new UserValidator(new User);
            $v->validate([
                'email'     => [$email, 'required|email|uniqueEmail'],
                'username'  => [$username, 'required|alnumDash|max(30)|min(6)|uniqueUsername'],
                'password'  => [$password, 'required|min(8)']
            ]);

            if (!$v->passes()) {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                return $this->jsonRender->render($response, 400, $data);

            }

            $user = new User();
            $user->email    = $email;
            $user->username = $username;
            $user->full_name = $fullName;
            $user->password = $password;
            $saved = $user->save();
            if(!$saved)
            {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some thing Went Wrong While Saving User';
                return $this->jsonRender->render($response, 400, $data);
            }

            $membership = new Membership();
            $membership->user_id = $user->id;
            $membership->school_id = $school_id;
            $membership->type = $type?:'student';
            $membership->lecturer_id = $lecturer_id;
            $membership->student_id = $student_id;
            $membership->staff_id = $staff_id;
            $membership->active = $active;
            $membership->added_by= $this->auth->user()->id;
            $membership->temporary_password = $password;

            $saved = $membership->save();
            if(!$saved)
            {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some thing Went Wrong While Creating Your Membership';
                return $this->jsonRender->render($response, 400, $data);
            }
            $roleStudentID = Role::where('name','student')->first()->id;
            $roleLectuerID = Role::where('name','lecturer')->first()->id;
            $roleAdminID = Role::where('name','admin')->first()->id;

            if ($type=='admin_student_lecturer'){
                $user->roles()->sync([$roleStudentID, $roleLectuerID, $roleAdminID]);
            }
            if ($type=='admin_lecturer'){
                $user->roles()->sync([$roleLectuerID, $roleAdminID]);
            }
            if ($type=='lecturer'){
                $user->roles()->sync([$roleLectuerID]);
            }
            if ($type=='student_lecturer'){
                $user->roles()->attach([$roleLectuerID, $roleStudentID]);
            }else{
                $user->roles()->sync([$roleStudentID]);
            }
            return $response->withJson($membership);
        }
    }

}