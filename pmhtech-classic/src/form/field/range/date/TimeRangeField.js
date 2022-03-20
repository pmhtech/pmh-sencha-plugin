Ext.define('PmhTech.form.field.range.date.TimeRangeField',{
    extend : 'PmhTech.form.field.range.RangeField',
    alias : ['widget.pmh-time-rangefield','widget.time-rangefield'],

    requires: [
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

    startMaxText :null,
    startMinText : null,
    endMaxText : null,
    endMinText : null,
    startTimeName : '',
    endTimeName : '',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
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
                xtype : 'timefield',
                width : 95,
                format : me.timeFormat,
                increment : me.increment,
                name : me.startTimeName,
                // margin : '0 0 0 5',
                value : null
            },{
                xtype: 'displayfield',
                height: 20,
                margin: '0 5 0 5',
                value: '~'
            }, {
                xtype : 'timefield',
                format : me.timeFormat,
                // margin : '0 0 0 5',
                increment : me.increment,
                width : 95,
                name : me.endTimeName,
                value : null
            }]
        });

        me.callParent(arguments);
    }
});