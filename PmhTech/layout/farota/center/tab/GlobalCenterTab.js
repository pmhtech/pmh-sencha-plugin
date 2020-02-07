Ext.define('PmhTech.view.global.center.tab.GlobalCenterTab', {
    extend : 'Ext.tab.Panel',
    alias :'widget.global-center-tab',
    bodyStyle : 'background-color:white',
    itemId : 'global-center-tab',
    border : '1px',
    tabBar :{
        style : {
            backgroundColor : '#EEF2F5',
            borderBottom: '5px solid #3D4956 !important',
            padding : '10px 10px 0px 10px'
        },
    },
    defaults: {
        bodyPadding: 0,
        closable: true,
        border: false,
        tabConfig : {
            width:165,
        }
    }
});