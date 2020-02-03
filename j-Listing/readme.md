## j-Listing

- easy usage
- works with the whole Arrays only on client-side

__Configuration__:

- `count` {Number} Optional, items per page (default: `20`)
- `pages` {Number} Optional, max pages in pagination (default: `3` --> half + current page + half)
- `scrolltop` {Boolean} scrolls top automatically when the user changes a page
- `parent` {String} jQuery selector for obtaining of height, enables fixed area with custom scrollbars
- `margin` {Number} a margin for `parent` (default: `0`)
- __NEW__: `marginxs` {Number} optional, a top/bottom margin together for `xs` screen width
- __NEW__: `marginsm` optional, a top/bottom margin together for `sm` screen width
- __NEW__: `marginmd` optional, a top/bottom margin together for `md` screen width
- __NEW__: `marginlg` optional, a top/bottom margin together for `lg` screen width

__Tangular layout__:

- `body` {String} contains all rendered items, output is __HTML__
- `page` {Number} current page number
- `pages` {Number} count of pages
- `count` {Number} count of items

__Tangular item__:

- `model` contains an object from `Array`
- second model contains info about data-source `{ index: Number, page: Number, pages: Number, count: Number }`

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)