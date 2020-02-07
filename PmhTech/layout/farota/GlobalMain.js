Ext.define('PmhTech.view.global.GlobalMain', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.global-main',
    layout : 'border',
    style: 'background-color : #FEFEFE',
items: [{
        xtype: 'global-north',
        region: 'north',
        height: 50
    },{
        xtype : 'container',
        region : 'center',
        flex : 1,
        itemId : 'menuContent',
        layout : 'border',
        items : [{
            xtype: 'global-west',
            region : 'west',
            scrollable : true,
            width : 220
        }, {
            xtype: 'global-center',
            region: 'center',
            flex: 1
        }]
    }]
});
