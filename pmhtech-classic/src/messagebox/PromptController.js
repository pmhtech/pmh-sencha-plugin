/**
 *
 */
Ext.define('PmhTech.messagebox.PromptController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pmh-prompt-messagebox',
    onShow : function(){
        var thisView = this.getView();
        thisView.down('[name=message]').setData(thisView.lookupViewModel().getData());
    },

    onBtnConfirm : function(button){
        var me = this.getView();

        var text = me.down('textfield').getValue();
        Ext.callback(me.callbackFunc,me.callbackScope,[me,text])
    },
    onBtnHide : function(button){
        var me = this.getView();
        me.hide();

    }
});