## j-DataGrid

This grid was created for single page applications and enterprise applications.

- please try to understand the functionality
- grid uses [Clusterize.js](https://clusterize.js.org/)
- needed `bootstrap` grid system
- you can render more than 20 000 rows without any problem
- supports drag&drop columns
- supports sorting
- supports resizing of columns
- supports vertical/horizontal scrolling
- supports filters
- supports checkboxes
- custom scrollbars independent on OS
- responsive

__TO-DO__:

- multisort
- resizing columns for touch devices
- re-ordering columns for touch devices

__Data-source__ needs to contain:

```javascript
{
    items: [{ name: 'Row 1' }, { name: 'Row 2' }, ...] // items
    page: 1,    // current pages
    pages: 30,  // count of pages
    limit: 5,   // items limit per page
    count: 150  // count of items in DB
}
```

or raw `Array` but you can't use pagination and external filters:

```javascript
[{ name: 'Row 1' }, { name: 'Row 2' }]
```

__Configuration__:

- `filterlabel` {String} a default placeholder for all filters (optional)
- `pluralizepages` {String} pluralization for pages (optional, default: `# pages,# page,# pages,# pages`)
- `pluralizeitems` {String} pluralization for items (optional, default: `# items,# item,# items,# items`)
- `height` {Number} height of grid (optional, default `auto`)
- `bottom` {Number} a bottom padding for `auto` height (optional, default: `80`)
- `boolean` {String} a values for filtering of boolean values (optional, default: `true|on|yes`)
- `resize` {Boolean} enables resizing of columns (optional, default: `true`)
- `reorder` {Boolean} enables re-ordering of columns (optional, default: `true`)
- `sorting` {Boolean} enables sorting (optional, default `true`)
- `remember` {Boolean} remembers re-ordering and resizing columns (optional, default `true`)
- `checkbox` {Boolean} enables checkboxes
- `colwidth` {Number} a default column width in pixels (optional, default `150`)
- `rowheight` {Number} a default row height in pixels (optional, default: `24`) + it depends on CSS
- `click` {String} a link to `function(row, grid)` is executed if the user clicks on a row
- `selected` {String} a link to `function(rows, grid)` is executed if the user selected/checked some rows
- `exec` {String} a link to `function(type, filter, sort, page)` for server-side operations only (it disables client-side sorting & filtering)

__Column properties__:

- `name` {String} a name of field in the row object
- `text` {String} a column label
- `title` {String} a column tooltip (optional)
- `width` {Number} a column width (optional, default `config.colwidth`)
- `filter` {String/Boolean} a placeholder for the filter or `boolean` can disable filter for this column (optional)
- `align` {String} can be `center` or `right` (optional, default: `left`)
- `template` {String} can be a Tangular template and the model is the entire object of row
- `sorting` {Boolean} enables sorting (optional, default: `true`)
- `search` {Boolean/String} `true` will filter a value according to the `template` result or `String` can be a Tangular template which will be used as a value for search

__Filtering__:

- `numbers`: (1) `number` searches an exact number, (2) `number - number` is an interval between numbers
- `strings`: (1) `string` searches an exact string, (2) `string1, string2, string3` is a multiple search criterium
- `dates`: (1) year `2017` searches all dates in this year, (2) `2017-02-12 - 2017-03-13` is an interval between dates, (3) `20.12 - 31.12` an interval between dates in the current year

### Author

- Peter Širka <petersirka@gmail.com>
- License: MIT