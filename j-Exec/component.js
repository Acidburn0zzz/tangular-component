COMPONENT('exec', function(self, config) {
	self.readonly();
	self.blind();
	self.make = function() {

		self.event('click', config.selector || '.exec', function(e) {

			var el = $(this);
			var attr = el.attrd('exec');
			var path = el.attrd('path');
			var href = el.attrd('href');
			var def = el.attrd('def');
			var reset = el.attrd('reset');

			if (el.attrd('prevent') === 'true') {
				e.preventDefault();
				e.stopPropagation();
			}

			if (attr) {
				if (attr.indexOf('?') !== -1)
					attr = attr.replace(/\?/g, el.scope().path);
				EXEC(attr, el, e);
			}

			href && NAV.redirect(href);

			if (def) {
				if (def.indexOf('?') !== -1)
					def = def.replace(/\?/g, el.scope().path);
				DEFAULT(def);
			}

			if (reset) {
				if (reset.indexOf('?') !== -1)
					reset = reset.replace(/\?/g, el.scope().path);
				RESET(reset);
			}

			if (path) {
				var val = el.attrd('value');
				if (val) {
					if (path.indexOf('?') !== -1)
						path = path.replace(/\?/g, el.scope().path);
					var v = GET(path);
					SET(path, new Function('value', 'return ' + val)(v), true);
				}
			}
		});
	};
});