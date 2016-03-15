<?php
namespace Learner\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
class User extends Eloquent {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	protected $fillable=['username', 'email'];
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');
}
