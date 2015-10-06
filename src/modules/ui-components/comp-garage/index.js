'use strict';
var pubsub = require('raptor-pubsub');

module.exports = require('marko-widgets').defineComponent({
    template: require.resolve('./template.marko'),
    init: function(widgetConfig) {
        this.rootEl = this.el;
        this.config = widgetConfig;

        this.bindEventListeners();
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

        $(_this.rootEl).on('click', '.comp-garage-state-toggle', function(event) {
            event.preventDefault();
            var requestData = _this.getRequestData();
            _this.callGaragesApi(requestData);
        });

        _this.subscribeTo(pubsub).on('garage_' + _this.config.model.id + '.callapi', function(data) {
            _this.callGaragesApi(data);
        });
    },
    getRequestData : function() {
        var _this = this;

        var requestData = JSON.parse(JSON.stringify(_this.config.model));

        if (requestData.state === "OPEN") {
            requestData.state = "CLOSED";
        } else {
            requestData.state = "OPEN";            
        }

        return requestData;
    },
    callGaragesApi : function(requestData) {
        var _this = this;        


        $.ajax({
          dataType: "json",
          method:"POST",
          url: "/api/garages",
          data: requestData,
          success: function (data) {
            if (data && (data.responseMeta.responseCode === 200)) {
                _this.config.model = data.model;
                _this.setState("model",data.model);
            } else {

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
