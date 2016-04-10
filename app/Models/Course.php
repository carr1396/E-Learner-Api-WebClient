<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/30/2016
 * Time: 2:13 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Course extends Eloquent
{
    protected $table = 'courses';

    protected $fillable =['name', 'code', 'school_id',  'added_id','abbrev', 'description' ];
    
    public function added()
    {
        return $this->belongsTo('Learner\Models\User');
    }

    public function students(){
        return $this->belongsToMany('Learner\Models\User', 'course_student');
    }

    public function lecturers(){
        return $this->belongsToMany('Learner\Models\User', 'course_lecturer');
    }

    public function categories()
    {
        return $this->belongsToMany('Learner\Models\Category');
    }
    public function school()
    {
        return $this->belongsTo('Learner\Models\School');
    }
    public function setActiveAttribute($value){
        $this->attributes['active']= is_null($value)?0:$value;
    }

}