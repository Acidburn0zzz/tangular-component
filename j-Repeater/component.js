COMPONENT('repeater', function(self) {

	var recompile = false;
	var filter;

	self.readonly();

	self.make = function() {
		var element = self.find('script');

		if (!element.length) {
			element = self.element;
			self.element = self.element.parent();
		}

		var html = element.html();
		element.remove();
		self.template = Tangular.compile(html);
		recompile = html.indexOf('data-jc="') !== -1;
		filter = GET(self.attrd('filter'));
	};

	self.setter = function(value) {

		if (!value || !value.length) {
			self.empty();
			return;
		}

		var builder = [];
		for (var i = 0, length = value.length; i < length; i++) {
			var item = value[i];
			item.index = i;
			if (!filter || filter(item))
				builder.push(self.template(item).replace(/\$index/g, i.toString()).replace(/\$path/g, self.path + '[' + i + ']'));
		}

		self.html(builder);
		recompile && self.compile();
	};
});