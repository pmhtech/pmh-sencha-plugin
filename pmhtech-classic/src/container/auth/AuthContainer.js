Ext.define('PmhTech.container.auth.AuthContainer',{
    extend : 'Ext.container.Container',
    alias : 'widget.pmh-auth-container',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.util.TaskManager'
    ],
    margin : '0 0 5 0',
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    authComplete : false,
    authName : null,
    authCodeName : null,

    initComponent : function(){
        var me = this;


        Ext.apply(me,{

            limitTime : 0,
            task :{
                run : me.runTimer,
                scope: me,
                interval : 1000

            },


            items:[{
                xtype : 'container',
                border : 0,
                margin : '0 0 5 0',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [{
                    xtype: 'textfield',
                    flex : 1,
                    itemId : 'auth',
                    name: me.authName,
                    listeners : {
                        change : me.onChangeAuth,
                        scope : me
                    },
                    margin : '0 10 0 0'
                },{
                    xtype : 'button',
                    itemId : 'authBtn',
                    width : 80,
                    text : '인증하기',
                    handler : me.onBtnAuthHandler,
                    scope : me
                }]
            }, {
                xtype : 'container',
                border : 0,
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [{
                    xtype: 'textfield',
                    fieldLabel: '인증번호 확인 ',
                    flex : 1,
                    readOnly : true,
                    blankText: '인증번호를 입력하세요',
                    itemId : 'authCode',
                    name: me.authCodeName,
                    triggers : {
                        limitTime : {
                            cls : 'limit-time',
                            bodyTpl : ''
                        }
                    },
                    margin : '0 10 0 0'
                },{
                    xtype : 'button',
                    handler : me.onBtnConfirmHandler,
                    scope : me,
                    disabled : true,
                    itemId : 'confirmBtn',
                    width : 80,
                    text : '인증확인'
                }]
            }],listeners : {
                afterrender: me.onAfterRender,
                scope: me
            }
        });





        me.callParent(arguments);


    },

    onAfterRender : function(comp){
        var auth = this.down('#auth');

        if(this.authType=='phone'){
            auth.setFieldLabel(Locale['FORM']['USER'][this.authType]['fieldLabel']);
            auth.blankText=Locale['FORM']['USER'][this.authType]['blankText']
        }
    },
    onChangeAuth : function(){

        var me = this;
        me.changeStatus('changeAuth');


    },

    onBtnAuthHandler : function(button){
        var me = this;
        var auth = this.down('#auth');


        var authCode = this.down('#authCode');
        var authBtn = this.down('#authBtn');
        var confirmBtn = this.down('#confirmBtn');



        var paramObj ={
            authValue : auth.getValue()
        };

        /*PmhTech.Ajax.request({
            url : authHost+'/auth/'+this.authType,
            method : 'POST',
            params : {
                auth : Ext.encode(paramObj)
            },
            success : function(resObj){
                me.changeStatus('successAuthSend');
                PmhTech.Msg.alert('확인','인증번호를 보냈습니다. 3분안에 입력하세요');

            }
        });*/
    },
    onBtnConfirmHandler : function(){

        var me = this;
        var auth = this.down('#auth');
        var authCode = this.down('#authCode');
        var authBtn = this.down('#authBtn');
        var confirmBtn = this.down('#confirmBtn');


        var paramObj ={
            authValue : auth.getValue(),
            authCode : authCode.getValue()
        };

       /* PmhTech.Ajax.request({
            url : authHost+'/auth/'+this.authType+'/confirm',
            method : 'PUT',
            params : {
                auth : Ext.encode(paramObj)
            },
            successMsg : {
                title : '확인',
                message : '인증이 완료되었습니다.'
            },
            success : function(){
                me.changeStatus('successAuthConfirm');

            }

        });*/
    },
    changeStatus : function(status){
        var auth = this.down('#auth');
        var authCode = this.down('#authCode');
        var authBtn = this.down('#authBtn');
        var confirmBtn = this.down('#confirmBtn');


        switch(status){
            case 'changeAuth' :
                authBtn.setText('인증하기');
                confirmBtn.setText('인증확인');
                confirmBtn.setDisabled(true);
                authCode.setReadOnly(true);
                authCode.reset();
                this.stopTimer();
                this.authComplete=false;
                break;

            case 'successAuthSend':
                authBtn.setText('재인증하기');
                confirmBtn.setText('인증확인');
                confirmBtn.setDisabled(false);
                authCode.setReadOnly(false);
                authCode.reset();
                this.startTimer();
                this.authComplete=false;
                break;
            case 'successAuthConfirm':
                confirmBtn.setText('인증성공');
                confirmBtn.setDisabled(true);
                authCode.setReadOnly(true);
                this.authComplete=true;
                this.stopTimer();
                break;
        }
    },
    startTimer : function(){
        this.limitTime = 180;
        this.down('#authCode').getTriggers().limitTime.show();
        Ext.TaskManager.start(this.task);

    },
    stopTimer : function(){

        this.limitTime=0;
        this.down('#authCode').getTriggers().limitTime.hide();
        Ext.TaskManager.stop(this.task);
    },

    runTimer : function(){


        if(this.limitTime<=0){

            Ext.TaskManager.stop(this.task);

        }

        var minute =Math.floor(this.limitTime/60);
        var second = Math.floor(this.limitTime%60);
        var html = Ext.String.leftPad(minute,2,'0')+':'+ Ext.String.leftPad(second,2,'0');
        this.limitTime=this.limitTime-1;
        this.down('#authCode').getTriggers().limitTime.el.dom.innerText= '남은시간 [ ' +html+']';






    }
});