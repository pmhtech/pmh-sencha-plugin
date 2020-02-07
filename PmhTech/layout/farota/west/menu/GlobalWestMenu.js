Ext.define('PmhTech.view.global.west.menu.GlobalWestMenu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.global-west-menu',
    requires : [
        'PmhTech.view.global.west.menu.button.GlobalWestMenuButton'

    ],
    margin : '0 0 10 0',
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    style : {
        textAlign : 'left'
    },
    items : [{
        xtype : 'container',
        height : 30
    }]
});