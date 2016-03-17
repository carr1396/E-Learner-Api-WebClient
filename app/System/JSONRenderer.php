<?php
/**
 * Created by PhpStorm.
 * User: farid
 * Date: 3/17/2016
 * Time: 3:12 AM
 */

namespace Learner\System;


use \Psr\Http\Message\ResponseInterface;
/**
 * JsonRenderer
 *
 * Render JSON view into a PSR-7 Response object
 */
class JSONRenderer
{
    /**
     *
     * @param ResponseInterface $response
     * @param int $statusCode
     * @param array $data
     *
     * @return ResponseInterface
     *
     * @throws \InvalidArgumentException
     * @throws \RuntimeException
     */
    public function render(ResponseInterface $response, $statusCode = 200, array $data = [], $status=null)
    {
        $newResponse = $response->withHeader('Content-Type', 'application/json');

        if($statusCode==440)
        {
            $newResponse = $newResponse->withStatus(440, 'Token Invalid Or Expired');
        }else{
            $newResponse = $newResponse->withStatus($statusCode);
        }

        $newResponse->getBody()->write(json_encode($data));
        return $newResponse;
    }
}