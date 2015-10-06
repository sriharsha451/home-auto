'use strict';
var pubsub = require('raptor-pubsub');

module.exports = require('marko-widgets').defineWidget({
    init: function(widgetConfig) {
        this.rootEl = this.el;
        this.config = widgetConfig;
        this.bindEventListeners();
    },
    bindEventListeners: function() {
    	var _this = this;

        //handles the click of SET button on the garage
        $(_this.rootEl).on('click', '.comp-garage-form .comp-garage-btn-set', function(event) {
            event.preventDefault();
            _this.setGarageOpenTimes();
        });       

    },
    setGarageOpenTimes : function() {
        var _this = this;
        // var baseForm = ;

        var hours = $(".comp-garage-form__" + _this.config.model.id + " .comp-garage-hour").val();
        var minutes = $(".comp-garage-form__" + _this.config.model.id + " .comp-garage-min").val();
        var _this = this;

        var requestData = JSON.parse(JSON.stringify(_this.config.model));
        requestData.events.today.push(hours+":"+minutes);
        pubsub.emit('garage_' + _this.config.model.id + '.callapi', requestData);

    }
});
