Ext.define('PmhTech.view.global.center.GlobalCenterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.global-center',
    onChangeSiteTab :function(tabpanel, newCard,oldcard){
        PmhTech.Cookie.setAppInfo('currentSite',newCard.siteIdx);

        var activeSiteParam = PmhTech.Cookie.getAppInfo('activeSiteTab')[newCard.siteIdx];

        var findRec = Ext.getStore('Site').findRecord('siteIdx',newCard.siteIdx);


        var siteParam = {
            siteIdx: findRec.data.siteIdx,
            userIdx : findRec.data.userIdx,
            stage : findRec.data.stage,
            status: findRec.data.status
        };

        PmhTech.Cookie.setAppInfo('siteParam',siteParam);

        Farota.app.getController('menu.MenuController').handleRoute(activeSiteParam.activePage);



        //console.log('siteIdx::: '+newCard.siteIdx+' ::: activePage ::'+activeSiteParam.activePage );

    },
    onCloseSiteTab : function(tabpanel,removeTab){

        var me = this;
        var activeSiteTab = PmhTech.Cookie.getAppInfo('activeSiteTab');
        delete activeSiteTab[removeTab.siteIdx];

        var activeTab = tabpanel.getActiveTab();
        var currentSite = Ext.isEmpty(activeTab) ? undefined : activeTab.siteIdx;

        PmhTech.Cookie.setAppInfo('activeSiteTab',activeSiteTab);
        PmhTech.Cookie.setAppInfo('currentSite',currentSite);



        if(!activeTab) {
            PmhTech.Msg.alert(LocaleMsg['ERROR']['NO_SELECT_SITE_MOVE_DASHBOARD'], function () {
                me.redirectTo('DSH_010002');
            });
        }
    }
});