/**
 *
 */
Ext.define('PmhTech.utils.Msg',{
    alternateClassName : ['PmhTech.Msg'],
    extend     : 'Ext.Base',
    singleton  : true,

    /**
     *
     * alert창 띄우기
     *
     * @param title  제목
     * @param message 메시지
     * @param func 콜백함수
     * @param scope 스코프
     */
    alert: function (title, msg, callbackFunc) {

        if(Ext.isObject(title)){

            var objMsg =title;
            title = objMsg.title;
            callbackFunc = msg;
            msg = objMsg.message;

        }

        Ext.Msg.alert(title, msg, function (btn) {
            if(Ext.isFunction(callbackFunc)){
                callbackFunc();
            }
        });
    },
    /***
     *
     *
     *  Confirm 창 띄우기
     *
     * @param {}title
     * @param message
     * @param callbackFunc || Object
     * @param scope
     */
    confirm : function(title,message,callbackFunc,scope){
        var msgbox = Ext.Msg.confirm(title,message,function(btn){
            if(Ext.isFunction(callbackFunc)){

                if(btn=='yes'){
                    Ext.callback(callbackFunc,this);
                }
            }else{

                if(btn=='yes'){

                    Ext.callback(callbackFunc.yesFunc,this);

                    callbackFunc.yesFunc();

                }else{

                    Ext.callback(callbackFunc.noFunc,this);
                }
            }

        },scope);
        Ext.WindowMgr.bringToFront(msgbox);




    }



});