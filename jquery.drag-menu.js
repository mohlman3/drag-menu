(function (jQuery) {
	handleElm = null,
	contentElm = null,
	contentElmOriginalPosition = null,
	contentElmLambdaPosition = null,
	menuElmSize = null,
	direction = null,
	dragStopCallback = null,
	dragStartCallback = null,
	dragCallback = null,
	menuVisibleCallback = null,
	menuHiddenCallback = null,
	closeAnimationDuration = 0,
	
	normalizeOptionElementSelector = function (option) {
		// if a selector was passed in, need to perform the selection
		if (typeof(option) == "string") {
			// assume id selctor if not specified
			if (option[0] != "#" && option[0] != ".") {
				option = "#" + option;
			}
			
			// find the element
			option = jQuery(option);
		}
		
		if (option && !option.jQuery) {
			option = jQuery(option);
		}
		
		return option;
	},
	
	onDrag = function (event, ui) {
		// record difference in position
		contentElmLambdaPosition.left = contentElmOriginalPosition.left + ui.position.left;
		contentElmLambdaPosition.top = contentElmOriginalPosition.top + ui.position.top;
		
		if (dragCallback) {
			dragCallback(this, event, ui);
		}
	},
	
	onDragStart = function (event, ui) {
		// do not allow click "snap back" while dragging
		contentElm.unbind("click", onClick);
		
		if (dragStartCallback) {
			dragStartCallback(this, event, ui);
		}
	},
	
	onDragStop = function (event, ui) {
		// if the dragable has been dragged, bind a click event so that
		// tapping on the contentElm will snap it back to original position
		if (contentElmLambdaPosition.left != 0 || contentElmLambdaPosition.top != 0) {
			// menu is showing in some way
			contentElm.bind("click", onClick);
			
			// fire the menu visible callback if set
			if (menuVisibleCallback) {
				menuVisibleCallback(this, event, ui);
			}
		} else if (contentElmLambdaPosition.left == 0 && contentElmLambdaPosition.top == 0) {
		    // menu is completely hidden
		    // unbind click event
		    contentElm.unbind("click", onClick);

			// fire the menu hidden callback if set
			if (menuHiddenCallback) {
				menuHiddenCallback(this, event, ui);
			}
		}
		
		if (dragStopCallback) {
			dragStopCallback(this, event, ui);
		}
	},

    onClick = function (event) {
        cancelEvent(event);
        jQuery.fn.dragMenu.closeMenu();
    },

    cancelEvent = function(event) {
        event.returnValue = false;
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    },
	
	getAxisFromDirection = function () {
		switch (direction) {
			case "left":
			case "right":
				return "x";
			
			case "up":
			case "down":
				return "y";
				
			default:
				throw "direction " + direction + " not supported.";
		}
	},
	
	addCssAnimationStyle = function () {
		// calculate number of seconds from given number of milliseconds
		var seconds = closeAnimationDuration / 1000;
		
		var style = jQuery("<style />")
			.attr("type", "text/css")
			.html(".drag-menu-transition {  -webkit-transition: all " + seconds + "s linear; -moz-transition: all " + seconds + "s linear; -o-transition: all " + seconds + "s linear; transition: all " + seconds + "s linear; }");
		jQuery("head").append(style);
	},
	
	jQuery.fn.dragMenu = function(handle, content, options) {
		options = jQuery.extend({}, jQuery.fn.dragMenu.defaultOptions, options);     
		
		var menuElm = this;
		
		// ensure we have an actual dom element from the handle parameter
		handleElm = normalizeOptionElementSelector(handle);
		if (!handleElm) {
			return;
		}
		
		// ensure we have an actual dom element from the content parameter
		contentElm = normalizeOptionElementSelector(content);
		if (!contentElm) {
			return;
		}
		
		// init variables needed
		menuElmSize = { width: menuElm.outerWidth(true), height: menuElm.outerHeight(true) };
		contentElmOriginalPosition = contentElm.position();
		
		// subtract margin from the body
		var jqBody = jQuery(document.body);
		var jqBodyMarginLeft = parseInt(jqBody.css("margin-left").replace("px", ""));
		var jqBodyMarginTop = parseInt(jqBody.css("margin-top").replace("Px", ""));
		contentElmOriginalPosition.left -= jqBodyMarginLeft;
		contentElmOriginalPosition.top -= jqBodyMarginTop;
		
		contentElmLambdaPosition = { top: 0, left: 0 };
		direction = options.direction;
		closeAnimationDuration = options.closeAnimationDuration;
		
		// set callbacks if set in options
		if (options.dragStart && typeof(options.dragStart) == "function") {
			dragStartCallback = options.dragStart;
		}
		
		if (options.dragStop && typeof(options.dragStop) == "function") {
			dragStopCallback = options.dragStop;
		}
		
		if (options.drag && typeof(options.drag) == "function") {
			dragCallback = options.drag;
		}
		
		if (options.menuVisible && typeof(options.menuVisible) == "function") {
			menuVisibleCallback = options.menuVisible;
		}
		
		if (options.menuHidden && typeof(options.menuHidden) == "function") {
			menuHiddenCallback = options.menuHidden;
		}
		
		// add the appropriate css animation styles to the document
		addCssAnimationStyle();
		
		// absoluteley position the content element
		contentElm.css("position", "absolute");
		
		var containment;
		if (direction == "left" || direction == "up") {
			containment = [	contentElmOriginalPosition.left - menuElmSize.width,
							contentElmOriginalPosition.top - menuElmSize.height,
							contentElmOriginalPosition.left,
							contentElmOriginalPosition.top ]
		} else {
			containment = [ contentElmOriginalPosition.left, 
							contentElmOriginalPosition.top, 
							menuElmSize.width, 
							menuElmSize.height ]
		}
		
		// set draggable on the element
		contentElm.draggable({
			handle: handleElm,
			axis: getAxisFromDirection(),
			drag: onDrag,
			start: onDragStart,
			stop: onDragStop,
			containment: containment
		});
		
		return this;
	},
	
	jQuery.fn.dragMenu.openMenu = function () {
		// use css for transition and snap it back to origina position
		contentElm.addClass("drag-menu-transition");
		
		if (direction === "right") {
			contentElm.css("left", menuElmSize.width);
		} else if (direction === "left") {
			contentElm.css("left", -menuElmSize.width);
		} else if (direction === "up") {
			contentElm.css("top", -menuElmSize.height);
		} else if (direction === "down") {
			contentElm.css("top", menuElmSize.height);
		}
		
		// after animation is complete, remove the transition class
		setTimeout(function () {
			contentElm.removeClass("drag-menu-transition");
		}, closeAnimationDuration);
	},
	
	jQuery.fn.dragMenu.closeMenu = function () {
		// use css for transition and snap it back to origina position
		contentElm.addClass("drag-menu-transition")
			   .css("left", contentElmOriginalPosition.left)
			   .css("top", contentElmOriginalPosition.top);
			   
	    // unbind click event
		contentElm.unbind("click", onClick);

		// after animation is complete, remove the transition class
		setTimeout(function () {
			contentElm.removeClass("drag-menu-transition");
		}, closeAnimationDuration);
	},
	
	jQuery.fn.dragMenu.defaultOptions = {
		direction: "right", // left | right | up | down
		dragStart: null, // function that is called when dragging is starting
		drag: null, // function that is called every time element is dragged
		dragStop: null, // function that is called when dragging is done
		menuVisible: null, // function that is called when dragging is done and the menu is visible in any way
 		menuHidden: null, // function that is called when dragging is done and the menu is completely hidden
		closeAnimationDuration: 300 // length of close animation in milliseconds
	};
})(jQuery);