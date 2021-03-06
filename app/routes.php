<?php
// Routes

// $app->get('/[{name}]', function ($request, $response, $args) {
//     // Sample log message
//     $this->logger->info("Slim-Skeleton '/' route");
//     // Render index view
//     return $this->renderer->render($response, 'index.phtml', $args);
// });
$app->get('/', 'Learner\Controllers\GuestController:index')->setName('guest_welcome');
$app->post('/register', 'Learner\Controllers\GuestController:register')->setName('guest_register');
$app->post('/login', 'Learner\Controllers\GuestController:login')->setName('guest_login');
$app->post('/logout', 'Learner\Controllers\GuestController:logout')->setName('guest_login');

$app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
});

$app->group('/api/v1', function () {
    $this->get('', 'Learner\Controllers\API\APIController:index')->setName('api_welcome');

    $this->post('/roles', 'Learner\Controllers\API\Admin\Super\RolesController:store')->setName('api_roles_store');
    $this->get('/roles', 'Learner\Controllers\API\Admin\Super\RolesController:index')->setName('api_roles_index');
    $this->get('/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:show')->setName('api_roles_show');
    $this->put('/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:update')->setName('api_roles_update');
    $this->delete('/roles/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\RolesController:destroy')->setName('api_roles_delete');

    $this->post('/permissions', 'Learner\Controllers\API\Admin\Super\PermissionsController:store')->setName('api_permissions_store');
    $this->get('/permissions', 'Learner\Controllers\API\Admin\Super\PermissionsController:index')->setName('api_permissions_index');
    $this->get('/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:show')->setName('api_permissions_show');
    $this->put('/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:update')->setName('api_permissions_update');
    $this->delete('/permissions/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\PermissionsController:destroy')->setName('api_permissions_delete');


    $this->post('/users', 'Learner\Controllers\API\Admin\Super\UsersController:store')->setName('api_users_store');
    $this->get('/users', 'Learner\Controllers\API\Admin\Super\UsersController:index')->setName('api_users_index');
    $this->get('/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:show')->setName('api_users_show');
    $this->put('/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:update')->setName('api_users_update');
    $this->get('/users/me', 'Learner\Controllers\API\UsersController:me')->setName('api_users_me');
    $this->delete('/users/{id:[0-9]+}', 'Learner\Controllers\API\Admin\Super\UsersController:destroy')->setName('api_users_delete');
    $this->put('/users/{id:[0-9]+}/password', 'Learner\Controllers\API\Admin\Super\UsersController:changePassword')->setName('api_users_changePassword');

    $this->post('/schools', 'Learner\Controllers\API\Admin\SchoolsController:store')->setName('api_schools_store');
    $this->get('/schools', 'Learner\Controllers\API\Admin\SchoolsController:index')->setName('api_schools_index');
    $this->get('/schools/{id:[0-9]+}', 'Learner\Controllers\API\Admin\SchoolsController:show')->setName('api_schools_show');
    $this->get('/schools/me', 'Learner\Controllers\API\Admin\SchoolsController:me')->setName('api_schools_me');
    $this->get('/schools/mine', 'Learner\Controllers\API\Admin\SchoolsController:mine')->setName('api_schools_mine');
    $this->get('/schools/{id:[0-9]+}/members', 'Learner\Controllers\API\Admin\SchoolsController:members')->setName('api_schools_members');
    $this->get('/schools/{id:[0-9]+}/courses', 'Learner\Controllers\API\Admin\SchoolsController:courses')->setName('api_schools_courses');
    $this->get('/schools/public', 'Learner\Controllers\API\Admin\SchoolsController:publicSchools')->setName('api_schools_public');
    $this->put('/schools/{id:[0-9]+}', 'Learner\Controllers\API\Admin\SchoolsController:update')->setName('api_schools_update');
    $this->put('/schools/{id:[0-9]+}/api_settings', 'Learner\Controllers\API\Admin\SchoolsController:updateAPISettings')->setName('api_schools_updateAPISettings');
    $this->delete('/schools/{id:[0-9]+}', 'Learner\Controllers\API\Admin\SchoolsController:destroy')->setName('api_schools_delete');

    $this->post('/memberships', 'Learner\Controllers\API\Admin\MembershipsController:register')->setName('api_memberships_store');
    $this->get('/memberships/{id:[0-9]+}', 'Learner\Controllers\API\Admin\MembershipsController:show')->setName('api_memberships_show');
    $this->put('/memberships/{id:[0-9]+}', 'Learner\Controllers\API\Admin\MembershipsController:update')->setName('api_memberships_update');
    $this->delete('/memberships/{id:[0-9]+}', 'Learner\Controllers\API\Admin\MembershipsController:destroy')->setName('api_memberships_delete');

    $this->get('/courses', 'Learner\Controllers\API\Admin\CoursesController:show')->setName('api_courses_index');
    $this->post('/courses', 'Learner\Controllers\API\Admin\CoursesController:store')->setName('api_courses_store');
    $this->get('/courses/{id:[0-9]+}', 'Learner\Controllers\API\Admin\CoursesController:show')->setName('api_courses_show');
    $this->put('/courses/{id:[0-9]+}', 'Learner\Controllers\API\Admin\CoursesController:update')->setName('api_courses_update');
    $this->post('/courses/subscriptions/update', 'Learner\Controllers\API\Admin\CoursesController:subscriptions')->setName('api_courses_subscriptions_update');
    $this->post('/courses/lecturers/update', 'Learner\Controllers\API\Admin\CoursesController:lecturersAdd')->setName('api_courses_lecturers_update');

    $this->get('/categories/list', 'Learner\Controllers\API\Admin\CategoriesController:listAll')->setName('api_categories_list');


});
$app->get('/{anything:.*}', 'Learner\Controllers\GuestController:anything')->setName('guest_anything');
/*$app->get('/users/{id:[0-9]+}', function ($request, $response, $args) {
    // Find user identified by $args['id']
});*/
