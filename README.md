drag-menu
=========
drag-menu is a jQuery Plugin that provides "native" draggable menu 
functionality.

It is lightweight, extensible, and easy to use.  For mobile functionality the 
"ui-touch-punch" library is included.  More information ui-touch-punch can be 
found at: http://touchpunch.furf.com/.

Tested on iOS6 Safari and Mobile Chrome.  See a bug?  Send me an email at:
drag-menu@ohlman.com, tweet [@matthewohlman](https://twitter.com/matthewohlman), or fork the source and submit a pull request.



Example:
========
View a working example: http://www.ohlman.com/drag-menu/



Dependencies:
=============
1. jQuery
2. jQuery UI
3. ui-touch-punch jQuery plugin (http://touchpunch.furf.com) if you want to use
   it with touch events on a mobile device.

   
   
How to use it:
==============
1. Include jQuery and jQuery UI.
2. Include the "ui-touch-punch" library (included in this repository).
3. Add a menu element to your page behind the main content.
4. Add a handle that the user will drag to pull the menu out.
5. Initialize the plugin using the following call:
		
		jQuery("#menu-id").dragMenu("#drag-handle-id", "#content-element-id");
	

	
Additional Options:
===================
Additionaly, you can pass in an object of options as the 3rd parameter to the 
dragMenu constructor.  The options are:

	direction: 	The direction that the content will slide to reveal the menu.  
				Valid options are: left, right, up, down
				Default is: right
				
	dragStart: 	A function that is called when dragging is starting.  The 
				function will be passed the dragMenu instance, the jQuery UI 
				drag event, and the jQuery UI object as parameters.
				
	drag: 		A function that is called every time the element is dragged.  
				The function will be passed the dragMenu instance, the jQuery 
				UI drag event, and the jQuery UI object as parameters.
				
	dragStop: 	A function that is called when dragging is done.  The function 
				will be passed the dragMenu instance, the jQuery UI drag event, 
				and the jQuery UI object as parameters.
				
	menuVisible:A function that is called when dragging is done and the menu is 
				visible in any way. The function will be passed the dragMenu 
				instance, the jQuery UI drag event, and the jQuery UI object as 
				parameters.
				
 	menuHidden: A function that is called when dragging is done and the menu is 
				completely hidden.  The function will be passed the dragMenu 
				instance, the jQuery UI drag event, and the jQuery UI object as 
				parameters.
	
	closeAnimationDuration: The length of close animation in milliseconds.  The
				default value is 300.

				
				
API Documentation:
==================
function dragMenu(handle, content, options):
The constructor.  Invoke this on the menu dom element.
Parameters:
- handle:		Either the jQuery selector for the handle that will be 
				used to drag the menu out, or an actual dom or jQuery  
				object that represents it.
- content:	Either the jQuery selector for the content that will
				be dragged away to reveal the menu, or an actual dom
				or jQuery object that represents it.
- options:	Additional options, see "Additional Options" section
				above.
Example: 
	jQuery("#menu-id").dragMenu("#drag-handle-id", "#content-element-id");
	

	
function openMenu():
Opens the menu.  Note: menuVisible will NOT fire when this method is 
invoked to open the menu.
Example: 
	jQuery("#id").dragMenu("#handle", "#content").openMenu();
	

	
function closeMenu():
Closes the menu.  Note: menuHidden will NOT fire when this method is
invoked to close the menu.
Example: 
	jQuery("#id").dragMenu("#handle", "#content").closeMenu();
		
		
License:
========
drag-menu is dual licensed under the MIT or GPL Version 2 licenses.

If you use or distribute this library in additional plugins or software packages,
please include attribution to the author (Matthew Ohlman) and github website
(https://github.com/mohlman3/drag-menu), and also include an attribution to the 
ui-touch-punch plugin as required by its license.