## j-Clock

__Configuration__:

Example: `data-jc-config="twelvehour:true;"`

- `twelvehour` {Boolean} (optional) the clock will be 12-hour (default `false`).

- works __only__ with Bootstrap Grid System (otherwise is need to fix CSS)
- Thanks [weareoutman](https://github.com/weareoutman/) for some things

## Usage

```javascript
var ELEMENT = $(document);
var PATH = 'some.path.to.date';
var X_OFFSET = 100;
FIND('clock').toggle(ELEMENT, PATH, function(date) {
   console.log('SELECTED DATE:', date);
}, X_OFFSET);
```

### Author

- Denis Granec <denis@granec.cz>
- License: MIT
