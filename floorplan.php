<?php

/**
 * Plugin Name: Floor Plan
 * Plugin URI: https://github.com/QasimRiaz/Floorplan
 * Description: Floor Plan.
 * Version: 11.1
 * @version : 11.1
 * Author: E2ESP
 * Author URI: http://expo-genie.com/
 * GitHub Plugin URI: https://github.com/QasimRiaz/Floorplan
 * License: ExpoGenie
 * Text Domain: ExpoGenie
 * Network:           true
 */

if (isset($_GET['floorplanRequest'])) {

    if ($_GET['floorplanRequest'] == "savedfloorplansettings") {

        require_once('../../../wp-load.php');

        getBoothList($_POST);
        die();


    } else if ($_GET['floorplanRequest'] == "getallboothtypes") {


        require_once('../../../wp-load.php');

        getBoothtypesList($_POST);
        die();

    } else if ($_GET['floorplanRequest'] == "savedalllegendstypes") {


        require_once('../../../wp-load.php');

        savedalllegendstypes($_POST);
        die();

    } else if ($_GET['floorplanRequest'] == "savedallboothtags") {


        require_once('../../../wp-load.php');

        savedallboothtags($_POST);
        die();

    } else if ($_GET['floorplanRequest'] == "savedallpricetegs") {


        require_once('../../../wp-load.php');

        savedallpricetegs($_POST);
        die();

    } else if ($_GET['floorplanRequest'] == "getproductdetail") {


        require_once('../../../wp-load.php');

        getproductdetail($_REQUEST);
        die();

    } else if ($_GET['floorplanRequest'] == "savedlockunlockstatus") {


        require_once('../../../wp-load.php');

        savedlockunlockstatus($_REQUEST);
        die();

    } else if ($_GET['floorplanRequest'] == "createnewfloorplan") {


        require_once('../../../wp-load.php');

        createnewfloorplan($_REQUEST);
        die();

    } else if ($_GET['floorplanRequest'] == "productremoverequest") {
        require_once('../../../wp-load.php');

        //productremoverequest($_REQUEST)
        productremoverequest();

        die();

    } else if ($_GET['floorplanRequest'] == "reservedBoothRequest") {
        require_once('../../../wp-load.php');

        //productremoverequest($_REQUEST)
        reservedBoothRequest();

        die();


    } else if ($_GET['floorplanRequest'] == "getCartTotal") {
        require_once('../../../wp-load.php');

        //productremoverequest($_REQUEST)

        getCartTotal();

        die();

    } else if ($_GET['floorplanRequest'] == "cart_total") {
        require_once('../../../wp-load.php');

        //productremoverequest($_REQUEST)

   
        getCartTotal();

        die();

    }else if ($_GET['floorplanRequest'] == "boothdiscount_price") {
        require_once('../../../wp-load.php');

        //productremoverequest($_REQUEST)
        $boothProductID = $_POST['boothproductid'];
   
        boothDiscountPrice($boothProductID);

        die();

    }  else if ($_GET['floorplanRequest'] == "boothselfassignment") {
        require_once('../../../wp-load.php');

     
        boothSelfAssignment();

        die();

    }

}

//zaeem
function getHighestPackagePriority()
{
    $productLevels = [];
    global $woocommerce;
    $item = $woocommerce->cart->get_cart();
//    check if the user is in entryflow form URL

    if (count($item) > 0 && strpos($_SERVER['REQUEST_URI'], 'order-pay') != 'entry-wizard') {
        foreach ($item as $key => $value) {
            $dat = $value['product_id'];
            $meta = get_post_meta($dat);
            $productLevels[] = $meta['productlevel'][0];
        }
        if (is_multisite()) {
            $blog_id = get_current_blog_id();
            $get_all_roles_array = 'wp_' . $blog_id . '_user_roles';
        } else {
            $get_all_roles_array = 'wp_user_roles';
        }
        $get_all_roles = get_option($get_all_roles_array);
        $priorityNums = [];
        foreach ($get_all_roles as $key => $name) {
            if (in_array($key, $productLevels)) {
                $int = (int)$get_all_roles[$key]['priorityNum'];
                $priorityNums[$int] = $key;
            }
        }
        $prior = [];
        foreach ($priorityNums as $key => $val) {
            array_push($prior, $key);
        }
        return $priorityNums[min($prior)];
    } elseif (is_user_logged_in() && !in_array('subscriber', (array)wp_get_current_user()->roles)) {
        $user = wp_get_current_user();
        $user_roles = $user->roles;
        $user_role = array_shift($user_roles);
        return $user_role;
    } else {
        return 0;
    }
}


// function remove_item_cart()
// {
//     # code...
//     echo "Yes"
// }
function getCartTotal()
{

    $items = [];

    foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {

        $terms = get_the_terms($cart_item['product_id'], 'product_cat');

        if ($terms[0]->name == 'Uncategorized') {

            $cartcount = WC()->cart->get_cart_contents_count();
            array_push($items, $cartcount);
        }

    }

    if (!empty($items)) {

        $cartcount = count($items);
    } else {

        $cartcount = 0;
    }

    echo $cartcount;

    
}
function boothDiscountPrice($boothProductID){

    require_once plugin_dir_path( __DIR__ ) . 'EGPL/includes/floorplan-manager.php';
    $demo = new FloorPlanManager();

    $pkgLvl = trigger2();

   // $isPartial = get_post_meta($boothProductID, '_wc_deposit_enabled', true);
  //  if(empty($isPartial)){
      

    $boothPriceBasedLevels = get_post_meta($boothProductID, 'levelbaseddiscountdata', true);
    $boothPriceBasedLevels = json_decode(json_encode($boothPriceBasedLevels),true);

        global $woocommerce;
    $item = $woocommerce->cart->get_cart();
    $flag = true;
    foreach ($item as $key => $value) {
        $dat = $value['product_id'];
        // echo $dat;
        $meta = get_post_meta($dat , '_list_of_selected_booth' , true);
  

        if(!empty($meta)){
            foreach($meta as $boothKey=>$boothID){

                $getthisboothproductID = $demo->getproductID($boothID);
                foreach ($item as $key => $value) {

                if($getthisboothproductID == $value['product_id']){

                        $flag = false;
                }
            }
            }
        }


    }

        if($flag == true){

        
            if(!empty($boothPriceBasedLevels)){

                if (is_user_logged_in()) {
                    $user = wp_get_current_user();
                    $user_role = $user->roles;
                }else{

                    $user_role = $pkgLvl;
                }
                    foreach($boothPriceBasedLevels as $key => $value){
                 
                        if(in_array($user_role[0], $value['levels'])){

                            if(!empty($value['discounttype']) && !empty($value['discountamount'])){

                                $codeid =  create_booth_discount_code($boothProductID,$value['discounttype'],$value['discountamount']);
                                break;
                            }
                       
                            
                        }else{

                          
                            if(in_array($user_role, $value['levels'])){

                                if(!empty($value['discounttype']) && !empty($value['discountamount'])){
                                    
                                    $codeid =  create_booth_discount_code($boothProductID,$value['discounttype'],$value['discountamount']);
                                    break;
                                }
                           
                            }
                        }
                    }   

                    if($codeid){
                    
                        $codeName = get_the_title($codeid); 
                
                        // apply_discount_code_to_booth($boothProductID, $codeName);
                        WC()->cart->add_discount($codeName);
                    }
 
            }
        }

   // }
}

function trigger2()
{
    $productLevels = [];
    global $woocommerce;
    $item = $woocommerce->cart->get_cart();
    foreach ($item as $key => $value) {
        $dat = $value['product_id'];
        $meta = get_post_meta($dat);
        $productLevels[] = $meta['productlevel'][0];
    }
    if (is_multisite()) {
        $blog_id = get_current_blog_id();
        $get_all_roles_array = 'wp_' . $blog_id . '_user_roles';
    } else {
        $get_all_roles_array = 'wp_user_roles';
    }
    $get_all_roles = get_option($get_all_roles_array);
    $priorityNums = [];
    foreach ($get_all_roles as $key => $name) {
        if (in_array($key, $productLevels)) {
            $int = (int)$get_all_roles[$key]['priorityNum'];
            $priorityNums[$int] = $key;
        }

    }
    $prior = [];
    foreach ($priorityNums as $key => $val) {
        array_push($prior, $key);
    }

    if(!empty($prior)){

        return $priorityNums[min($prior)];

    }else{

        return '';
    }
}

function create_booth_discount_code($boothProductID,$boothDiscountType,$boothDiscountAmount) {
    $coupon_code = 'booth-'.$boothProductID.'-'.rand(10,100); 
    $discount_amount = $boothDiscountAmount; 

    if($boothDiscountType == 'percent'){
        $type = 'percent';
    }else{
        $type = 'fixed_cart';
    }

    $coupon = new WC_Coupon($coupon_code);
    if ($coupon->get_id()) {
        return; 
    }

    $coupon = array(
                'post_title' => $coupon_code,
                'post_content' => '',
                'post_excerpt' => '',
                'post_status' => 'publish', 
                'post_author' => 1,
                'post_type' => 'shop_coupon'
            );


            $new_code_id = wp_insert_post($coupon);

         
            if ($new_code_id) {

                update_post_meta($new_code_id, 'coupon_amount', $discount_amount);
                // update_post_meta($new_code_id, 'customer_email', serialize($allowedemails));
                //update_post_meta($new_code_id, 'date_expires', $codeexpirydate);
                update_post_meta($new_code_id, 'discount_type', $type);
                //update_post_meta($new_code_id, 'exclude_product_categories', $excludeproductcategories);
                // update_post_meta($new_code_id, 'exclude_product_ids', $excludeproducts);
                // update_post_meta($new_code_id, 'exclude_sale_items', $excludeitems);
                // update_post_meta($new_code_id, 'individual_use', true);
                 update_post_meta($new_code_id, 'product_ids', $boothProductID); 
                update_post_meta($new_code_id, 'usage_limit', 1);

            }
    
            return $new_code_id;
}

// function apply_discount_code_to_booth($product_id, $coupon_code) {
//     // Check if the product exists
//     $product = wc_get_product($product_id);
//     if (!$product) {
        
//         return;
//     }

//     // Check if the coupon exists
//     $coupon = new WC_Coupon($coupon_code);
//     if (!$coupon->get_id()) {
      
//         return;
//     }

//     // Add the coupon to the cart
//     WC()->cart->add_discount($coupon_code);


// }

function productremoverequest()
{
    # code...
    global $woocommerce;
    $cart = $woocommerce->instance()->cart;
    $id = $_POST['p_id'];
    $cart_id = $cart->generate_cart_id($id);
    $cart_item_id = $cart->find_product_in_cart($cart_id);
    echo $id;
    if ($cart_item_id) {
        $cart->set_quantity($cart_item_id, 0);
    }
}

function reservedBoothRequest()
{
    # code...
    $id = $_POST['p_id'];
    $user_ID = get_current_user_id();
    $blog_id = get_current_blog_id();
    $array = array();
    $reservedBoothsInMeta = get_user_meta($user_ID, 'wp_' . $blog_id . '_userBoothReserved');
    // echo "Reserverd";
    // echo "<pre>";  
    // print_r($reservedBoothsInMeta);
    // echo "Reserverd";
    if (empty($reservedBoothsInMeta)) {
        //echo "===EMPTY==";
        array_push($reservedBoothsInMeta, $id);
        //  echo "<pre>";
        // print_r($reservedBoothsInMeta);
        update_post_meta($id, 'Reserved', $user_ID);
        update_user_option($user_ID, 'userBoothReserved', $reservedBoothsInMeta);
    } else {
        foreach ($reservedBoothsInMeta as $key => $value) {
            //  echo "=====";
            //  print_r($value);
            //  echo "=====";
            //  echo "==[0]==";
            //  print_r($value[0]);
            //  echo "==[0]==";
            array_push($array, $value[$key]);
            // echo "=====";
        }
        // echo "<pre>";
        // echo "Before Push";
        //     print_r($array);
        array_push($array, $id);
        // echo "<pre>";
        // echo "After Push";
        // print_r($array);
        update_post_meta($id, 'Reserved', $user_ID);
        update_user_option($user_ID, 'userBoothReserved', $array);
        // foreach ($array as $key => $value) {
        //     echo "=====";
        //     print_r($value);
        //     echo "=====";
        // }
    }

    // print_r($reservedBoothsInMeta);
    // echo "=====";
    //print_r(json_encode($array));
    //$array=explode(",",$reservedBoothsInMeta);
    // echo "=====";

    // array_push($array,$id);
//     echo "<pre>";
//    // print_r($array);
//     print_r($reservedBoothsInMeta);
//     $array=serialize( $reservedBoothsInMeta);

    //  echo "<pre>";
    //  print_r($reservedBoothsInMeta);
    //update_user_option($user_ID,'userBoothReserved','');
}


function woo_in_cart($product_id)
{

    global $woocommerce;

    foreach ($woocommerce->cart->get_cart() as $key => $val) {
        $_product = $val['data'];

        if ($product_id == $_product->id) {
            return true;
        }
    }

    return false;
}


function createnewfloorplan($postData)
{

    try {


        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);
        $lastInsertId = contentmanagerlogging('Add New Floor Plan', "Admin Action", $postData, $user_ID, $user_info->user_email, "");

        $digits = 6;
        $floorplandefaultname = "Floor Plan - " . rand(pow(10, $digits - 1), pow(10, $digits) - 1);

        if (!empty($postData['loadedfloorplantitle'])) {

            $floorplandefaultname = $postData['loadedfloorplantitle'];

        }

        // Gather post data.
        $my_post = array(
            'post_title' => $floorplandefaultname,
            'post_content' => '',
            'post_status' => '',
            'post_author' => 1,
            'post_type' => 'floor_plan',

        );

        // Insert the post into the database.
        $id = wp_insert_post($my_post);
        $contentmanager_settings['ContentManager']['floorplanactiveid'] = $id;

        $boothTypes = "[";

        $boothTypes .= '{"width":100,"height":100,"style":"DefaultStyle1;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;shadow=0;"},';

        $boothTypes .= '{"width":200,"height":200,"style":"DefaultStyle2;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;"},';

        $boothTypes .= '{"width":300,"height":200,"style":"DefaultStyle3;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=18;uno=#fff;occ=#fff;glass=0;comic=0;"}';

        $boothTypes .= ']';

        $FloorBackground = '';

        // Getting floorplan settings from wp options
        $floorPlanSettingsString = 'floorPlanSettings';
        $floorPlanSettings = get_option($floorPlanSettingsString);

        // $user_ID = get_current_user_id();
        $blog_id = get_current_blog_id();
        $arr = array();
        $args = array(
            'role__not_in' => 'Administrator',
        );
        $user_query = new WP_User_Query($args);
        $lisstofuser = $user_query->get_results();
        foreach ($lisstofuser as $key => $a_value) {
            $user_Info = get_user_meta($a_value->ID, 'nickname');
            $user_Priroty_Num = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_priorityNum');

            $user_option = get_user_meta($a_value->ID, 'ID', 'wp_' . $blog_id . '_myTurn');
            $user_Status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_userBoothStatus');
            $user_Remove_status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_RemoveFromQueue');
            // echo "<pre>";
            // print_r(  $user_option[0]);
            if (empty($user_Remove_status[0]) && !empty($user_Priroty_Num[0]) && $user_Priroty_Num[0] != "-") {
                array_push($arr, (object)[
                    'Email' => $user_Info[0],
                    'PrirotyNumber' => $user_Priroty_Num[0],
                    'turn' => $user_option[0],
                    'Id' => $a_value->ID,
                    'Status' => $user_Status[0],
                ]);

            }
        }
        $array_Pr = array();
        foreach ($arr as $key => $a_value) {
            // echo "<pre>";
            // print_r($a_value);

            //   echo "----------trtrtrtrtrt-----------";
            if ($a_value->turn == 'Checked') {
                array_push($array_Pr, $a_value->PrirotyNumber);

            }

        }


        if (!empty($array_Pr)) {

            $value = max($array_Pr);
        }

        $value = max($array_Pr);


        // global $cartCounts;
        // $cartCount= $cartCounts->instance()->cart->cart_contents_count();
        $loggedInUser = get_user_meta($user_ID);
        $getroledata = unserialize($loggedInUser['wp_' . $blog_id . '_capabilities'][0]);
        // echo "<pre>";
        // print_r($getroledata);
        reset($getroledata);
        $rolename = key($getroledata);
        $get_all_roles_array = 'wp_' . $blog_id . '_user_roles';
        $all_roles = get_option($get_all_roles_array);
        foreach ($all_roles as $key => $name) {
            if ($rolename == $key) {
                $userLevel = $name['name'];
            }
        }

        $getroledata = unserialize($loggedInUser['wp_' . $blog_id . '_capabilities'][0]);
        reset($getroledata);
        $rolename = key($getroledata);

        $loggedInUsers = array(
            'ID' => $user_ID,
            'UserLevel' => $rolename,
            'priorityNum' => $loggedInUser['wp_' . $blog_id . '_priorityNum'],
            'status' => $loggedInUser['wp_' . $blog_id . '_userBoothStatus'],
            'turn' => $loggedInUser['wp_' . $blog_id . '_myTurn'],
            'OverrideBoothLimit' => $loggedInUser['wp_' . $blog_id . '_OverrideNumberOfBooths'][0],
            'ReservedBooth' => unserialize($loggedInUser['wp_' . $blog_id . '_userBoothReserved'][0]),
            'OverrideCheck' => ($loggedInUser['wp_' . $blog_id . '_Override_Check'][0]),
            'Overrideprepaid' => $loggedInUser['wp_' . $blog_id . '_prePaid_checkbox'][0],
        );
        $legendlabel = "[";
        $legendlabel .= '{"ID":1,"colorstatus":true,"name":"Gold","colorcode":#00000},';
        $legendlabel .= '{"ID":2,"colorstatus":true,"name":"Sliver","colorcode":#00000},';
        $legendlabel .= '{"ID":3,"colorstatus":true,"name":"Red","colorcode":#00000}';

        $legendlabel .= "]";

        $FloorplanXml[0] = '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="2175" pageHeight="2175" ><root></root></mxGraphModel>';

        //   update_option( 'ContenteManager_Settings', $contentmanager_settings );
        update_post_meta($id, 'booth_types', $boothTypes);
        update_post_meta($id, 'floor_background', $FloorBackground);
        update_post_meta($id, 'floorplan_xml', $FloorplanXml[0]);
        update_post_meta($id, 'legendlabels', $legendlabel);
        update_post_meta($id, 'floorplantitle', 'Defualt Floor Plan');
        update_post_meta($id, 'legendlabels', "");
        update_post_meta($id, 'legendlabels', "");
        update_post_meta($id, 'pricetegs', "");
        update_post_meta($id, 'sellboothsjson', "");
        update_post_meta($id, 'updateboothpurchasestatus', "");


        contentmanagerlogging_file_upload($lastInsertId, $post_request);

        echo $id;


    } catch (Exception $e) {


        return $e;

    }

}


function savedlockunlockstatus($post_request)
{

    try {


        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);
        $lastInsertId = contentmanagerlogging('Save All Price Tags', "Admin Action", $post_request, $user_ID, $user_info->user_email, "");

        update_post_meta($post_request['post_id'], 'updateboothpurchasestatus', $post_request['status']);

        contentmanagerlogging_file_upload($lastInsertId, $post_request);

        echo 'update';


    } catch (Exception $e) {


        return $e;

    }

}

function getproductdetail($productID)
{
    require_once plugin_dir_path(__DIR__) . 'EGPL/includes/floorplan-manager.php';
    try {
        $demo = new FloorPlanManager();
        $AllBoothsList = $demo->getAllbooths();
        $id = $productID['pro_id'];
        $floorplanID = $productID['floorplanID'];
        $woocommerce_rest_api_keys = get_option('ContenteManager_Settings');
        $wooconsumerkey = $woocommerce_rest_api_keys['ContentManager']['wooconsumerkey'];
        $wooseceretkey = $woocommerce_rest_api_keys['ContentManager']['wooseceretkey'];
        $user_ID = get_current_user_id();
        $blog_id = get_current_blog_id();
        $loggedInUser = get_user_meta($user_ID);
        require_once('lib/woocommerce-api.php');
        $url = get_site_url();
        $options = array(
            'debug' => true,
            'return_as_array' => false,
            'validate_url' => false,
            'timeout' => 30,
            'ssl_verify' => false,
        );
        $client = new WC_API_Client($url, $wooconsumerkey, $wooseceretkey, $options);
        $get_product = wc_get_product($id);
        $get_products = get_post_meta($id);
        $number = 0;
        if ($user_ID) {
            foreach ($AllBoothsList as $boothIndex => $boothValue) {
                if ($boothValue['bootheOwnerID'] == $user_ID) {
                    $number++;
                }
            }
        }
        // echo "<pre>";
        // print_r($get_product);
        // echo "<pre>";
        // echo"-----------------------";
        // print_r($get_products);exit;
        $get_deposit_type = get_post_meta($id, "_wc_deposit_type", true);
        $get_override_check = get_post_meta($id, "overrideCheck", true);
        $get_reserved_check = get_post_meta($id, "reservedStatus", true);
        $get_reserved_status = get_post_meta($id, "Reserved", true);
        $get_deposit_amount = get_post_meta($id, "_wc_deposit_amount", true);
        $get_BoothLevel_amount = get_post_meta($id, "LevelOfBooth", true);
        $get_Booth_Owner = get_post_meta($id, "BoothForUser", true);
        $get_depositenable_type = get_post_meta($id, "_wc_deposit_enabled", true);
        $get_role_type = get_post_meta($id, "_wc_deposit_enabled", true);

        if (empty($get_product)) {

            $productdetail['productstatus'] = 'removed';
        } else {
            $productdetail['productstatus'] = 'exist';
        }

        $productdetail['NumberOfReservedBooths'] = unserialize($loggedInUser['wp_' . $blog_id . '_userBoothReserved'][0]);
        $productdetail['title'] = addslashes($get_product->name);
        $productdetail['slug'] = $get_product->get_slug();
        $productdetail['description'] = $get_product->description;
        $productdetail['OverrideCheck'] = $get_override_check;
        $productdetail['reservedStatus'] = $get_reserved_check;
        $productdetail['Reserved'] = $get_reserved_status;
        $productdetail['PurchaseCount'] = $number;

        $productdetail['price'] = (int)$get_product->regular_price;
        $productdetail['stockstatus'] = $get_product->stock_status;
        $productdetail['deposit_type'] = $get_deposit_type;
        $productdetail['deposit_amount'] = $get_deposit_amount;
        $productdetail['LevelOfBooth'] = $get_BoothLevel_amount;
        $productdetail['Booth_Purchaser'] = $get_Booth_Owner;
        $productdetail['deposit_enable_type'] = $get_depositenable_type;

        $productdetail['currencysymbole'] = get_woocommerce_currency_symbol($currency);
        $levelname = $get_product->tax_class;
        global $wp_roles;
        $all_roles = $wp_roles->roles;
        foreach ($all_roles as $key => $name) {

            if ($levelname == $key) {

                $productdetail['level'] = $name['name'];
            }
        }
        if (!empty($get_product->image_id)) {
            $productdetail['src'] = wp_get_attachment_thumb_url($get_product->image_id);
        } else {
            $productdetail['src'] = $url . '/wp-content/plugins/floorplan/icon01.png';
        }
        $productdetail['floorplanstatus'] = get_post_meta($floorplanID, 'updateboothpurchasestatus', true);

        $counts = 0;
        $woocommerce = new WC_API_Client($url, $wooconsumerkey, $wooseceretkey, $options);
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            $product_id = $cart_item['product_id'];
            $getproduct_detail = $woocommerce->products->get($product_id);
            if ($getproduct_detail->product->categories[0] != 'Package' && $getproduct_detail->product->categories[0] != 'Add-ons') {
                $counts++;
            }
        }

        $productdetail['CartTotal'] = $counts;
        if (woo_in_cart($id)) {

            $productdetail['status'] = 'alreadyexistproduct';


        } else {

            $productdetail['status'] = 'unassigned';
        }

        // code By Zaeem

        $priority = getHighestPackagePriority();
        $productdetail['priority'] = 'false';

        $productdetail['TEMP'] = $priority;

        if (!empty($priority)) {
            // if (!is_user_logged_in()) {
            if (in_array($priority, (array)$get_BoothLevel_amount) || $get_BoothLevel_amount[0] == "") {
                $productdetail['priority'] = 'true';
            } else {
                $productdetail['priority'] = 'false';
                $productdetail['productstatus'] = 'removed';
            }
            // }
        }


        if (is_user_logged_in()) {

            $user_ID = get_current_user_id();
            $statusturn = get_user_option('myTurn', $user_ID);
            $floor_Plan_Settings = 'floorPlanSettings';
            $get = get_option($floor_Plan_Settings);


            if (empty($statusturn) && $get['tableSort'] == 'checked') {

                $productdetail['priority'] = 'false';
                $productdetail['productstatus'] = 'removed';
            }
        }

        echo json_encode($productdetail);

        die();

    } catch (Exception $e) {


        return $e;

    }

}




function savedallpricetegs($Dataarray)
{

    try {

        $id = $Dataarray['post_id'];

        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);
        $lastInsertId = contentmanagerlogging('Save All Price Tags', "Admin Action", $Dataarray, $user_ID, $user_info->user_email, "");

        update_post_meta($id, 'pricetegs', $Dataarray['pricetegsArray']);
        contentmanagerlogging_file_upload($lastInsertId, $Dataarray['pricetegsArray']);
        echo 'update';

    } catch (Exception $e) {


        return $e;

    }

}


function savedallboothtags($Dataarray)
{

    try {
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);
        $lastInsertId = contentmanagerlogging('Save All Booth Tags', "Admin Action", $Dataarray, $user_ID, $user_info->user_email, "");

        $id = $Dataarray['post_id'];
        update_post_meta($id, 'boothtags', $Dataarray['boothtagsArray']);
        contentmanagerlogging_file_upload($lastInsertId, $Dataarray['boothtagsArray']);
        echo 'update';
    } catch (Exception $e) {


        return $e;

    }

}

function savedalllegendstypes($Dataarray)
{

    try {
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);
        $lastInsertId = contentmanagerlogging('Save All Legends Labels', "Admin Action", $Dataarray, $user_ID, $user_info->user_email, "");

        $id = $Dataarray['post_id'];
        update_post_meta($id, 'legendlabels', $Dataarray['legendstypesArray']);
        contentmanagerlogging_file_upload($lastInsertId, $Dataarray['pricetegsArray']);
        echo 'update';
    } catch (Exception $e) {


        return $e;

    }

}


add_action('wp_enqueue_scripts', 'ajax_test_enqueue_scripts');
function ajax_test_enqueue_scripts()
{


    wp_localize_script('love', 'postlove', array(
        'ajax_url' => admin_url('admin-ajax.php')
    ));

}

//COde

//COde
add_action('wp_ajax_nopriv_post_love_add_love', 'post_love_add_love');
//add_action( 'wp_ajax_nopriv_getBoothList', 'getBoothList' );
add_action('wp_ajax_nopriv_getExhibitordata', 'getExhibitordata');
add_action('wp_ajax_nopriv_getPresetList', 'getPresetList');

add_action('wp_ajax_post_love_add_love', 'post_love_add_love');
//add_action( 'wp_ajax_getBoothList', 'getBoothList' );
add_action('wp_ajax_getExhibitordata', 'getExhibitordata');
add_action('wp_ajax_getPresetList', 'getPresetList');

function sanitize($str, $quotes = ENT_NOQUOTES)
{
    $str = htmlspecialchars($str, $quotes);
    return $str;
}

function post_love_add_love()
{
    $boothTypes = get_post_meta($_REQUEST['post_id'], 'booth_types', true);
    $boothTypes2 = json_decode($boothTypes, true);

    $boothArray = $_REQUEST['boothArray'];
    $boothTypes2[] = $boothArray[0];

    if (defined('DOING_AJAX') && DOING_AJAX) {
        update_post_meta($_REQUEST['post_id'], 'booth_types', json_encode($boothTypes2));
        //print_r($boothTypes2);
        die();
    } else {
        wp_redirect(get_permalink($_REQUEST['post_id']));
        exit();
    }
}


function getPresetList()
{

    //echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
    $presetname = $_REQUEST['presetname'];

    $floorplan_id = $_REQUEST['floorplanid'];

    update_post_meta($_REQUEST['post_id'], 'booth_types', trim($boothTypes));
    update_post_meta($_REQUEST['post_id'], 'floor_background', $_REQUEST['floorBG']);
    update_post_meta($_REQUEST['post_id'], 'floorplan_xml', $_REQUEST['floorXml']);

    $presetarray = get_post_meta($floorplan_id, 'booth_types', true);
    $preset_dataarray = json_decode($presetarray);
    $responce_message['status'] = 'clear';


    foreach ($preset_dataarray[0] as $keys => $value) {

        if ($keys == 'style') {


            $get_presetname = explode(";", $value);

            foreach ($get_presetname as $key => $newvalue) {

                if ($newvalue == 'presetName=' . $presetname) {
                    $responce_message['status'] = 'alreadyexist';
                    break;
                }

            }


        }
    }

    echo json_encode($responce_message);

    die();
}


function getBoothtypesList($postdata)
{

    //echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );
    try {

        $id = $postdata['post_id'];


        $boothTypesLegend = get_post_meta($id, 'legendlabels', true);

        if (empty($boothTypesLegend)) {
            $singleuserdata = 'empty';
        } else {

            $singleuserdata = json_encode($boothTypesLegend);

        }

        echo $singleuserdata;

    } catch (Exception $e) {


        return $e;

    }
    die();
}


function getBoothList($postdata)
{

    //echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );


    // echo '<pre>';
    // print_r("Qasimriaz");exit;

    try {
        $boothTypes = $postdata['boothTypes'];
        // $boothTypes = json_encode($boothTypes);
        $user_ID = get_current_user_id();
        $user_info = get_userdata($user_ID);


        $lastInsertId = contentmanagerlogging('Floor Plan Activity Log', "Admin Action", "", $user_ID, $user_info->user_email, $postdata['speciallog']);
        $lastInsertId = contentmanagerlogging('Floor Plan Settings Saved', "Admin Action", "", $user_ID, $user_info->user_email, $postdata);

        // $Flo_test= '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" ';


        $CurrentXML = simplexml_load_string(stripslashes($postdata['floorXml']));

        // echo '<pre>';
        // print_r($postdata['sellboothsjson']);
        // exit;

        if ($CurrentXML !== FALSE) {


            update_post_meta($postdata['post_id'], 'booth_types', trim($boothTypes));
            update_post_meta($postdata['post_id'], 'floor_background', $postdata['floorBG']);
            update_post_meta($postdata['post_id'], 'floorplan_xml', $postdata['floorXml']);
            update_post_meta($postdata['post_id'], 'sellboothsjson', $postdata['sellboothsjson']);
            update_post_meta($postdata['post_id'], 'updateboothpurchasestatus', "unlock");

            $my_post = array(
                'ID' => $postdata['post_id'],
                'post_title' => $postdata['loadedfloorplantitle']

            );


            wp_update_post($my_post);


            if (!empty($postdata['sellboothsjson'])) {


                require_once plugin_dir_path(__DIR__) . 'EGPL/includes/floorplan-manager.php';
                $demo = new FloorPlanManager();
                $defaultImage = get_site_url() . "/wp-content/plugins/floorplan/icon01.png";
                $productpicID = floorplanBoothImage($defaultImage);


                $responce = $demo->createAllBoothPorducts($postdata['post_id'], $postdata['sellboothsjson'], $postdata['floorXml'], $productpicID);


            }
        } else {

            echo 'faildXmlError';

        }


    } catch (Exception $e) {

        //contentmanagerlogging_file_upload ($lastInsertId,serialize($e));
        return $e;

    }
    die();
}


function getExhibitordata()
{

    //echo $boothTypes = get_post_meta( $_REQUEST['post_id'], 'booth_types', true );

    $user_id = $_REQUEST['user_id'];

    $user_data = get_userdata($user_id);
    $all_meta_for_user = get_user_meta($user_id);

    if (isset($all_meta_for_user['first_name'][0])) {
        $userdataarray['first_name'] = $all_meta_for_user['first_name'][0];
    } else {

        $userdataarray['first_name'] = '';
    }

    if (isset($all_meta_for_user['last_name'][0])) {
        $userdataarray['last_name'] = $all_meta_for_user['last_name'][0];
    } else {

        $userdataarray['last_name'] = '';
    }
    if (isset($all_meta_for_user['wp_capabilities'][0])) {

        $rolename = unserialize($all_meta_for_user['wp_capabilities'][0]);
        foreach ($rolename as $key => $index) {
            $rolename_name = $key;
            break;
        }


        $userdataarray['wp_capabilities'] = $rolename_name;
    } else {

        $userdataarray['wp_capabilities'] = '';
    }
    if (isset($all_meta_for_user['nickname'][0])) {
        $userdataarray['nickname'] = $all_meta_for_user['nickname'][0];
    } else {

        $userdataarray['nickname'] = '';
    }
    if (isset($all_meta_for_user['prefix'][0])) {
        $userdataarray['prefix'] = $all_meta_for_user['prefix'][0];
    } else {

        $userdataarray['prefix'] = '';
    }
    if (isset($all_meta_for_user['address_line_1'][0])) {
        $userdataarray['address_line_1'] = $all_meta_for_user['address_line_1'][0];
    } else {

        $userdataarray['address_line_1'] = '';
    }
    if (isset($all_meta_for_user['address_line_2'][0])) {
        $userdataarray['address_line_2'] = $all_meta_for_user['address_line_2'][0];
    } else {

        $userdataarray['address_line_2'] = '';
    }

    if (isset($all_meta_for_user['usercity'][0])) {
        $userdataarray['usercity'] = $all_meta_for_user['usercity'][0];
    } else {

        $userdataarray['usercity'] = '';
    }
    if (isset($all_meta_for_user['userstate'][0])) {
        $userdataarray['userstate'] = $all_meta_for_user['userstate'][0];
    } else {

        $userdataarray['userstate'] = '';
    }
    if (isset($all_meta_for_user['usercountry'][0])) {
        $userdataarray['usercountry'] = $all_meta_for_user['usercountry'][0];
    } else {

        $userdataarray['usercountry'] = '';
    }
    if (isset($all_meta_for_user['user_phone_1'][0])) {
        $userdataarray['user_phone_1'] = $all_meta_for_user['user_phone_1'][0];
    } else {

        $userdataarray['user_phone_1'] = '';
    }

    if (isset($all_meta_for_user['user_phone_2'][0])) {
        $userdataarray['user_phone_2'] = $all_meta_for_user['user_phone_2'][0];
    } else {

        $userdataarray['user_phone_2'] = '';
    }
    if (isset($all_meta_for_user['reg_codes'][0])) {
        $userdataarray['reg_codes'] = $all_meta_for_user['reg_codes'][0];
    } else {

        $userdataarray['reg_codes'] = '';
    }
    if (isset($all_meta_for_user['usernotes'][0])) {
        $userdataarray['usernotes'] = $all_meta_for_user['usernotes'][0];
    } else {

        $userdataarray['usernotes'] = '';
    }
    if (isset($all_meta_for_user['userzipcode'][0])) {
        $userdataarray['userzipcode'] = $all_meta_for_user['userzipcode'][0];
    } else {

        $userdataarray['userzipcode'] = '';
    }
    if (isset($all_meta_for_user['customefield_company_description_u7lyg'][0])) {
        $allUsersData[$index]['customefield_company_description_u7lyg'] = $all_meta_for_user['customefield_company_description_u7lyg'][0];
    } else {

        $allUsersData[$index]['customefield_company_description_u7lyg'] = '';
    }
    if (isset($all_meta_for_user['customefield_contact_first_name_xkf3r'][0])) {
        $allUsersData[$index]['customefield_contact_first_name_xkf3r'] = $all_meta_for_user['customefield_contact_first_name_xkf3r'][0];
    } else {

        $allUsersData[$index]['customefield_contact_first_name_xkf3r'] = '';
    }
    if (isset($all_meta_for_user['customefield_contact_last_name_3eyrd'][0])) {
        $allUsersData[$index]['customefield_contact_last_name_3eyrd'] = $all_meta_for_user['customefield_contact_last_name_3eyrd'][0];
    } else {

        $allUsersData[$index]['customefield_contact_last_name_3eyrd'] = '';
    }
    if (isset($all_meta_for_user['customefield_contact_email_py8cr'][0])) {
        $allUsersData[$index]['customefield_contact_email_py8cr'] = $all_meta_for_user['customefield_contact_email_py8cr'][0];
    } else {

        $allUsersData[$index]['customefield_contact_email_py8cr'] = '';
    }
    if (isset($all_meta_for_user['customefield_contact_phone_39ev0'][0])) {
        $allUsersData[$index]['customefield_contact_phone_39ev0'] = $all_meta_for_user['customefield_contact_phone_39ev0'][0];
    } else {

        $allUsersData[$index]['customefield_contact_phone_39ev0'] = '';
    }


    $singleuserdata = json_encode($userdataarray);

    echo $singleuserdata;
    exit;

    die();

}


function getAllusers_data()
{
    global $wpdb;
    $args['role__not_in'] = 'Administrator';
    $user_query = new WP_User_Query($args);
    $authors = $user_query->get_results();
    $index = 1;
    $site_prefix = $wpdb->get_blog_prefix();
    sort($authors);
    $cart = array();

    $args = array(
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_type' => 'egpl_custome_tasks',
        'post_status' => 'draft',
    );
    $taskkeyContent = get_posts($args);

    foreach ($taskkeyContent as $taskIndex => $taskObject) {


        $taskID = $taskObject->ID;
        $key = get_post_meta($taskID, 'key', true);
        $TaskCode = get_post_meta($taskID, 'taskCode', true);
        $value_label = get_post_meta($taskID, 'label', false);

        if ($TaskCode != "") {

            $MappedKeys[$TaskCode] = $key;

        }

    }


    $blog_id = get_current_blog_id();
    foreach ($authors as $aid) {

        $user_data = get_userdata($aid->ID);
        $index = $aid->ID;
        $all_meta_for_user = get_user_meta($aid->ID);


        if (!in_array("administrator", $user_data->roles)) {

            if ($all_meta_for_user[$site_prefix . 'company_name'][0] == null || empty($all_meta_for_user[$site_prefix . 'company_name'][0])) {


            } else {


                foreach ($MappedKeys as $mappedIndex => $maapedObject) {


                    if ($mappedIndex == 'COL') {

                        if (!empty($all_meta_for_user[$maapedObject])) {
                            $getLogoURL = unserialize($all_meta_for_user[$maapedObject][0]);
                        } else {

                            $getLogoURL['url'] = "";
                        }


                        $allUsersData[$index][$mappedIndex] = $getLogoURL['url'];

                    } else {

                        if (!empty($all_meta_for_user[$maapedObject][0])) {

                            $allUsersData[$index][$mappedIndex] = $all_meta_for_user[$maapedObject][0];
                        } else {

                            $allUsersData[$index][$mappedIndex] = "";
                        }


                    }


                }


                $allUsersData[$index]['companyname'] = $all_meta_for_user[$site_prefix . 'company_name'][0];
                if (isset($all_meta_for_user[$site_prefix . 'user_profile_url'])) {
                    $allUsersData[$index]['companylogourl'] = $all_meta_for_user[$site_prefix . 'user_profile_url'][0];
                }
                $allUsersData[$index]['exhibitorsid'] = $aid->ID;


                if (isset($all_meta_for_user['first_name'][0])) {
                    $allUsersData[$index]['first_name'] = $all_meta_for_user['first_name'][0];
                } else {

                    $allUsersData[$index]['first_name'] = '';
                }

                if (isset($all_meta_for_user['last_name'][0])) {
                    $allUsersData[$index]['last_name'] = $all_meta_for_user['last_name'][0];
                } else {

                    $allUsersData[$index]['last_name'] = '';
                }
                if (isset($all_meta_for_user['wp_capabilities'][0])) {

                    $rolename = unserialize($all_meta_for_user['wp_capabilities'][0]);
                    foreach ($rolename as $keyy => $indexx) {
                        $rolename_name = $keyy;
                        break;
                    }


                    $allUsersData[$index]['wp_capabilities'] = $rolename_name;
                } else {

                    $allUsersData[$index]['wp_capabilities'] = '';
                }
                if (isset($all_meta_for_user['nickname'][0])) {
                    $allUsersData[$index]['nickname'] = $all_meta_for_user['nickname'][0];
                } else {

                    $allUsersData[$index]['nickname'] = '';
                }
                if (isset($all_meta_for_user['prefix'][0])) {
                    $allUsersData[$index]['prefix'] = $all_meta_for_user['prefix'][0];
                } else {

                    $allUsersData[$index]['prefix'] = '';
                }
                if (isset($all_meta_for_user['address_line_1'][0])) {
                    $allUsersData[$index]['address_line_1'] = $all_meta_for_user['address_line_1'][0];
                } else {

                    $allUsersData[$index]['address_line_1'] = '';
                }
                if (isset($all_meta_for_user['address_line_2'][0])) {
                    $allUsersData[$index]['address_line_2'] = $all_meta_for_user['address_line_2'][0];
                } else {

                    $allUsersData[$index]['address_line_2'] = '';
                }

                if (isset($all_meta_for_user['usercity'][0])) {
                    $allUsersData[$index]['usercity'] = $all_meta_for_user['usercity'][0];
                } else {

                    $allUsersData[$index]['usercity'] = '';
                }
                if (isset($all_meta_for_user['userstate'][0])) {
                    $allUsersData[$index]['userstate'] = $all_meta_for_user['userstate'][0];
                } else {

                    $allUsersData[$index]['userstate'] = '';
                }
                if (isset($all_meta_for_user['usercountry'][0])) {
                    $allUsersData[$index]['usercountry'] = $all_meta_for_user['usercountry'][0];
                } else {

                    $allUsersData[$index]['usercountry'] = '';
                }
                if (isset($all_meta_for_user['user_phone_1'][0])) {
                    $allUsersData[$index]['user_phone_1'] = $all_meta_for_user['user_phone_1'][0];
                } else {

                    $allUsersData[$index]['user_phone_1'] = '';
                }

                if (isset($all_meta_for_user['user_phone_2'][0])) {
                    $allUsersData[$index]['user_phone_2'] = $all_meta_for_user['user_phone_2'][0];
                } else {

                    $allUsersData[$index]['user_phone_2'] = '';
                }
                if (isset($all_meta_for_user['userzipcode'][0])) {
                    $allUsersData[$index]['userzipcode'] = $all_meta_for_user['userzipcode'][0];
                } else {

                    $allUsersData[$index]['userzipcode'] = '';
                }

                // if(isset($all_meta_for_user['wp_'.$blog_id.'_task_contact_phone_yjsw7'][0])){
                //     $allUsersData[$index]['contactNumber'] = $all_meta_for_user['wp_'.$blog_id.'_task_contact_phone_yjsw7'][0];
                // }else{

                //      $allUsersData[$index]['contactNumber'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_task_contact_name_gppkg'][0])){
                //     $allUsersData[$index]['contactName'] = $all_meta_for_user['wp_'.$blog_id.'_task_contact_name_gppkg'][0];
                // }else{

                //      $allUsersData[$index]['contactName'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_task_company_description_u69fg'][0])){
                //     $allUsersData[$index]['compnayDesp'] = $all_meta_for_user['wp_'.$blog_id.'_task_company_description_u69fg'][0];
                // }else{

                //      $allUsersData[$index]['compnayDesp'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_task_company_website_1nphd'][0])){
                //     $allUsersData[$index]['compnaywebsite'] = $all_meta_for_user['wp_'.$blog_id.'_task_company_website_1nphd'][0];
                // }else{

                //      $allUsersData[$index]['compnaywebsite'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_company_description_u7lyg'][0])){
                //     $allUsersData[$index]['wp_'.$blog_id.'_customefield_company_description_u7lyg'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_company_description_u7lyg'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_company_description_u7lyg'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_company_description_u7lyg'][0])){
                //     $allUsersData[$index]['company_description'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_company_description_u7lyg'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_company_description_u7lyg'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_contact_first_name_xkf3r'][0])){
                //     $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_first_name_xkf3r'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_contact_first_name_xkf3r'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_first_name_xkf3r'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_contact_last_name_3eyrd'][0])){
                //     $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_last_name_3eyrd'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_contact_last_name_3eyrd'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_last_name_3eyrd'] = '';
                // }

                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_contact_email_py8cr'][0])){
                //     $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_email_py8cr'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_contact_email_py8cr'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_email_py8cr'] = '';
                // }
                // if(isset($all_meta_for_user['wp_'.$blog_id.'_customefield_contact_phone_39ev0'][0])){
                //     $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_phone_39ev0'] = $all_meta_for_user['wp_'.$blog_id.'_customefield_contact_phone_39ev0'][0];
                // }else{

                //      $allUsersData[$index]['wp_'.$blog_id.'_customefield_contact_phone_39ev0'] = '';
                // }

                //array_push($cart,$allUsersData);

            }

        }

    }


    if (!empty($allUsersData)) {
        uasort($allUsersData, 'compareByName');

    }


    return $allUsersData;


}

function compareByName($a, $b)
{
    return strcmp($a["companyname"], $b["companyname"]);
}


function array_msort($array, $cols)
{
    $colarr = array();
    foreach ($cols as $col => $order) {
        $colarr[$col] = array();
        foreach ($array as $k => $row) {
            $colarr[$col]['_' . $k] = strtolower($row[$col]);
        }
    }
    $eval = 'array_multisort(';
    foreach ($cols as $col => $order) {
        $eval .= '$colarr[\'' . $col . '\'],' . $order . ',';
    }
    $eval = substr($eval, 0, -1) . ');';
    eval($eval);
    $ret = array();
    foreach ($colarr as $col => $arr) {
        foreach ($arr as $k => $v) {
            $k = substr($k, 1);
            if (!isset($ret[$k])) $ret[$k] = $array[$k];
            $ret[$k][$col] = $array[$k][$col];
        }
    }
    return $ret;

}

function floorplan_shortcode($atts, $content = null)
{

    $blog_id = get_current_blog_id();

    if (isset($_GET['floorplanID'])) {


        $id = $_GET['floorplanID'];

    } else {

        $id = "default";
    }


    $floorplanstatus = false;
    if (current_user_can('administrator') || current_user_can('contentmanager')) {
        $floorplanstatus = true;
    } else {
        if ($atts['status'] == 'viewer') {

            $floorplanstatus = true;


        }

    }
    if ($floorplanstatus == true) {

        extract(shortcode_atts(array("iid" => '', "status" => ''), $atts));
        $getAllusers_data = addslashes(json_encode(getAllusers_data()));


        if ($id == "default") {

            $contentmanager_settings = get_option('ContenteManager_Settings');
            $id = $contentmanager_settings['ContentManager']['floorplanactiveid'];
            $wooconsumerkey = $contentmanager_settings['ContentManager']['wooconsumerkey'];
            $wooseceretkey = $contentmanager_settings['ContentManager']['wooseceretkey'];

        }


        $args_floorplan = array(
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'floor_plan',
            'post_status' => 'draft',

        );
        $getlistofallpostsFloorplan = get_posts($args_floorplan);

        foreach ($getlistofallpostsFloorplan as $listfloorplanindex => $listfloorplanValue) {


            $listoffloorplan[$listfloorplanValue->ID] = $listfloorplanValue->post_title;

        }

        $listoffloorplan = json_encode($listoffloorplan);


        $boothTypes = "[";

        $boothTypes .= '{"width":100,"height":100,"style":"DefaultStyle1;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=35;uno=#fff;occ=#fff;glass=0;comic=0;"},';

        $boothTypes .= '{"width":200,"height":200,"style":"DefaultStyle2;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=35;uno=#fff;occ=#fff;glass=0;comic=0;"},';

        $boothTypes .= '{"width":300,"height":200,"style":"DefaultStyle3;whiteSpace=wrap;shape=rectangle;html=1;fillColor=#fff;fontSize=35;uno=#fff;occ=#fff;glass=0;comic=0;"}';

        $boothTypes .= ']';

        if (empty($id) || $id == 'new') {

            // Gather post data.

            $digits = 6;
            $floorplandefaultname = "Floor Plan - " . rand(pow(10, $digits - 1), pow(10, $digits) - 1);


            $my_post = array(
                'post_title' => $floorplandefaultname,
                'post_content' => '',
                'post_status' => '',
                'post_author' => 1,
                'post_type' => 'floor_plan',

            );

            // Insert the post into the database.
            $id = wp_insert_post($my_post);
            $contentmanager_settings['ContentManager']['floorplanactiveid'] = $id;


            $FloorBackground = '';
            $arr = array();
            $args = array(
                'role__not_in' => 'Administrator',
            );
            $user_query = new WP_User_Query($args);
            $lisstofuser = $user_query->get_results();
            foreach ($lisstofuser as $key => $a_value) {
                $user_Info = get_user_meta($a_value->ID, 'nickname');
                $user_Priroty_Num = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_priorityNum');

                $user_option = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_myTurn');
                $user_Status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_userBoothStatus');
                $user_Remove_status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_RemoveFromQueue');
                // echo "<pre>";
                // print_r(  $user_option[0]);
                if (empty($user_Remove_status[0]) && !empty($user_Priroty_Num[0]) && $user_Priroty_Num[0] != "-") {
                    array_push($arr, (object)[
                        'Email' => $user_Info[0],
                        'PrirotyNumber' => $user_Priroty_Num[0],
                        'turn' => $user_option[0],
                        'Id' => $a_value->ID,
                        'Status' => $user_Status[0],
                    ]);

                }
            }

            $array_Pr = array();
            foreach ($arr as $key => $a_value) {

                //   echo "----------trtrtrtrtrt-----------";
                if ($a_value->turn == 'Checked') {
                    array_push($array_Pr, $a_value->PrirotyNumber);

                }

            }
            if (!empty($array_Pr)) {

                $value = max($array_Pr);
            }
            $value = max($array_Pr);
            // Getting floorplan settings from wp options
            $floorPlanSettingsString = 'floorPlanSettings';
            $floorPlanSettings = get_option($floorPlanSettingsString);
            // global $cartCounts;
            // $cartCount= $cartCounts->instance()->cart->cart_contents_count();
            $user_ID = get_current_user_id();
            // echo $user_ID ;

            $loggedInUser = get_user_meta($user_ID);
            $getroledata = unserialize($loggedInUser['wp_' . $blog_id . '_capabilities'][0]);
            // echo "<pre>";
            // print_r($getroledata);
            reset($getroledata);
            $rolename = key($getroledata);
            $get_all_roles_array = 'wp_' . $blog_id . '_user_roles';
            $all_roles = get_option($get_all_roles_array);
            foreach ($all_roles as $key => $name) {
                if ($rolename == $key) {
                    $userLevel = $name['name'];
                }
            }
            $loggedInUsers = array(
                'ID' => $user_ID,
                'UserLevel' => $rolename,
                'priorityNum' => $loggedInUser['wp_' . $blog_id . '_priorityNum'][0],
                'status' => $loggedInUser['wp_' . $blog_id . '_userBoothStatus'],
                'turn' => $loggedInUser['wp_' . $blog_id . '_myTurn'],
                'OverrideBoothLimit' => $loggedInUser['wp_' . $blog_id . '_OverrideNumberOfBooths'][0],
                'ReservedBooth' => unserialize($loggedInUser['wp_' . $blog_id . '_userBoothReserved'][0]),
                'OverrideCheck' => ($loggedInUser['wp_' . $blog_id . '_Override_Check'][0]),
            );
            $legendlabel = "[";
            $legendlabel .= '{"ID":1,"colorstatus":true,"name":"Gold","colorcode":#00000},';
            $legendlabel .= '{"ID":2,"colorstatus":true,"name":"Sliver","colorcode":#00000},';
            $legendlabel .= '{"ID":3,"colorstatus":true,"name":"Red","colorcode":#00000}';

            $legendlabel .= "]";
            $boothtags = "[]";
            $FloorplanXml[0] = '<mxGraphModel dx="2487" dy="2370" grid="1" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="2175" pageHeight="2175" ><root></root></mxGraphModel>';

            update_option('ContenteManager_Settings', $contentmanager_settings);
            update_post_meta($id, 'booth_types', $boothTypes);
            update_post_meta($id, 'floor_background', $FloorBackground);
            update_post_meta($id, 'floorplan_xml', $FloorplanXml[0]);
            update_post_meta($id, 'legendlabels', $legendlabel);
            update_post_meta($id, 'floorplantitle', 'Defualt Floor Plan');

            update_post_meta($id, 'boothtags', $boothtags);

            update_post_meta($id, 'pricetegs', "");
            update_post_meta($id, 'sellboothsjson', "");
            update_post_meta($id, 'updateboothpurchasestatus', "");

        }

        if ($atts['status'] != 'viewer') {
            update_post_meta($id, 'updateboothpurchasestatus', 'lock');
        }
        $boothsproductsData;
        //$boothTypes        = get_post_meta( $id, 'booth_types', true );
        $FloorBackground = get_post_meta($id, 'floor_background', true);
        $FloorplanXml[0] = get_post_meta($id, 'floorplan_xml', true);
        $FloorplanLegends = get_post_meta($id, 'legendlabels', true);
        $FloorplanTags = get_post_meta($id, 'boothtags', true);
        $mxPriceTegsObject = get_post_meta($id, 'pricetegs', true);
        $sellboothsjson = get_post_meta($id, 'sellboothsjson', true);
        $floorplanstatuslockunlock = get_post_meta($id, 'updateboothpurchasestatus', true);

        // Getting floorplan settings from wp options
        $floorPlanSettingsString = 'floorPlanSettings';
        $floorPlanSettings = get_option($floorPlanSettingsString);
        // $user_ID = get_current_user_id();
        $arr = array();
        $args = array(
            'role__not_in' => 'Administrator',
        );
        $user_query = new WP_User_Query($args);
        $lisstofuser = $user_query->get_results();
        foreach ($lisstofuser as $key => $a_value) {
            $user_Info = get_user_meta($a_value->ID, 'nickname');
            $user_Priroty_Num = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_priorityNum');

            $user_option = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_myTurn');
            $user_Status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_userBoothStatus');
            $user_Remove_status = get_user_meta($a_value->ID, 'wp_' . $blog_id . '_RemoveFromQueue');
            // echo "<pre>";
            // print_r(  $user_option[0]);
            if (empty($user_Remove_status[0]) && !empty($user_Priroty_Num[0]) && $user_Priroty_Num[0] != "-") {
                array_push($arr, (object)[
                    'Email' => $user_Info[0],
                    'PrirotyNumber' => $user_Priroty_Num[0],
                    'turn' => $user_option[0],
                    'Id' => $a_value->ID,
                    'Status' => $user_Status[0],
                ]);

            }
        }
        $array_Pr = array();
        foreach ($arr as $key => $a_value) {
            // echo "<pre>";
            // print_r($a_value);

            //   echo "----------trtrtrtrtrt-----------";
            if ($a_value->turn == 'Checked') {
                array_push($array_Pr, $a_value->PrirotyNumber);

            }

        }

        if (!empty($array_Pr)) {

            $value = max($array_Pr);
        }

        $exhibitorflowstatusKey = "exhibitorentryflowstatus";
        $exhibitorflowstatus = get_option($exhibitorflowstatusKey);
        // global $cartCounts;
        // $cartCount= $cartCounts->instance()->cart->cart_contents_count();
        $userentryflow = $exhibitorflowstatus['status'];
        $user_ID = get_current_user_id();
        $user = wp_get_current_user();

        $blog_id = get_current_blog_id();
        $loggedInUser = get_user_meta($user_ID);
        $getroledata = unserialize($loggedInUser['wp_' . $blog_id . '_capabilities'][0]);
        $getroledata = (array)$getroledata;
        reset($getroledata);
        $rolename = key($getroledata);
        $get_all_roles_array = 'wp_' . $blog_id . '_user_roles';


        $loggedInUsers = array(
            'ID' => $user_ID,
            'UserLevel' => $rolename,
            'priorityNum' => $loggedInUser['wp_' . $blog_id . '_priorityNum'][0],
            'status' => $loggedInUser['wp_' . $blog_id . '_userBoothStatus'],
            'turn' => $loggedInUser['wp_' . $blog_id . '_myTurn'],
            'OverrideBoothLimit' => $loggedInUser['wp_' . $blog_id . '_OverrideNumberOfBooths'][0],
            'ReservedBooth' => unserialize($loggedInUser['wp_' . $blog_id . '_userBoothReserved'][0]),
            'OverrideCheck' => ($loggedInUser['wp_' . $blog_id . '_Override_Check'][0]),
            'Overrideprepaid' => $loggedInUser['wp_' . $blog_id . '_prePaid_checkbox'][0],
        );
        $user_info = get_userdata($user_ID);
        $actual_link = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        if (strpos($actual_link, '/floor-plan-editor/') != false) {

            $lastInsertId = contentmanagerlogging('Floor Plan Editor Opening', "Admin view", $FloorplanXml[0], $user_ID, $user_info->user_email, "specialLoging");

        } else {

            $lastInsertId = contentmanagerlogging('Floor Plan Viewer Loading', "User view", $FloorplanXml[0], $user_ID, $user_info->user_email, "specialLoging");
        }


        $args = array(
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'egpl_custome_tasks',
            'post_status' => 'draft',

        );
        $taskkeyContent = get_posts($args);

        foreach ($taskkeyContent as $taskindex => $taskValue) {

            $tasksID = $taskValue->ID;
            $value_key = get_post_meta($tasksID, 'key', true);
            $value_label = get_post_meta($tasksID, 'label', true);
            $arrayoftasks[$tasksID] = $value_label;

        }
        $arrayoftasks = json_encode($arrayoftasks);
        global $wp_roles;
        $all_roles = $wp_roles->roles;
        foreach ($all_roles as $key => $name) {

            if ($key != 'administrator' && $key != 'contentmanager' && $key != 'subscriber' && $key != 'master_admin') {

                $arrayoflevels[$key] = $name['name'];
            }
        }
        $arrayoflevels = json_encode($arrayoflevels);
        if (!empty($wooconsumerkey) && !empty($wooseceretkey)) {

            require_once('lib/woocommerce-api.php');
            $url = get_site_url();
            $options = array(
                'debug' => true,
                'return_as_array' => false,
                'validate_url' => false,
                'timeout' => 30,
                'ssl_verify' => false,
            );
            $woocommerce_object = new WC_API_Client($url, $wooconsumerkey, $wooseceretkey, $options);
            $all_products = $woocommerce_object->products->get('', ['filter[limit]' => -1, 'filter[post_status]' => 'any']);

            $indexProduct = 0;

            foreach ($all_products->products as $single_product) {


                if ($single_product->categories[0] == 'Booths') {
                    $boothsproductsData[$indexProduct]['title'] = $single_product->title;
                    $boothsproductsData[$indexProduct]['id'] = $single_product->id;
                    $boothsproductsData[$indexProduct]['price'] = (int)$single_product->price;
                    $indexProduct++;
                }

            }


            if (!empty($boothsproductsData)) {
                $boothsproductsData = json_encode($boothsproductsData);
            }


        }


        $key = 'custome_exhibitor_flow_settings_data';
        $exhibitorEntryLevel = get_option($key);
        $packageboothflow = "disabled";

        if ($exhibitorEntryLevel[2]['statusactive'] == true) {

            $packageboothflow = "enabled";

        }


        $current_site_logo = $contentmanager_settings['ContentManager']['adminsitelogo'];
        $current_site_name = get_bloginfo('name');
        $current_site_url = get_site_url();
        $current_floor_plan_status = $status;
        include 'functions.php';


    } else {

        $redirect = get_site_url();
        wp_redirect($redirect);
        exit;
    }

}

add_shortcode('floorplan', 'floorplan_shortcode');


function floorplan_contentmanagerlogging($acction_name, $action_type, $pre_action_data, $user_id, $email, $result)
{


// Create post object


    $current_user = wp_get_current_user();
    $dataArray['Action-type'] = $action_type;
    $dataArray['Logged-in-user-id'] = $current_user->ID;
    $dataArray['Pre-action-data'] = $pre_action_data;
    $dataArray['Email'] = $email;
    $dataArray['IP'] = $_SERVER['REMOTE_ADDR'];
    $dataArray['Result'] = $result;

    $data['title'] = $acction_name;
    $data['email'] = $email;
    return $data;


}

require 'plugin-update-checker/plugin-update-checker.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;


if (is_admin()) { // note the use of is_admin() to double check that this is happening in the admin
    // $config = array(
    //     'slug' => plugin_basename(__FILE__), // this is the slug of your plugin
    //     'proper_folder_name' => 'floorplan', // this is the name of the folder your plugin lives in
    //     'api_url' => 'https://api.github.com/repos/QasimRiaz/Floorplan', // the GitHub API url of your GitHub repo
    //     'raw_url' => 'https://raw.github.com/QasimRiaz/Floorplan/master', // the GitHub raw url of your GitHub repo
    //     'github_url' => 'https://github.com/QasimRiaz/Floorplan', // the GitHub url of your GitHub repo
    //     'zip_url' => 'https://github.com/QasimRiaz/Floorplan/zipball/master', // the zip url of the GitHub repo
    //     'sslverify' => true, // whether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details
    //     'requires' => '3.0', // which version of WordPress does your plugin require?
    //     'tested' => '3.3', // which version of WordPress is your plugin tested up to?
    //     'readme' => 'README.md', // which file to use as the readme for the version number
    //     'access_token' => '', // Access private repositories by authorizing under Appearance > GitHub Updates when this example plugin is installed
    // );
    // new WP_GitHub_floorplan_Updater($config);


    // $tokennumber ="expo-2023-"."FJr4Fa1i9RBzK7hbPRvDpRNfcrWUBi0EJ6c2";
    // $gitAuthKey = 'ghp_'.str_replace("expo-2023-",'',$tokennumber);


    // $myUpdateChecker = PucFactory::buildUpdateChecker(
    //     'https://github.com/QasimRiaz/Floorplan',
    //     __FILE__,
    //     'FloorPlan'
    // );

    // $myUpdateChecker->setBranch('master');
    // $myUpdateChecker->setAuthentication($gitAuthKey);
    // $myUpdateChecker->getVcsApi()->enableReleaseAssets();


    $gitKey = get_option("eg_gitauth_key");

    if (!empty($gitKey)) {
        $myUpdateChecker = PucFactory::buildUpdateChecker(
            'https://github.com/QasimRiaz/Floorplan',
            __FILE__,
            'FloorPlan'
        );
        $myUpdateChecker->setBranch('master');
        $myUpdateChecker->setAuthentication($gitKey);
        $myUpdateChecker->getVcsApi()->enableReleaseAssets();
    }


}


/* Add image to media library from URL and return the new image ID */
function floorplanBoothImage($url)
{

    // Gives us access to the download_url() and wp_handle_sideload() functions
    require_once(ABSPATH . 'wp-admin/includes/file.php');

    // Download file to temp dir
    $timeout_seconds = 10;
    $temp_file = download_url($url, $timeout_seconds);

    if (!is_wp_error($temp_file)) {

        // Array based on $_FILE as seen in PHP file uploads
        $file = array(
            'name' => basename($url), // ex: wp-header-logo.png
            'type' => 'image/png',
            'tmp_name' => $temp_file,
            'error' => 0,
            'size' => filesize($temp_file),
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
        $results = wp_handle_sideload($file, $overrides);


        if (!empty($results['error'])) {
            // Insert any error handling here
        } else {


            $url = $results['url'];
            $type = $results['type'];
            $file = $results['file'];
            $title = sanitize_text_field($name);
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
            $id = wp_insert_attachment($attachment, $file, '', true);
            require_once(ABSPATH . 'wp-admin/includes/image.php');

// Generate the metadata for the attachment, and update the database record.
            $attach_data = wp_generate_attachment_metadata($id, $file);
            wp_update_attachment_metadata($id, $attach_data);


            return $id;
        }
    }
}

function boothSelfAssignment(){

    require_once plugin_dir_path(__DIR__) . 'EGPL/includes/floorplan-manager.php';
    include_once(plugin_dir_path(__DIR__) . 'EGPL/egpl_core_functions_nine.php');
    
    $productID = $_POST['booth_productid'];
    $userloggedinstatus = $_POST['userloggedinstatus'];
   
    $userlimit = $_POST['userlimit']; 

    $demo = new FloorPlanManager();
    $AllBoothsList = $demo->getAllbooths();
    $id = $product_ID;
    $user_ID = get_current_user_id();
    $blog_id = get_current_blog_id();
    $loggedInUser = get_user_meta($user_ID);
    require_once('lib/woocommerce-api.php');
    $url = get_site_url();

    $get_product = wc_get_product($id);
 
    $number = 0;
    if ($user_ID) {
        foreach ($AllBoothsList as $boothIndex => $boothValue) {
            if ($boothValue['bootheOwnerID'] == $user_ID) {
                $number++;
            }
        }
    }
    $purchCount = $number;

//    echo $productID.'===='.$userloggedinstatus.'===='.$purchCount.'===='.$userlimit;
//    exit;
    
    $result = 'limitnotreached';
    if ((($userlimit <= $purchCount && $userlimit != '') && $purchCount != 0) && ($userloggedinstatus == "1")) {

        $result = 'limitreached';
    }


    if($result != 'limitreached'){

      
        $woocommerce_rest_api_keys = get_option('ContenteManager_Settings');
        $boothpurchaseenablestatus = $woocommerce_rest_api_keys['ContentManager']['boothpurchasestatus'];
        $current_user = get_current_user_id();
        if ($current_user != 0 && !empty($current_user) && !empty($boothpurchaseenablestatus) && $boothpurchaseenablestatus == "enabled") {
            // echo '8897';
    
            $OrderUserID = $current_user;
            $foolrplanID = $woocommerce_rest_api_keys['ContentManager']['floorplanactiveid'];
            $boothTypesLegend = json_decode(get_post_meta($foolrplanID, 'legendlabels', true));
            $FloorplanXml = get_post_meta($foolrplanID, 'floorplan_xml', true);
            $FloorplanXml = str_replace('"n<', '<', $FloorplanXml);
            $FloorplanXml = str_replace('>n"', '>', $FloorplanXml);
            $xml = simplexml_load_string($FloorplanXml) or die("Error: Cannot create object");
            $currentIndex = 0;
    
            foreach ($xml->root->MyNode as $cellIndex => $CellValue) {
                $cellboothlabelvalue = $CellValue->attributes();
                $getCellStylevalue = $xml->root->MyNode[$currentIndex]->mxCell->attributes();
    
                if (!empty($cellboothlabelvalue['boothproductid']) && $cellboothlabelvalue['boothproductid'] == $productID) {
                    $att = "boothOwner";
                    $styleatt = 'style';
                    $xml->root->MyNode[$currentIndex]->attributes()->$att = $OrderUserID;
                    $loggin_data['boothnumberindex'][] = '' . $cellboothlabelvalue['mylabel'];
                    $loggin_data['ownerID'][] = $OrderUserID;
                    $getCellStyle = $getCellStylevalue['style'];
                    $getCellStyle = str_replace($oldfillcolortext, 'fillColor=' . $NewfillColor, $getCellStyle);
                    $xml->root->MyNode[$currentIndex]->mxCell->attributes()->$styleatt = $getCellStyle;
    
                    if (isset($cellboothlabelvalue['legendlabels']) && !empty($cellboothlabelvalue['legendlabels'])) {
                        $orderlogginsData['legendlabels'][] = 'enabled';
                        $getlabelID = '' . $cellboothlabelvalue['legendlabels'];
                        foreach ($boothTypesLegend as $boothlabelIndex => $boothlabelValue) {
                            if ($boothlabelValue->ID == $getlabelID) {
                                $createdproductPrice = $boothlabelValue->colorcodeOcc;
                                if ($createdproductPrice != "none") {
                                    $NewfillColor = $createdproductPrice;
                                    $getCellStyleArray = explode(';', $getCellStyle);
                                    foreach ($getCellStyleArray as $styleIndex => $styleValue) {
                                        if ($styleValue != 'DefaultStyle1') {
                                            $styledeepCheck = explode('=', $styleValue);
                                            if ($styledeepCheck[0] == 'fillColor') {
                                                $oldfillcolortext = $styleValue;
                                            }
                                        }
                                    }
                                } else {
                                    $getCellStyleArray = explode(';', $getCellStyle);
                                    foreach ($getCellStyleArray as $styleIndex => $styleValue) {
                                        if ($styleValue != 'DefaultStyle1') {
                                            $styledeepCheck = explode('=', $styleValue);
    
                                            if ($styledeepCheck[0] == 'occ') {
                                                $NewfillColor = $styledeepCheck[1];
                                            } elseif ($styledeepCheck[0] == 'fillColor') {
                                                $oldfillcolortext = $styleValue;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        $orderlogginsData['legendlabels'][] = 'disabled';
                        $getCellStyleArray = explode(';', $getCellStyle);
                        foreach ($getCellStyleArray as $styleIndex => $styleValue) {
                            if ($styleValue != 'DefaultStyle1') {
                                $styledeepCheck = explode('=', $styleValue);
                                if ($styledeepCheck[0] == 'occ') {
                                    $NewfillColor = $styledeepCheck[1];
                                } elseif ($styledeepCheck[0] == 'fillColor') {
                                    $oldfillcolortext = $styleValue;
                                }
                            }
                        }
                    }
    
                    $orderlogginsData['assigendcolor'][] = $NewfillColor;
                    $orderlogginsData['assigendoldcolor'][] = $oldfillcolortext;
                    $getCellStyle = str_replace($oldfillcolortext, 'fillColor=' . $NewfillColor, $getCellStyle);
                    $xml->root->MyNode[$currentIndex]->mxCell->attributes()->$styleatt = $getCellStyle;
                }
                $currentIndex++;
            }
    
            $getresultforupdat = str_replace('<?xml version="1.0"?>', "", $xml->asXML());
            update_post_meta($foolrplanID, 'floorplan_xml', json_encode($getresultforupdat));
            update_post_meta($id, 'boothStatus', 'Completed');
            $loggin_data['boothstatus'][] = 'Completed';
        } else {
            update_post_meta($id, 'boothStatus', 'Pending');
            $loggin_data['boothstatus'][] = 'Pending';
        }
    }

        //Getting Settings for Booth//
    $floor_Plan_Settings = 'floorPlanSettings';
    $Booth_Queue_Settings = 'boothQueueSettings';
    $get = get_option($floor_Plan_Settings);
    
    
    if ($get['tableSort'] == "checked") {
            $get_booth_settings = get_option($Booth_Queue_Settings);
             user_pirority_Updates($get_booth_settings);
        }
     echo $result;
}   
?>
