'use strict';
var pubsub = require('raptor-pubsub');

module.exports = require('marko-widgets').defineComponent({
    template: require.resolve('./template.marko'),
    init: function(widgetConfig) {
        this.rootEl = this.el;
        this.socket = io();
        this.config = widgetConfig;
        this.bindEventListeners();
        this.callThermostatsAPI(widgetConfig.model);
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

        _this.subscribeTo(pubsub).on('thermostat_' + _this.config.model.id + '.callapi', function(data) {
            data.currentTemperature = _this.config.model.currentTemperature;
            _this.callThermostatsAPI(data);
        });

        _this.socket.on('thermostat.update', function (data) {
            _this.refreshThermostatState(data);
        });

    },
    refreshThermostatState : function(data) {
        var _this = this;
        if ((_this.config.model.state === "ON") && (data.id == _this.config.model.id)) {
            if (data.currentTemperature) {
                _this.config.model.currentTemperature = data.currentTemperature;                
            }
            if (data.setTemperature) {
                _this.config.model.setTemperature = data.setTemperature;                
            }
            _this.config.model.state = data.state;
            _this.setState("model",data);                
        }
    },
    callThermostatsAPI : function(requestData) {
        var _this = this;        

        $.ajax({
          dataType: "json",
          method:"POST",
          url: "/api/thermostats",
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
