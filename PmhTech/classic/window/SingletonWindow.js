/**
 *
 *
 * SingleTone 방식으로 Window를 생성시켜줍니다.
 *
 */


Ext.define('PmhTech.window.SingletonWindow', {
    extend: 'Ext.window.Window',
    alias : 'widget.pmh-singleton-window',
    modal: true,
    width: 800,
    closable: true,
    hidden: true,
    closeAction: 'hide',
    floating: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [],
    initSingleTone: function (options) {


        var controller = this.getController() || this;


        var mode = options.mode;
        var configs = options.configs;
        var params = options.params;
        var callbackScope = options.callbackScope;
        var callbackFunc = options.callbackFunc;

        if (Ext.isFunction(callbackFunc)) {
            controller.callbackFunc = function () {
                Ext.callback(callbackFunc, callbackScope, arguments);
            };
        }
        if (mode) {
            Ext.callback(controller.initSetting, controller, [mode, params]);
        } else {
            Ext.callback(controller.initSetting, controller, [params]);
        }

        controller.mode = mode;
        controller.params = params;
        controller.configs = configs;

        this.show();

    }
});