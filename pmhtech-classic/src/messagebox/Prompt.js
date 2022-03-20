/**
 *
 */
Ext.define('PmhTech.messagebox.Prompt', {
    alias: 'widget.pmh-prompt-messagebox',
    extend: 'PmhTech.window.SingletonWindow',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'PmhTech.messagebox.PromptController'
    ],
    controller : 'pmh-prompt-messagebox',
    width: 400,
    bodyPadding : 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'container',
        name : 'message',
        tpl : ['<div>{message}</div>'],
        flex : 1,
    }, {
        xtype: 'textfield',
        margin : '10 0 10 0',
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        }, items: [
            {xtype: 'tbfill'},
            {
                xtype: 'button',
                width: 100,
                margin : '0 10 0 0',
                text: '확인',
                handler: 'onBtnConfirm'
            }, {
                xtype: 'button',
                width: 100,
                text: '취소',
                handler: 'onBtnHide'
            }, {
                xtype: 'tbfill'
            }]
    }],
    listeners : {
        show : 'onShow'
    }
});