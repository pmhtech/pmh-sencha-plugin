Ext.define('PmhTech.overrides.form.field.Tag', {
    override: 'Ext.form.field.Tag',

    requires: [
        'Ext.data.Store'
    ],
    initComponent: function(){
        var me = this;
        Ext.apply(me,{
            store : Ext.create('Ext.data.Store')
        })

        me.callParent(arguments);

        me.getStore().addListener('load',me.onAddLoad,me);
    },
    onAddLoad : function(thisStore){
        var me = this;
        var val =me.getValue();
        me.setValue(val);
    },
    getValue : function(){
        return this.value;
    },
    getSubmitValue : function(){
        return this.value;
    }
});