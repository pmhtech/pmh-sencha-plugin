/**
 *
 */
Ext.define('PmhTech.overrides.form.field.Hidden',{
    override : 'Ext.form.field.Hidden',
    multi : false,
    arrayValue : [],
    setValue : function(value){

        var me = this;
        if(!me.multi){
            me.callParent(arguments);
            return;
        }

        if(Ext.isEmpty(value)){
            me.arrayValue=[]
        }

        if(Ext.isArray(value)){
            me.arrayValue=value
        }else{
            me.arrayValue=[value]
        }
    },
    getValue : function(){
        var me = this;
        if(!me.multi){
            return me.callParent(arguments);

        }

        return this.arrayValue;
    },

    getSubmitValue : function(){
        var me = this;
        if(!me.multi){
            return me.callParent(arguments);

        }

        return this.arrayValue;
    }
})