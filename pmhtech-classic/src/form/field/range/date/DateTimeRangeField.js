Ext.define('PmhTech.form.field.range.date.DateTimeRangeField',{
    extend : 'PmhTech.form.field.range.RangeField',
    alias : ['widget.pmh-datetime-rangefield','widget.datetime-rangefield'],

    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.form.field.Time',
        'Ext.layout.container.HBox'
    ],

    increment :60,
    timeFormat: "H 시",

    defaultListenerScope: true,
    allowBlank: null,
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
    startTimeName : '',
    endDateName : '',
    endTimeName : '',

    initComponent : function(){
        var me = this;

        var defaults ={
            allowBlank : me.allowBlank,
            format : me.format,
            minWidth : 0,
            altFormats : me.format,
            submitFormat : me.submitFormat,
        };

        for( var key in defaults){

            if(defaults[key]===null){
                delete defaults[key];
            }
        }

        Ext.apply(me,{

            defaults : defaults,
            items: [{
                xtype: 'datefield',
                hideLabel : true,
                fieldLabel : me.fieldLabel+' 시작일',
                name : me.startDateName,
                minText : me.startMinText,
                maxText :me.startMaxText || Ext.String.format('[{0}] 시작일이 종료일보다 빠릅니다.',me.fieldLabel),
                width : 140,
                listeners : {
                    select : me.onSelectStartDate,
                    scope : me
                },
            }, {
                xtype : 'timefield',
                width : 95,
                format : me.timeFormat,
                increment : me.increment,
                name : me.startTimeName,
                margin : '0 0 0 5',
                value : '000000'
            },{
                xtype: 'displayfield',
                height: 20,
                margin: '0 5 0 5',
                value: '~'
            }, {
                xtype: 'datefield',
                hideLabel : true,
                name : me.endDateName,
                fieldLabel : me.fieldLabel+' 종료일',
                minText :me.endMinText || Ext.String.format('[{0}] 종료일이 시작일보다 빠릅니다.',me.fieldLabel),
                maxText :me.endMaxText,
                width : 140,
                listeners : {
                    select : me.onSelectEndDate,
                    scope : me
                }
            },{
                xtype : 'timefield',
                format : me.timeFormat,
                margin : '0 0 0 5',
                increment : me.increment,
                width : 95,
                name : me.endTimeName,
                value : '000000'
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