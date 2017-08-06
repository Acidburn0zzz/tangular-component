## j-Form

- Works only with +`v11.1.0` [jComponent](http://jcomponent.org)
- __Download__ [jComponent with Tangular (jcta.min.js)](https://github.com/petersirka/jComponent)
- Works with Bootstrap

__Configuration__:

Example: `data-jc-config="title:Form title;width:800;if:user;icon:home"`

- `title` {String} form title
- `width` {Number} form max-width
- `if` {String} condition for showing of the form, it's compared with the value within of `data-jc-path`
- `icon` {String} Font-Awesome icon without `fa-`
- `reload` {String} link to a global function and it's executed if the form is showing
- `submit` {String} link to a global function and it's executed if the submit button is pressed
- `cancel` {String} link to a global function and it's executed if the cancel button is pressed
- `enter` {Boolean} (optional) captures `enter` key automatically and performs submit (default: `false`)

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT