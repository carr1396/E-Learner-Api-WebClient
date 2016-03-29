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

	protected $fillable =['username', 'email', 'password', 'display_name', 'full_name', 'id_number'];
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $dates =['last_login_at'];
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = [
		'password', 'remember_token'
	];

    public function roles()
    {
        return $this->belongsToMany('Learner\Models\Role');
    }
    public function setPasswordAttribute($value){
        $options = [
            'cost' => 11
        ];

        if($value){
            $this->attributes['password'] =password_hash($value, PASSWORD_BCRYPT, $options);
        }
    }
    public function password_check($password){
        return password_verify ( $password , $this->password );
    }
    public function setDisplayNameAttribute($value){
        //set display_name to value or concat user's name
        $this->attributes['display_name']=($value?:($this->name()?:$this->attributes['username']));
    }
    public function name()
    {
        return $this->full_name?:null;
    }
}
