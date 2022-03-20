/**
 *
 */
Ext.define('PmhTech.grid.FieUploadGrid',{
    extend : 'Ext.grid.Panel',
    alias : 'widget.pmh-fileupload-grid',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.util.Format'
    ],
    columns: [{
        xtype : 'rownumberer'
    },{
        text: '파일명',
        align:'start',
        dataIndex: 'originalName',
        flex: 2
    }, {
        text: '파일크기',
        dataIndex: 'fileSize',
        align:'right',
        width: 100,
        renderer: Ext.util.Format.fileSize
    }],
});