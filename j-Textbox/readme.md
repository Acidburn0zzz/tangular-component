﻿## j-Textbox

__Configuration__:

Example: `data-jc-config="required:true;icon:envelope;format:dd.MM.yyyy;type:date"`

- `type` {String} (optional) can be `email`, `password`, `date`, `number`, `search` or empty (default)
- `required` {Boolean} (optional) enables "required" (default: `false`)
- `icon` {String} (optional) icon for label e.g. `home`, `cog`, etc.
- `icon2` {String} (optional) icon in the right box e.g. `home`, `cog`, etc.
- `label` {String} (optional) label (default is HTML content)
- `autofocus` {Boolean} (optional) focuses the input (default: `false`)
- `align` {String} (optional) `left` (default), `right` or `center`
- `autofill` {Boolean} (optional) enables browser's autofill feature (default: `false`)
- `placeholder` {String} (optional) adds a `placeholder` text into the input
- `maxlength` {Number} (optional) sets a maximum length of chars
- `validation` {String} (optional) a condition for `evaluation` e.g. `value.match(/[a-z]+/) !== null`
- `format` {String} (optional) output formatting e.g. for dates `yyyy-MM-dd` (default: `dd.MM.yyyy`)
- `increment` {Boolean} (optional) enables controls for incrementing of numbers (default: `false`)
- `keypress` {Boolean} (optional) can disable real-time binding values (default: `true`)
- `delay` {Number} (optional) can increase/decrease delay for real-time binding (default: `300` ms)
- `disabled` {Boolean} (optional) disables this component
- `error` {String} (optional) adds a `string` text under the input

__Interesting:__

- `type:date` uses `calendar` component

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT
