Ext.define('PmhTech.field.Time',{
    extend : 'Ext.field.Container',
    alias : 'widget.pmh-timefield',

    value : Ext.Date.format(new Date(),'H:i'),
    timeName : null,
    labelAlign : 'left',
    layout : {
        type : 'hbox',
        align : 'stretch'

    },items : [{
        xtype :'textfield',
        itemId : 'hiddenTime'
    },{
        xtype : 'button',
        text : '오전',
        margin : '0 2 0 0',
        flex : 2,
        ui : 'action',
        fieldName : 'AM',
        hidden : true,
        handler : function(button){

            var comp = button.up('pmh-timefield');
            comp.down('button[fieldName=AM]').hide();
            comp.down('button[fieldName=PM]').show();
            Ext.callback(comp.changeValue,comp,[]);

        }
    },{
        xtype : 'button',
        text : '오후',
        flex : 2,
        margin : '0 2 0 0',
        ui : 'action',

        fieldName : 'PM',
        hidden : true,
        handler : function(button){

            var comp = button.up('pmh-timefield');
            comp.down('button[fieldName=PM]').hide();
            comp.down('button[fieldName=AM]').show();

            Ext.callback(comp.changeValue,comp,[]);

        }
    },{
        xtype : 'numberfield',
        triggers : null,
        vtypes : 'hh',
        flex : 1,
        textAlign: 'center',
        fieldName : 'HH',
        listeners : {
            change : function(field){
                var  comp = field.up('pmh-timefield');
                Ext.callback(comp.changeValue,comp,[]);

            }
        }
    },{
        xtype : 'displayfield',
        margin : '0 5 0 5',
        value : ':'
    },{
        xtype : 'numberfield',
        triggers : null,
        required : true,
        vtypes : 'mi',
        flex : 1,
        fieldName : 'MI',
        textAlign: 'center',
        listeners : {
            change : function(field){

                var  comp = field.up('pmh-timefield');
                Ext.callback(comp.changeValue,comp,[]);



            }
        }
    }],

    changeValue : function(){

        var comp = this;
        var newValue = comp.down('[fieldName=HH]').getValue();
        var isAM = ! comp.down('button[fieldName=AM]').isHidden();



        var hh=parseInt(newValue);

        if(!isNaN(hh)) {

            if(hh==12){
                hh = isAM ? '0' : hh;

            }else if (!isAM) {
                hh += 12;
            }
            var hh = Ext.String.leftPad(hh, 2, '0');

            comp.value = hh + ':' + comp.down('[fieldName=MI]').getValue();
            console.log(comp.value);
        }
        comp.down('#hiddenTime').setValue(comp.value);

    },
    getValue: function(){

        return  this.value;

    },setValue: function(value){
        
        value = value;
        this.value=value;

        var hh = parseInt(value.substr(0,2));
        var mi = value.substr(3);


        var ampm = 'AM';
        if(hh>=12){
            ampm = 'PM';

        }
        this.down('[fieldName=AM]').setHidden(ampm !='AM');
        this.down('[fieldName=PM]').setHidden(ampm !='PM');


        if(0==hh) {
            hh = '12';
        }else if(hh>12){
            hh=hh-12;
        }
        var hh = Ext.String.leftPad(hh,2,'0');

        this.down('[fieldName=MI]').setValue(mi);
        this.down('[fieldName=HH]').setValue(hh);
    },listeners : {
        painted : function(comp){

            var hiddenfield = comp.down('#hiddenTime');

            if(!comp.timeName){
                comp.timeName = comp.getName();
                hiddenfield.setName(comp.timeName);
                comp.setName(null);
            }

            hiddenfield.vtypes = comp.vtypes;
            hiddenfield.hide();
            comp.setName(null);


            var value = comp.getValue() || comp.value;
            comp.setValue(value);
            delete comp.vtypes;


        }
    }

});