<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/17/2016
 * Time: 4:04 PM
 */

namespace Learner\System;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Symfony\Component\Config\Definition\Exception\Exception;


class JWTHelper
{
    private $audience;
    private $token;
    private $signer;
    private $client_id;
    private $iss;
    private $key;
    private $user_id;
    private $user_role;
    private  $username;



    function __construct($iss, $key, $user_id, $user_role, $username, $audience = null, $client_id=null)
    {
        $this->signer = new Sha256();
        $this->key = $key;
        $this->audience=$audience;
        $this->username = $username;
        $this->user_role = $user_role;
        $this->user_id = $user_id;
        $this->iss=$iss;
        $this->client_id=$client_id;

        if ($this->audience) {

        }
    }


    /**
     * @return \Lcobucci\JWT\Token
     */
    public function generate_token(){
        $tokenId = base64_encode(mcrypt_create_iv(32));
        $this->token = (new Builder())
            ->setIssuer($this->iss)
            ->setId($tokenId, true)
            ->setAudience(is_null($this->audience)?'':$this->audience)
            ->setIssuedAt(time()) // Configures the time that the token was issue (iat claim)
            ->setNotBefore(time() + 60) // Configures the time that the token can be used (nbf claim)
            ->setExpiration(time() + 3600*60*24*30) // Configures the expiration time of the token (exp claim)
            ->set('user_id', $this->user_id)
            ->set('roles', $this->user_role)
            ->set('username', $this->username)
            ->sign($this->signer, $this->key)
            ->getToken();
        return $this->token;
    }

    public static  function parse_token($token)
    {
        $pos = strpos($token, '.');
        if($pos===false)
        {
            return false;
        }
        $token = (new Parser())->parse((string) $token);
        return $token;
    }
    public static function verify_token($token)
    {
        $data = new ValidationData();
        $parsed_token = JWTHelper::parse_token($token);
        if($parsed_token===false)
            return null;

        if(is_null($parsed_token)){
            return null;
        }else{
            $data->setIssuer($parsed_token->getClaim('iss'));
            $data->setId($parsed_token->getHeader('jti'));
            return $parsed_token->validate($data);
        }
    }

    public  static function get_token_from_header($headers)
    {
        $token = '';
        $auth_header = $headers['HTTP_AUTHORIZATION'];
        $bearer = $auth_header[0];
        $p = explode(' ', $bearer);
        if(count($p)>1){
            $token = trim($p[1]);
        }
        return $token;
    }


}