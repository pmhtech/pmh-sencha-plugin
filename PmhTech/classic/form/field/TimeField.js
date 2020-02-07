Ext.define('PmhTech.form.field.TimeField', {
    extend: 'Ext.form.field.Text',//Extending the NumberField
    alias: 'widget.pmh-timefield',

    requires: [
        'Ext.util.Format',
        'PmhTech.utils.Format'
    ],
    initComponent: function () {
        this.callParent(arguments);
    },

    renderTpl: [
        '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
        '<tpl if="fieldEl"><div class="x-form-field-container">',
        '<input id="{inputId}" type="{inputType}" name="{name}" pattern="[0-9]*" class="{fieldCls}"',
        '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
        '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
        '<tpl if="style">style="{style}" </tpl>',
        '<tpl if="minValue != undefined">min="{minValue}" </tpl>',
        '<tpl if="maxValue != undefined">max="{maxValue}" </tpl>',
        '<tpl if="stepValue != undefined">step="{stepValue}" </tpl>',
        '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
        '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
        '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
        '/>',
        '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
        '</div></tpl>',
        '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div><div></tpl>'
    ],
    // @private
    onRender : function() {
        Ext.apply(this.renderData, {
            maxValue : this.maxValue,
            minValue : this.minValue,
            stepValue : this.stepValue
        });

        PmhTech.form.field.TimeField.superclass.onRender.apply(this, arguments);
    },
    validator : function(val){


     var errMsg ='잘못된 시간포맷입니다.';

        if(!val){
            return errMsg;
        }


        var temp=PmhTech.Format.timeRenderer(val);

        if(temp.length==5){
            val = temp;
        }




        val = val.replace(':','');

        switch (val.length) {

            case 3:

                var hh = val.substr(0,1);
                var mm = val.substr(1,2);

                val=Ext.util.Format.leftPad(hh,2,'0')+':'+mm;
                break;
            case 4:
                var hh = val.substr(0,2);
                var mm = val.substr(2,2);

                val=Ext.util.Format.leftPad(hh,2,'0')+':'+mm;

                break;


            default:
                return errMsg;

        }
        this.setRawValue(val);


        var reg = /^(?:(?:2[0-3]|[0-1][0-9]?)\:)(?:[0-5][0-9]?)$/g;
        return reg.test(val) ? true : errMsg;
    },
    setValue : function(value){

        value = this.callParent([
            value
        ]);



        var val = this.rawValue;
        var temp=PmhTech.Format.timeRenderer(val);

        if(!val){
            return;
        }
        if(temp.length==5){
            val = temp;
        }

        val = val.replace(':','');

        switch (val.length) {

            case 3:

                var hh = val.substr(0,1);
                var mm = val.substr(1,2);

                val=Ext.util.Format.leftPad(hh,2,'0')+':'+mm;
                break;
            case 4:
                var hh = val.substr(0,2);
                var mm = val.substr(2,2);

                val=Ext.util.Format.leftPad(hh,2,'0')+':'+mm;

                break;


            default:
                return errMsg;

        }
        this.setRawValue(val);


        this.refreshEmptyText();
    },




    getValue : function(){



    //    var me = this,
     //       val = me.rawToValue(me.processRawValue(me.getRawValue()));
     //   me.value = val;
        var me = this;

        if(this.rawValue && this.rawValue.length==5){
            var arr = this.rawValue.split(':');

            var hour = parseInt(arr[0])*60*60;
            var min = parseInt(arr[1])*60;

            me.value=(hour+min)*1000;
            return me.value;
        }

        return me.rawValue;


    }
});

