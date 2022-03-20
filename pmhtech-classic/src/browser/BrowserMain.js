/**
 *
 */
Ext.define('PmhTech.browser.BrowserMain', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.browser-main',

    requires: [
        'Ext.layout.container.Fit'
    ],
    renderTo: Ext.getBody(),
    layout: 'fit',

    initComponent: function () {
        var me = this;

        me.callParent(arguments);


    }
});
