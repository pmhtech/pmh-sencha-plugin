/**
 *
 */
Ext.define('PmhTech.overrides.form.field.File', {
    override: 'Ext.form.field.File',
    onRender: function () {
        this.callParent(arguments);
        this.fileInputEl.dom.setAttribute('multiple', this.multiple);
    },

    /**
     * Convenience method that will return the files in the fileInputEl.dom
     */
    getFileList: function () {
        return this.fileInputEl.dom.files;
    }
});