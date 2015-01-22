define([
    'lodash',
    'core',
    'lmexpandtable',
    'demo/templates',
    './EmbeddedView'
], function (_, LM, ExpandTable, templates, EmbeddedView) {
    return ExpandTable.extend({
        template: templates['demo/MyExpandTable'],

        _showEmbeddedTableView: function (id) {
            return new EmbeddedView({
                data: _.filter(this.fullData, {id: id})
            });
        }
    });
});