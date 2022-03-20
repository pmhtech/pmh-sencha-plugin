/**
 *
 */
Ext.define('PmhTech.overrides.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',

    labelSeparator:'',
    blankText : '1개 이상 체크해주세요.',
    requireFlag : true,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    afterRender : function(){
        this.callParent(arguments);
        var me = this;

        var field  =me.down('field');
        if(field){
            me.allowBlank=field.allowBlank

            if(me.allowBlank!==true){
                me.allowBlank = false;
            }
            me.setAllowBlank(me.allowBlank);
        }
    }
});