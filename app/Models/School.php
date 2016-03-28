<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:22 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;


class School extends Eloquent
{
    protected $table = 'schools';

    protected $fillable =['name', 'description', 'abbrev', 'description', 'location', 'identifier',
        'longitude', 'latitude', 'private', 'phone', 'email', 'other_contact', 'country', 'user_id',
        'api_base_url', 'admin_verification_url', 'student_update_url', 'course_update_url' ];


    public function creator()
    {
        return $this->hasOne('Learner\Models\User');
    }

    public function setPrivateAttribute($value){
        $this->attributes['private']= is_null($value)?0:$value;
    }

}