Ext.define('PmhTech.override.form.field.Base', {
    override: 'Ext.form.field.Base',
    labelSeparator : '',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.oriFieldLabel =me.fieldLabel;
        me.oriValue = me.value;
        me.addListener('afterrender',function(component){
            if(component.allowBlank===false){
                component.setAllowBlank(component.allowBlank);
            }
        });
    },

    setAllowBlank : function(allowBlank,afterTextLabel){
        var me = this;
        if(allowBlank){
            me.setFieldLabel(me.oriFieldLabel);
         }else{
            me.setFieldLabel(me.oriFieldLabel+'<font color="red"> *</font>');
        }
    }
});