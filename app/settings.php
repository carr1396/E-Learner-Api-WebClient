<?php
return [
  'settings' => [
    'displayErrorDetails' => true, // set to false in production
      'determineRouteBeforeAppMiddleware' => true,
    // Renderer settings
    'renderer' => [
      'template_path' => __DIR__ . '/../views/',
    ],

    // Monolog settings
    'logger' => [
      'name' => 'e_learner_web',
      'path' => __DIR__ . '/../logs/app.log',
    ],
    //database
    'db'=>[
      'driver' => 'mysql',
      'host' => '127.0.0.1',
      'database' => 'elearner_db',
      'username' => 'root',
      'password' => '64@15625',
      'charset'   => 'utf8',
      'collation' => 'utf8_unicode_ci',
      'prefix' => ''
    ],
    'jwt'=>[
      'iss' => 'http://192.168.0.121:8080/', // Configures the issuer (iss claim)
      'private_key'=>'adele_went_to_limkokwing_in_2015_as_student_11000204'
    ],
  ],
];
