<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 4/5/2016
 * Time: 6:02 PM
 */

namespace Learner\Controllers\API\Admin;
use Learner\Models\Course;
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