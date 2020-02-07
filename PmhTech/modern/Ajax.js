Ext.define('PmhTech.Ajax', {
    extend     : 'Ext.Base',
    singleton  : true,

    requires :[
        'PmhTech.utils.Ajax',
        'PmhTech.utils.Cookie',
        'PmhTech.utils.Msg'
    ],
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
     * @param {{method: string, success: success, failure: failure, params: {refreshToken}, url: string}} options 파라미터는 Object로 넘겨야 하며 사항은 아래와 같습니다
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


        let me = this;



        let confirmMsg = options.confirmMsg;




        if (confirmMsg) {
              PmhTech.Msg.confirm(confirmMsg.title, confirmMsg.message, function () {
             me._runAjax(options);
             });
        } else {
            me._runAjax(options);
        }
    },
    refreshAccessToken : function(){


        PmhTech.Ajax.request({
            url : authHost+'/token/refresh',
            method : 'POST',
            params : {
                accessToken : accessToken
            },success : function(resObj){

                PmhTech.Cookie.setAccessToken(resObj.accessToken);
                PmhTech.Cookie.setRefreshToken(resObj.refreshToken);


            },failure : function(){


            }
        });



    },

    defaultFailure : function(response) {



        let resObj = Ext.decode(response.responseText);

        let message = resObj.message;


        switch(message){

            case 'JWT_NOT_FOUND_ACCESS_TOKEN' :
            case 'JWT_EXPIRE' :
                PmhTech.Ajax.refreshAccessToken();
                return;
            default:
                PmhTech.Msg.alert('확인',Ext.encode(resObj));
                return;

        }
    },
    /**
     * Applies padding, margin, border, top, left, height, and width configs to the
     * appropriate elements.
     * @private
     */
    _runAjax: function (options) {

        const me = this;

        /*   PmhTech.Ajax.loadMessage = Ext.MessageBox.wait('잠시만 기다리세요..', '데이터 처리중...', {
         interval : 500, //bar will move fast!
         duration : 50000,
         increment: 15
         });*/

        if(!options.scope){

            options.scope=me;
        }

        let callBackFunc = Ext.clone(options.success);
        options.success  = function (response) {


            let resObj = [];
            if(!Ext.isEmpty(response.responseText)){

                let contentType = response.getResponseHeader('content-type');
                if(contentType!=='text/html'){
                    resObj = Ext.decode(response.responseText);
                }else{
                    resObj = response
                }

            }

            let me         = this;
            let successMsg = options.successMsg;

            if (successMsg) {
                PmhTech.Msg.alert(successMsg.title, successMsg.message, function () {
                    Ext.callback(callBackFunc, me, [resObj]);
                });
            } else {

                Ext.callback(callBackFunc, me, [resObj]);
            }
        };


        if(!options.failure){

            options.failure = PmhTech.Ajax.defaultFailure;
        }

        let accessToken =PmhTech.Cookie.getAccessToken();
        options.headers = options.headers || {};
        if(accessToken){
            options.headers['Access-Control-Allow-Origin']='*';
            options.headers['authorization']='Basic';
            options.headers['access-token']=PmhTech.Cookie.getAccessToken();
        }

        options.withCredentials= true;
        options.disableCaching= false;

        Ext.Ajax.request(options);
    }
});