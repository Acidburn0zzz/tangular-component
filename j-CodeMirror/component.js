COMPONENT('codemirror', 'linenumbers:false;required:false', function(self, config) {

	var skipA = false;
	var skipB = false;
	var editor = null;

	self.getter = null;

	self.reload = function() {
		editor.refresh();
	};

	self.validate = function(value) {
		return (config.disabled || !config.required ? true : value && value.length > 0) === true;
	};

	self.configure = function(key, value, init) {
		if (init)
			return;

		switch (key) {
			case 'disabled':
				self.tclass('ui-disabled', value);
				editor.readOnly = value;
				editor.refresh();
				break;
			case 'required':
				self.find('.ui-codemirror-label').tclass('ui-codemirror-label-required', value);
				self.state(1, 1);
				break;
			case 'icon':
				self.find('i').rclass().aclass('fa fa-' + value);
				break;
		}

	};

	self.make = function() {
		var content = config.label || self.html();
		self.html((content ? '<div class="ui-codemirror-label' + (config.required ? ' ui-codemirror-label-required' : '') + '">' + (config.icon ? '<i class="fa fa-' + config.icon + '"></i> ' : '') + content + ':</div>' : '') + '<div class="ui-codemirror"></div>');
		var container = self.find('.ui-codemirror');
		editor = CodeMirror(container.get(0), { lineNumbers: config.linenumbers, mode: config.type || 'htmlmixed', indentUnit: 4 });

		if (config.height !== 'auto') {
			var is = typeof(config.height) === 'number';
			editor.setSize('100%', is ? (config.height + 'px') : (config.height || '200px'));
			!is && self.css('height', config.height);
		}

		if (config.disabled) {
			self.aclass('ui-disabled');
			editor.readOnly = true;
			editor.refresh();
		}

		editor.on('change', function(a, b) {

			if (config.disabled)
				return;

			if (skipB && b.origin !== 'paste') {
				skipB = false;
				return;
			}

			setTimeout2(self.id, function() {
				skipA = true;
				// self.reset(true);
				self.dirty(false);
				self.set(editor.getValue());
			}, 200);
		});

		skipB = true;
	};

	self.setter = function(value) {

		if (skipA === true) {
			skipA = false;
			return;
		}

		skipB = true;
		editor.setValue(value || '');
		editor.refresh();
		skipB = true;

		CodeMirror.commands['selectAll'](editor);
		skipB = true;
		editor.setValue(editor.getValue());
		skipB = true;

		setTimeout(function() {
			editor.refresh();
		}, 200);

		setTimeout(function() {
			editor.refresh();
		}, 1000);

		setTimeout(function() {
			editor.refresh();
		}, 2000);
	};

	self.state = function(type) {
		if (!type)
			return;
		var invalid = config.required ? self.isInvalid() : false;
		if (invalid === self.$oldstate)
			return;
		self.$oldstate = invalid;
		self.find('.ui-codemirror').tclass('ui-codemirror-invalid', invalid);
	};
}, ['//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.css', '//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.js', '//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/javascript/javascript.min.js', '//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/htmlmixed/htmlmixed.min.js', '//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/xml/xml.min.js', '//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/css/css.min.js']);
