<?php
/**
 * ACL Access Control List Class
 * User: spider
 * Date: 3/15/2016
 * Time: 5:31 PM
 */

namespace Learner\System;

use Learner\Models\User;


class ACL
{
    private $session;
    public function __construct()
    {
        $this->session = new Session;
    }

    /**
     * profile
     * Get current user profile
     * @return $user Eloquent User Model Instance
     */
    public function profile()
    {
        $user = User::find($this->session->get('user_id'));
        return $user;
    }

}