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

    $this->post( '/roles', 'Learner\Controllers\API\Admin\Super\RolesController:store')->setName('api_roles_store');
    $this->get( '/roles', 'Learner\Controllers\API\Admin\Super\RolesController:index')->setName('api_roles_index');
    $this->get( '/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:show')->setName('api_roles_show');
    $this->put( '/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:update')->setName('api_roles_update');
    $this->delete( '/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:destroy')->setName('api_roles_delete');

    $this->post( '/permissions', 'Learner\Controllers\API\Admin\Super\PermissionsController:store')->setName('api_permissions_store');
    $this->get( '/permissions', 'Learner\Controllers\API\Admin\Super\PermissionsController:index')->setName('api_permissions_index');
    $this->get( '/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:show')->setName('api_permissions_show');
    $this->put( '/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:update')->setName('api_permissions_update');
    $this->delete( '/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:destroy')->setName('api_permissions_delete');

    $this->post( '/users', 'Learner\Controllers\API\Admin\Super\UsersController:store')->setName('api_users_store');
    $this->get( '/users', 'Learner\Controllers\API\Admin\Super\UsersController:index')->setName('api_users_index');
    $this->get( '/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:show')->setName('api_users_show');
    $this->put( '/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:update')->setName('api_users_update');
    $this->delete( '/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:destroy')->setName('api_users_delete');


});
$app->get('/{anything:.*}','Learner\Controllers\GuestController:anything')->setName('guest_anything');
/*$app->get('/users/{id:[0-9]+}', function ($request, $response, $args) {
    // Find user identified by $args['id']
});*/
