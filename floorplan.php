<?php

/**
 * Plugin Name: Floor Plan
 * Plugin URI: https://github.com/QasimRiaz/Floorplan
 * Description: Floor Plan.
 * Version: 1.3
 * Author: E2ESP
 * Author URI: http://expo-genie.com/
 * GitHub Plugin URI: https://github.com/QasimRiaz/Floorplan
 * License: ExpoGenie
 * Text Domain: ExpoGenie
 * Network:           true
*/



if($_GET['floorplanRequest'] == "savedfloorplansettings") { 
    
    require_once('../../../wp-load.php');
    
    getBoothList($_POST);
    die();
    
    
}else if($_GET['floorplanRequest'] == "getallboothtypes"){
    
    
    require_once('../../../wp-load.php');
    
    getBoothtypesList($_POST);
    die();
    
}else if($_GET['floorplanRequest'] == "savedalllegendstypes"){
    
    
    require_once('../../../wp-load.php');
    
    savedalllegendstypes($_POST);
    die();
    
}


function savedalllegendstypes($Dataarray){
    
    try{
	
        $id = $Dataarray['post_id'];
        update_post_meta( $id, 'legendlabels', $Dataarray['legendstypesArray'] );
        echo 'update';
    }catch (Exception $e) {
       
     
        return $e;
        
    }
    
}


add_action( 'wp_enqueue_scripts', 'ajax_test_enqueue_scripts' );
function ajax_test_enqueue_scripts() {
	

	

	wp_localize_script( 'love', 'postlove', array(
		'ajax_url' => admin_url( 'admin-ajax.php' )
	));

}



add_action( 'wp_ajax_nopriv_post_love_add_love', 'post_love_add_love' );
//add_action( 'wp_ajax_nopriv_getBoothList', 'getBoothList' );
add_action( 'wp_ajax_nopriv_getExhibitordata', 'getExhibitordata' );
add_action( 'wp_ajax_nopriv_getPresetList', 'getPresetList' );

add_action( 'wp_ajax_post_love_add_love', 'post_love_add_love' );
//add_action( 'wp_ajax_getBoothList', 'getBoothList' );
add_action( 'wp_ajax_getExhibitordata', 'getExhibitordata' );
add_action( 'wp_ajax_getPresetList', 'getPresetList' );

function sanitize($str, $quotes = ENT_NOQUOTES){  
   $str = htmlspecialchars($str, $quotes);
   return $str;
}

function post_love_add_love() {
	$boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
	$boothTypes2 = json_decode($boothTypes, true);
	
	$boothArray = $_REQUEST['boothArray'];
	$boothTypes2[] = $boothArray[0];
	
	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) { 
		update_post_meta( $_REQUEST['post_id'], 'booth_types', json_encode($boothTypes2) );
		print_r($boothTypes2);
		die();
	}
	else {
		wp_redirect( get_permalink( $_REQUEST['post_id'] ) );
		exit();
	}
}


function getPresetList() {
	
	//echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
	$presetname = $_REQUEST['presetname'];

	$floorplan_id =$_REQUEST['floorplanid'];

	update_post_meta( $_REQUEST['post_id'], 'booth_types', trim($boothTypes) );
	update_post_meta( $_REQUEST['post_id'], 'floor_background', $_REQUEST['floorBG'] );
	update_post_meta( $_REQUEST['post_id'], 'floorplan_xml', $_REQUEST['floorXml'] );
	
        $presetarray = get_post_meta( $floorplan_id, 'booth_types', true );
        $preset_dataarray = json_decode($presetarray);
        $responce_message['status'] = 'clear';
                
        
        foreach($preset_dataarray[0] as $keys =>$value){
            
            if($keys=='style'){
                
                
                $get_presetname =  explode(";",$value);
                
                foreach ($get_presetname as $key=>$newvalue){
                    
                    if($newvalue == 'presetName='.$presetname){
                        $responce_message['status'] = 'alreadyexist';
                        break;
                    }
                    
                }
                
                
                
                
            }
        }
        
        echo json_encode($responce_message);
        
	die();
}


function getBoothtypesList($postdata) {
	
	//echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
    try{
	
        $id = $postdata['post_id'];
        
        
        $boothTypesLegend = get_post_meta($id, 'legendlabels', true );
        
        if(empty($boothTypesLegend)){
           $singleuserdata = 'empty';
        }else{
            
            $singleuserdata = json_encode($boothTypesLegend);
            
        }
        
        echo $singleuserdata;
        
    }catch (Exception $e) {
       
     
        return $e;
        
    }
	die();
}


function getBoothList($postdata) {
	
	//echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
    try{
	$boothTypes = $postdata['boothTypes'];
       // $boothTypes = json_encode($boothTypes);
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);  
        
        
        $lastInsertId = floorplan_contentmanagerlogging('Floor Plan Settings Saved',"Admin Action","",$user_ID,$user_info->user_email,$postdata);
      
        
        
	update_post_meta( $postdata['post_id'], 'booth_types', trim($boothTypes) );
	update_post_meta( $postdata['post_id'], 'floor_background', $postdata['floorBG'] );
	update_post_meta( $postdata['post_id'], 'floorplan_xml', $postdata['floorXml'] );
        
        
    }catch (Exception $e) {
       
        //contentmanagerlogging_file_upload ($lastInsertId,serialize($e));
        return $e;
        
    }
	die();
}


function getExhibitordata() {
	
	//echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
        
	$user_id = $_REQUEST['user_id'];
       
        $user_data = get_userdata($user_id);
        $all_meta_for_user = get_user_meta($user_id);
        
        if(isset($all_meta_for_user['first_name'][0])){
            $userdataarray['first_name'] = $all_meta_for_user['first_name'][0];
        }else{
            
             $userdataarray['first_name'] = '';
        }
        
        if(isset($all_meta_for_user['lanme'][0])){
            $userdataarray['lanme'] = $all_meta_for_user['lanme'][0];
        }else{
            
             $userdataarray['lanme'] = '';
        }
        if(isset($all_meta_for_user['wp_capabilities'][0])){
            
            $rolename =  unserialize ($all_meta_for_user['wp_capabilities'][0]);
            foreach ($rolename as $key=>$index){
                $rolename_name = $key;
                break;
            }
            
          
            $userdataarray['wp_capabilities'] =$rolename_name;
        }else{
            
             $userdataarray['wp_capabilities'] = '';
        }
        if(isset($all_meta_for_user['nickname'][0])){
            $userdataarray['nickname'] = $all_meta_for_user['nickname'][0];
        }else{
            
             $userdataarray['nickname'] = '';
        }
         if(isset($all_meta_for_user['prefix'][0])){
            $userdataarray['prefix'] = $all_meta_for_user['prefix'][0];
        }else{
            
             $userdataarray['prefix'] = '';
        } if(isset($all_meta_for_user['address_line_1'][0])){
            $userdataarray['address_line_1'] = $all_meta_for_user['address_line_1'][0];
        }else{
            
             $userdataarray['address_line_1'] = '';
        } if(isset($all_meta_for_user['address_line_2'][0])){
            $userdataarray['address_line_2'] = $all_meta_for_user['address_line_2'][0];
        }else{
            
             $userdataarray['address_line_2'] = '';
        }
        
        if(isset($all_meta_for_user['usercity'][0])){
            $userdataarray['usercity'] = $all_meta_for_user['usercity'][0];
        }else{
            
             $userdataarray['usercity'] = '';
        }if(isset($all_meta_for_user['userstate'][0])){
            $userdataarray['userstate'] = $all_meta_for_user['userstate'][0];
        }else{
            
             $userdataarray['userstate'] = '';
        }if(isset($all_meta_for_user['usercountry'][0])){
            $userdataarray['usercountry'] = $all_meta_for_user['usercountry'][0];
        }else{
            
             $userdataarray['usercountry'] = '';
        }if(isset($all_meta_for_user['user_phone_1'][0])){
            $userdataarray['user_phone_1'] = $all_meta_for_user['user_phone_1'][0];
        }else{
            
             $userdataarray['user_phone_1'] = '';
        }
        
        if(isset($all_meta_for_user['user_phone_2'][0])){
            $userdataarray['user_phone_2'] = $all_meta_for_user['user_phone_2'][0];
        }else{
            
             $userdataarray['user_phone_2'] = '';
        }if(isset($all_meta_for_user['reg_codes'][0])){
            $userdataarray['reg_codes'] = $all_meta_for_user['reg_codes'][0];
        }else{
            
             $userdataarray['reg_codes'] = '';
        }if(isset($all_meta_for_user['usernotes'][0])){
            $userdataarray['usernotes'] = $all_meta_for_user['usernotes'][0];
        }else{
            
             $userdataarray['usernotes'] = '';
        }
        if(isset($all_meta_for_user['userzipcode'][0])){
            $userdataarray['userzipcode'] = $all_meta_for_user['userzipcode'][0];
        }else{
            
             $userdataarray['userzipcode'] = '';
        }
        
       
        
        
        $singleuserdata = json_encode($userdataarray);

	echo $singleuserdata; exit;
	
	die();
        
}


function getAllusers_data(){
         global $wpdb;
        $args['role__not_in']= 'Administrator';
        $user_query = new WP_User_Query( $args );
        $authors = $user_query->get_results();
        $index = 1;
        $site_prefix = $wpdb->get_blog_prefix();
        sort($authors);
        $cart = array();
        foreach ($authors as $aid) {
        
            $user_data = get_userdata($aid->ID);
            $index = $aid->ID;
            $all_meta_for_user = get_user_meta($aid->ID);
           
             
            if (!in_array("administrator", $user_data->roles)) {
                
                if($all_meta_for_user[$site_prefix.'company_name'][0] == null || empty($all_meta_for_user[$site_prefix.'company_name'][0])){
                    
                    
                }else{
                    
                    
                
                
                $allUsersData[$index]['companyname'] = $all_meta_for_user[$site_prefix.'company_name'][0];
                $allUsersData[$index]['companylogourl'] = $all_meta_for_user[$site_prefix.'user_profile_url'][0];
                $allUsersData[$index]['exhibitorsid'] = $aid->ID;
                
                if(isset($all_meta_for_user['first_name'][0])){
                    $allUsersData[$index]['first_name'] = $all_meta_for_user['first_name'][0];
                }else{
            
                    $allUsersData[$index]['first_name'] = '';
                }       
        
                if(isset($all_meta_for_user['lanme'][0])){
                    $allUsersData[$index]['lanme'] = $all_meta_for_user['lanme'][0];
                }else{

                     $allUsersData[$index]['lanme'] = '';
                }
                if(isset($all_meta_for_user['wp_capabilities'][0])){

                    $rolename =  unserialize ($all_meta_for_user['wp_capabilities'][0]);
                    foreach ($rolename as $keyy=>$indexx){
                        $rolename_name = $keyy;
                        break;
                    }


                    $allUsersData[$index]['wp_capabilities'] =$rolename_name;
                }else{

                     $allUsersData[$index]['wp_capabilities'] = '';
                }
                if(isset($all_meta_for_user['nickname'][0])){
                    $allUsersData[$index]['nickname'] = $all_meta_for_user['nickname'][0];
                }else{

                     $allUsersData[$index]['nickname'] = '';
                }
                 if(isset($all_meta_for_user['prefix'][0])){
                    $allUsersData[$index]['prefix'] = $all_meta_for_user['prefix'][0];
                }else{

                     $allUsersData[$index]['prefix'] = '';
                } if(isset($all_meta_for_user['address_line_1'][0])){
                    $allUsersData[$index]['address_line_1'] = $all_meta_for_user['address_line_1'][0];
                }else{

                     $allUsersData[$index]['address_line_1'] = '';
                } if(isset($all_meta_for_user['address_line_2'][0])){
                    $allUsersData[$index]['address_line_2'] = $all_meta_for_user['address_line_2'][0];
                }else{

                     $allUsersData[$index]['address_line_2'] = '';
                }

                if(isset($all_meta_for_user['usercity'][0])){
                    $allUsersData[$index]['usercity'] = $all_meta_for_user['usercity'][0];
                }else{

                     $allUsersData[$index]['usercity'] = '';
                }if(isset($all_meta_for_user['userstate'][0])){
                    $allUsersData[$index]['userstate'] = $all_meta_for_user['userstate'][0];
                }else{

                     $allUsersData[$index]['userstate'] = '';
                }if(isset($all_meta_for_user['usercountry'][0])){
                    $allUsersData[$index]['usercountry'] = $all_meta_for_user['usercountry'][0];
                }else{

                     $allUsersData[$index]['usercountry'] = '';
                }if(isset($all_meta_for_user['user_phone_1'][0])){
                    $allUsersData[$index]['user_phone_1'] = $all_meta_for_user['user_phone_1'][0];
                }else{

                     $allUsersData[$index]['user_phone_1'] = '';
                }

                if(isset($all_meta_for_user['user_phone_2'][0])){
                    $allUsersData[$index]['user_phone_2'] = $all_meta_for_user['user_phone_2'][0];
                }else{

                     $allUsersData[$index]['user_phone_2'] = '';
                }
                if(isset($all_meta_for_user['userzipcode'][0])){
                    $allUsersData[$index]['userzipcode'] = $all_meta_for_user['userzipcode'][0];
                }else{

                     $allUsersData[$index]['userzipcode'] = '';
                }
               
                //array_push($cart,$allUsersData);

            }
            
           } 
            
        }
        
        
        if(!empty($allUsersData)){ 
        usort($allUsersData, 'compareByName');
        
        }
       
        return $allUsersData;
    
    
    
}

function compareByName($a, $b) {
  return strcmp($a["companyname"], $b["companyname"]);
}


function array_msort($array, $cols)
{
    $colarr = array();
    foreach ($cols as $col => $order) {
        $colarr[$col] = array();
        foreach ($array as $k => $row) { $colarr[$col]['_'.$k] = strtolower($row[$col]); }
    }
    $eval = 'array_multisort(';
    foreach ($cols as $col => $order) {
        $eval .= '$colarr[\''.$col.'\'],'.$order.',';
    }
    $eval = substr($eval,0,-1).');';
    eval($eval);
    $ret = array();
    foreach ($colarr as $col => $arr) {
        foreach ($arr as $k => $v) {
            $k = substr($k,1);
            if (!isset($ret[$k])) $ret[$k] = $array[$k];
            $ret[$k][$col] = $array[$k][$col];
        }
    }
    return $ret;

}

function floorplan_shortcode( $atts, $content = null ) {
    
    
    $floorplanstatus = false;
    if (current_user_can('administrator') || current_user_can('contentmanager')) {
		$floorplanstatus = true;
	}else{
		if($atts['status'] == 'viewer'){
			
			$floorplanstatus = true;
			
			
		}
		
	}
	if($floorplanstatus == true){
		
	extract(shortcode_atts(array("id" => '',"status" =>''), $atts));
        $getAllusers_data = addslashes(json_encode(getAllusers_data()));
        
        $contentmanager_settings = get_option( 'ContenteManager_Settings' );
	$id = $contentmanager_settings['ContentManager']['floorplanactiveid'];
        
         if(empty($id)){
              
            // Gather post data.
            $my_post = array(
                'post_title' => 'Defualt Floor Plan',
                'post_content' => '',
                'post_status' => '',
                'post_author' => 1,
                'post_type'=>'floor_plan',
               
            );

            // Insert the post into the database.
               $id = wp_insert_post($my_post);
               $contentmanager_settings['ContentManager']['floorplanactiveid'] = $id;
           
            $boothTypes ="[";
            
            $boothTypes.='{"width":100,"height":100,"style":"DefaultStyle1;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;shadow=0;"},';
            
            $boothTypes.='{"width":200,"height":200,"style":"DefaultStyle2;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;shadow=0;"},';
            
            $boothTypes.='{"width":300,"height":200,"style":"DefaultStyle3;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;shadow=0;"}';
            
            $boothTypes.=']';
            
            $FloorBackground = '';
            
            
            $legendlabel = "[";
            $legendlabel.='{"ID":1,"colorstatus":true,"name":"Gold","colorcode":#00000},';
            $legendlabel.='{"ID":2,"colorstatus":true,"name":"Sliver","colorcode":#00000},';
            $legendlabel.='{"ID":3,"colorstatus":true,"name":"Red","colorcode":#00000}';
           
            $legendlabel .= "]";
            
            $FloorplanXml = '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="2175" pageHeight="2175" ><root></root></mxGraphModel>';
            
               update_option( 'ContenteManager_Settings', $contentmanager_settings );
               update_post_meta( $id, 'booth_types', $boothTypes );
               update_post_meta( $id, 'floor_background', $FloorBackground);
               update_post_meta( $id, 'floorplan_xml', $FloorplanXml );
               update_post_meta( $id, 'legendlabels', $legendlabel );
            
             
         }
        
        
       
        
            $boothTypes = get_post_meta( $id, 'booth_types', true );
            $FloorBackground = get_post_meta( $id, 'floor_background', true );
            $FloorplanXml = get_post_meta( $id, 'floorplan_xml', true );
            $FloorplanLegends = get_post_meta( $id, 'legendlabels', true );

        
        
        $current_site_logo = $contentmanager_settings['ContentManager']['adminsitelogo'];
        $current_site_name = get_bloginfo( 'name' );
        $current_site_url  = get_site_url();
        $current_floor_plan_status  = $status;
        
	
	include 'functions.php';
    
        
    }else {
        
        $redirect = get_site_url();
        wp_redirect($redirect);
        exit;
    }
	
}
add_shortcode( 'floorplan', 'floorplan_shortcode' );


function floorplan_contentmanagerlogging($acction_name,$action_type,$pre_action_data,$user_id,$email,$result){

    
//require_once('../../../wp-load.php');
   
global $wpdb;
$blog_id =get_current_blog_id();
   if(get_current_blog_id() == 1){
        $tablename = 'contentmanager_log';
    }else{
    
        $tablename = 'contentmanager_'.$blog_id.'_log';
    } 
$_SERVER['currentuseremail'] = $email;
$postArrayData['UserInfo'] = $_SERVER ;
$emailwithIPAddress = $email.'---'.$_SERVER['REMOTE_ADDR'];
$postArrayData['requestData'] = unserialize($pre_action_data) ;

$postArrayData = serialize($postArrayData);
$query = "INSERT INTO ".$tablename." (action_name, action_type,pre_action_data,user_id,user_email,result) VALUES (%s,%s,%s,%s,%s,%s)";
$wpdb->query($wpdb->prepare($query, $acction_name, $action_type,$postArrayData,$user_id,$emailwithIPAddress,$result));
$lastInsertId = $wpdb->insert_id;
return $lastInsertId;

}
include_once('updater.php');


if (is_admin()) { // note the use of is_admin() to double check that this is happening in the admin
        $config = array(
            'slug' => plugin_basename(__FILE__), // this is the slug of your plugin
            'proper_folder_name' => 'floorplan', // this is the name of the folder your plugin lives in
            'api_url' => 'https://api.github.com/repos/QasimRiaz/Floorplan', // the GitHub API url of your GitHub repo
            'raw_url' => 'https://raw.github.com/QasimRiaz/Floorplan/master', // the GitHub raw url of your GitHub repo
            'github_url' => 'https://github.com/QasimRiaz/Floorplan', // the GitHub url of your GitHub repo
            'zip_url' => 'https://github.com/QasimRiaz/Floorplan/zipball/master', // the zip url of the GitHub repo
            'sslverify' => true, // whether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details
            'requires' => '3.0', // which version of WordPress does your plugin require?
            'tested' => '3.3', // which version of WordPress is your plugin tested up to?
            'readme' => 'README.md', // which file to use as the readme for the version number
            'access_token' => '', // Access private repositories by authorizing under Appearance > GitHub Updates when this example plugin is installed
        );
        new WP_GitHub_floorplan_Updater($config);
    }


?>

