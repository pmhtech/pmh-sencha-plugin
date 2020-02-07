Ext.define('PmhTech.utils.Jwt',{
    alternateClassName : ['PmhTech.Jwt'],
    extend : 'Ext.Base',

    requires: [
        'Ext.data.Store',
        'PmhTech.utils.Ajax',
        'PmhTech.utils.Cookie',
        'PmhTech.utils.Msg',
        'PmhTech.utils.Sha256'
    ],
    singleton  : true,
    loadLocale : function() {

        PmhTech.Ajax.request({
            url: 'resources/locale/' + locale + '/locale-message.json',
            method: 'GET',
            async : false,
            success: function (resObj) {
                LocaleMsg = resObj;
            }
        });

        PmhTech.Ajax.request({
            url: 'resources/locale/' + locale + '/locale-code.json',
            method: 'GET',
            async : false,
            success: function (resObj) {
                LocaleCode = resObj;
            }
        });
    },

    getDefaultLanguage : function(){

        var findIdx = SysCode['COM_000002'].find('code', 'DEFAULT');
        var defaultRec = SysCode['COM_000002'].getAt(findIdx);
        return defaultRec.get('ref1');
    },
    doLogin : function(paramObj,callbackFunc){

        paramObj.password = PmhTech.utils.Sha256.encode(paramObj.password);
        PmhTech.Ajax.request({
            url : authHost+'/token',
            async : false,
            method : 'POST',
            params : {
                jwtUser : Ext.encode(paramObj)
            },
            success : function(resObj){
                PmhTech.Cookie.setAccessToken(resObj.accessToken);
                callbackFunc();


            },scope : this

        });
    },



    doLogout : function(){




        PmhTech.Msg.confirm(LocaleMsg['CONFIRM']['LOGOUT']['title'], LocaleMsg['CONFIRM']['LOGOUT']['message'],function(){

            PmhTech.Cookie.removeCookie();

            location.reload();

        });




    },
    checkLogin: function () {


        var userInfo = PmhTech.utils.Cookie.getUserInfo();

        if(userInfo){

            var userIdx = PmhTech.utils.Cookie.getUserInfo().userIdx;



            PmhTech.Ajax.request({
                url: frontHost + '/users/' + userIdx+'/login',
                method: 'GET',
                async : false,
                failure : function(){
                  PmhTech.Cookie.removeCookie();
                  location.href="";

                },
                success: function (resObj) {


                    if(resObj.user[0]==null){
                        PmhTech.Cookie.removeCookie();
                        location.href="";

                    }

                    if(resObj.sysCodeMap){

                        Ext.iterate(resObj.sysCodeMap,function(preCode,data){

                            for(var i=0;i<data.length;i++){
                                Ext.Array.findBy(LocaleCode,function(item){

                                    if(data[i].code=='ALL'){
                                        data[i].codeName=Locale['COMMON']['ALL']
                                    }
                                    else if(data[i].preCode==item.preCode && data[i].code==item.code){
                                        data[i]= Ext.apply(data[i],item);
                                    }
                                })
                            }
                            if(Ext.isEmpty(SysCode[preCode])){
                                SysCode[preCode] = Ext.create('Ext.data.Store',{
                                    data : data
                                });
                            }
                        });
                    }
                    if(resObj.sysMenu){

                        Ext.getStore('Navigation').doLoadData(resObj.sysMenu);
                    }



                    Ext.getStore('User').loadRawData(resObj.user);
                    Ext.getStore('Site').loadRawData(resObj.site);
                    Ext.getStore('DeviceType').loadRawData(resObj.deviceType);


                }, scope: this

            });
        }else{

            location.hash='';
            PmhTech.Ajax.request({
                url: frontHost + '/users/guest',
                method: 'GET',
                async : false,
                params : {
                    localeCode : 'KOR'
                },failure : function(){
                    PmhTech.Cookie.removeCookie();
                    location.href="";

                },
                success : function(resObj){

                    if(resObj.sysCodeMap){

                        Ext.iterate(resObj.sysCodeMap,function(preCode,data){

                            if(Ext.isEmpty(SysCode[preCode])) {
                                SysCode[preCode] = Ext.create('Ext.data.Store', {
                                    data: data
                                });
                            }
                        });
                    }
                    if(resObj.sysMenu){

                        Ext.getStore('Navigation').doLoadData(resObj.sysMenu);
                    }
                }



            });

        }
    }

});