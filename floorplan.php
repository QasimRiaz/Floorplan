<?php

/**
 * Plugin Name: Floor Plan
 * Plugin URI: https://github.com/QasimRiaz/Floorplan
 * Description: Floor Plan.
 * Version: 3.3
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
    
}else if($_GET['floorplanRequest'] == "savedallpricetegs"){
    
    
    require_once('../../../wp-load.php');
    
    savedallpricetegs($_POST);
    die();
    
}else if($_GET['floorplanRequest'] == "getproductdetail"){
    
    
    require_once('../../../wp-load.php');
    
    getproductdetail($_REQUEST);
    die();
    
}else if($_GET['floorplanRequest'] == "savedlockunlockstatus"){
    
    
    require_once('../../../wp-load.php');
    
    savedlockunlockstatus($_REQUEST);
    die();
    
}else if($_GET['floorplanRequest'] == "createnewfloorplan"){
    
    
    require_once('../../../wp-load.php');
    
    createnewfloorplan($_REQUEST);
    die();
    
}



function woo_in_cart($product_id) {
    
    global $woocommerce;
 
    foreach($woocommerce->cart->get_cart() as $key => $val ) {
        $_product = $val['data'];
 
        if($product_id == $_product->id ) {
            return true;
        }
    }
 
    return false;
}

function createnewfloorplan($postData){
    
    try{
	
        
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);  
        $lastInsertId = floorplan_contentmanagerlogging('Add New Floor Plan',"Admin Action",$postData,$user_ID,$user_info->user_email,"");
        
        $digits = 6;
        $floorplandefaultname ="Floor Plan - ".rand(pow(10, $digits-1), pow(10, $digits)-1);
        
        if(!empty($postData['loadedfloorplantitle'])){
            
            $floorplandefaultname = $postData['loadedfloorplantitle'];
            
        }
        
            // Gather post data.
            $my_post = array(
                'post_title' => $floorplandefaultname,
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
            
            $FloorplanXml[0] = '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="2175" pageHeight="2175" ><root></root></mxGraphModel>';
            
            //   update_option( 'ContenteManager_Settings', $contentmanager_settings );
               update_post_meta( $id, 'booth_types', $boothTypes );
               update_post_meta( $id, 'floor_background', $FloorBackground);
               update_post_meta( $id, 'floorplan_xml', $FloorplanXml[0] );
               update_post_meta( $id, 'legendlabels', $legendlabel );
               update_post_meta( $id, 'floorplantitle', 'Defualt Floor Plan' );
               update_post_meta( $id, 'legendlabels', "" );
               update_post_meta( $id, 'pricetegs', "" );
               update_post_meta( $id, 'sellboothsjson', "" );
               update_post_meta( $id, 'updateboothpurchasestatus', "" );
             
        
        contentmanagerlogging_file_upload ($lastInsertId,serialize($post_request));
        
        echo $id;
        
        
    }catch (Exception $e) {
       
     
        return $e;
        
    }
    
}



function savedlockunlockstatus($post_request){
    
    try{
	
        
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);  
        $lastInsertId = floorplan_contentmanagerlogging('Save All Price Tags',"Admin Action",$post_request,$user_ID,$user_info->user_email,"");
      
        update_post_meta( $post_request['post_id'], 'updateboothpurchasestatus', $post_request['status'] );
        
        contentmanagerlogging_file_upload ($lastInsertId,serialize($post_request));
        
        echo 'update';
        
        
    }catch (Exception $e) {
       
     
        return $e;
        
    }
    
}

function getproductdetail($productID){
    
    try{
	
        $id = $productID['pro_id'];
        
        
        
        
        $floorplanID = $productID['floorplanID'];
        $woocommerce_rest_api_keys = get_option( 'ContenteManager_Settings' );
        $wooconsumerkey = $woocommerce_rest_api_keys['ContentManager']['wooconsumerkey'];
        $wooseceretkey = $woocommerce_rest_api_keys['ContentManager']['wooseceretkey'];
        
        require_once( 'lib/woocommerce-api.php' );
        $url = get_site_url();
        $options = array(
             'debug'           => true,
             'return_as_array' => false,
             'validate_url'    => false,
             'timeout'         => 30,
             'ssl_verify'      => false,
         );
        $client = new WC_API_Client( $url, $wooconsumerkey, $wooseceretkey, $options );
        $get_product = wc_get_product( $id );
        
       
        
        if(empty($get_product)){
            
            $productdetail['productstatus'] =  'removed';
        }else{
            
            $productdetail['productstatus'] =  'exist';
        }
        
        $productdetail['title'] =  addslashes($get_product->name);
        $productdetail['slug'] =  $get_product->slug;
        $productdetail['description'] =  $get_product->description;
        $productdetail['price'] =  (int)$get_product->regular_price;
        $productdetail['stockstatus'] =  $get_product->stock_status;
        $productdetail['currencysymbole'] =  get_woocommerce_currency_symbol( $currency );
        
        $levelname =  $get_product->tax_class;
        
        
        
         global $wp_roles;
            $all_roles = $wp_roles->roles;
            foreach ($all_roles as $key => $name) {
                
                if ($levelname == $key ) {
                    
                     $productdetail['level'] = $name['name'];
                }
            }
         
         
        
      
        
        if(!empty($get_product->image_id)){
            
             $productdetail['src'] = wp_get_attachment_thumb_url($get_product->image_id);
            
        }else{
            
        
        $productdetail['src'] =  $url.'/wp-content/plugins/floorplan/icon01.png';
        
        }
        
        
       $productdetail['floorplanstatus'] =  get_post_meta($floorplanID, 'updateboothpurchasestatus', true );
        
       if(woo_in_cart($id)) {
            
          $productdetail['status'] = 'alreadyexistproduct';
            
            
        }else{
            
            $productdetail['status'] = 'unassigned';
        }
       
       echo json_encode($productdetail);
       exit;
      
        
        
        
        
    }catch (Exception $e) {
       
     
        return $e;
        
    }
    
}


function savedallpricetegs($Dataarray){
    
    try{
	
        $id = $Dataarray['post_id'];
        
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);  
        $lastInsertId = floorplan_contentmanagerlogging('Save All Price Tags',"Admin Action",$Dataarray,$user_ID,$user_info->user_email,"");
      
        update_post_meta( $id, 'pricetegs', $Dataarray['pricetegsArray'] );
        contentmanagerlogging_file_upload ($lastInsertId,serialize($Dataarray['pricetegsArray']));
        echo 'update';
        
    }catch (Exception $e) {
       
     
        return $e;
        
    }
    
}
function savedalllegendstypes($Dataarray){
    
    try{
	$user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);  
        $lastInsertId = floorplan_contentmanagerlogging('Save All Legends Labels',"Admin Action",$Dataarray,$user_ID,$user_info->user_email,"");
      
        $id = $Dataarray['post_id'];
        update_post_meta( $id, 'legendlabels', $Dataarray['legendstypesArray'] );
         contentmanagerlogging_file_upload ($lastInsertId,serialize($Dataarray['pricetegsArray']));
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
        update_post_meta( $postdata['post_id'], 'sellboothsjson', $postdata['sellboothsjson'] );
        $my_post = array(
            'ID'           => $postdata['post_id'],
            'post_title'   => $postdata['loadedfloorplantitle']
           
            );


         wp_update_post( $my_post );
       
        
        
        if(!empty($postdata['sellboothsjson'])){
            
            
            
            
            require_once plugin_dir_path( __DIR__ ) . 'EGPL/includes/floorplan-manager.php';
            $demo = new FloorPlanManager();
            $defaultImage = get_site_url()."/wp-content/plugins/floorplan/icon01.png";
            $productpicID = floorplanBoothImage($defaultImage);
           
            
            $responce = $demo->createAllBoothPorducts($postdata['post_id'],$postdata['sellboothsjson'],$postdata['floorXml'],$productpicID);exit;
            
            
        }
        
        
        
        
        
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
        
        $args = array(
            'posts_per_page'   => -1,
            'orderby'          => 'date',
            'order'            => 'DESC',
            'post_type'        => 'egpl_custome_tasks',
            'post_status'      => 'draft',
	);
        $taskkeyContent = get_posts( $args );
        
        foreach($taskkeyContent as $taskIndex=>$taskObject){
            
            
            
            $taskID = $taskObject->ID;
            $key = get_post_meta( $taskID, 'key', true);
            $TaskCode = get_post_meta( $taskID, 'taskCode', true);
            $value_label = get_post_meta( $taskID, 'label' , false);
            if($TaskCode != ""){
                
                $MappedKeys[$TaskCode]  = $key;
                
            }
            
        }
       
        
        
        foreach ($authors as $aid) {
        
            $user_data = get_userdata($aid->ID);
            $index = $aid->ID;
            $all_meta_for_user = get_user_meta($aid->ID);
           
             
            if (!in_array("administrator", $user_data->roles)) {
                
                if($all_meta_for_user[$site_prefix.'company_name'][0] == null || empty($all_meta_for_user[$site_prefix.'company_name'][0])){
                    
                    
                }else{
                    
                    
                foreach($MappedKeys as $mappedIndex=>$maapedObject){
                    
                      
                     if($mappedIndex == 'COL'){
                         
                         $getLogoURL = unserialize($all_meta_for_user[$maapedObject][0]);
                         
                         
                         $allUsersData[$index][$mappedIndex] = $getLogoURL['url'];
                         
                     }else{
                        
                         $allUsersData[$index][$mappedIndex] = $all_meta_for_user[$maapedObject][0];
                     
                     }
                    
                    
                }
              
                $allUsersData[$index]['companyname'] = ucfirst($all_meta_for_user[$site_prefix.'company_name'][0]);
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
        uasort($allUsersData, 'compareByName');
        
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
    
    
    
    if(isset($_GET['floorplanID'])){
        
        
        $id = $_GET['floorplanID'];
        
    }else{
        
        $id = "default";
    }
    
   
    
    $floorplanstatus = false;
    if (current_user_can('administrator') || current_user_can('contentmanager')) {
		$floorplanstatus = true;
	}else{
		if($atts['status'] == 'viewer'){
			
			$floorplanstatus = true;
			
			
		}
		
	}
	if($floorplanstatus == true){
		
	extract(shortcode_atts(array("iid" => '',"status" =>''), $atts));
        $getAllusers_data = addslashes(json_encode(getAllusers_data()));
        
       
        
        if($id == "default"){
         
            $contentmanager_settings = get_option( 'ContenteManager_Settings' );
            $id = $contentmanager_settings['ContentManager']['floorplanactiveid'];
            $wooconsumerkey = $contentmanager_settings['ContentManager']['wooconsumerkey'];
            $wooseceretkey = $contentmanager_settings['ContentManager']['wooseceretkey'];
        
        }
        
        
        $args_floorplan = array(
                 'posts_per_page'   => -1,
                 'orderby'          => 'date',
                 'order'            => 'DESC',
                 'post_type'        => 'floor_plan',
                 'post_status'      => 'draft',

            );
        $getlistofallpostsFloorplan = get_posts( $args_floorplan );
       
         foreach ($getlistofallpostsFloorplan as $listfloorplanindex => $listfloorplanValue) {
                
                
                $listoffloorplan[$listfloorplanValue->ID]=$listfloorplanValue->post_title;
                
            }
            
            $listoffloorplan = json_encode($listoffloorplan);
        
        if(empty($id) || $id == 'new'){
              
            // Gather post data.
            
            $digits = 6;
        $floorplandefaultname ="Floor Plan - ".rand(pow(10, $digits-1), pow(10, $digits)-1);
        
        
            
            $my_post = array(
                'post_title' => $floorplandefaultname, 
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
            
            $FloorplanXml[0] = '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="2175" pageHeight="2175" ><root></root></mxGraphModel>';
            
              // update_option( 'ContenteManager_Settings', $contentmanager_settings );
               update_post_meta( $id, 'booth_types', $boothTypes );
               update_post_meta( $id, 'floor_background', $FloorBackground);
               update_post_meta( $id, 'floorplan_xml', $FloorplanXml[0] );
               update_post_meta( $id, 'legendlabels', $legendlabel );
               update_post_meta( $id, 'floorplantitle', 'Defualt Floor Plan' );
               update_post_meta( $id, 'legendlabels', "" );
               update_post_meta( $id, 'pricetegs', "" );
               update_post_meta( $id, 'sellboothsjson', "" );
               update_post_meta( $id, 'updateboothpurchasestatus', "" );
             
         }
        
        
         
            $boothsproductsData;
            $boothTypes        = get_post_meta( $id, 'booth_types', true );
            $FloorBackground   = get_post_meta( $id, 'floor_background', true );
            $FloorplanXml[0]   = get_post_meta( $id, 'floorplan_xml', true );
            $FloorplanLegends  = get_post_meta( $id, 'legendlabels', true );
            $mxPriceTegsObject = get_post_meta( $id, 'pricetegs', true );
            $sellboothsjson = get_post_meta( $id, 'sellboothsjson', true );
            $floorplanstatuslockunlock = get_post_meta( $id, 'updateboothpurchasestatus', true );
            
            
            
            
           
            
           
           
            $args = array(
                 'posts_per_page'   => -1,
                 'orderby'          => 'date',
                 'order'            => 'DESC',
                 'post_type'        => 'egpl_custome_tasks',
                 'post_status'      => 'draft',

            );
            $taskkeyContent = get_posts( $args );
             
            foreach ($taskkeyContent as $taskindex => $taskValue) {
                
                $tasksID = $taskValue->ID;
                $value_key = get_post_meta( $tasksID, 'key', true);
                $value_label = get_post_meta( $tasksID, 'label' , true);
                $arrayoftasks[$tasksID] = $value_label;
                
            }
            $arrayoftasks = json_encode($arrayoftasks);
            global $wp_roles;
            $all_roles = $wp_roles->roles;
            foreach ($all_roles as $key => $name) {
                
                if ($key != 'administrator' && $key != 'contentmanager' && $key != 'subscriber') {
                    
                     $arrayoflevels[$key] = $name['name'];
                }
            }
            $arrayoflevels = json_encode($arrayoflevels);
            if(!empty($wooconsumerkey) && !empty($wooseceretkey)){
                
                require_once( 'lib/woocommerce-api.php' );
                $url = get_site_url();
                $options = array(
                    'debug' => true,
                    'return_as_array' => false,
                    'validate_url' => false,
                    'timeout' => 30,
                    'ssl_verify' => false,
                );
                $woocommerce_object = new WC_API_Client( $url, $wooconsumerkey, $wooseceretkey, $options );
                $all_products= $woocommerce_object->products->get( '', ['filter[limit]' => -1,'filter[post_status]' => 'any']);
               
                $indexProduct = 0;
                 foreach ($all_products->products as $single_product) {
                    
                    
                    
                     
                     
                     
                    if($single_product->categories[0] == 'Booths'){
                     $boothsproductsData[$indexProduct]['title'] = $single_product->title;
                     $boothsproductsData[$indexProduct]['id'] = $single_product->id;
                     $boothsproductsData[$indexProduct]['price'] = (int)$single_product->price;
                     $indexProduct++;
                    }
                     
                }
                
                 
               $boothsproductsData = json_encode($boothsproductsData);
               
              
                 
            }
        
        
         
            
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

    
// Create post object
$activitylog = array(
  'post_title'    => wp_strip_all_tags( $acction_name ),
  'post_content'  => "",
  'post_status'   => 'publish',
  'post_author'   => $user_id,
  'post_type'=>'expo_genie_log'
);
 

 $logID = wp_insert_post( $activitylog );
 $_SERVER['currentuseremail'] = $email;
 update_post_meta( $logID, 'action-type-name', $action_type );
 update_post_meta( $logID, 'pre-action-data', $pre_action_data );
 update_post_meta( $logID, 'current-user-info', $_SERVER );
 update_post_meta( $logID, 'currentuseremail', $email );
 update_post_meta( $logID, 'ip-address', $_SERVER['REMOTE_ADDR'] );
 update_post_meta( $logID, 'browser-agent', $_SERVER['HTTP_USER_AGENT'] );
 update_post_meta( $logID, 'final-result', $result );
 update_post_meta( $logID, 'request-data-and-time',  date("Y-m-d H:i:s") );
 return $logID;
 

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

    
/* Add image to media library from URL and return the new image ID */
function floorplanBoothImage($url) {

  // Gives us access to the download_url() and wp_handle_sideload() functions
  require_once( ABSPATH . 'wp-admin/includes/file.php' );

  // Download file to temp dir
  $timeout_seconds = 10;
  $temp_file = download_url( $url, $timeout_seconds );

  if ( !is_wp_error( $temp_file ) ) {

      // Array based on $_FILE as seen in PHP file uploads
      $file = array(
          'name'     => basename($url), // ex: wp-header-logo.png
          'type'     => 'image/png',
          'tmp_name' => $temp_file,
          'error'    => 0,
          'size'     => filesize($temp_file),
      );

      $overrides = array(
          // Tells WordPress to not look for the POST form
          // fields that would normally be present as
          // we downloaded the file from a remote server, so there
          // will be no form fields
          // Default is true
          'test_form' => false,

          // Setting this to false lets WordPress allow empty files, not recommended
          // Default is true
          'test_size' => true,
      );

      // Move the temporary file into the uploads directory
      $results = wp_handle_sideload( $file, $overrides );
      
      
      if ( !empty( $results['error'] ) ) {
          // Insert any error handling here
      } else {

         
          $url = $results['url'];
          $type = $results['type'];
          $file = $results['file'];
          $title = sanitize_text_field( $name );
          $content = '';
          $excerpt = '';
          
          $attachment = array(
                'post_mime_type' => $type,
                'guid' => $url,
                'post_parent' => '',
                'post_title' => $title,
                'post_content' => $content,
                'post_excerpt' => $excerpt,
            );
    
    
  
 
   
    // Save the data
    $id = wp_insert_attachment( $attachment, $file, '', true );
    require_once( ABSPATH . 'wp-admin/includes/image.php' );

// Generate the metadata for the attachment, and update the database record.
    $attach_data = wp_generate_attachment_metadata( $id, $file );
    wp_update_attachment_metadata( $id, $attach_data );
          
          
          

          return $id;
      }
  }
}    

                

?>

