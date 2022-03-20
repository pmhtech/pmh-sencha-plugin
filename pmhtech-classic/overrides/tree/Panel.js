
Ext.define('PmhTech.overrides.tree.Panel',{
    override : 'Ext.tree.Panel',
    columnLines : true,
    initComponent : function(){
        var me = this;

        me.__rootVisible = me.rootVisible || false;

        if(me.rootVisible===false){
            me.cls = 'pmh-no-root';
        }
        delete me.rootVisible;

        me.callParent(arguments);

    },
    afterRender : function(){
        var me = this;

        me.rootVisible = me.__rootVisible;
        if(me.rootVisible===false){

        }


        me.callParent(arguments);



    }
})