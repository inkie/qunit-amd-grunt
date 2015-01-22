define([
    'core',
    'modelurls'
], function (LM, modelUrls) {
    return LM.Model.extend({
        urlRoot: modelUrls.users
    });
});