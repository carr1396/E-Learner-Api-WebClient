<?php
// Routes

// $app->get('/[{name}]', function ($request, $response, $args) {
//     // Sample log message
//     $this->logger->info("Slim-Skeleton '/' route");
//     // Render index view
//     return $this->renderer->render($response, 'index.phtml', $args);
// });
$app->get('/','Learner\Controllers\GuestController:index')->setName('guest_welcome');
$app->post( '/register', 'Learner\Controllers\GuestController:register')->setName('guest_register');
$app->post( '/login', 'Learner\Controllers\GuestController:login')->setName('guest_login');
$app->post( '/logout', 'Learner\Controllers\GuestController:logout')->setName('guest_login');

$app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
});

$app->group('/api/v1', function(){
   $this->get( '', 'Learner\Controllers\API\APIController:index')->setName('api_welcome');
});
$app->get('/{anything:.*}','Learner\Controllers\GuestController:anything')->setName('guest_anything');
/*$app->get('/users/{id:[0-9]+}', function ($request, $response, $args) {
    // Find user identified by $args['id']
});*/
