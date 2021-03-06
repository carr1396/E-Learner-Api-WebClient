<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/30/2016
 * Time: 2:13 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Subscription extends Eloquent
{
    protected $table ="memberships";
    protected $fillable =['user_id', 'student_id', 'staff_id', 'lecturer_id','type', 'active', 'school_id', 'added_by', 'temporary_password'];

    public function user()
    {
        return $this->belongsTo('Learner\Models\User');
    }

    public function school()
    {
        return $this->belongsTo('Learner\Models\School');
    }
    public function setActiveAttribute($value){
        $this->attributes['active']= is_null($value)?0:$value;
    }

}