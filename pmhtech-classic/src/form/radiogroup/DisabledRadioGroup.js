/**
 *
 */
Ext.define('PmhTech.form.radiogroup.DisabledRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    alias: ['widget.pmh-disabled-radiogroup', 'widget.disabled-radiogroup'],

    requires: [
        'Ext.layout.container.Column'
    ],
    fieldLabel: '사용유무',
    trueBoxLabel: '아니오',
    falseBoxLabel: '예',
    defaultValue: 'false',
    minWidth : Ext.form.Field.minWidth,
    initComponent: function (arguments) {
        var me = this;

        var name = me.name;
        delete me.name;

        Ext.apply(me,{

            layout: 'column',
            items: [{
                xtype: 'radiofield',
                margin: '0 20 0 0',
                name: name,
                checked: me.defaultValue == 'false',
                boxLabel: me.falseBoxLabel,
                readOnly: me.readOnly,
                allowBlank: me.allowBlank,
                inputValue: 'false'
            }, {
                xtype: 'radiofield',
                margin: '0 20 0 0',
                name: name,
                checked: me.defaultValue == 'true',
                boxLabel: me.trueBoxLabel,
                readOnly: me.readOnly,
                allowBlank: me.allowBlank,
                inputValue: 'true'
            }]
        });
        me.callParent(arguments);
    }
});