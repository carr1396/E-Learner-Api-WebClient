<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/30/2016
 * Time: 2:13 AM
 */

namespace Learner\Models;


class Subscription
{
    protected $table ="subscriptions";
    protected $fillable =['user_id', 'school_id', 'type', 'active'];

    public function setActiveAttribute($value){
        $this->attributes['active']= is_null($value)?0:$value;
    }

}