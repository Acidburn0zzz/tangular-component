COMPONENT('datagrid', function() {

	var self = this;
	var width = [];
	var Theaders = {};
	var Trows = {};
	var Twidths = {};
	var rows;
	var el_rows;
	var el_headers;

	self.readonly();

	self.onCheckbox;
	self.onButton;

	self.make = function() {
		self.element.addClass('ui-datagrid');

		self.element.on('change', 'input', function() {
			var el = $(this);
			var index = parseInt(el.closest('.ui-datagrid-row').attr('data-index'));
			if (self.onCheckbox)
				self.onCheckbox(index, self.get()[index], el.prop('checked'), el);
		});

		self.element.on('click', 'button', function() {
			var el = $(this);
			var index = parseInt(el.closest('.ui-datagrid-row').attr('data-index'));
			if (self.onButton)
				self.onButton(index, self.get()[index], el.attr('name'), el);
		});

		self.find('script').each(function(index) {

			var html = this.innerHTML.replace(/(\s|\")column(\s|\")/g, function(text) {
				return text.replace('column', 'ui-datagrid-column');
			}).replace(/(\s|\")controls(\s|\")/g, function(text) {
				return text.replace('controls', 'ui-datagrid-controls');
			}).trim();

			var type = this.getAttribute('data-type');
			var header = type === 'header' || type === 'head';

			if (!header) {
				html = html.replace(/class\=\".*?"/g, function(text) {
					if (text.indexOf('ui-datagrid-column') === -1)
						return text;
					return '[#]' + text;
				});
			}

			var responsive = this.getAttribute('data-responsive');

			responsive.split(',').forEach(function(size) {
				size = size.trim();
				if (header) {
					Theaders[size] = Ta.compile(html);
					Twidths[size] = html.match(/width:\d+(px|\%)/gi);
				} else
					Trows[size] = Ta.compile(html);
			});

		}).remove();

		self.element.html('<div class="ui-datagrid-headers"></div><div class="ui-datagrid-rows"></div>');
		el_headers = self.element.find('.ui-datagrid-headers');
		el_rows = self.element.find('.ui-datagrid-rows');
	};

	self.renderrow = function(index, row, size) {
		if (!size)
			size = WIDTH();
		row.$index = index;
		var Trow = Trows[size];
		if (!Trow)
			return '';
		return Trow(row);
	};

	self.render = function(index, refresh, row, size) {

		if (!size)
			size = WIDTH();

		if (refresh === undefined)
			refresh = true;

		if (row === undefined)
			row = self.get()[index];

		var indexer = 0;

		rows[index] = '<div class="ui-datagrid-row" data-index="{1}">{0}</div>'.format(self.renderrow(index, row, size).replace(/\[\#\]/g, function(text) {
			var w = Twidths[size];
			if (w)
				w = w[indexer++];
			if (!w)
				return '';
			return 'style="{0}" '.format(w);
		}), index);

		if (refresh)
			self.element.find('.ui-datagrid-row[data-index="{0}"]'.format(index)).replaceWith(rows[index]);

		return self;
	};

	self.setter = function(value) {

		if (!value) {
			self.element.addClass('hidden');
			return;
		}

		rows = [];

		var size = WIDTH();

		for (var i = 0, length = value.length; i < length; i++)
			self.render(i, false, value[i], size);

		var Thead = Theaders[size];
		el_headers.empty().append(Thead ? Thead(value) : '');
		el_rows.empty().append(rows.join(''));
		self.element.removeClass('hidden');
	};

});