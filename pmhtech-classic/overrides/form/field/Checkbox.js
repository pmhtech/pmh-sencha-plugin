/**
 *
 */
Ext.define('PmhTech.overrides.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
    minWidth : null,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addListener('afterrender',function(component){
            if(component.readOnly===true){
                component.setReadOnly(component.readOnly);
            }
        });
    },

    setReadOnly : function(readOnly){
        var me = this;


        me.callParent(arguments);

    }
    
});