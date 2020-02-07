Ext.define('PmhTech.utils.Cookie', {
    alternateClassName : ['PmhTech.Cookie'],
    extend: 'Ext.Base',

    requires: [
        'Ext.util.Base64',
        'Ext.util.Cookies'
    ],
    singleton: true,
    config : {
        accessToken : null,
        refreshToken : null,
        userInfo : null,
        appInfo : {}
    },
    getLocale : function(){
      var locale = Ext.util.Cookies.get('_farota_app_locale_');
      return locale || 'ko';
    },
    setLocale : function(locale){
        Ext.util.Cookies.set('_farota_app_locale_',locale);
    },
    setAppInfo : function(name,data){

        this._appInfo[name]=data;
        var base64 = Ext.util.Base64.encode(Ext.encode(this._appInfo));
        Ext.util.Cookies.set('_farota_app_info',base64);

    },
    getAppInfo : function(param){
        if(param){
            return this._appInfo[param];
        }
        return this._appInfo;
    },

    loadCookie : function(){
        var appInfo = Ext.util.Cookies.get('_farota_app_info');

        if(appInfo){
            this._appInfo = Ext.decode(Ext.util.Base64.decode(appInfo));
        }
    },
    saveCookie : function(){

        var appInfo = Ext.util.Base64.encode(Ext.encode(this._appInfo));
        Ext.util.Cookies.set('_farota_app_info',appInfo);


    },

    constructor: function(config) {

        this.callParent();
        this._appInfo = {};
        this._accessToken = Ext.util.Cookies.get('_farota_access_token');
        this._refreshToken = Ext.util.Cookies.get('_farota_refresh_token');
        this.setAccessTokenUserInfo();
    },
    setAccessToken : function(token){
        PmhTech.Cookie._accessToken=token;
        this.setAccessTokenUserInfo();
        Ext.util.Cookies.set('_farota_access_token',token,Ext.Date.add(new Date(),Ext.Date.HOUR,4));
    },
    setRefreshToken : function(token){
        PmhTech.Cookie._refreshToken=token;
        Ext.util.Cookies.set('_farota_refresh_token',token,Ext.Date.add(new Date(),Ext.Date.DAY,7));

    },
    removeCookie : function(){

        this._accessToken =null;
        this._refreshToken =null;
        this._userInfo =null;

        Ext.util.Cookies.clear('_farota_app_info');
        Ext.util.Cookies.clear('_farota_refresh_token',);
        Ext.util.Cookies.clear('_farota_access_token');
    },
    setAccessTokenUserInfo : function(){
        var accessToken = this.getAccessToken();


        if(accessToken){
            //JWT 표준 규약상 Padding이 없는 형태로 들어와야함.
            var noPadBase64 =accessToken.split('.')[1];


            var addPad ='';

            var dataCount = noPadBase64.length%4;

            //Padding 처리;
            if(dataCount==2){
                addPad = '==';

            }



            else if(dataCount==3){
                addPad = '=';
            }

            var base64Data =noPadBase64+addPad;


            var decodeData = Ext.util.Base64.decode(base64Data);
            this.setUserInfo(Ext.decode(decodeData));
        }
    }

});