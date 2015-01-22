define([
	'core',
    'demo/templates',
    'lmdropdown'
], function (LM, templates,  DropDown) {
    return DropDown.extend({
        template: templates['demo/MyDropDown'],

        initialize: function (options) {
            this._super(options);
            this.render();
        },

        render: function () {
            this.$el.html(this.template).appendTo(document.body);
        }
        });
});