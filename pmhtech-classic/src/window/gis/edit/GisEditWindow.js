/**
 *
 */
Ext.define('PmhTech.window.gis.edit.GisEditWindow', {
    extend: 'PmhTech.window.SingletonWindow',
    alias: ['widget.pmh-gis-edit-popup','widget.gis-edit-popup'],

    requires: [
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'PmhTech.window.gis.edit.GisInfoWindowController'
    ],
    modal : false,
    width : 200,
    height : 100,
    controller : 'pmh-gis-edit-popup',
    renderTo : Ext.getBody(),
    title : '지형편집',
    bbar : [{
        xtype : 'tbfill'
    },{
        type : 'button',
        handler : 'onBtnComplete',
        text : '편집완료'
    },{
        type : 'button',
        handler : 'onBtnCancel',
        text : '편집취소'
    },{
        xtype : 'tbfill'
    }]
});