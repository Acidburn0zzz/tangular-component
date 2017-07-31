## j-Form

- Works only with +`v11.1.0` [jComponent](http://jcomponent.org)
- __Download__ [jComponent with Tangular (jcta.min.js)](https://github.com/petersirka/jComponent)
- Works with Bootstrap

__Configuration__:

Example: `data-jc-config="title:Form title;width:200;icon:home"`

- `title` {String} form title
- `width` {Number} form max-width
- `icon` {String} Font-Awesome icon without `fa-`

__Methods__:

- `instance.show(el, position, [offsetX], [offsetY])` - shows the form, positions: `left` (default, `center` or `right`
- `instance.hide()` - hides the form
- `instance.toggle(el, position, [offsetX], [offsetY])` - toggles the form

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT