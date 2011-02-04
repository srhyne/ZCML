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
	//extend $ prototype
	$.fn.zohoView = function(){
		//store instance
		var self = this,
			base = "http://creator.zoho.com/";
		//loop through all view scripts
		self.each(function(){
			//id of template
			var id = this.id,
			//make url
				$this = $(this),
				sharedBy = $this.attr("sharedBy"),
				appLinkName = $this.attr("appLinkName"),
				viewLinkName = $this.attr("viewLinkName"),
				privateLink = $this.attr("privateLink"),
				params = $this.attr("params");
			if(!sharedBy){
				alert("Missing 'sharedBy' attribute on "+id+" script. Example : <script type=\"text/html\" shareBy=\"zoho.adminuser\">");
			}	
			if(!appLinkName){
				alert("Missing 'appLinkName' attribute on "+id+" script. Example: <script type=\"text/html\" appLinkName=\"zoho.appname\">");
			}
			var url = base+sharedBy+"/"+appLinkName+"/json/"+viewLinkName+"/";
			url += privateLink?privateLink+"/":"";
			url += params?params+"&callback=?":"callback=?";
			//get JSONP from ZC
			$.getJSON(url,function(data){
				//a single loop to access the first child with unkown name
				for(var r in data){
				//loop through records in array	
					var records = data[r],
						l = records.length,
						html = "",
						tmpl_id = id;	
					records.reverse;
					while(l--){
						//use template to update htlm
						html += tmpl(tmpl_id,records[l]);
					}
					//create $ obj of html string
					var $html = $(html);
					//replace template with live html
					$this.replaceWith($html);
				}//end of for
			});//end of getJSON
		});//end of each		
	};//end of function
	//on ready init
	$(function(){
		$("script[elName='zc-component']").zohoView();
	});	
	
})(jQuery);	



