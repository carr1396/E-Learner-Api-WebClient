<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:22 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;


class Permission extends Eloquent
{
    protected $table = 'permissions';

    protected $fillable =['name', 'description'];

    protected $touches = ['roles'];

    public function setNameAttribute($value){
        if($value){
            $this->attributes['name'] = $value;
        }
    }

}