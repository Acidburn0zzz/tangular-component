## j-Importer

__j-Import__ is a great component for importing HTML templates, scripts or styles according to the path and condition. The component can help with SPA applications because you can easily import templates, scripts or styles dynamically.

__Configuration__:

- `if` {String} needs to contain a condition in the form `value === 'myvalue'` (the condition is evaluated with the value according to `data-jc-path`)
- `url` {String} URL to subpage/subpart
- `reload` {String} a link to method in the global scope, it's executed if the __condition__ is valid

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT