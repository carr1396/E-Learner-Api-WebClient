<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:20 AM
 */

namespace Learner\Controllers\API\Admin;

use Learner\Models\Course;
use Learner\Models\Membership;
use Learner\Models\Role;
use Learner\Models\Subscription;
use Learner\Validation\SchoolValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Learner\Controllers\Controller as BaseController;
use Learner\Models\School;

class SchoolsController extends BaseController
{
    public function index(Request $request, Response $response, $args)
    {
        return $response->withJson(School::all());
    }
    public function me(Request $request, Response $response, $args)
    {

        return $response->withJson(Membership::with('school')->where('user_id', $this->auth->user()->id)->get());
    }
    public function members(Request $request, Response $response, $args)
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
        return $response->withJson(Membership::with('user')->where('school_id', $args['id'])->get());
    }

    public function courses(Request $request, Response $response, $args)
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
        return $response->withJson(Course::with('added')->where('school_id', $args['id'])->get());
    }

    public function toggleActivate(Request $request, Response $response, $args)
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
        return $response->withJson(Course::with('added')->where('school_id', $args['id'])->get());
    }

    public function mine(Request $request, Response $response, $args)
    {

        return $response->withJson(School::where('creator_id', $this->auth->user()->id)->get());
    }

    public function publicSchools(Request $request, Response $response, $args)
    {
        return $response->withJson(School::where('private', 0)->get());
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
        return $response->withJson(School::with('creator')->where('id', $args['id'])->first());
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
        $school = School::where('id', $args['id'])->first();
        $school->delete();
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
        $abbrev   = isset($data['abbrev'])?$data['abbrev']:null;
        $private   = isset($data['private'])?$data['private']:null;
        $description   = isset($data['description'])?$data['description']:null;
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $v = new SchoolValidator(new School());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueNameRoute('.$args['id'].')|min(8)'],
                'abbrev' =>[$abbrev, 'required|min(3)|max(8)'],
                'description'      => [$description, 'min(40)']
            ]);
            if(!$v->passes()){

                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $school = School::where('id', $args['id'])->first();
                if(!is_null($identifier))
                {
                    $school->name= $identifier;
                }
                if(!is_null($description))
                {
                    $school->description = $description;
                }
                if(!is_null($abbrev))
                {
                    $school->abbrev = $abbrev;
                }
                if(!is_null($private))
                {
                    $school->private = $private;
                }

                $saved = $school->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving School';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
                    return $response->withJson(School::where('id', $args['id'])->first());
                }
            }
        }

    }
    public function updateAPISettings(Request $request, Response $response, $args)
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
        $api_base_url   = isset($data['api_base_url'])?$data['api_base_url']:null;
        $student_update_url   = isset($data['student_update_url'])?$data['student_update_url']:null;
        $lecturer_update_url   = isset($data['lecturer_update_url'])?$data['lecturer_update_url']:null;
        $course_update_url   = isset($data['course_update_url'])?$data['course_update_url']:null;
        $course_associate_student_update_url   = isset($data['course_associate_student_update_url'])?$data['course_associate_student_update_url']:null;
        $course_associate_lecturer_update_url   = isset($data['course_associate_lecturer_update_url'])?$data['course_associate_lecturer_update_url']:null;
        $admin_verification_url = isset($data['admin_verification_url'])?$data['admin_verification_url']:null;

        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body No Updates Made';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $school = School::where('id', $args['id'])->first();
            if(!is_null($api_base_url))
            {
                $school->api_base_url= $api_base_url;
            }
            if(!is_null($admin_verification_url))
            {
                $school->admin_verification_url = $admin_verification_url;
            }
            if(!is_null($student_update_url))
            {
                $school->student_update_url = $student_update_url;
            }
            if(!is_null($lecturer_update_url))
            {
                $school->lecturer_update_url = $lecturer_update_url;
            }
            if(!is_null($course_update_url))
            {
                $school->course_update_url = $course_update_url;
            }
            if(!is_null($course_associate_student_update_url))
            {
                $school->course_associate_student_update_url = $course_associate_student_update_url;
            }
            if(!is_null($course_associate_lecturer_update_url))
            {
                $school->course_associate_lecturer_update_url = $course_associate_lecturer_update_url;
            }
            $saved = $school->save();
            if(!$saved)
            {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some thing Went Wrong While Saving School';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                return $response->withJson(School::where('id', $args['id'])->first());
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

        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{
            $identifier   = isset($data['name'])?$data['name']:null;
            $abbrev   = isset($data['abbrev'])?$data['abbrev']:null;
            $private   = isset($data['private'])?$data['private']:null;
            $description   = isset($data['description'])?$data['description']:null;
            $v = new SchoolValidator(new School());
            $v->validate([
                'name'    => [$identifier, 'required|uniqueName|min(8)'],
                'abbrev' =>[$abbrev, 'required|min(3)|max(8)'],
                'description'      => [$description, 'min(40)']
            ]);
            if(!$v->passes()){
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some Errors Were Found';
                $data['errors']= $v->errors()->all();
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }else{
                $school = new School();
                $school->name   = $identifier;
                $school->abbrev   = $abbrev;
                $school->private = $private;
                $school->creator_id = $this->auth->user()->id;
                if(!is_null($description))
                {
                    $school->description = $description;
                }


                $saved = $school->save();
                if(!$saved)
                {
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Some thing Went Wrong While Saving School';
                    $response = $this->jsonRender->render($response, 400, $data);
                    return $response;
                }else{
                    $data =array();
                    $data['school']=$school;
                    $data['code']=200;
                    $data['success']=true;
                    $admin = Role::where('name', 'admin')->first();
                    $isAdmin = false;
                    if(!is_null($admin))
                    {
                        $rs = $this->auth->user()->roles()->get();
                        $roleIds = array();
                        foreach ($rs as $r){
                            array_push($roleIds, $r->id);
                        }
                        $this->auth->user()->roles()->sync([$admin->id]+$roleIds);
                        $isAdmin= true;
                    }
                    $subscription = new Subscription();
                    $subscription->user_id = $this->auth->user()->id;
                    $subscription->school_id = $school->id;
                    $subscription->type = 'creator';
                    $subscription->active = 1;
                    $subscription->added_by= $this->auth->user()->id;
                    $subscription->save();
                    $data['isAdmin'] = $isAdmin;
                    $response = $this->jsonRender->render($response, 200, $data);
                    return $response;
                }
            }
        }
    }

}