'use strict';
var pubsub = require('raptor-pubsub');

module.exports = require('marko-widgets').defineWidget({
    init: function(widgetConfig) {
        this.rootEl = this.el;
        this.config = widgetConfig;
        this.constants = {
            "btnClass" : "comp-thermostat-btn-state"
        }
        this.bindEventListeners();
    },
    bindEventListeners: function() {
    	var _this = this;

        //handles the click of SET button on the thermostat
        $(_this.rootEl).on('click', '.comp-thermostat-form .comp-thermostat-btn-set', function(event) {
            event.preventDefault();
            _this.validateAndSetTemperature();
        });

        //handles the click of ON/OFF button on the thermostat
        $(_this.rootEl).on('click', '.comp-thermostat-form .comp-thermostat-btn-state', function(event) {
            event.preventDefault();
            _this.handleThermostatOnOff($(this));
        });        

    },
    validateAndSetTemperature : function() {
        var inputElement = $("#comp-thermostat-set-temperature__" + _this.config.model.id);
        var setTemperature = inputElement.val();
        if (_this.isInputNumeric(setTemperature)) {
            inputElement.parent().removeClass("has-error");                
            _this.setThermostatTemperature(setTemperature);
        } else {
            inputElement.parent().addClass("has-error");
        }
    },
    isInputNumeric : function(val) {
        return (!isNaN(val))
    },
    setThermostatTemperature : function(setTemperature) {
        var _this = this;
        var requestData = JSON.parse(JSON.stringify(_this.config.model));
        requestData.setTemperature = parseInt(setTemperature);
        pubsub.emit('thermostat_' + _this.config.model.id + '.callapi', requestData);
    },
    handleThermostatOnOff : function(elm) {
        var _this = this;
        var currentState = elm.val();
        var futureState = _this.getFutureState(currentState);

        var requestData = JSON.parse(JSON.stringify(_this.config.model));
        requestData.state = (futureState);

        $(elm).val(futureState).html(futureState).removeClass(_this.constants.btnClass + "__" + currentState).addClass(_this.constants.btnClass + "__" + futureState);
        pubsub.emit('thermostat_' + _this.config.model.id + '.callapi', requestData);
    },
    getFutureState : function(currentState) {
        var futureState = "ON";

        if (currentState === "ON") {
            futureState = "OFF";
        }
        return futureState;
    }
});
