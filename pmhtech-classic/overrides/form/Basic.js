Ext.define('PmhTech.overrides.form.Basic', {
    override : 'Ext.form.Basic',
    /**
     * Set values for fields in this form in bulk.
     *
     * @param {Object/Object[]} values Either an array in the form:
     *
     *     [{id:'clientName', value:'Fred. Olsen Lines'},
     *      {id:'portOfLoading', value:'FXT'},
     *      {id:'portOfDischarge', value:'OSL'} ]
     *
     * or an object hash of the form:
     *
     *     {
     *         clientName: 'Fred. Olsen Lines',
     *         portOfLoading: 'FXT',
     *         portOfDischarge: 'OSL'
     *     }
     *
     * @return {Ext.form.Basic} this
     */

    /**
     * Loads an {@link Ext.data.Model} into this form by calling {@link #setValues} with the
     * {@link Ext.data.Model#getData record data}. The fields in the model are mapped to
     * fields in the form by matching either the {@link Ext.form.field.Base#name} or
     * {@link Ext.Component#itemId}.  See also {@link #trackResetOnLoad}.
     * @param {Ext.data.Model} record The record to load
     * @return {Ext.form.Basic} this
     */
    loadRecord: function(record) {
        for(var name in record.data){
            var field = this.findField(name);

            if(field){
                if(field.isXType('checkboxfield') || field.isXType('radiofield')){
                    var val = record.data[name];

                    if(Ext.isBoolean(val)){
                        val=val+'';
                        record.data[name]=val;
                    }
                }
            }
        }
        this.callParent(arguments);
    },
    getValues: function(asString, dirtyOnly, includeEmptyText, useDataValues, isSubmitting) {
        var values = {},
            fields = this.getFields().items,
            fLen = fields.length,
            isArray = Ext.isArray,
            dataMethod = useDataValues ? 'getModelData' : 'getSubmitData',
            field, data, val, bucket, name, f;
        for (f = 0; f < fLen; f++) {
            field = fields[f];

            if(field.isXType('checkboxgroup') && !field.isXType('radiogroup')){
                var temp = field.down('checkboxfield');
                values[temp.name]=[];

            }

            if (!dirtyOnly || field.isDirty()) {
                data = field[dataMethod](includeEmptyText, isSubmitting);

                if (Ext.isObject(data)) {
                    for (name in data) {
                        if (data.hasOwnProperty(name)) {
                            val = data[name];

                            if (includeEmptyText && val === '') {
                                val = field.emptyText || '';
                            }

                            if (!field.isRadio) {
                                if (values.hasOwnProperty(name)) {
                                    bucket = values[name];

                                    if (!isArray(bucket)) {
                                        bucket = values[name] = [bucket];
                                    }

                                    if (isArray(val)) {
                                        values[name] = bucket.concat(val);
                                    }
                                    else {
                                        bucket.push(val);
                                    }
                                }
                                else {
                                    values[name] = val;
                                }
                            }
                            else {
                                values[name] = values[name] || val;
                            }
                        }
                    }
                }
            }
        }

        if (asString) {
            values = Ext.Object.toQueryString(values);
        }

        return values;
    }
});