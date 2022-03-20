/**
 *
 */
Ext.define('PmhTech.overrides.form.field.Text', {
    override: 'Ext.form.field.Text',

    labelSeparator:'',
    blankText : '필수 입력항목입니다.',
    initComponent : function(){
        var me = this;

        me.callParent(arguments);
        me.addListener('show',me.onAddShow);
    },
    onAddShow : function(){

        var me = this;

        if(me.up().getXTypes().indexOf('pmh-fieldset')!=-1 && me.columnWidth){
            var pmhfieldset= me.up();
            if(pmhfieldset.getWidth() >660){
                var minWidth = 660*me.columnWidth;
                me.setMinWidth(minWidth);
            }
        }
    }
});