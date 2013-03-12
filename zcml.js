/*
@author Stephen Rhyne  Note:(Micro Templating by John Resig)
@twitter srhyne
@email stephen@stephenrhyne.com
@license Do whatever you want with this..
*/

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
//http://ejohn.org/blog/javascript-micro-templating/
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

(function($){

	/**
	 * base url will get the following params added to it.. 
	 * &sharedBy=<zoho.adminuser>
	 * &appLinkName=<zoho.appname>
	 * &viewLinkName=<the_real_view_name>
	 * &privatelink=<private link to your view>
	 */
	var base = 'https://creatorexport.zoho.com/showJson.do?fileType=json'

	/**
	 * convert a zcml markup script into a json request
	 * @param  jQuery instance the zcml script view being converted into live markup
	 * @param  Object  the json returned from the Zoho API
	 * @param  String id of the zcml view used as a template for each record object
	 * @return undefined
	 */
	function callback(_this, data, id){
		var records, l, html, $html;
		
		
		//a single loop to access the first child with unknown form name
		for(var r in data){
		//loop through records in array	
			records = data[r];
			l = records.length;
			html = "";
			records.reverse;
			
			while(l--){
				records[l]['subform.name'] = 'testing';
				normalizeSubFormKeys(records[l])
				//use template to update htlm
				html += tmpl(id, records[l]);
			}
			//create $ obj of html string
			$html = $(html);
			//replace template with live html
			_this.replaceWith($html);
		}//end of for
			
	}

	/**
	 * add safe keys for subform values.
	 *
	 * Attaches record['subform.name'] to record.subform_name
	 * this way the zcml template can use <%=subform_name%> without
	 * throwing an exception. 
	 *
	 * @param  Object zoho json record
	 * @return undefined 
	 */
	function normalizeSubFormKeys ( record ) {
		var _r;

		for(var r in record){
			if( r.indexOf('.') !== -1 ){
				_r = r.replace('.', '_');
				record[_r] = record[r];
			}
		}

	}

	/**
	 * validate the presense of the required params
	 * @param  Object params attributes bucket that converts into the request params
	 * @return Bool true of needed params exists. 
	 */
	function validateParams( params ){

		if(!params.sharedBy){
			alert("Missing 'sharedBy' attribute on script. Example : <script type=\"text/html\" sharedBy=\"zoho.adminuser\">");
			return false;
		}
	
		if(!params.appLinkName){
			alert("Missing 'appLinkName' attribute on script. Example: <script type=\"text/html\" appLinkName=\"zoho.appname\">");
			return false;
		}

		return true;
	}

	/**
	 * parse the zcml script view into a string of request params
	 * 
	 * @param  jQuery instance the zcml view
	 * @return String formatted request params
	 */
	function getParams ( view ){
		var params, keys;

		params = {};
		keys = ['sharedBy', 'appLinkName', 'viewLinkName', 'privatelink'];
		$.each(keys, function(i, k){
			params[k] = view.attr(k);
		});

		if( !validateParams(params) ){
			return false;
		}
		
		params = $.param(params);

		viewParams = view.attr('params');
		if(viewParams){
			params += ("&" + viewParams)
		}

		params += "&callback=?";

		return params;
	}
	
	/**
	 * compile the request params from a given html view,
	 * make the json request, then fire the templating process
	 * @return undefined
	 */
	function convert(){
		var id, _this, params, url;

		id = this.id;
		_this = $(this);
		params = getParams(_this);

		if(!params){
			return false;
		}

		url = base + '&' + params;

		//get JSONP from ZC
		$.getJSON(url,function(json){
			callback(_this, json, id)
		});//end of getJSON

	}

	//extend $ prototype
	$.fn.zohoView = function(){
		//loop through all view scripts
		this.each(convert);//end of each		
	};//end of function
	
	//on ready init
	$(function(){
		$("script[elName='zc-component']").zohoView();
	});	
	
})(jQuery);	



