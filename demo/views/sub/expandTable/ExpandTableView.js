define([
    'core',
    'demo/templates',
    './MyExpandTable'
], function (LM, templates,  MyExpandTable) {
    return LM.View.extend({
        className: 'page-wrapper',

        template: templates['demo/ExpandTable'],

        render: function () {
            this.$el.html(this.template());

            this.registerComponent('expand', new MyExpandTable({
                data: [
                    {
                        id: 1,
                        name: 'test1',
                        description: 'test1 description',
                        datasource: 'datasource1',
                        note: 'test1 note',
                        status: 'ok',
                        user: 'user1'
                    },
                    {
                        id: 2,
                        name: 'test2',
                        description: 'test1 description',
                        datasource: 'datasource2',
                        note: 'test1 note',
                        status: 'bad',
                        user: 'user2'
                    },
                    {
                        id: 3,
                        name: 'test3',
                        description: 'test1 description',
                        datasource: 'datasource3',
                        note: 'test1 note',
                        status: 'good',
                        user: 'user3'
                    }
                ]
            }), '.expand-table-con');
        }
    });
});
