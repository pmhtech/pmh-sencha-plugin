/**
 *
 */
Ext.define('PmhTech.overrides.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
    queryMode : 'local',
    forceSelection : true,

    afterRender : function(){
        var me = this;

        var value = me.getValue();
        me.fireEvent('change',me,value);
        if(value) {
            me.fireEvent('select', me, me.getSelection());
        }
        me.callParent(arguments);
    }
});
