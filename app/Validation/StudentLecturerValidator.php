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

class StudentLecturerValidator extends Violin
{
    function __construct(Student $student)
    {
        $this->student = $student;
        $this->addFieldMessages([
        ]);
    }
}