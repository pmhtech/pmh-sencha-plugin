/**
 *
 */
Ext.define('PmhTech.form.radiogroup.RadioGroup', {
    extend: 'Ext.form.RadioGroup',
    alias: ['widget.pmh-radiogroup'],

    requires: [
        'Ext.layout.container.Column'
    ],
    initComponent : function(arguments){
        var me = this;

        var name = me.name;

        delete me.name;
        Ext.apply(me,{
            layout: 'column',
            defaults: {
                margin: '0 20 0 0',
                xtype: 'radiofield',
                name : name
            }
        });
        me.callParent(arguments);
    }





});