<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/24/2016
 * Time: 1:27 AM
 */

namespace Learner\Validation;


use Learner\Models\Course;
use Violin\Violin;

class CourseValidator extends Violin
{
    function __construct(Course $course)
    {
        $this->course = $course;
        $this->addFieldMessages([
            'name' => [
                'uniqueName' => 'Course Name already in use in this school',
                'uniqueNameRoute' => 'Course Name Is already in use By Another Course In This School',
            ],
            'code' => [
                'uniqueCode' => 'Course Code already in use in this school',
                'uniqueCodeRoute' => 'Course Code Is already in use By Another Course In This School',
            ]
        ]);
    }

    public function validate_uniqueName($value, $input, $args)
    {
        $courses = $this->course->where('school_id', $args[0])->get();
        $count = 0;
        for ($i = 0; $i < count($courses); $i++) {
            if (strcmp($courses[$i]->name, $value)==0) {
                $count++;
            }
        }
        return !(bool)$count;
    }

    public function validate_uniqueCode($value, $input, $args)
    {
        $courses = $this->course->where('school_id', $args[0])->get();
        $count = 0;
        for ($i = 0; $i < count($courses); $i++) {
            if (strcmp($courses[$i]->code, $value)==0) {
                $count++;
            }
        }
        return !(bool)$count;
    }


    public function validate_uniqueNameRoute($value, $input, $args)
    {
        $course = $this->course->where('id', $args[1])->first();
        $courses = $this->course->where('school_id', $args[0])->get();
        $count = 0;
        for ($i = 0; $i < count($courses); $i++) {
            if ($courses[$i]->name == $value) {
                if ($courses[$i]->id != $course->id) {
                    $count++;
                }
            }
        }
        return !(bool)$count;
    }

    public function validate_uniqueCodeRoute($value, $input, $args)
    {
        $course = $this->course->where('id', $args[1])->first();
        $courses = $this->course->where('school_id', $args[0])->get();
        $count = 0;
        for ($i = 0; $i < count($courses); $i++) {
            if ($courses[$i]->code == $value) {
                if ($courses[$i]->id != $course->id) {
                    $count++;
                }
            }
        }
        return !(bool)$count;
    }
}