Ext.define('PmhTech.overrides.data.ChainedStore', {
    override: 'Ext.data.ChainedStore',

   /* constructor : function(){
        var me = this;

        me.callParent(arguments);

        if(Ext.isString(me.originFieldName)){
            me.addListener('add',me.onAddDataChanged);
            me.addListener('update',me.onAddDataChanged);
            me.addListener('remove',me.onAddDataChanged);

        }
    },

    onAddDataChanged : function(thisStore,eOpts){
        var datas = Ext.clone(Ext.Array.pluck(thisStore.getRange(),'data'));

        for(var i=0;i<datas.length;i++){
            var data = datas[i];
            delete data.id;
        }
        this.originRecord.data[this.originFieldName]=datas;

    }*/
});