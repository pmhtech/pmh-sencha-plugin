/**
 *
 */
Ext.define('PmhTech.window.upload.excel.upload.ExcelUploadWindow',{
    extend: 'PmhTech.window.SingletonWindow',
    alias : 'widget.excel-upload-popup',
    requires: [
        'Ext.button.Button',
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.toolbar.Fill',
        'PmhTech.form.field.file.ExcelFileField',
        'PmhTech.plugin.grid.ExcelEditor',
        'PmhTech.plugin.grid.Exporter',
        'PmhTech.plugin.grid.Validator',
        'PmhTech.window.upload.excel.upload.ExcelUploadWindowController'
    ],

    controller: 'excel-upload-popup',
    maximizable: true,
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    items : [{
        xtype : 'toolbar',
        margin : '0 10 0 10',
        items : [{
            xtype : 'tbfill'
        },{
            xtype : 'pmh-excelfilefield',
            flex : 1,
            itemId : 'uploadfield',
            buttonText : '업로드하기',
            listeners : {
                excelupload : 'onExcelUpload'
            }
        },{
            xtype: 'button',
            text: '양식 다운로드',
            handler : 'onBtnSampleDownload'
        }]
    },{
        xtype : 'gridpanel',
        margin : '0 10 0 10',
        frame : true,
        height : 500,
        title : '업로드 내용 미리보기',
        itemId : 'excelGrid',
        tbar : [{
            xtype : 'tbfill'
        },{
            xtype : 'button',
            handler : 'onBtnExcelDownload',
            text : '엑셀다운로드'
        }],
        store : Ext.create('Ext.data.Store'),
        plugins : [{
            ptype : 'pmh-grid-excel-editor'
        },{
            ptype : 'pmh-grid-validator',
        },{
            ptype : 'pmh-grid-exporter'
        }]
    },{
        xtype : 'gridpanel',
        hidden : true,
        itemId : 'sampleGrid',
        store : Ext.create('Ext.data.Store'),
        plugins : [{
            ptype : 'pmh-grid-excel-editor'
        },{
            ptype : 'pmh-grid-validator'
        },{
            ptype : 'pmh-grid-exporter'
        }]
    }],
    bbar : [
        {
            xtype : 'button',
            text : '업로드 적용하기',
            handler : 'onBtnApply'
        },{
            xtype : 'button',
            handler : 'onBtnCancel',
            text : '취소'
        }
    ],
    listeners : {
        show : 'onShow'
    }
});
