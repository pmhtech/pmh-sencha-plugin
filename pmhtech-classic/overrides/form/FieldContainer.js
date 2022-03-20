/**
 *
 */
Ext.define('PmhTech.overrides.form.FieldContainer', {
    override: 'Ext.form.FieldContainer',

    requires: [
        'PmhTech.plugin.form.field.MarkerLabelable'
    ],

    labelSeparator:'',
    requireFlag: true,
    blankText : '필수 입력항목입니다.',
    plugins : [{
        ptype : 'pmh-marker-labelable'
    }],

    initComponent : function(){

        var me = this;
        me.oriColumnWidth=me.columnWidth;

        me.callParent(arguments);

    }
});