<?php

/** WP 2FA plugin data encryption key. For more information please visit melapress.com */
define( 'WP2FA_ENCRYPT_KEY', '6j1alrIi0BGW3+uzoiQr7g==' );

# Database Configuration
define( 'DB_NAME', 'wp_securityreleas' );
define( 'DB_USER', 'securityreleas' );
define( 'DB_PASSWORD', '_rdDz7oVein3iHcU90F2' );
define( 'DB_HOST', '127.0.0.1:3306' );
define( 'DB_HOST_SLAVE', '127.0.0.1:3306' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         '7DO<mE|0YagZ{-$3@:(i0;IN<+7x_u0,GkGa#vw+BnlPV2,0!r+`?]6aBcjf^0$<');
define('SECURE_AUTH_KEY',  '}S]s &f2-]+M|+-)++k!&Kk+>B|4/|Mf5)-kRSxw;5?Rv?LOT?(&RST:6a/M#)Kb');
define('LOGGED_IN_KEY',    'b<U-t8xC %-TT{(2ZwK>fFZ$r.!()4Y r@_*=E/.wc51^{/N+DYA&nHFk:q|-|0B');
define('NONCE_KEY',        'a:N0R%AmhC=]%)|9,b-}c7VL6g0^x]}9;*V!3z/V*{cUKe-(??9:JG(8x}9~--zb');
define('AUTH_SALT',        'dDK$ASh`<mMYm4WK7){J@MQ9E{65v<6*;,rK+cC~Hu|Q!{l#swiuiufdO6=zXiA*');
define('SECURE_AUTH_SALT', 'vwQi_!6<-A70-jR,>zj|zA>:>%IJl-$7_- rM?twe*T$=Q7:jhh3C`fq`fM1z&mT');
define('LOGGED_IN_SALT',   '?/ ?y#f8j*FI+?Qx$SX@d=E%4wPpS-IG<W:|!-[`kBdc*(+RNUvq,p-J1ja1N[#j');
define('NONCE_SALT',       '7+P9SMd*++#}Ex<1.PgYF]iP2(|y4@2(<M{[|.?6=b&LS@Z?M,*^cgKJcC&xe&,B');


# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'securityreleas' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'PWP_ROOT_DIR', '/nas/wp' );

define( 'WPE_APIKEY', 'e650176f0e9b054064de1a1fcdf523eee85414e5' );

define( 'WPE_CLUSTER_ID', '112313' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_LBMASTER_IP', '' );

define( 'WPE_CDN_DISABLE_ALLOWED', false );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'securityreleas.wpengine.com', 1 => 'securityreleas.wpenginepowered.com', 2 => 'securityrelease.expo-genie.com', );

$wpe_varnish_servers=array ( 0 => 'pod-112313', );

$wpe_special_ips=array ( 0 => '35.185.21.169', );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( );

define( 'DOMAIN_CURRENT_SITE', 'securityrelease.expo-genie.com' );

define( 'WPE_SFTP_ENDPOINT', '' );
define('WPLANG','');

# WP Engine ID


# WP Engine Settings




define( 'WP_ALLOW_MULTISITE', true );
define( 'MULTISITE', true );
define( 'SUBDOMAIN_INSTALL', false );
$base = '/';

define( 'PATH_CURRENT_SITE','/' );
define( 'SITE_ID_CURRENT_SITE', 1 );
define( 'BLOG_ID_CURRENT_SITE', 1 );

// define( 'WP_DEBUG', true );
// define('WP_DEBUG_DISPLAY', true);
// define('WP_DEBUG_LOG', true);

# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', __DIR__ . '/');
require_once(ABSPATH . 'wp-settings.php');














