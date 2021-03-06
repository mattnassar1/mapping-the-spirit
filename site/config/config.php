<?php

/*

---------------------------------------
License Setup
---------------------------------------

Please add your license key, which you've received
via email after purchasing Kirby on http://getkirby.com/buy

It is not permitted to run a public website without a
valid license key. Please read the End User License Agreement
for more information: http://getkirby.com/license

*/

c::set( 'license', 'K2-PERSONAL-f555e903ce42fb15c6c7c7807f2bd267' );
c::set( 'autopublish.templates', array( 'book', 'category' ) );
c::set( 'scssNestedCheck', true );
c::set( 'panel.install', true );
c::set( 'cache.ignore', array( 'sitemap' ) );
// c::set('debug', true);

c::set( 'routes', array(
  array(
    'pattern' => 'story',
    'action' => function() {
      return go( page( 'home' )->url() . '/#stories' );
    }
  ),
  array(
    'pattern' => 'story/(:any)/(:any)',
    'action'  => function( $story, $item ) {
      $page = page( 'story' )->children()->find( $story )->children()->find( $item );
      if( !$page ) $page = page( 'story' )->children()->find( $story );
      if( !$page ) $page = site()->errorPage();
      return site()->visit( $page );
    }
  )
));