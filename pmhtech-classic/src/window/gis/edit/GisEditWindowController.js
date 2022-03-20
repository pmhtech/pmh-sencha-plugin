Ext.define('PmhTech.window.gis.edit.GisInfoWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pmh-gis-edit-popup',
    initSetting: function(param){

        this.gisContainer = param.gisContainer;
     },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     */
    onBtnCancel: function (button, e) {
        var me = this;

        me.gisContainer.removeInteraction('modify');
        me.gisContainer.removeInteraction('select');
        me.gisContainer.addSelectInteraction();
        me.getView().hide();
        Ext.ComponentQuery.query('pmh-gis-info-popup')[0].show();
    },
    /**
     * @param {Ext.button.Button} button
     * @param {Event} e
     */
    onBtnComplete: function (button, e) {
        var me = this;

        me.gisContainer.removeInteraction('modify');
        var datas = me.gisContainer.getSelection();
        me.gisContainer.removeInteraction('select');
        me.gisContainer.addSelectInteraction();
        me.gisContainer.select(datas);

        Ext.ComponentQuery.query('pmh-gis-info-popup')[0].show();
        me.getView().hide();

    },
});