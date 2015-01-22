define([
    'lodash',
    'core',
    'lmtable',
    'demo/templates'
], function (_, LM, Table, templates) {
    return Table.extend({
        template: templates['demo/EmbeddedTable']
    });
});