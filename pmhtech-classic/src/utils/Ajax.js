/**
 * Ajax 간소화 유틸리티 confirm Message와 success Message를 처리합니다.
 *
 *
 * 		@example
 *     	PmhTech.Ajax.request({
 *			url : '/resources/json/AjaxTestData.json',
 *			method : 'GET',
 *			confirmMsg : {
 *				title : '확인',
 *				message : '저장하시겠습니까?'
 *			},
 *			successMsg : {
 *				title : '확인',
 *				message : '정상처리되었습니다'
 *			},
 *			success : function(resObj){
 *				alert('title :'+ resObj.title +'message :'+ resObj.message);
 *
 *			},
 *			scope : this
 *		});
 */

Ext.define('PmhTech.utils.Ajax', {
    alternateClassName : ['PmhTech.Ajax'],
    extend     : 'Ext.Base',

    headers :{
        'content-type' :'application/x-www-form-urlencoded; charset=UTF-8'
    },
    requires: [
        'PmhTech.utils.Jwt',
        'PmhTech.utils.Msg'
    ],
    singleton  : true,
    useToast : true,
    errorMsg :{
        'JWT_USER_PASSWORD_MISMATCHED' : '아이디 또는 비밀번호가 잘못되었습니다.'
    },
    /**
     * Sends an HTTP request to a remote server.
     *
     *     @example
     *     PmhTech.Ajax.request({
	 *			url : 'resources/json/AjaxTestData.json',
 	 *			method : 'GET',
 	 *			confirmMsg : {
 	 *				title : '확인',
 	 *				message : '저장하시겠습니까?'
 	 *			},
 	 *			successMsg : {
 	 *				title : '확인',
 	 *				message : '정상처리되었습니다'
 	 *			},
 	 *			success : function(resObj){
 	 *				alert('title :'+ resObj.title +'message :'+ resObj.message);
 	 *
 	 *			},
 	 *			scope : this
 	 *		});
     *
     *
     * @param {Object} options 파라미터는 Object로 넘겨야 하며 사항은 아래와 같습니다
     * @param {String} options.method 기본 설정값은 GET으로 요청을 합니다
     * @param {String} options.url : 요청할 URL주소입니다
     *
     * @param {Object} options.confirmMsg (optional) Ajax요청 전에 confirmMsg 항목이 있으면 MessageBox가 나타나고
     * Yes버튼을 눌렀을때에만 Ajax 요청을 합니다. 미지정시 바로 Ajax요청을 합니다.
     *
     * @param {Object} options.scope : 요청시 Scope를 지정합니다 반드시 this로 지정을 하셔야만 합니다
     *
     * @param {Function} options.success : 요청이 완료되었을때 실행되는 함수입니다.
     * JSON으로 위 코드와 같이 처리하시면 됩니다.
     *
     *  그밖의 사항들은 Ext.Ajax.request와 동일합니다
     *
     *  failure 부분은 추후에 Customizing 할수 있도록 구성하도록 하겠습니다.
     *
     *
     *
     */
    request : function (options) {

        if (options.params) {
            //  options.jsonData = Ext.encode(options.params);
        }
        var me = this;

        if(Ext.isEmpty(options.async)){
            options.async=true
        }

        if(options.ignoreMsg===true){

            options.confirmMsg=undefined;
            options.successMsg=undefined;
        }

        var confirmMsg = options.confirmMsg;
        
        if (confirmMsg) {
              PmhTech.Msg.confirm(confirmMsg.title, confirmMsg.message, function (b) {
             me._runAjax(options);
             });
        } else {
            me._runAjax(options);
        }
    },

    defaultResponseFailure: function(response){
        return true;

    },

    defaultHttpFailure : function(response) {

        return true;


/*
        var me = this;
        var resObj = Ext.decode(response.responseText);
        // console.log('server-side failure with status code ' + response.status);
        switch(resObj.error){
            case 'JwtExpireException':
            case 'JwtValidateException':
            case 'JwtVerifyException' :
                PmhTech.Cookie.removeCookie();
                location.href="";
                return;
            case 'JwtNotFoundException':
                PmhTech.Ajax.refreshAccessToken(response);
                break;

            case 'UserIdNotFoundException':
                PmhTech.Msg.alert('확인','사용자를 찾을수 없습니다.');
                return;
            case 'UserPasswordMismatchException':
                PmhTech.Msg.alert('확인','비밀번호가 일치하지 않습니다.');
                return;
            default:
                Ext.iterate(resObj,function(key,value){
                    if(Ext.isString(value)){
                        resObj[key]= value.replaceAll('\n','<br>').replaceAll('\t','&nbsp;&nbsp;&nbsp;&nbsp;');
                    }
                });


                PmhTech.Msg.alert('확인',Ext.encode(resObj));
                return;

        }*/
    },

    /**
     * Applies padding, margin, border, top, left, height, and width configs to the
     * appropriate elements.
     * @private
     */
    _runAjax: function (options) {

        var loadComp = options.loadMask ||'';
        if(loadComp.isComponent===true){
            loadComp.setLoading(true);
        }
        var me = this;
        if(!options.scope){

            options.scope=me;
        }
        var callBackFunc = Ext.clone(options.success);
        options.success  = function (response) {




            var resObj = [];
            if(!Ext.isEmpty(response.responseText)){

                var contentType = response.getResponseHeader('content-type');
                if(contentType!='text/html'){
                    resObj = Ext.decode(response.responseText);
                }else{
                    resObj = response
                }
            }

            if(!PmhTech.Ajax.defaultResponseFailure(resObj)){
                return;
            }

            var me         = this;
            var successMsg = options.successMsg;



            if(loadComp.isComponent===true){
                loadComp.setLoading(false);
            }
            if (successMsg) {

                if(me.useToast===true){

                    Ext.widget('toast',{
                        html : successMsg.message,
                    }).show();
                    Ext.defer(function(){
                        Ext.callback(callBackFunc, me, [resObj]);
                    });
                }else{
                    PmhTech.Msg.alert(successMsg.title, successMsg.message, function () {
                        Ext.callback(callBackFunc, me, [resObj]);
                    });
                }

            } else {
                Ext.callback(callBackFunc, me, [resObj]);
            }
        };


        if(!options.failure){
            options.failure = PmhTech.Ajax.defaultHttpFailure;
        }

        options.headers = options.headers ||{};

        if(options.ignoreToken!==true){
            var accessToken = PmhTech.Jwt.getAccessToken();
            if(accessToken){
                options.headers['Authorization'] = 'Bearer '+ accessToken;
            }
        }


        options.cors=true;
        options.useDefaultXhrHeader=false;

        options.disableCaching= false;

        Ext.Ajax.request(options);
    }
});