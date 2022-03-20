Ext.define('PmhTech.form.field.file.MultiFile', {
    alias: ['widget.pmh-multifilefield','widget.multi-filefield'],
    extend: 'Ext.form.field.File',

    requires: [
        'Ext.form.field.File'
    ],
    minWidth : 0,
    buttonOnly: true,
    readOnly : false,
    buttonWidth: 12,
    buttonText : '파일찾기',
    initComponent: function () {
        var me = this;

        me.on('render', function () {
            me.fileInputEl.set({ multiple: false });
        });

        me.callParent(arguments);
    },
    afterRender : function(){
        var me = this;
        me.inputCell.hide();
        me.callParent(arguments);
    },
    onFileChange: function (button, e, value) {
        var me = this;
        this.duringFileSelect = true;

        var me = this,
            upload = me.fileInputEl.dom,
            files = upload.files,
            names = [];

        if (files) {
            for (var i = 0; i < files.length; i++)
                names.push(files[i].name);
            value = names.join(', ');
        }

        Ext.form.field.File.superclass.setValue.call(this, value);


        me.fireEvent('changefile',me,Ext.clone(files));

        me.reset();


        delete this.duringFileSelect;
    }
});