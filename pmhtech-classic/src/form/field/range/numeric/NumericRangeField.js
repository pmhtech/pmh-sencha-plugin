Ext.define('PmhTech.form.field.range.numeric.NumericRangeField',{
    extend : 'PmhTech.form.field.range.RangeField',
    alias : ['widget.pmh-numeric-rangefield','widget.numeric-rangefield'],

    requires: [
        'Ext.form.field.Display',
        'Ext.layout.container.HBox',
        'PmhTech.form.field.NumericField'
    ],

    defaultListenerScope: true,
    labelSeparator: '',
    format: null,
    altFormats: null,
    submitFormat: null,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
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
                xtype: 'numericfield',
                allowBlank : me.allowBlank,
                hideLabel : true,
                width : 120,
                readOnly : me.readOnly,
                fieldLabel : me.fieldLabel+' 최소값',
                name : me.startDateName,
                minWidth : null,
                value : null,
                minText : me.startMinText,
                maxText :me.startMaxText || Ext.String.format('[{0}] 최소값이 최대값보다 빠릅니다.',me.fieldLabel),
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
                xtype: 'numericfield',
                allowBlank : me.allowBlank,
                hideLabel : true,
                minWidth : null,
                width : 120,
                value : null,
                readOnly : me.readOnly,
                name : me.endDateName,
                fieldLabel : me.fieldLabel+' 최대',
                minText :me.endMinText || Ext.String.format('[{0}] 최대값이 최소값보다 빠릅니다.',me.fieldLabel),
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