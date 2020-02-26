Ext.define('PmhTech.window.gis.info.GisInfoWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pmh-gis-info-popup',

    requires: [
        'PmhTech.utils.Window'
    ],

    /**
     *
     * @param {PmhTech.window.gis.info.GisInfoWindow} comp
     */
    onAfterRender: function (comp) {

        var tools = comp.query('tool');
        tools.forEach(function (tool) {
            tool.getEl().on('mouseup', function () {
                Ext.callback(this.handler, comp)
            }, tool);
        });
    },
    /**
     * @param {Ext.container.Container} comp
     * @param {Ext.Component} newComp
     * @param {Number} index
     */
    onAddItem: function (comp, newComp, index) {

        var buttons = comp.query('button');

        buttons.forEach(function (button) {
            button.clickEvent = 'mouseup';
        });

        newComp.setTitle(null);


    },
    /**
     *
     * @param {Ext.button.Button} button
     */
    onBtnModifyGeometry: function (button) {
        var thisView = this.getView();
        thisView.hide();
        thisView.gisContainer.startModify();

        PmhTech.utils.Window.showPopup('gis-edit-popup', {
            params : {
                gisContainer : thisView.gisContainer
            },
            callbackFunc: function () {
                thisView.gisContainer.fireEvent('drawend');
            },
            callbackScope: this
        });

    },
});