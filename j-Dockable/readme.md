## j-Dockable (BETA)

- Works only with `+v18`
- Supports touches
- Movable
- Resizable

__Configuration__:

- `style` {Number} `1` bottom panel will be fullwidth, `2` bottom panel will be between the left and right panel
- `parent` {String} jquery selector due to container height (default: `window`)
- `margin` {Number} a bottom margin (default: `0`)

The `dockable` component expects `Array` of objects.

```javascript
// Component declaration
var panel = {

	// Component ID
	id: 'PANEL_ID',

	// Positioning
	// You can define specific display size and if the display size is not specified then the window tries to find a size for larger display
	html: 'THE CONTENT OF PANEL', // or can be raw HTMLElement

	offset: { x: 200, y: 100, width: 600, height: 400, minwidth: 200, minheight: 200, maxwidth: 1000, maxheight: 1000, dockminwidth: 200, dockminheight: 200, dockmaxwidth: 400, dockmaxheight: 400 }, // minwidth, maxwidth, maxheight, minheight, dockminheight, dockminwidth, dockmaxheight, dockmaxwidth are optional

	// Default settings
	actions: { move: true, close: true, resize: true, autosave: false, resizeX: true, resizeY: true },

	// A window title
	title: 'Title for the panel',

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

PUSH('panels', panel);
```

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)