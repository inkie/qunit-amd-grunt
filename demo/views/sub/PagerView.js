define([
    'lodash',
    'core',
    'lmpager',
    'demo/templates'
], function (_, LM, Pager, templates) {
    return LM.View.extend({
        template: templates['demo/Pager'],

        appEvents: {
            'select pager': '_onSelectPage'
        },

        render: function () {
            this._super();
            this.registerComponent('pager', new Pager({
                pageIndex: 1,
                pageSize: 5,
                total: 30,
                label: 'items'
            }), '.pager-con');
            this.curPage = this.$('.content1');
        },

        _onSelectPage: function (pageIndex) {
            var oldPage = this.curPage;
            if (oldPage && oldPage.length > 0) {
                oldPage.hide();
            }
            var curPage = this.curPage = this.$('.content'+pageIndex);
            if  (curPage && curPage.length > 0) {
                curPage.show();
            }
        }
    });
});