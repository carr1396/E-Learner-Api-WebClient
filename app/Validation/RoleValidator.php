<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:27 AM
 */

namespace Learner\Validation;


use Learner\Models\Role;
use Violin\Violin;

class RoleValidator extends Violin
{
    function __construct(Role $role) {
        $this->role = $role;
        $this->addFieldMessages([
            'name' => [
                'uniqueName' => 'Role Name already in use',
                'uniqueNameRoute' => 'Role Name Is already in use By Another Role'
            ]
        ]);
    }
    public function validate_uniqueName($value, $input, $args)
    {
        return ! (bool) $this->role->where('name', $value)->count();
    }
    public function validate_uniqueNameRoute($value, $input, $args)
    {
        $role = $this->role->where('id', $args[0])->first();
        $roles = $this->role->all();
        $count =0;
        for($i=0; $i<count($roles); $i++){
            if($roles[$i]->name==$value){
                if($roles[$i]->id!=$role->id){
                        $count++;
                }
            }
        }
        return !(bool)$count;
    }
}