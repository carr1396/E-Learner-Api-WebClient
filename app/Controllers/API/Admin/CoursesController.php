<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 4/5/2016
 * Time: 6:02 PM
 */

namespace Learner\Controllers\API\Admin;
use Illuminate\Database\QueryException;
use Learner\Models\Course;
use Learner\Models\Membership;
use Learner\Validation\CourseValidator;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use Learner\Controllers\Controller;

class CoursesController extends Controller
{
    public function index(Request $request, Response $response, $args)
    {
        return $response->withJson(Course::all());
    }
    public function me(Request $request, Response $response, $args)
    {

        return $response->withJson(Course::with('course')->where('user_id', $this->auth->user()->id)->get());
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
        return $response->withJson(Course::with('course')->where('added_id', $args['id']));

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

        return $response->withJson(Course::with('added')->where('course_id', $args['id']));

    }

    public function course(Request $request, Response $response, $args)
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
        return $response->withJson(Course::with('added')->where('course_id', $args['id']));

    }
    public function show(Request $request, Response $response, $args)
    {
        if (!isset($args['id'])) {
            $data = array();
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Course::with('added')->with('school')->with('categories')->where('id', $args['id'])->first());

    }

    public function lecturersAdd(Request $request, Response $response, $args){
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $school_id = isset($data['schoolID']) ? $data['schoolID'] : null;
        if (is_null($school_id)) {
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'You Did Not Specify The school To Register For';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $course_identifier = isset($args['id'])?isset($args['id']):null;
        $course = null;
        $code   = isset($data['code'])?$data['code']:null;
        if (is_null($course_identifier)){
            if(is_null($code)){
                $data['code'] = 400;
                $data['success'] = false;
                $data['error'] = 'You Did Not Specify Course Code';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }
            $course = Course::where('code', $code)->where('school_id', $school_id)->first();

            if (is_null($course)){
                $data['code'] = 400;
                $data['success'] = false;
                $data['error'] = 'Course Could Not Be Found Recheck your input or check if You Have Registered This Course. And Try Adding It Manually';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }

            $course_identifier = $course->id;
        }else{
            $course = Course::where('id', $course_identifier)->where('school_id', $school_id)->first();
        }
        if (is_null($course_identifier)){
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'You Did Not Specify Course Code OR ID';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $lecturers = isset($data['lecturers'])?$data['lecturers']:[];
        $users =[];
        foreach ($lecturers as $s){
            $u = Membership::where('lecturer_id', $s['lecturer_id'])->where('school_id', $school_id)->first();
            if(!is_null($u)){
                array_push($users, $u);
            }
        }

        if (count($lecturers)<=0){
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'No Lecturers Found To Add To Course';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $user = $this->auth->user();
        $attachments = $course->lecturers()->get();
        $errors = [];
        for ($i=0; $i<count($users); $i++){
            if (count($attachments)>0){

            }
            try{
                $course->lecturers()->attach([$users[$i]->user_id =>['added_id'=>$user->id]]);
            }catch(QueryException $e)
            {
                if ($e->getCode()==23000){
                    $data=array();
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Registration Error!!';
                    array_push($errors, ' Lecturer ('.$users[$i]->lecturer_id.') Already Taking Course');
                }else{
                    $data=array();
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Registration Error!!!';
                    array_push($errors, 'Something Went Wrong When Attaching Lecturer  ('.$users[$i]->lecturer_id.')');
                }
            }

        }


        if(count($errors)>0){
            $data['error'] = 'Registration Error!!!';
            $data['errors']=$errors;
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Course::with('lecturers')->where('id', $course->id)->first());

    }

    public function subscriptions(Request $request, Response $response, $args){
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $school_id = isset($data['schoolID']) ? $data['schoolID'] : null;
        if (is_null($school_id)) {
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'You Did Not Specify The school To Register For';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $course_identifier = isset($args['id'])?isset($args['id']):null;
        $course = null;
        $code   = isset($data['code'])?$data['code']:null;
        if (is_null($course_identifier)){
            if(is_null($code)){
                $data['code'] = 400;
                $data['success'] = false;
                $data['error'] = 'You Did Not Specify Course Code';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }
            $course = Course::where('code', $code)->where('school_id', $school_id)->first();

            if (is_null($course)){
                $data['code'] = 400;
                $data['success'] = false;
                $data['error'] = 'Course Could Not Be Found Recheck your input or check if You Have Registered This Course. And Try Adding It Manually';
                $response = $this->jsonRender->render($response, 400, $data);
                return $response;
            }

            $course_identifier = $course->id;
        }else{
            $course = Course::where('id', $course_identifier)->where('school_id', $school_id)->first();
        }
        if (is_null($course_identifier)){
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'You Did Not Specify Course Code OR ID';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $students = isset($data['students'])?$data['students']:[];
        $users =[];
        foreach ($students as $s){
            $u = Membership::where('student_id', $s['student_id'])->where('school_id', $school_id)->first();
            if(!is_null($u)){
                array_push($users, $u);
            }
        }

        if (count($students)<=0){
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'No Students Found To Add To Course';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $user = $this->auth->user();
        $attachments = $course->students()->get();
        $errors = [];
        for ($i=0; $i<count($users); $i++){
            if (count($attachments)>0){

            }
            try{
                $course->students()->attach([$users[$i]->user_id =>['added_id'=>$user->id]]);
            }catch(QueryException $e)
            {
                if ($e->getCode()==23000){
                    $data=array();
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Registration Error!!';
                    array_push($errors, ' Student ('.$users[$i]->student_id.') Already Taking Course');
                }else{
                    $data=array();
                    $data['code']=400;
                    $data['success']=false;
                    $data['error'] = 'Registration Error!!!';
                    array_push($errors, 'Something Went Wrong When Attaching Student  ('.$users[$i]->student_id.')');
                }
            }

        }


        if(count($errors)>0){
            $data['error'] = 'Registration Error!!!';
            $data['errors']=$errors;
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        return $response->withJson(Course::with('students')->where('id', $course->id)->first());

    }
    public function update(Request $request, Response $response, $args){
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
        }
        $identifier   = isset($data['name'])?trim($data['name']):null;
        $abbrev   = isset($data['abbrev'])?$data['abbrev']:null;
        $active   = isset($data['active'])?$data['active']:null;
        $code   = isset($data['code'])?$data['code']:null;
        $description   = isset($data['description'])?$data['description']:null;

        $v = new CourseValidator(new Course());

        $course = Course::with('added')->where('id', $args['id'])->first();
        if(is_null($course) || is_null($course->id)){
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Course Does Not Exist';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $school_id  = $course->school_id;
        $v->validate([
            'name'    => [$identifier, 'required|uniqueNameRoute('.$course->school_id.', '.$args['id'].')|min(8)'],
            'abbrev' =>[$abbrev, 'min(3)|max(8)'],
            'code' =>[$code, 'required|uniqueCodeRoute('.$school_id.', '.$args['id'].')|min(3)|max(8)'],
            'description'      => [$description, 'min(40)']
        ]);

        if(!$v->passes()){

            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Some Errors Were Found';
            $data['errors']= $v->errors()->all();
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        if(!is_null($identifier))
        {
            $course->name= $identifier;
        }
        if(!is_null($description))
        {
            $course->description = $description;
        }
        if(!is_null($abbrev))
        {
            $course->abbrev = $abbrev;
        }
        if(!is_null($active))
        {
            $course->active = $active;
        }
        if(!is_null($code))
        {
            $course->code = $code;
        }

        $saved = $course->save();

        if(!$saved)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Some thing Went Wrong While Saving Course Updates';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }else{

            $categories =  isset($data['categoriesOut'])?$data['categoriesOut']:[];


            if(count($categories)>0){
                $course->categories()->sync($categories);
            }
            return $response->withJson($course);
        }
    }

    public function destroy(Request $request, Response $response, $args)
    {
        if(!isset($args['id']))
        {
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'School ID Not Specified';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        $c = Course::with('school')->where('id', $args['id'])->first();
        if (is_null($c)){
            $data=array();
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Course Not Found';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        if($c->added_id == $this->auth->user()->id || $c->school->creator_id== $this->auth->user()->id){
            $c->delete();
            return $response->withJson(array("code"=>200, "deleted"=>true));
        }else {

            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'Course Can Only Be Deleted By School Main Administrator Or The User Who AddedThe Course';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }
        }

        public function store(Request $request, Response $response, $args){
        $this->jsonRequest->setRequest($request);
        $data = $this->jsonRequest->getRequestParams();
        if(count($data)<=0)
        {
            $data['code']=400;
            $data['success']=false;
            $data['error'] = 'Post Sent Without Body';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $school_id = isset($data['schoolID']) ? $data['schoolID'] : null;
        if (is_null($school_id)) {
            $data['code'] = 400;
            $data['success'] = false;
            $data['error'] = 'You Did Not Specify The school To Register For';
            $response = $this->jsonRender->render($response, 400, $data);
            return $response;
        }

        $identifier   = isset($data['name'])?trim($data['name']):null;
        $abbrev   = isset($data['abbrev'])?$data['abbrev']:null;
        $active   = isset($data['active'])?$data['active']:null;
        $code   = isset($data['code'])?$data['code']:null;
        $description   = isset($data['description'])?$data['description']:null;

        $v = new CourseValidator(new Course());

        $v->validate([
            'name'    => [$identifier, 'required|uniqueName('.$school_id.')|min(8)'],
            'abbrev' =>[$abbrev, 'min(3)|max(8)'],
            'school_id'=>[$school_id, 'required'],
            'code' =>[$code, 'required|uniqueCode('.$school_id.')|min(3)|max(8)'],
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


            $course = new Course();
            $course->name   = $identifier;
            $course->abbrev   = $abbrev;
            $course->code   = $code;
            $course->active = $active;
            $course->description = $description;
            $course->added_id = $this->auth->user()->id;
            $course->school_id = $school_id;

            $saved = $course->save();
            if(!$saved)
            {
                $data['code']=400;
                $data['success']=false;
                $data['error'] = 'Some thing Went Wrong While Saving User';
                return $this->jsonRender->render($response, 400, $data);
            }

            $categories =  isset($data['categories'])?$data['categories']:[];


            if(count($categories)>0){
                $course->categories()->sync($categories);
            }


            return $response->withJson($course);

        }
    }



}