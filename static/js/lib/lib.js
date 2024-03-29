/*
	 *  String library 
	 */
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}	  
	
	String.prototype.replaceAll = function(str1, str2, ignore) 
	{
	    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
	} 
	
	Number.prototype.formatNumber = function(decPlaces) {
	    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
	    decSeparator = ".";
	    thouSeparator = " ";

	    var n = this.toFixed(decPlaces);
	    if (decPlaces) {
	        var i = n.substr(0, n.length - (decPlaces + 1));
	        var j = decSeparator + n.substr(-decPlaces);
	    } else {
	        i = n;
	        j = '';
	    }

	    function reverse(str) {
	        var sr = '';
	        for (var l = str.length - 1; l >= 0; l--) {
	            sr += str.charAt(l);
	        }
	        return sr;
	    }

	    if (parseInt(i)) {
	        i = reverse(reverse(i).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator));
	    }
	    return i+j;
	};

	// http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
	Date.now = function() { return new Date().getTime(); };
		
	
	/* http://stackoverflow.com/questions/14923301/uncaught-typeerror-cannot-read-property-msie-of-undefined-jquery-tools*/
	jQuery.browser = {};
	(function () {
	    jQuery.browser.msie = false;
	    jQuery.browser.version = 0;
	    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
	        jQuery.browser.msie = true;
	        jQuery.browser.version = RegExp.$1;
	    }
	})();
	

	// Fix JQuery problem with tooltip
	$(document).tooltip({
		position: {
			my: "right bottom+50"
		},
		tooltipClass: "entry-tooltip-positioner",
		track: true
	});
	