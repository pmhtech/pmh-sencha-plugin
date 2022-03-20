Ext.define('PmhTech.overrides.form.RadioGroup', {
    override: 'Ext.form.RadioGroup',

    labelSeparator:'',
    blankText : '필수 선택항목입니다.',
    afterLayout : function(){
        var me = this;

        me.callParent(arguments);


        var minWidth = me.labelWidth;

        if(!me.fieldLabel){
            minWidth = 0;
        }


        for(var item of me.items.items){
            minWidth = minWidth+item.getWidth();
        }
        me.setMinWidth(minWidth);
    }
});