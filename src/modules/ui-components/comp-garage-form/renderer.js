"use strict";

module.exports = require('marko-widgets').defineRenderer({
    template: require.resolve('./template.marko'),

    getTemplateData: function(state, input) {
        return {
            model: input.model,
            options: input.options
        };
    }
});
