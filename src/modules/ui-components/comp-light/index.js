'use strict';
var pubsub = require('raptor-pubsub');

module.exports = require('marko-widgets').defineComponent({
    template: require.resolve('./template.marko'),
    init: function(widgetConfig) {
        this.rootEl = this.el;
        this.bindEventListeners();
        this.config = widgetConfig;
    },

    //Required for stateful widget.
    getInitialState: function(input) {
        return {
            model: input.model,
            options: input.options
        };
    },

    //Required for client side render.
    getTemplateData: function(state) {
        return {
            model: state.model,
            options: state.options
        };
    },

    bindEventListeners: function() {
        var _this = this;

        $(_this.rootEl).on('click', '.comp-light-state-toggle', function(event) {
            event.preventDefault();
            var requestData = _this.getRequestData();
            _this.callLightsApi(requestData);
        });

    },
    getRequestData : function() {
        var _this = this;
        var requestData = JSON.parse(JSON.stringify(_this.config.model));

        if (requestData.state === "ON") {
            requestData.state = "OFF";
        } else {
            requestData.state = "ON";            
        }

        return requestData;
    },
    callLightsApi : function(requestData) {
        var _this = this;        

        $.ajax({
          dataType: "json",
          method:"POST",
          url: "/api/lights",
          data: requestData,
          success: function (data) {
            if (data && (data.responseMeta.responseCode === 200)) {
                _this.config.model = data.model;
                _this.setState("model",data.model);
            } else {
                //handle api error case here
            }
          },
          error : function() {            
            var res = JSON.parse(JSON.stringify(_this.config.model));
            res.responseMeta = {
                responseCode : 500
            };
            _this.setState("model",res);            
          }
        });        

    }
});
