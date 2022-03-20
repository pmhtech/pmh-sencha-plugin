/**
 *
 */
Ext.define('PmhTech.overrides.form.field.Date', {
    override: 'Ext.form.field.Date',
    submitFormat : 'Ymd',
    format : 'Y.m.d',
    altFormats : 'Ymd|Y-m-d|Y.m.d|Y/m/d',

    setValue :function(v){
        var me = this,
            utilDate = Ext.Date,
            rawDate;

        if(Ext.isNumber(v)){
            v = new Date(v);
        }
        me.lastValue = me.rawDateText;
        me.lastDate = me.rawDate;

        if (Ext.isDate(v)) {
            rawDate = me.rawDate  = v;
            me.rawDateText = me.formatDate(v);
        }
        else {
            rawDate = me.rawDate = me.rawToValue(v);
            me.rawDateText = me.formatDate(v);
            if (rawDate === v) {
                rawDate = me.rawDate = null;
                me.rawDateText = '';
            }
        }
        if (rawDate && !utilDate.formatContainsHourInfo(me.format)) {
            me.rawDate = utilDate.clearTime(rawDate, true);

        }

        me.callParent(arguments);
    },
    getSubmitValue : function(){
        var  value = this.rawDate;

        if(Ext.isDate(value)){

         return value.getTime();
        }

        return value;


    }
});