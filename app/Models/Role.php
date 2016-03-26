<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:22 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;


class Role extends Eloquent
{
    protected $table = 'roles';

    protected $fillable =['name', 'description'];

    protected $touches = ['users'];

    public function users()
    {
        return $this->belongsToMany('Learner\Models\User');
    }

    public function permissions()
    {
        return $this->belongsToMany('Learner\Models\Permission');
    }

}