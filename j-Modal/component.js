COMPONENT('modal', function() {
	var self = this;
	var reload = self.attr('data-reload');

	if (!MAN.$$modal) {
		window.$$modal_level = window.$$modal_level || 1;
		MAN.$$modal = true;
		$(document).on('click', '.ui-modal-close', function() {
			SET($(this).attr('data-path'), '');
			window.$$modal_level--;
		});
	}

	self.readonly();
	self.make = function() {
		self.condition = self.attr('data-if');
		$(document.body).append('<div id="{0}" class="hidden ui-modal-container"><a href="javascript:void(0)" class="ui-modal-close" data-path="{2}"><i class="fa fa-times"></i>{1}</a><div class="ui-modal-body"></div></div>'.format(self._id, self.attr('data-button') || 'Close window', self.path));
		var el = $('#' + self._id);
		el.find('.ui-modal-body').get(0).appendChild(self.element.get(0));
		self.classes('-hidden');
		self.element = el;
		self.event('scroll', function() {
			EMIT('reflow', self.name);
		});

		self.attr('data-esc') !== 'false' && $(window).on('keydown', function(e) {
			e.keyCode === 27 && self.get() && self.set('');
		});
	};

	self.getter = null;
	self.setter = function(value) {

		setTimeout2(self.id + '.scroll', function() {
			$('html').toggleClass('ui-modal-noscroll', $('.ui-modal-container').not('.hidden').length ? true : false);
		}, 100);

		var isHidden = !EVALUATE(self.path, self.condition);
		if (self.element.hasClass('hidden') && isHidden)
			return;

		EMIT('reflow', self.name);

		if (isHidden) {
			self.classes('-ui-modal-visible');
			setTimeout2(self.id, function() {
				self.classes('hidden');
			}, 50);
			return;
		}

		window.$$modal_level++;
		self.classes('-hidden');

		setTimeout2(self.id, function() {
			self.classes('ui-modal-visible');
		}, 50);

		reload && EXEC(reload, self);
		self.element.css('z-index', window.$$modal_level * 5);
		self.find('.ui-modal-body').animate({ scrollTop: 0 }, 0, NOOP, 300);
	};
});