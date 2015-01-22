define([
    'lodash',
    'jquery'
], function (_, $) {
    return {
        events: {
            'click .toggle-link': '_toggleSectionBox'
        },

        _toggleSectionBox: function (e) {
            var $sectionContent = $(e.target).closest('.section-header').next('.section-content');

            if ($sectionContent.is(':hidden')) {
                $sectionContent.show();
            } else {
                $sectionContent.hide();
            }
        }
    };
});