Ext.define('PmhTech.button.Search',{
    extend : 'Ext.button.Button',
    alias : ['widget.pmhtech-button-search','widget.pmh-button-search'],
    text: '조회',
    initComponent : function(){
        var me =this;

        if(me.useIcon===true){
            me.iconCls = 'x-fa fa-search';
            me.text=null;
        }else{
            me.width=90;
        }
        me.callParent(arguments);
    }
});