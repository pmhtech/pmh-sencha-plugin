/**
 *
 */
Ext.define('PmhTech.form.radiogroup.BooleanRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    alias: ['widget.pmh-boolean-radiogroup', 'widget.boolean-radiogroup'],

    requires: [
        'Ext.layout.container.Column'
    ],
    fieldLabel: '사용유무',
    trueBoxLabel: '예',
    falseBoxLabel: '아니오',
    defaultValue: 'true',
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
                checked: me.defaultValue == 'true',
                boxLabel: me.trueBoxLabel,
                readOnly: me.readOnly,
                allowBlank: me.allowBlank,
                inputValue: 'true'
            }, {
                xtype: 'radiofield',
                margin: '0 20 0 0',
                name: name,
                checked: me.defaultValue == 'false',
                boxLabel: me.falseBoxLabel,
                readOnly: me.readOnly,
                allowBlank: me.allowBlank,
                inputValue: 'false'
            }]
        });
        me.callParent(arguments);
    }
});