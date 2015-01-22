define([
	'core',
	'jquery',
	'demo/templates',
	'lmblockui'
], function (LM, $, templates, BlockUI) {
	return LM.View.extend({
		events: {
			'click #blockEntirePage': '_onBlockEntirePage',
			'click #blockSomeEl': '_onBlockSomeEl',
			'click #unBlockSomeEl': '_onUnBlockSomeEl'
		},

		className: 'page-wrapper',

		template: templates['demo/BlockUI'],

		initialize: function () {
			this.blockUI = new BlockUI();
		},

		render: function () {
			this.$el.html(this.template());
		},

		_onBlockEntirePage: function () {
			var that = this;
			this.blockUI.block({
				$blockEl: null,
				message: 'this is a whole page block'
			});
			setTimeout(function () {
				that.blockUI.unBlock();
			}, 3000);
		},

		_onBlockSomeEl: function () {
			this.blockUI.block({
				message: 'loading, please wait...',
				$blockEl: this.$('#testBlockDiv')
			});
		},

		_onUnBlockSomeEl: function () {
			this.blockUI.unBlock();
		}
	});
});
