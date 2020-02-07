
Ext.define('PmhTech.plugin.field.KeyPadPlugin', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.pmhkeypad',
    showKeyPad : function(){

        var me = this;
        var activeKeyPad = me.activeContent.activeKeyPad;
        var keyPadAreaMenu = me.activeContent.keyPadAreaMenu;
        var keyPadVisible = !keyPadAreaMenu.getHidden();

        if(activeKeyPad && !keyPadVisible){

            keyPadAreaMenu.show();

            var mask = Ext.ComponentQuery.query('mask')[0];
            if(mask){
                mask.destroy();
            }
        }

        if(!activeKeyPad && keyPadVisible){
            keyPadAreaMenu.hide();
        }
    },

    createEmptyPad :function(){

        var me = this;
        if(!me.activeContent.keyPadAreaMenu){
            me.activeContent.keyPadAreaMenu= Ext.Viewport.setMenu({
                height : 300,
                side: 'bottom',
                listeners : {
                    beforeshow  : function(){

                        if(!me.activeContent){
                            me.activeContent =Ext.ComponentQuery.query('global-content')[0];
                        }

                        if(me.activeContent.activeKeyPad===true){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
            },{
                side: 'bottom',
                reveal: true,
                animate : false,
                cover: false
            });
        }
        return me.activeContent.keyPadAreaMenu;
    },
    init: function (field) {
        var me = this;



        if(Ext.isEmpty(window.farotaBridge)){
            return;
        }
        me.field = field;


        field.addListener('painted',function(){
            field.fieldYPos = field.el.getY();
        });



        field.addListener('focus',function(field,e){

            me.activeContent = Ext.ComponentQuery.query('global-content')[0];
            me.createEmptyPad();

            field.fieldYPos = field.fieldYPos || field.el.getY();
            var thisHeight = field.fieldYPos;
            if(thisHeight>=275) {
                me.activeContent.activeKeyPad=true;

                var showDelay = new Ext.util.DelayedTask(function() {
                    me.activeContent.activeKeyPad=true;
                });
                showDelay.delay(299);

                var activeDelay = new Ext.util.DelayedTask(function() {
                    me.activeContent.activeKeyPad=true;
                    me.showKeyPad();
                });
                 activeDelay.delay(300);
            }

        },{
            fieldYPos : field.el.getY()
        });

        field.addListener('blur', function (thisField) {
            
            me.activeContent.activeKeyPad=false;
            var deactiveDelay = new Ext.util.DelayedTask(function () {

                var focusField = me.activeContent.el.select('.'+thisField.focusCls).elements[0];


                if(!me.activeContent.activeKeyPad) {
                    if (focusField) {
                        var thisHeight = Ext.getCmp(focusField.id).fieldYPos;
                        var keyPadHeight = me.activeContent.keyPadAreaMenu.isHidden() ? 0 : me.activeContent.keyPadAreaMenu.getHeight();



                        var realHeight = keyPadHeight + thisHeight;

                        if (realHeight >= 275) {
                            me.activeContent.activeKeyPad = true;
                        } else {
                            me.activeContent.activeKeyPad = false;
                        }

                    }
                }
                me.showKeyPad();
            });
            deactiveDelay.delay(300);
        });

        
    }
});