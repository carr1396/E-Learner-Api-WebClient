<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:27 AM
 */

namespace Learner\Validation;


use Learner\Models\School;
use Violin\Violin;

class SchoolValidator extends Violin
{
    function __construct(School $school)
    {
        $this->school = $school;
        $this->addFieldMessages([
            'name' => [
                'uniqueName' => 'School Name already in use',
                'uniqueNameRoute' => 'School Name Is already in use By Another School',
            ]
        ]);
    }

    public function validate_uniqueName($value, $input, $args)
    {
        return !(bool)$this->school->where('name', $value)->count();
    }


    public function validate_uniqueNameRoute($value, $input, $args)
    {
        $school = $this->school->where('id', $args[0])->first();
        $schools = $this->school->all();
        $count = 0;
        for ($i = 0; $i < count($schools); $i++) {
            if ($schools[$i]->name == $value) {
                if ($schools[$i]->id != $school->id) {
                    $count++;
                }
            }
        }
        return !(bool)$count;
    }
}