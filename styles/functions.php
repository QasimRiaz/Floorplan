 <script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/jquery-1.12.4.js"></script>
	<script type="text/javascript">
            
            
              
                
		pluginBasePath = '<?php echo plugin_dir_url( __FILE__ ); ?>';
		mxBasePath = '<?php echo plugin_dir_url( __FILE__ ); ?>src';
		mxPostID = '<?php echo $id; ?>';
		mxBoothTypes = '<?php echo $boothTypes; ?>';
		mxFloorBackground = '<?php echo $FloorBackground; ?>';
		mxFloorPlanXml = '<?php echo $FloorplanXml; ?>';
		mxCurrentSiteLogo = '<?php echo $current_site_logo; ?>';
		mxCurrentSiteTitle = '<?php echo $current_site_name; ?>';
		mxCurrentSiteUrl = '<?php echo $current_site_url; ?>';
                mxgetAllusersData = '<?php echo $getAllusers_data; ?>';
                mxgetjosnusersData = JSON.parse(mxgetAllusersData);
                
                
                
                baseCurrentSiteURl ='<?php echo  get_site_url(); ?>';
                mxCurrentfloorplanstatus ='<?php echo  $current_floor_plan_status; ?>';
                // console.log(mxgetAllusersData)
		var ArrayOfObjects = [];
		var json = {};
		//console.log(mxFloorPlanXml);
		var jsonBooth = JSON.parse(mxBoothTypes);
		//console.log(jsonBooth);
		jQuery.each(jsonBooth, function(index, value) {
			json = {};
			json.background = jsonBooth[index].background;
			json.width = jsonBooth[index].width;
			json.height = jsonBooth[index].height,
			json.style = jsonBooth[index].style;
			ArrayOfObjects.push(json);
		});
                
               
	</script>

        <title><?php echo $current_site_name; ?> - Floor Plan Editor </title>
        <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/jquery-confirm.css?v=1.1">
        <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/select2-bootstrap.css?v=1.1">
        <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/select2.min.css?v=1.1">
        <?php if($current_floor_plan_status == 'viewer' ){?>
         
         <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/main.css">
        <?php } ?>
        <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/grapheditor.css?v=1.20">
<link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/fontawesome-all.css?v=1.03">

       
 <link rel="stylesheet" type="text/css" href="<?php echo plugin_dir_url( __FILE__ ); ?>styles/sweetalert.css">
 

 
 
	<script type="text/javascript">
		// Parses URL parameters. Supported parameters are:
		// - lang=xy: Specifies the language of the user interface.
		// - touch=1: Enables a touch-style user interface.
		// - storage=local: Enables HTML5 local storage.
		// - chrome=0: Chromeless mode.
                
                function iframeLoaded(){
    
    
                    jQuery("#loadingicon").hide();
                    jQuery("#helpvidep").show();


                }
		var urlParams = (function(url)
		{
			var result = new Object();
			var idx = url.lastIndexOf('?');
	
			if (idx > 0)
			{
				var params = url.substring(idx + 1).split('&');
				
				for (var i = 0; i < params.length; i++)
				{
					idx = params[i].indexOf('=');
					
					if (idx > 0)
					{
						result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
					}
				}
			}
			
			return result;
		})(window.location.href);
	
		// Default resources are included in grapheditor resources
		mxLoadResources = false;
	</script>
        <script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/jquery-confirm.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Init.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>jscolor/jscolor.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>sanitizer/sanitizer.min.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/mxClient.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/EditorUi.js?v=14.34"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Editor.js?v=2.24"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Sidebar.js?v=2.36"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Graph.js?v=3.01"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Shapes.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Actions.js?v=2.27"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Menus.js?v=2.19"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Format.js?v=2.66"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Toolbar.js?v=2.31"></script>
	<script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/Dialogs.js?v=2.19"></script>
        <script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/customefunctions.js?v=2.19"></script>
        <script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/select2.full.js?v=2.19"></script>
         <?php if($current_floor_plan_status == 'viewer' ){?>
        
         <?}?>
        <script type="text/javascript" src="<?php echo plugin_dir_url( __FILE__ ); ?>js/sweetalert.js?v=2.19"></script>
        
        
	<script type="text/javascript">
		// Extends EditorUi to update I/O action states based on availability of backend
                
		(function()
		{
			var editorUiInit = EditorUi.prototype.init;
			
			EditorUi.prototype.init = function()
			{
				editorUiInit.apply(this, arguments);
				this.actions.get('export').setEnabled(false);

				// Updates action states which require a backend
				if (!Editor.useLocalStorage)
				{
					mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function(req)
					{
						var enabled = req.getStatus() != 404;
						this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
						this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
						this.actions.get('save').setEnabled(enabled);
						this.actions.get('saveAs').setEnabled(enabled);
						this.actions.get('export').setEnabled(enabled);
					}));
				}
			};
			
			// Adds required resources (disables loading of fallback properties, this can only
			// be used if we know that all keys are defined in the language specific file)
			mxResources.loadDefaultBundle = false;
			var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
				mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

			// Fixes possible asynchronous requests
			mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr)
			{
				// Adds bundle text to resources
				mxResources.parse(xhr[0].getText());
				
				// Configures the default graph theme
				var themes = new Object();
				themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement(); 
				
				// Main
				new EditorUi(new Editor(urlParams['chrome'] == '0', themes));
			}, function()
			{
				document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
			});
		})();
                
                 
                
                
	</script>
        
