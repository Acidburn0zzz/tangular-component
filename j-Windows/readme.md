## j-Windows (BETA)

- Works only with `+v18`
- Supports mobile devices
- Supports touches
- Movable
- Resizable

__Configuration__:

- `menuicon` {String} a menu icon in window title bar (default `fa fa-navicon`)

The `windows` component expects `Array` of objects.

```javascript
// Component declaration
var win = {

	// Component ID
	id: 'WINDOW_ID',

	// Positioning
	// You can define specific display size and if the display size is not specified then the window tries to find a size for larger display
	html: 'THE CONTENT OF WINDOW', // or can be raw HTMLElement

	offset: { x: 200, y: 100, width: 600, height: 400, minwidth: 200, minheight: 200, maxwidth: 1000, maxheight: 1000 }, // minwidth, maxwidth, maxheight, minheight are optional

	// Default settings
	actions: { move: true, close: true, resize: true, menu: false, minimize: true, maximize: true, autosave: false },

	// A window title
	title: 'Title for the window',

	// Handlers (optional):
	destroy: function() {
		// @el {jQuery} a content of the window
		// @this {Instance}

		// is executed when the window is destroyed
	},

	make: function(el) {

		// @el {jQuery} a content of the window
		// @this {Instance}

		// this.meta {Object} a reference to window object
		// this.element {jQuery} a content element of the window
		// this.container {jQuery} a main content element of the window
		// this.main {Object} a reference to "Windows" component
		// this.width {Number} a width of window
		// this.height {Number} a height of the content of the window
		// this.x {Number} offset X
		// this.y {Number} offset Y

		// Methods:
		// this.setsize(width, height);
		// this.setcommand(cmd); Allowed commands: "close", "maximize", "resetmaximize", "togglemaximize", "minimize", "resetminimize", "toggleminimize", "resize", "move", "focus"
		// this.setoffset(x, y);

		// is executed when the window is making
	},

	menu: function(el) {
		// @el {jQuery} a content element of the window

		// is executed when the user clicks on the menu icon in the window title bar
	},

	data: function(type, data, el) {

		// @type {String}
		// @data {Object}
		// @el {jQuery} a content element of the window
		// @this {Instance}

		// is executed when data are sent via SETTER('windows', 'send', 'TYPE', 'DATA')
	},

	resize: function(width, height, el, x, y) {

		// @width {Number}
		// @height {Number}
		// @el {jQuery} a content of the window
		// @this {Instance}

		// is executed when the window is resized
	},

	move: function(x, y, el) {

		// @x {Number}
		// @y {Number}
		// @el {jQuery} a content of the window
		// @this {Instance}

		// is executed when the window is moved
	},

	service: function(counter, el) {

		// @counter {Number} count of calls
		// @el {jQuery} a content of the window
		// @this {Instance}

		// the component will execute this handler each 5 seconds
	}
};

PUSH('windows', win);
```

__Methods__:

- `component.finditem(panel_id)` finds the specific window according to `ID`

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)