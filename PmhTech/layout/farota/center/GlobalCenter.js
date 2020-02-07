Ext.define('PmhTech.view.global.center.GlobalCenter', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.global-center',
    requires: [
        'PmhTech.view.global.center.tab.GlobalCenterTab'
    ],
    controller : 'global-center',
    layout : 'fit',
    items: [{
        xtype: 'global-center-tab',
        hidden : false,
        itemId : 'menuCenterTabPanel'
    },{
        xtype: 'global-center-tab',
        hidden : false,
        itemId : 'siteCenterTabPanel',
        tabBar : {
            listeners :{
                //beforeremove : 'onCloseSiteTab',
            }
        },
        listeners : {
            tabchange : 'onChangeSiteTab',
            remove : 'onCloseSiteTab'
        },

    }]
});