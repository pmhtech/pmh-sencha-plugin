/**
 *
 */
Ext.define('PmhTech.utils.Jwt', {
    alternateClassName: ['PmhTech.Jwt'],
    extend: 'Ext.Base',

    requires: [
        'Ext.util.Base64',
        'Ext.util.Cookies'
    ],
    singleton: true,
    userData : null,

    refreshAccessToken : function(){

    },

    getAccessToken : function(){

        var accessToken =Ext.util.Cookies.get(this.cookieName.accessToken);
        if(!accessToken){
            return this.refreshAccessToken();
        }
        return accessToken;


    },
    removeCookie: function () {
        Ext.util.Cookies.clear(this.cookieName.accessToken);
    },
    parseUserData : function(accessToken){
        //JWT 표준 규약상 Padding이 없는 형태로 들어와야함.
        var noPadBase64 = accessToken.split('.')[1];

        var addPad = '';
        var dataCount = noPadBase64.length % 4;

        //Padding 처리;
        if (dataCount == 2) {
            addPad = '==';

        } else if (dataCount == 3) {
            addPad = '=';
        }

        var base64Data = noPadBase64 + addPad;
        var decodeData = Ext.util.Base64.decode(base64Data);
        return Ext.decode(decodeData);
    },
    getUserData: function () {
        var accessToken = Ext.util.Cookies.get(this.cookieName.accessToken);


        if (accessToken) {
            return this.parseUserData(accessToken);
        }
        return null;
    }
});