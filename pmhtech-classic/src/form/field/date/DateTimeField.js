Ext.define('PmhTech.form.field.date.DateTimeField',{
    extend : 'Ext.form.FieldContainer',
    alias : 'widget.datetimefield',

    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.layout.container.HBox'
    ],
    layout : {
        type : 'hbox',
        align : 'stretch'
    },
    dateFieldName : '',
    timeFieldName : '',
    timeIncrement: 30,
    initComponent : function(){
        var me = this;
        var dateFieldName =me.dateFieldName;
        var timeFieldName =me.timeFieldName;

        if(me.name){
            dateFieldName= me.name;
            timeFieldName=me.name+'Hour';
        }

        Ext.apply(me,{
            items : [{
                xtype: 'datefield',
                hideLabel : true,
                flex : 1,
                margin : '0 5 0 0',
                fieldLabel : me.fieldLabel,
                name : dateFieldName,
                minWidth : null,
            }, {
                xtype : 'timefield',
                minWidth : null,
                width : 100,
                altFormat : 'His|H:i:s',
                increment: me.timeIncrement,
                name : timeFieldName,
            }]
        });
        me.callParent(arguments);

    }

})