Ext.define('PmhTech.view.global.west.GlobalWest', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.global-west',
    header : {
      height : 35
    },
    layout: {
        type : 'vbox',
        align : 'stretch'
    },
    collapsible : true,
    items : [],

    removeMenu : function(){

        this.removeAll();
    }
});