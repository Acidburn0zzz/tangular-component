COMPONENT('nosqlcounter', 'count:0;height:80', function(self, config) {

	var months = MONTHS;
	var container, labels;

	self.readonly();

	self.make = function() {
		self.aclass('ui-nosqlcounter');
		self.append('<div class="ui-nosqlcounter-table"{0}><div class="ui-nosqlcounter-cell"></div></div><div class="ui-nosqlcounter-labels"></div>'.format(config.height ? ' style="height:{0}px"'.format(config.height) : ''));
		container = self.find('.ui-nosqlcounter-cell');
		labels = self.find('.ui-nosqlcounter-labels');
	};

	self.configure = function(key, value) {
		switch (key) {
			case 'months':
				if (value instanceof Array)
					months = value;
				else
					months = value.split(',').trim();
				break;
		}
	};

	self.redraw = function(maxbars, value) {

		if (!value)
			value = [];

		if (WIDTH() === 'xs')
			maxbars = maxbars / 2;

		var dt = new Date();
		var current = dt.format('yyyyMM');
		var stats = null;

		if (config.lastvalues) {
			var max = value.length - maxbars;
			if (max < 0)
				max = 0;
			stats = value.slice(max, value.length);
		} else {
			stats = [];
			for (var i = 0; i < maxbars; i++) {
				var id = dt.format('yyyyMM');
				var item = value.findItem('id', id);
				stats.push(item ? item : { id: id, month: dt.getMonth() + 1, year: dt.getFullYear(), value: 0 });
				dt = dt.add('-1 month');
			}
			stats.reverse();
		}

		var max = stats.scalar('max', 'value');
		var bar = 100 / maxbars;
		var builder = [];
		var dates = [];
		var cls = '';

		for (var i = 0, length = stats.length; i < length; i++) {
			var item = stats[i];
			var val = item.value;
			if (val > 999)
				val = (val / 1000).format(1, 2) + 'K';

			var h = (item.value / max) * 60;
			h += 40;

			cls = item.value ? '' : 'empty';

			if (item.id === current)
				cls += (cls ? ' ' : '') + 'current';

			if (i === maxbars - 1)
				cls += (cls ? ' ' : '') + 'last';

			var w = bar.format(2, '');

			builder.push('<div style="width:{0}%;height:{1}%" title="{3}" class="{4}"><span>{2}</span></div>'.format(w, h.format(0, ''), val, months[item.month - 1] + ' ' + item.year, cls));
			dates.push('<div style="width:{0}%">{1}</div>'.format(w, months[item.month - 1].substring(0, 3)));
		}

		labels.html(dates.join(''));
		container.html(builder.join(''));
	};

	self.setter = function(value) {
		if (config.count === 0) {
			self.width(function(width) {
				self.redraw(width / 30 >> 0);
			});
		} else
			self.redraw(config.count);
	};
});