/*!
 * jQuery viewloader plugin
 *
 * Version 0.1 (24-November-2011)
 * @requires jQuery 1.5 and above (for the Deferred support)
 *
 * Copyright (c) 2011 Philippe Monnet (@techarch) 	http://blog.monnet-usa.com
 * Source: http://github.com/techarch/jquery-viewloader
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

;(function($) {

	// Ensure that at least jQuery 1.5 is available since we need the Deferred capability
	if (typeof($.Deferred) != 'function') {
		alert('view-loader requires jQuery v1.5 or later!  You are using v' + $.fn.jquery);
		return;
	}
	
	/**
	* Constructor for the view-loader plugin
	* @param {Object} element 	The jQuerified HTML element the plugin will be attached to
	* @param {Object} options 	The object literal / hash containing specific options (see defaults) 
	*/
	$.viewloader = function (element, options) {
		
		// Default options
		var defaults = {
			logLevel: "none",						// none / debug / info / warn / error
			viewExtension: '.view.html',	// proposed extension
			scripts: null,							// can be an jQuery array of script items
			afterEachTemplate: null,		// optional callback function to invoke after each template has been loaded
			success: null,							// the "success" callback to invoke once all templates have been loaded
			error: null								// the "error" callback to invoke if a failure occurs
		}
		
		var plugin = this;	// to avoid confusion related to this
		
		// The id will faciliate troubleshooting in a debugger (to quickly see which plugin is attached to which element)
		plugin.id = element.id || element.toString();  
		
        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
             element = element;        // reference to the actual DOM element
		
        // This will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('pluginName').settings.propertyName from outside the plugin, where "element" is the
        // element the plugin is attached to;
		plugin.settings = { }
		
        // The "constructor" method that gets called when the object is created
        plugin.init = function() {

            // The plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            // Initializes the list of templates
			plugin.templates = [ ];	
			
			// Load
			plugin.loadAllPartialViews();
        }
		
        // --- Public Methods ---
		//
		//	- loadAllPartialViews()
		//  - loadSourceForPartialView(deferredLoadRequest)
		// 
		// Usage notes:
        // 		plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // 		element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
		//
		
		/**
		* Loads all partial (in the Rails / MVC sense) views referred to inside the current element
		* as script blocks with a source url ending with the plugin.settings.viewExtension
		* E.g.:	<script id="mainViewTemplate" type="text/html" src="view/main.view.html" ></script>
		*/
		plugin.loadAllPartialViews = function () {
			// Identify all script tags containing a source url ending in .view
			// as this is the convention for our partial views expressed in the jQuery template format.
			var templateScripts = plugin.settings.scripts || $element.find("script[src$='" + plugin.settings.viewExtension + "']");

			// Create a list of deferred requests - but do not execute them yet
			templateScripts.each(function () {
				var templateScript = $(this);
				
				var templateID = templateScript.attr("id");
				var templateSrc = templateScript.attr("src");
				
				// Check if the script exists in the DOM
				var domScriptItem = $("script[id=" + templateID + "]");
				
				if (domScriptItem.length == 0) {
					// Add it to the document DOM if it does not already exist
					addNewTemplateScriptToDOM(templateID, templateSrc);
				}
			
				// Queue up the request within a Deferred 
				queueUpTemplateLoadRequest(templateScript);
			});
			
			// Configure the when-then structure
			$.when.apply(plugin,plugin.templates)
				.done(function (resolution) {
								if (plugin.settings.success) {
									log("viewloader.loadAllPartialViews executing 'success' function", "debug");
									plugin.settings.success(resolution);
								} else {
									log("viewloader.loadAllPartialViews all done since no 'success' function was provided", "debug");
								}
							})
				.fail(function (resolution) {
								if (plugin.settings.error) {
									log("viewloader.loadAllPartialViews executing 'error' function", "debug");
									plugin.settings.error(resolution);
								} else {
									log("viewloader.loadAllPartialViews all done since no 'error' function was provided", "debug");
								}
							});

			// Execute all load requests serially
			for ( var i=0; i < plugin.templates.length; i++) {
				var deferredLoadRequest = plugin.templates[i];
				
				// Note: the request will mark itself "resolved" once it has been fully completed 
				// (i.e. the data has been received and processed) 
				deferredLoadRequest.execute(deferredLoadRequest);
			}
		}

		/**
		* Loads a specific partial (in the Rails / MVC sense) views referred to inside the current element
		* as script blocks with a source url ending with the plugin.settings.viewExtension
		* E.g.:	<script id="mainViewTemplate" type="text/html" src="view/main.view.html" ></script>
		* @param {Deferred} deferredLoadRequest The deferred request associated with a given template script
		*/
		plugin.loadSourceForPartialView = function (deferredLoadRequest) {
			
			log('viewloader.loadSourceForPartialView loading source for view:' 
							+ ' id=' 		+ deferredLoadRequest.templateID 
							+ ' src='	+ deferredLoadRequest.templateSrc, "debug");
		
			// Fetch the script template source so it can be stored in the DOM
			$.ajax(	
						{
							url: deferredLoadRequest.templateSrc, 
							data: deferredLoadRequest.templateID, 
							error: function (jqXHR, textStatus, errorThrown) {
									log('viewloader.loadSourceForPartialView could not find the view with id: '
											+ deferredLoadRequest.templateID
											+ ' at url: ' + deferredLoadRequest.templateSrc, "error");
									deferredLoadRequest.reject(deferredLoadRequest.templateID + " : " + errorThrown.message);
							},
							success: function (data, textStatus, jqXHR) {
								//
								// Get the associated DOM node
								var currentScript = $("#" + deferredLoadRequest.templateID);

								if (currentScript.length == 0) {
									log('viewloader.loadSourceForPartialView could not find script with id: '+ deferredLoadRequest.templateID, "error");
									deferredLoadRequest.resolve(null);
									return;
								} else {
									log('viewloader.loadSourceForPartialView saving source in '+ deferredLoadRequest.templateID, "debug");
								}

								// Save the source inside the script tag in the DOM
								var jsSource = jqXHR.responseText;
								currentScript[0].text = jsSource;

								// Create a continuation function so we can either invoke it inline or 
								// in a deferred manner once the Deferred has been resolved
								var continuationFunction = function (deferredLoadRequest) {
									// Execute the afterEachTemplate callback function if one was provided
									var plugin = this;
									if (plugin.settings.afterEachTemplate) {
										log("viewloader.loadSourceForPartialView execute afterEachTemplate callback for " + deferredLoadRequest.templateID, "debug");
										try {
											plugin.settings.afterEachTemplate(deferredLoadRequest.templateID);
										} catch (exception) {
											log("viewloader.loadSourceForPartialView afterEachTemplate callback for " + deferredLoadRequest.templateID + " failure: " + exception, "error");
										}
									}							

									// Proceed to the next deferred template load request
									deferredLoadRequest.resolve(deferredLoadRequest.templateID);
								}
								
								var currentPlugin = plugin;
								
								// Identify any nested view templates scripts in the source we just retrieved
								var embeddedScriptRefs = $(jsSource).find("script[type$=html]");
								if (embeddedScriptRefs.length > 0) {
									// Rename the id of each script template since we have already added
									// a new script block to the page body.This prevents duplicates.
									embeddedScriptRefs.each(function() {
										var embeddedScriptRef = $(this);
										var embeddedScriptRefID = embeddedScriptRef.attr("id");
										jsSource = jsSource.replace(embeddedScriptRefID, "_" + embeddedScriptRefID+"_");
									});
									
									// Re-Save the updated source
									currentScript[0].text = jsSource;
									
									// Recursively request dynamic synchronized loading of the nested templates								
									currentScript.viewloader({
										logLevel: "debug",
										afterEachTemplate: currentPlugin.settings.afterEachTemplate,
										scripts: embeddedScriptRefs,
										success: function (successfulResolution) {
											// All nested templates have been loaded so we can now
											// execute the contination for the current template
											continuationFunction.call(currentPlugin, deferredLoadRequest);
										},
										error: function (failedResolution) {
											continuationFunction.call(currentPlugin, deferredLoadRequest);
										}
									});
								} else {
									// Since there are no nested templates we can now
									// execute the contination for the current template
									continuationFunction.call(currentPlugin, deferredLoadRequest);
								}
								
							}
						}
			);		
		}

        // --- Private Methods ---
		//
		//	 - addNewScriptToDOM()
		//	 - queueUpTemplateLoadRequest($script)
        //   - log(message, level)
		//
		
		/**
		* Dynamically creates and insert a new script tag in the DOM for our view template
		* @param {string} templateID 		The ID of the view template script
		* @param {string} templateSrc 	The spirce of the view template script
		*/
		var addNewTemplateScriptToDOM = function (templateID, templateSrc) {
			var templateScript = "<script id='" + templateID + "'"
													+ " type='text/html' "
													+ " src='" + templateSrc + "' "
													+ "></script>";
			$("body").append(templateScript);
		}
		
		/**
		* Instantiates a Deferred for our view loading request
		* @param {Object} $script 	The script element for a given template / view
		*/
		var queueUpTemplateLoadRequest = function ($script) {
				var deferredLoadRequest = $.Deferred();
				
				// "Attach" new properties onto the Deferred to make it easier to process later
				deferredLoadRequest.templateID   = $script.attr("id");
				deferredLoadRequest.templateSrc = $script.attr("src");
				deferredLoadRequest.execute 	  = plugin.loadSourceForPartialView;
				
				plugin.templates.push(deferredLoadRequest);		
		}
		
		/**
		* Logs a message on the browser console
		* @param {string} message 	The message to log 
		* @param {string} level		 	The log level to use: none / debug / info / warn / error 
		*/
		var log = function (message, level) {
			if (plugin.settings.logLevel == "none") {
				return;
			}
			
			if ($.browser.mozilla) {
				switch (level) {
					case "debug":
						try { console.debug(message); } catch (ex) { var a = 1; }
						break;
					case "error":
						try { console.error(message); } catch (ex) { var a = 1; }
						break;
					case "info":
						try { console.info(message); } catch (ex) { var a = 1; }
						break;
					default:
						try { console.debug(message); } catch (ex) { var a = 1; }
						break;
				}
				return;
			}

			if ($.browser.msie) {
				try { console.log(message); } catch (ex) { var a = 1; }
			}
		}
		
        // Initialize the plugin
        plugin.init();
	}
	
	/**
	* Registers the viewloader plugin in the jQuery.fn object
	* @param {Object} options 	The object literal / hash containing specific options (see defaults) 
	*/
    $.fn.viewloader = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('viewloader')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.viewloader(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('viewloader', plugin);

            }

        });

    }
	
})(jQuery);
