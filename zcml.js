/*
 ________   ____              __        
/\_____  \ /\  _`\    /'\_/`\/\ \       
\/____//'/'\ \ \/\_\ /\      \ \ \      
     //'/'  \ \ \/_/_\ \ \__\ \ \ \  __ 
    //'/'___ \ \ \L\ \\ \ \_/\ \ \ \L\ \
    /\_______\\ \____/ \ \_\\ \_\ \____/
    \/_______/ \/___/   \/_/ \/_/\/___/ 
                                        
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
	
	var base;
	
	base = "http://creator.zoho.com/"
	
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
				//use template to update htlm
				html += tmpl(id, records[l]);
			}
			//create $ obj of html string
			$html = $(html);
			//replace template with live html
			_this.replaceWith($html);
		}//end of for
		
		
	}
	
	function convert(){ 
		var id, _this, sharedBy, appLinkName, viewLinkName, privateLink, params, url;
		//id of template
		id = this.id;
		//make url
		_this = $(this);
		sharedBy = _this.attr("sharedBy");
		appLinkName = _this.attr("appLinkName");
		viewLinkName = _this.attr("viewLinkName");
		privateLink = _this.attr("privateLink");
		params = _this.attr("params");
		
		
		if(!sharedBy){
			return alert("Missing 'sharedBy' attribute on "+id+" script. Example : <script type=\"text/html\" shareBy=\"zoho.adminuser\">");
		}	
		if(!appLinkName){
			return alert("Missing 'appLinkName' attribute on "+id+" script. Example: <script type=\"text/html\" appLinkName=\"zoho.appname\">");
		}
		
		
		url = base+sharedBy+"/"+appLinkName+"/json/"+viewLinkName+"/";
		url += privateLink?privateLink+"/":"";
		url += params?params+"&callback=?":"callback=?";
		
		//get JSONP from ZC
		$.getJSON(url,function(json){
			callback(_this, json, id)
		});//end of getJSON
		
	}
	
	//extend $ prototype
	$.fn.zohoView = function(){
		//store instance
		var self = this;
		
		//loop through all view scripts
		self.each(convert);//end of each		
	};//end of function
	
	//on ready init
	$(function(){
		$("script[elName='zc-component']").zohoView();
	});	
	
})(jQuery);	



