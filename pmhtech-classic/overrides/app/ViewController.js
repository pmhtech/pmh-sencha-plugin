/**
 *
 */
Ext.define('PmhTech.overrides.app.ViewController',{
    override : 'Ext.app.ViewController',

    getGlobalContent : function(){

        return this.getView().up('global-content') || this.getView().up('window');
    },
    getWindowContent : function(){
        return this.getView().up('window');
    }
})