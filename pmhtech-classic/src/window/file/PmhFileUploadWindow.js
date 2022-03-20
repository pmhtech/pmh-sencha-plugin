/**
 *
 */
Ext.define('PmhTech.window.file.PmhFileUploadWindow', {
    extend: 'PmhTech.window.SingletonWindow',
    alias: 'widget.pmh-fileupload-window',
    requires: [
        'Ext.button.Button',
        'Ext.data.Store',
        'Ext.form.field.Display',
        'Ext.toolbar.Fill',
        'PmhTech.button.Delete',
        'PmhTech.dd.file.FileDropZone',
        'PmhTech.form.field.file.MultiFile',
        'PmhTech.grid.FieUploadGrid',
        'PmhTech.window.file.PmhFileUploadWindowController'
    ],
    controller: 'pmh-fileupload-window',
    width: 600,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    multiUpload : false,
    maxFileSize : 5242880,
    uploadFiles: [],
    tbar: [{
        xtype : 'tbfill'
    },{
        xtype : 'displayfield',
        itemId : 'maxFileSize'
    },{
        xtype: 'multi-filefield',
        margin : '0 10 0 0',
        listeners: {
            changefile: 'onChangeFile'
        }
    }, {
        xtype: 'pmh-button-delete',
        handler : 'onBtnDelete'
    }],
    items: [{
        xtype: 'pmh-fileupload-grid',
        height: 200,
        margin : '0 0 20 0',
        store: Ext.create('Ext.data.Store')
    }, {
        xtype: 'pmh-file-drop-zone',
        height: 200,
        listeners: {
            dropfiles: 'onChangeFile',
        },
        selType : {
            selmodel :'MULTI'
        }
    }],
    bbar : [{
        xtype : 'tbfill'
    },{
        xtype : 'button',
        text : '적용',
        margin : '0 10 0 0',
        handler : 'onBtnUploadFile'
    },{
        xtype : 'button',
        text : '취소',
        handler : 'onBtnCancel'
    },{
        xtype : 'tbfill'
    }],
    listeners : {
        show : 'onShow',
        hide : 'onHide'
    }
});