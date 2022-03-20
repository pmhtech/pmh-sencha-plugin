Ext.define('PmhTech.form.field.file.ExcelFileField', {
    alias: 'widget.pmh-excelfilefield',
    extend: 'Ext.form.field.File',
    output: null,

    msgTarget: 'side',


    initComponent: function () {
        var me = this;


        me.callParent();

        me.on('afterrender', function () {
            var me = this;
            me.inputEl.setVisible(false)
            me.fileInputEl.on('change', function (event) {

                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    var data = event.target.result;

                    var workBook = XLSX.read(data, {type: 'binary'});
                    workBook.SheetNames.forEach(function (sheetName) {

                        me.output = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {range: 1, raw: false});
                    });
                    me.fireEvent('excelupload', me, me.output);

                    setTimeout(function() {
                        me.fileInputEl.dom.value = null;
                        me.setValue(me.fileInputEl.dom.value);
                    }, 100);

                };
                reader.readAsBinaryString(file);
            });
        });
    },


    toJson: function (workbook) {
        var me = this;
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        me.output = result;
        return result;
    }
});