<?php 

        
    if($_REQUEST){    
        
        
        
        
        $params=[
            'apikey'=>'qmmksSjDKvuokVkrK7T6ihXNov6daB0no9nilAo90eRGnc3tQ7jukmHojx3SIhlr',
            'inputformat'=>'html',
            'input'=>'raw',
            'outputformat'=>$_REQUEST['outputformat'],
            'file'=>$_REQUEST['file'],
            'filename'=>$_REQUEST['filename'],
            'wait'=>true,
            'download'=>true,
           ];
        
        
        $defaults = array(
        CURLOPT_URL => 'https://api.cloudconvert.com/convert', 
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $params,
        );
        $ch = curl_init();
        
        
        
        
        $result = curl_setopt_array($ch, $defaults);
        
        $output = curl_exec($ch);       
        curl_close($ch);
        
       // $output = str_replace("See Other. Redirecting to ","",$output);
        
     
        
        
     
    }
        
       

