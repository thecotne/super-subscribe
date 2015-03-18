(function($) {
	var decodeHTML = function(html_str) {
		return $("<div />").html(html_str).text();
	}
	$.fn.superSubscribe = function(opts) {
		var superSubscribe = {
			wrapper: null,
			init: function(wrapper, opts) {
				this.wrapper = wrapper;
				this.opts = $.extend({}, opts);
				this.action = $(this.wrapper).attr('super-subscribe');

				$(this.wrapper).find('[super-subscribe-submit]').on('click', $.proxy(this.submit, this));
				$(this.wrapper).find('[super-subscribe-email]').on('keypress', $.proxy(this.detectEnter, this));

			},
			detectEnter: function(e) {
				if (e.which == 13) {
					e.preventDefault();
					this.submit();
				}
			},
			ajaxResponse: function(jqXHR, status, statusMSG) {
				console.log(jqXHR.responseText);
				if (jqXHR.responseText) {
					try {
						res = $.parseJSON(jqXHR.responseText);
					} catch (err) {};
					if (res.status) {
						if (res.status == 'ok') {
							var addClass = 'alert-success';
						} else if (res.status == 'mail_already_exists') {
							var addClass = 'alert-info';
						} else {
							var addClass = 'alert-danger';
						}

						$(this.wrapper).find('.output')
							.hide()
							.removeClass('alert-success alert-info alert-danger')
							.addClass('alert ' + addClass)
							.html(decodeHTML(res.data))
							.fadeIn();
						// setTimeout($.proxy(function(e){
						// 	$(this.wrapper).find('.output').fadeOut(300, $.proxy(function(e){
						// 		$(this.wrapper).find('.output').html('');
						// 		$(this.wrapper).find('input[type="text"]').val('');
						// 	},this));
						// }), 2000);

					};

				}
			},
			submit: function(e) {
				e && e.preventDefault();
				$.ajax({
					method: 'post',
					url: this.action,
					data: {
						email: $(this.wrapper).find('[super-subscribe-email]').val()
					},
					complete: $.proxy(this.ajaxResponse, this)
				});
			}
		};
		if (this.length > 1) {
			var objects = [];
			$(this).each(function() {
				var instance = Object.create(superSubscribe);
				instance.init(this, opts);
				objects.push(instance);
			});
			return objects;
		} else {
			var instance = Object.create(superSubscribe);
			instance.init(this, opts);
			return instance;
		}
	}
	$(function() {
		$("[super-subscribe]").superSubscribe();
	});
})(jQuery);
