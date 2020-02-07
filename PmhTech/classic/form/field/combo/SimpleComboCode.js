Ext.define('PmhTech.form.field.combo.SimpleComboCode',{
    extend : 'Ext.form.field.ComboBox',
    alias: ['widget.pmh-simple-combo-code', 'widget.pmh-combo-code'],
    sysCodeName : null,

    filterField : null,
    filterValue : null,

    displayField : 'codeName',
    valueField : 'code',
    isAll : true,
    initComponent : function(){

        let me = this;

        if(me.sysCodeName){

            if(SysCode[me.sysCodeName]){
                Ext.apply(me,{
                    store : SysCode[me.sysCodeName].copy(me.isAll)
                });
            }
        }

        me.callParent(arguments);

        if(me.filterField && me.filterValue){
            me.getStore().filter(me.filterField,me.filterValue);
        }
    }
});