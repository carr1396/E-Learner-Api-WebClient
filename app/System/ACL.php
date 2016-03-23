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
        $user = null;
        if(isset($_SESSION['token']))
        {
            $token = JWTHelper::parse_token($_SESSION['token']);
            $user_id=$token->getClaim('user_id');
            $user = User::with('roles')->find($user_id);
        }else if(isset($_SESSION['user_id'])){

            $user = User::with('roles')->find($_SESSION['user_id']);
        }
        return $user;
    }

    public function isLogged()
    {
        if (isset($_SESSION['token'])) {
            return true;
        }
    }
}