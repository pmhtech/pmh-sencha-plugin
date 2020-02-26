Ext.define('PmhTech.window.gis.info.GisInfoWindow', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.pmh-gis-info-popup','widget.gis-info-popup'],

    requires: [
        'Ext.button.Button',
        'Ext.button.Button',
        'Ext.layout.container.VBox',
        'PmhTech.window.gis.info.GisInfoWindowController'
    ],
    controller : 'pmh-gis-info-popup',
    collapsible : true,
    header : {
        height : 30
    },
    layout : {
        type : 'vbox',
        align : 'stretch'
    },listeners : {
        afterrender : 'onAfterRender',
        add : 'onAddItem'
    },
    bbar : [{
        xtype : 'button',
        clickEvent : 'mouseup',
        text :'지형편집',
        handler : 'onBtnModifyGeometry'
    },{
        xtype : 'button',
        clickEvent : 'mouseup',
        text : '적용',
        //handler : 'onBtnModify'
    }],
});