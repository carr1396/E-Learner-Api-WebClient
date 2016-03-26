<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:27 AM
 */

namespace Learner\Validation;


use Learner\Models\Permission;
use Violin\Violin;

class PermissionValidator extends Violin
{
    function __construct(Permission $permission) {
        $this->permission = $permission;
        $this->addFieldMessages([
            'name' => [
                'uniqueName' => 'Permission Name already in use',
                'uniqueNameRoute' => 'Permission Name Is already in use By Another Permission',
                <<<'NAMEFORMATSTATEMENT'
nameFormat
NAMEFORMATSTATEMENT
=>'Permission Name Should Be in format <subjectname(between 4-16 characters)>:<actionname (between 4-16 characters)> in lowercase'
            ]
        ]);
    }
    public function validate_uniqueName($value, $input, $args)
    {
        return ! (bool) $this->permission->where('name', $value)->count();
    }
    public function validate_nameFormat($value, $input, $args)
    {
        //"/^(([a-z]+)(:)([a-z]+))$/"
        $is_match =preg_match("/^(([a-z]{4,16})(:)([a-z]{4,16}))$/", $value,$matches);

        return $is_match;
    }
    public function validate_uniqueNameRoute($value, $input, $args)
    {
        $permission = $this->permission->where('id', $args[0])->first();
        $permissions = $this->permission->all();
        $count =0;
        for($i=0; $i<count($permissions); $i++){
            if($permissions[$i]->name==$value){
                if($permissions[$i]->id!=$permission->id){
                        $count++;
                }
            }
        }
        return !(bool)$count;
    }
}