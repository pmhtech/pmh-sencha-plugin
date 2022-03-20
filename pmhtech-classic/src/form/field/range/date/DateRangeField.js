Ext.define('PmhTech.form.field.range.date.DateRangeField',{
    extend : 'PmhTech.form.field.range.RangeField',
    alias : ['widget.pmh-date-rangefield','widget.date-rangefield'],

    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.layout.container.HBox'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaultListenerScope: true,
    labelSeparator: '',
    format: null,
    altFormats: null,
    submitFormat: null,
    startMaxText :null,
    startMinText : null,
    endMaxText : null,
    endMinText : null,
    startDateName : '',
    endDateName : '',
    initComponent : function(){
        var me = this;
        Ext.apply(me,{
            items: [{
                xtype: 'datefield',
                allowBlank : me.allowBlank,
                hideLabel : true,
                width : 120,
                readOnly : me.readOnly,
                fieldLabel : me.fieldLabel+' 시작일',
                name : me.startDateName,
                minWidth : null,
                minText : me.startMinText,
                maxText :me.startMaxText || Ext.String.format('[{0}] 시작일이 종료일보다 빠릅니다.',me.fieldLabel),
                flex: 1,
                listeners : {
                    select : me.onSelectStartDate,
                    scope : me
                }
            }, {
                xtype: 'displayfield',
                height: 20,
                minWidth : null,
                margin: '0 5 0 5',
                value: '~'
            }, {
                xtype: 'datefield',
                allowBlank : me.allowBlank,
                hideLabel : true,
                minWidth : null,
                width : 120,
                readOnly : me.readOnly,
                name : me.endDateName,
                fieldLabel : me.fieldLabel+' 종료일',
                minText :me.endMinText || Ext.String.format('[{0}] 종료일이 시작일보다 빠릅니다.',me.fieldLabel),
                maxText :me.endMaxText,
                flex: 1,
                listeners : {
                    select : me.onSelectEndDate,
                    scope : me
                }
            }]
        });

        me.callParent(arguments);
    },
    onSelectStartDate: function(field,newValue,oldValue){

        var me = this;

        var startDate = me.down('[name='+me.startDateName+']');
        var endDate = me.down('[name='+me.endDateName+']');

        endDate.setMinValue(startDate.getRawValue());

    },
    onSelectEndDate: function(field,newValue,oldValue){

        var me = this;
        var startDate = me.down('[name='+me.startDateName+']');
        var endDate = me.down('[name='+me.endDateName+']');

        startDate.setMaxValue(endDate.getRawValue());

    }
});