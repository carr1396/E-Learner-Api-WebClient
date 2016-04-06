<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:22 AM
 */

namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;


class Category extends Eloquent
{
    protected $table = 'categories';

    protected $fillable =['name', 'description'];

    public function courses()
    {
        return $this->belongsToMany('Learner\Models\Course');
    }

}