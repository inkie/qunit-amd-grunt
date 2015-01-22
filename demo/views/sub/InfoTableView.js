define([
    'lodash',
    'core',
    'lminfotable',
    'demo/templates'
], function (_, LM, InfoTable, templates) {
    return LM.View.extend({
        template: templates['demo/InfoTable'],

        render: function () {
            this._super();
            var data = [
                {name: 'case1', value: 'case1 status is ok'},
                {name: 'case2', value: 'case2 status is ok'},
                {name: 'case3', value: 'case3 status is ok'},
                {name: 'case4', value: 'case4 status is ok'}
            ];
            this.registerComponent('single-info-table', new InfoTable({
                data: data,
                sortBy: 'name',
                template: templates['demo/MyInfoTable']
            }), '.info-table-con-single');
            this.registerComponent('couple-info-table', new InfoTable({
                data: data,
                coupleRows: true,
                sortBy: 'name',
                template: templates['demo/MyInfoTable']
            }), '.info-table-con-couple');
        }
    });
});