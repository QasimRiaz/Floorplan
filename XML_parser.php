<?php

//     EGPL_floorplan 
//     fp_bgimage_url
//     fp_posX
//     fp_posY
//     fp_height
//     fp_width
//     fp_bgcolor
//     fp_id

//     EGPL_object 
//     fp_object_type
//     fp_object_label
//     fp_object_companydiscription
//     fp_object_detail
//     fp_object_posX
//     fp_object_posY
//     fp_object_width
//     fp_object_height
//     fp_object_exhibitor_id
//     fp_object_product_id
//     fp_object_legendlabel_id
//     fp_object_boothtags_id (List of booth tag IDs)
//     fp_object_id
//     fp_object_floorplan_id
//     fp_object_style_type
//     fp_object_style_%name% (there could be more than one)

//     EGPL_legendlabel 
//     fp_legendlabel_id
//     fp_legendlabel_name
//     fp_legendlabel_unOcc_color
//     fp_legendlabel_occ_color
//     fp_legendlabel_colorstatus

//     EGPL_boothtag 
//     fp_boothtag_id
//     fp_boothtag_name

    // EGPL_customstyle
    // fp_customstyle_height
    // fp_customstyle_width
    // fp_customstyle_%CSS_elements%

function clear_posts()
{
    // """
    // clears the custom post types of EGPL_floorplan,EGPL_object,EGPL_legendlabel,EGPL_boothtags. This function will clear all of the floorplan data saved in these custom types.
    // Args:
    //     None
    // Returns:
    //     None
    // Raises:
    //     None
    // """
    $post_type = 'EGPL_floorplan'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true);
    }
    $post_type = 'EGPL_object'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true); 
    }
    $post_type = 'EGPL_legendlabel'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true); 
    }
    $post_type = 'EGPL_boothtag'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true); 
    }
    $post_type = 'EGPL_customstyle'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true); 
    }
    $response = array(
        'message' => 'Data removed from fp posts'
        );
    return new WP_REST_Response($response, 200);
}

function parse_CSS($CSS_string)
{
    // """
    // takes in a CSS class and returns KEY VALUE PAIRS of the CSS attributes.
    // Args:
    //     the CSS as a string
    // Returns:
    //     Dictionary of the key value pairs
    // Raises:
    //     None
    // """
    $parsed_data = array();
    $lines = explode(';', $CSS_string);
    foreach ($lines as $line) 
    {
        $pairs = explode('=', $line);
        if (count($pairs) === 2) 
        {
            $key = trim($pairs[0]); 
            $value = trim($pairs[1]);
            $parsed_data[$key] = $value;
        }
        elseif ($line != '') 
        {
            echo 'type_Here'.$line;
            $parsed_data['type'] = $line;
        }
    }
    return $parsed_data;
}

function fp_get_bg()
{
    //query to get legend label colors
    $args = array(
    'post_type'      => 'EGPL_floorplan',
    'posts_per_page' => 1,   
    'post_status'  => "draft",
    );
    $_output = new WP_Query($args);
    if ($_output->have_posts())
    {
        $post = $_output->the_post();
        $ID = get_the_ID();
        $bg = get_post_meta($ID,'fp_bgimage_url',true);
    }
    if ($bg != '')
    {
        return $bg;
    }
    else
    {
        echo 'bg image not found';
    }

}
function fp_new_db()
{
    //floorplan post in the post type, the attributes will be saved in the post meta
    $floorplan_data = array(
        'post_title' => 'floorplan',
        'post_content' => 'floorplan',
        'post_status'  => "draft",
        'post_author'  => "",
        'post_type'    => 'EGPL_floorplan'
    );
    //FLOORPLAN SCHEMA
    // floorplan (fp_bgimage_url,fp_height,fp_width,fp_posX,fp_posY,fp_bgcolor,fp_id)
    $floorplan_id = wp_insert_post($floorplan_data);

    //adding attributes in the meta tags
    add_post_meta($floorplan_id,'fp_bgimage_url',"",true);
    add_post_meta($floorplan_id, 'fp_posX', "2487", true);
    add_post_meta($floorplan_id, 'fp_posY', "2370", true);
    add_post_meta($floorplan_id, 'fp_height', "2175", true);
    add_post_meta($floorplan_id, 'fp_width', "2175", true);
    add_post_meta($floorplan_id, 'fp_bgcolor', "", true);
    add_post_meta($floorplan_id,'fp_id',$floorplan_id,true);

    //adding these to object post meta
    $legendLabel_data = array(
        'post_title' => "Gold",
        'post_content' => "",
        'post_status'  => "draft",
        'post_author'  => "",
        'post_type'    => 'EGPL_legendlabel'
    );
    $legendlabel_post_id = wp_insert_post($legendLabel_data);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_id",1,true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_name",'Gold',true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_unOcc_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_occ_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_colorstatus",true,true);

    //adding these to object post meta
    $legendLabel_data = array(
        'post_title' => "Sliver",
        'post_content' => "",
        'post_status'  => "draft",
        'post_author'  => "",
        'post_type'    => 'EGPL_legendlabel'
    );
    $legendlabel_post_id = wp_insert_post($legendLabel_data);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_id",2,true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_name",'Sliver',true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_unOcc_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_occ_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_colorstatus",true,true);


    //adding these to object post meta
    $legendLabel_data = array(
        'post_title' => "Red",
        'post_content' => "",
        'post_status'  => "draft",
        'post_author'  => "",
        'post_type'    => 'EGPL_legendlabel'
    );
    $legendlabel_post_id = wp_insert_post($legendLabel_data);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_id",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_name",'Red',true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_unOcc_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_occ_color","#00000",true);
    add_post_meta($legendlabel_post_id,"fp_legendlabel_colorstatus",true,true);
}

function fp_create_db($postdata)
{
    // """
    // fetches the data from floorplan post type and populates the new schema mentioned above.
    // Args:
    //     None
    // Returns:
    //     WP_rest response on succesful operation.
    // Raises:
    //     None
    // """
    //SAMPLE INFORMATION TO CREATE DB FROM
    $fp_post_id = get_posts([
        'post_type' => 'floor_plan',
        'posts_per_page' => 1,
        'post_status' => 'draft',
        'fields' => 'ids',
    ])[0];
    $xml = simplexml_load_string(stripslashes($postdata['floorXml']));     
    $bg_image_url = $postdata['floorBG'];
    $legend_labels = json_decode(get_post_meta($fp_post_id, 'legendlabels', true),true);
    $booth_tags = json_decode(get_post_meta($fp_post_id, 'boothtags',true),true);

    //clear previous DB
    if ($xml == false)
    {
        echo "xml not loaded";
        return;
    }

    //clear post types
    $post_type = 'EGPL_floorplan'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true);
    }
    $post_type = 'EGPL_object'; 
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, 
        'post_status'  => "draft"
    );
    $previous_posts = get_posts($args);
    foreach ($previous_posts as $post) {
        wp_delete_post($post->ID, true); 
    }
    
    //get information for floorplan
    $static_page = $xml->xpath("//mxGraphModel");
    foreach ($static_page as $page)
    {
        $dx = strval($page['dx']);
        $dy = strval($page['dy']);
        $pageScale = strval($page['pageScale']);
        $pageWidth = strval($page['pageWidth']);
        $pageHeight = strval($page['pageHeight']);
        $background = strval($page['background']);
    }
    
    //floorplan post in the post type, the attributes will be saved in the post meta
    $floorplan_data = array(
        'post_title' => 'floorplan',
        'post_content' => 'floorplan',
        'post_status'  => "draft",
        'post_author'  => "",
        'post_type'    => 'EGPL_floorplan'
    );
    //FLOORPLAN SCHEMA
    // floorplan (fp_bgimage_url,fp_height,fp_width,fp_posX,fp_posY,fp_bgcolor,fp_id)
    $floorplan_id = wp_insert_post($floorplan_data);

    //adding attributes in the meta tags
    add_post_meta($floorplan_id,'fp_bgimage_url',$bg_image_url,true);
    add_post_meta($floorplan_id, 'fp_posX', $dx, true);
    add_post_meta($floorplan_id, 'fp_posY', $dy, true);
    add_post_meta($floorplan_id, 'fp_height', $pageWidth, true);
    add_post_meta($floorplan_id, 'fp_width', $pageHeight, true);
    add_post_meta($floorplan_id, 'fp_bgcolor', $background, true);
    add_post_meta($floorplan_id,'fp_id',$floorplan_id,true);

    //object scheme Oject(fp_object_type,fp_object_label,fp_object_detail,fp_object_posX,fp_object_posY,fp_object_exhibitor_id,fp_object_product_id,fp_object_isOccupied)
    //get information for objects
    $elements = $xml->xpath("//MyNode");
    foreach($elements as $element)
    {
        //object
        $fp_object_type = "booth";
        $fp_object_label = strval($element['mylabel']);
        $fp_object_detail = strval($element['boothDetail']);
        $fp_object_companydescription = strval($element['companydescripiton']);
        $fp_object_posX = strval($element->mxCell->mxGeometry['x']);
        $fp_object_posY = strval($element->mxCell->mxGeometry['y']);
        $fp_object_width  = strval($element->mxCell->mxGeometry['width']);
        $fp_object_height = strval($element->mxCell->mxGeometry['height']);
        $fp_object_exhibitor_id = strval($element['boothOwner']);
        $fp_object_product_id = strval($element['boothproductid']);
        $fp_object_legend_label_id = strval($element['legendlabels']);
        $fp_object_boothtag_ids = strval($element['boothtags']);
        $fp_object_boothtag_ids_list = explode(',',$fp_object_boothtag_ids);
        $fp_object_id = strval($element['id']);
        $fp_object_floorplan_id = $floorplan_id;

        $fp_legendlabel_id = strval($element['legendlabels']);
        //adding these to object post meta
        $object_data = array(
            'post_title' => $fp_object_label,
            'post_content' => "",
            'post_status'  => "draft",
            'post_author'  => "",
            'post_type'    => 'EGPL_object'
        );
        $object_id = wp_insert_post($object_data);
        add_post_meta($object_id,"fp_object_type",$fp_object_type, true);
        add_post_meta($object_id,"fp_object_label",$fp_object_label, true);
        add_post_meta($object_id,"fp_object_companydiscription",$fp_object_companydescription, true);
        add_post_meta($object_id,"fp_object_detail",$fp_object_detail, true);
        add_post_meta($object_id,"fp_object_posX",$fp_object_posX, true);
        add_post_meta($object_id,"fp_object_posY",$fp_object_posY, true);
        add_post_meta($object_id,"fp_object_width",$fp_object_width,true);
        add_post_meta($object_id,"fp_object_height",$fp_object_height,true);
        add_post_meta($object_id,"fp_object_exhibitor_id",$fp_object_exhibitor_id, true);
        add_post_meta($object_id,"fp_object_product_id",$fp_object_product_id, true);
        add_post_meta($object_id,"fp_object_legendlabel_id",$fp_object_legend_label_id, true);
        add_post_meta($object_id,"fp_object_boothtags_id",$fp_object_boothtag_ids_list, true);
        add_post_meta($object_id,"fp_object_id",$fp_object_id, true);
        add_post_meta($object_id,"fp_object_floorplan_id",$fp_object_floorplan_id, true);

        //style tags
        $style_list = parse_CSS(strval($element->mxCell['style']));
        $prefix = 'fp_object_style_';
        foreach($style_list as $key => $value)
        {   
            add_post_meta($object_id,$prefix.$key,$value, true);
        }
    }
    //update_boothtags($postdata);
    //update_boothtypes($postdata);
    //update_legendlabels($postdata);
}

function update_boothtags($postdata)
{
    $booth_tags = json_decode(stripslashes($postdata['boothtagsArray']),true);
    if ($booth_tags !== null) 
    {
        $post_type = 'EGPL_boothtag'; 
        $args = array(
            'post_type' => $post_type,
            'posts_per_page' => -1, 
            'post_status'  => "draft"
        );
        $previous_posts = get_posts($args);
        foreach ($previous_posts as $post) {
            wp_delete_post($post->ID, true); 
        }
    }
    else
    {
        echo "boothtags array not present";
    }


    if ($booth_tags !== null) 
    {
        foreach ($booth_tags as $boothtag) 
        {
            //adding these to object post meta
            $boothtag_data = array(
                'post_title' => $boothtag['name'],
                'post_content' => "",
                'post_status'  => "draft",
                'post_author'  => "",
                'post_type'    => 'EGPL_boothtag'
            );
            $boothtag_post_id = wp_insert_post($boothtag_data);
            add_post_meta($boothtag_post_id,"fp_boothtag_id",$boothtag['ID'],true);
            add_post_meta($boothtag_post_id,"fp_boothtag_name",$boothtag['name'],true);
        }
    } else {
        echo "Failed to parse boothtag JSON.";
    }
    echo 'saved';
}

function update_legendlabels($postdata)
{
    $legend_labels = json_decode(stripslashes($postdata['legendstypesArray']),true);
    if ($legend_labels !== null)
    {
        $post_type = 'EGPL_legendlabel'; 
        $args = array(
            'post_type' => $post_type,
            'posts_per_page' => -1, 
            'post_status'  => "draft"
        );
        $previous_posts = get_posts($args);
        foreach ($previous_posts as $post) {
            wp_delete_post($post->ID, true); 
        }
    
    }
    else
    {
        echo 'legend label array not present';
    }

    if ($legend_labels !== null) 
    {
        foreach ($legend_labels as $label) 
        {
            //adding these to object post meta
            $legendLabel_data = array(
                'post_title' => $label['name'],
                'post_content' => "",
                'post_status'  => "draft",
                'post_author'  => "",
                'post_type'    => 'EGPL_legendlabel'
            );
            $legendlabel_post_id = wp_insert_post($legendLabel_data);
            add_post_meta($legendlabel_post_id,"fp_legendlabel_id",$label['ID'],true);
            add_post_meta($legendlabel_post_id,"fp_legendlabel_name",$label['name'],true);
            add_post_meta($legendlabel_post_id,"fp_legendlabel_unOcc_color",$label['colorcode'],true);
            add_post_meta($legendlabel_post_id,"fp_legendlabel_occ_color",$label['colorcodeOcc'],true);
            add_post_meta($legendlabel_post_id,"fp_legendlabel_colorstatus",$label['colorstatus'],true);
        }
    } else {
        echo "Failed to parse legend label JSON.";
    }
}

function update_boothtypes($postdata)
{
    $boothtypes = json_decode(stripslashes($postdata['boothTypes']),true); 
    if ($boothtypes !== null)
    {
        $post_type = 'EGPL_customstyle'; 
        $args = array(
            'post_type' => $post_type,
            'posts_per_page' => -1, 
            'post_status'  => "draft"
        );
        $previous_posts = get_posts($args);
        foreach ($previous_posts as $post) {
            wp_delete_post($post->ID, true); 
        }
    
    }
    else
    {
        echo 'boothtype array not present';
    }

    if ($boothtypes !== null) 
    {
        foreach ($boothtypes as $label) 
        {
            //adding these to object post meta
            $boothtype_data = array(
                'post_title' => $label['name'],
                'post_content' => "",
                'post_status'  => "draft",
                'post_author'  => "",
                'post_type'    => 'EGPL_customstyle'
            );
            $boothtype_post_id = wp_insert_post($boothtype_data);
            add_post_meta($boothtype_post_id,"fp_customstyle_width",$label['width'],true);
            add_post_meta($boothtype_post_id,"fp_customstyle_height",$label['height'],true);
            $style_list = parse_CSS($label['style']);
            $prefix = 'fp_customstyle_';
            foreach($style_list as $key => $value)
            {   
                add_post_meta($boothtype_post_id,$prefix.$key,$value, true);
            }

        }
    } else {
        echo "Failed to parse boothtype JSON.";
    }
}

function get_boothtags()
{
    $boothtags = array();
    $args = array(
        'post_type' => 'EGPL_boothtag',
        'posts_per_page' => -1, 
        'post_status' => 'draft'
    );
    //quering for the floorplan data
    $output = new WP_Query($args);
    while ($output->have_posts())
    {
        $output->the_post();
        $post_id = get_the_ID();
        $ID = get_post_meta($post_id,'fp_boothtag_id',true);
        $name = get_post_meta($post_id,'fp_boothtag_name',true); 
        $boothtag = array(
            'ID' => $ID,
            'name' => $name
        );
        $boothtags[] = $boothtag;
        wp_reset_postdata();
    }
    $JSON = json_encode($boothtags);
    return $JSON;
}
function get_legendlabels()
{
    $legendlabels = array();
    $args = array(
        'post_type' => 'EGPL_legendlabel',
        'posts_per_page' => -1, 
        'post_status' => 'draft'
    );
    //quering for the floorplan data
    $output = new WP_Query($args);
    while ($output->have_posts())
    {
        $output->the_post();
        $post_id = get_the_ID();
        $ID = get_post_meta($post_id,'fp_legendlabel_id',true);
        $name = get_post_meta($post_id,'fp_legendlabel_name',true); 
        $unOcc_color = get_post_meta($post_id,'fp_legendlabel_unOcc_color',true); 
        $occ_color = get_post_meta($post_id,'fp_legendlabel_occ_color',true); 
        $colorstatus = get_post_meta($post_id,'fp_legendlabel_colorstatus',true); 
        $legendlabel = array(
            'ID' => $ID,
            'name' => $name,
            'colorcode' => $unOcc_color,
            'colorcodeOcc' => $occ_color,
            'colorstatus' => $colorstatus
        );
        $legendlabels[] = $legendlabel;
        wp_reset_postdata();
    }
    $JSON = json_encode($legendlabels);
    return $JSON;
}
function get_boothtypes()
{
    $boothtypes = array();
    $args = array(
        'post_type' => 'EGPL_customstyle',
        'posts_per_page' => -1, 
        'post_status' => 'draft'
    );
    //quering for the floorplan data
    $output = new WP_Query($args);
    while ($output->have_posts())
    {
        $non_style_tags = ['fp_customstyle_type','fp_customstyle_width','fp_customstyle_height'];
        $output->the_post();
        $post_id = get_the_ID();
        $width = get_post_meta($post_id,'fp_customstyle_width',true);
        $height = get_post_meta($post_id,'fp_customstyle_height',true); 
        $all_post_meta_keys = get_post_custom_keys($post_id);
        $prefix = 'fp_customstyle_';
        $CSS_string = "";
        //getting all style tags and creating CSS string for the XML    
        foreach ($all_post_meta_keys as $meta_key)
        {
            if ($meta_key == 'fp_customstyle_type')
            {
                $line = get_post_meta($post_id,$meta_key,true).';';
                $CSS_string .= $line;
            }
            elseif (!in_array($meta_key,$non_style_tags))
            {
                $line = substr($meta_key,15).'='.get_post_meta($post_id, $meta_key, true).';';
                $CSS_string .= $line;
            }
        }
        $boothtype = array(
            'width' => $width,
            'height' => $height,
            'style' => $CSS_string
        );
        $boothtypes[] = $boothtype;
        wp_reset_postdata();
    }
    $JSON = json_encode($boothtypes);
    return $JSON;
}

function fp_create_xml()
{
    // """
    // fetches the data from new schema and populates a string form XML for the current floorplan version.
    // Args:
    //     None
    // Returns:
    //     XML in string form
    // Raises:
    //     None
    // """

    //XML object that will be populated with the data
    $xml = new SimpleXMLElement('<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>');
    $args = array(
        'post_type' => 'EGPL_floorplan',
        'posts_per_page' => -1, 
        'post_status' => 'draft'
    );
    //quering for the floorplan data
    $output = new WP_Query($args);
    if ($output->have_posts())
    {
        while($output->have_posts())
        {
            $output->the_post();
            $post_id = get_the_ID(); 
            $xml['dx'] = get_post_meta($post_id, 'fp_posX', true);
            $xml['dy'] = get_post_meta($post_id, 'fp_posY', true);
            $xml['grid'] = 1;
            $xml['gridSize'] = 1;
            $xml['guides'] = 1;
            $xml['tooltips'] = 1;
            $xml['connect'] = 0;
            $xml['arrows'] = 0;
            $xml['fold'] = 1;
            $xml['page'] =1;
            $xml['pageScale'] = 1;
            $xml['pageWidth'] = get_post_meta($post_id, 'fp_height', true);
            $xml['pageHeight'] = get_post_meta($post_id, 'fp_width', true);
            $xml['background'] = get_post_meta($post_id, 'fp_bgcolor', true);
            wp_reset_postdata();
        }
    }
    else
    {
        echo 'no floorplan found';
    }
    //quering for floorplan objects

    $args = array(
        'post_type' => 'EGPL_object',
        'posts_per_page' => -1, 
        'post_status' => 'draft'
    );
    $output = new WP_Query($args);
    if ($output -> have_posts())
    {
        while($output->have_posts())
        {
            $output->the_post();
            $post_id = get_the_ID();
            $my_node = $xml->root->addChild('MyNode');
            $my_node->addAttribute('mylabel', get_post_meta($post_id, 'fp_object_label', true));
            $my_node->addAttribute('boothDetail', get_post_meta($post_id, 'fp_object_detail', true));
            $my_node->addAttribute('companydescripiton', get_post_meta($post_id, 'fp_object_companydescription"', true));
            $my_node->addAttribute('legendlabels', get_post_meta($post_id, 'fp_object_legendlabel_id', true));
            $val =  strval(get_post_meta($post_id, 'fp_object_legendlabel_id', true));
            //query to get legend label colors
            $args = array(
                'post_type'      => 'EGPL_legendlabel',
                'posts_per_page' => 1,   
                'post_status'  => "draft",
                'meta_query'     => array(
                    array(
                        'key'     => 'fp_legendlabel_id', 
                        'value'   => $val, 
                        'compare' => '=', 
                    ),
                ),
            );
            $_output = new WP_Query($args);
            if ($_output->have_posts())
            {
                $legend_label_post = $_output->the_post();
                $legend_label_post_id = get_the_ID();
                $my_node->addAttribute('legendlabelscolorUn', get_post_meta($legend_label_post_id,'fp_legendlabel_unOcc_color', true));
                $my_node->addAttribute('legendlabelscolorOcc', get_post_meta($legend_label_post_id, 'fp_legendlabel_occ_color', true));
            }
            else
            {
                $my_node->addAttribute('legendlabelscolorUn', '');
                $my_node->addAttribute('legendlabelscolorOcc','');
            }
            $my_node->addAttribute('pricetegid', "");
            $boothtags_list = get_post_meta($post_id, 'fp_object_boothtags_id', true);
            $boothtags_array = array(); 
            foreach ($boothtags_list as $boothtag) {
                $boothtags_array[] = $boothtag; 
            }
            $boothtags = implode(',', $boothtags_array); 
            $my_node->addAttribute('boothtags', $boothtags);
            $my_node->addAttribute('boothOwner', get_post_meta($post_id, 'fp_exhibitor_id', true));
            $my_node->addAttribute('boothproductid', get_post_meta($post_id, 'fp_object_product_id', true));
            $my_node->addAttribute('label', "");
            $my_node->addAttribute('id', get_post_meta($post_id, 'fp_object_id', true));
            $mxCell = $my_node->addChild('mxCell');
            $all_post_meta_keys = get_post_custom_keys($post_id);
            $prefix = 'fp_object_style_';
            $CSS_string = "";
            //getting all style tags and creating CSS string for the XML    
            foreach ($all_post_meta_keys as $meta_key)
            {
                if ($meta_key == 'fp_object_style_type')
                {
                    $line = get_post_meta($post_id,$meta_key,true).';';
                }
                elseif (strpos($meta_key, $prefix) === 0)
                {
                    $line = substr($meta_key,16).'='.get_post_meta($post_id, $meta_key, true).';';
                    $CSS_string .= $line;
                }
            }
            $mxCell->addAttribute('style', $CSS_string);
            $mxCell->addAttribute('parent',1);
            $mxCell->addAttribute('vertex',1);
            $mxGeometry = $mxCell->addChild('mxGeometry');
            $mxGeometry->addAttribute('x', get_post_meta($post_id, 'fp_object_posX', true));
            $mxGeometry->addAttribute('y', get_post_meta($post_id, 'fp_object_posY', true));
            $mxGeometry->addAttribute('width', get_post_meta($post_id, 'fp_object_width', true));
            $mxGeometry->addAttribute('height', get_post_meta($post_id, 'fp_object_height', true));
            $mxGeometry->addAttribute('as',"geometry");
            wp_reset_postdata();
        }
    }
    $xmlString = str_replace('<?xml version="1.0"?>', "", $xml->asXML()); //removes <xml> version tag at the start
    $xmlString = '"n'.$xmlString.'n"'; //adds the headers that are required in the other endpoint for the XML
    $xmlString = str_replace(PHP_EOL, '', $xmlString);
    return $xmlString;
}
    
function fp_test()
{
    // """
    // test function to test the functionality of the above code, this function creates DB, clears the floorplanXML 
    // in the floorplan post type and creates the new XML and preprocces it and updates the floorplan meta tag "floorplanXML" 
    // with new XML. This function is for testing purposes only.
    // Args:
    //     WP rest response to see changes in META tags between and after changes
    // Returns:
    //     XML in string form
    // Raises:
    //     None
    // """
    $fp_post_id = 274; //replace this with query for the specific subsite.
    //update_boothtypes();
    $JSON = get_boothtypes();
    $response = array(
    'message' => 'hi',
    'boothtypes' => get_post_custom_keys($fp_post_id),
    'new_meta' => $JSON
    );
    return new WP_REST_Response($response, 200);
}
