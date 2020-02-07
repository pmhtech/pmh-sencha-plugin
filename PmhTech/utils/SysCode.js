Ext.define('PmhTech.utils.SysCode', {
    alternateClassName : ['PmhTech.SysCode'],
    extend: 'Ext.Base',
    singleton: true,
    
    copy :function(preCode,all){
        
        var datas = SysCode[preCode];
        var store =null;
        if(datas){
            var storeData =Ext.pluck(SysCode[preCode].data.items,'data');
            if(all===false){
                storeData = Ext.Array.slice(storeData,1)
            }
            store = Ext.create('Ext.data.Store',{
               data : storeData
            });
        }
        return store;
    },
    findCodeName : function(preCode,code){

        var findRec = SysCode[preCode].findRecord('code',code);

        if(findRec){
            return findRec.get('codeName');
        }else{
            return '코드없음';
        }

    }
});