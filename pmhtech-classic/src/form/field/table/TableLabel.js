Ext.define('PmhTech.form.field.table.TableLabel', {
    alias: ['widget.pmh-table-label', 'widget.table-label'],
    extend: 'Ext.form.field.Display',
    style: {
        margin: '0 auto',
        textAlign: 'center'
    },
    minWidth : null,
    hideLabel : true,
    requireFlag : false,
    initComponent: function () {
        var me = this;
        var fieldLabel = me.value || me.fieldLabel;

        delete me.fieldLabel;
        Ext.apply(me,{

            value : fieldLabel
        })



        me.callParent(arguments);


    }
})