/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.utils.Format', {
    extend: 'Ext.Base',
    alternateClassName: ['PmhTech.Format'],
    requires: [
        'Ext.util.Format',
        'PmhTech.utils.Cookie'
    ],
    singleton: true,

    getSysCodeName : function(preCode,code){

        var store = SysCode[preCode];

        if(store){

            var findRec = store.findRecord('code',code);

            if(findRec){
                return findRec.get('codeName');
            }
        }
    },
    getGmtDate :function(gmtOffset,timestamp){
        var nowDate = new Date();
        if(!timestamp){
            timestamp = nowDate.getTime();
        }



        var hour = parseInt(gmtOffset.substr(4,2))*60*60*1000;
        var min = parseInt(gmtOffset.substr(6))*60*1000;

        if(gmtOffset.substr(3,1)=='+'){
            nowDate =new Date(utcDate.getTime()+hour+min);
        }else{
            nowDate =new Date(utcDate.getTime()+hour+min);
        }

        return nowDate;
    },

    /**
     *
     * @param value
     * @param metaData
     * @param record
     * @param rowIndex
     * @param colIndex
     * @param store
     * @returns {string}
     */
    comboRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        var combo = metaData.column.getEditor();
        var comboStore = combo.getStore();
        var findIdx = combo.getStore().find(combo.valueField, value);

        if (findIdx == -1) {
            return value;
        }
        var rec = comboStore.getAt(findIdx);


        var value = '';
        if (combo.isShowCode === true) {

            value = '[' + rec.get(combo.valueField) + '] ';
        }
        value += rec.get(combo.displayField);

        return value;
    },
    /**
     *
     * @param value
     */
    dateRenderer: function (value) {

        if (Ext.isDate(value)) {
            return Ext.util.Format.date(value, 'Y-m-d')
        }

        var year = value.substr(0, 4);
        var month = value.substr(4, 2);
        var day = value.substr(6, 2);

        return Ext.String.format('{0}-{1}-{2}', year, month, day);
    },
    /**
     *
     * @param value
     */
    numberRenderer: function (value) {
        return Ext.util.Format.number(value, '#,###')
    },
    sensorRenderer : function(v,metaData,rec){

        switch(rec.get('gaugeType')){
            case 'humid' :
                if(v){
                    return Ext.util.Format.number(v, '#,###.0')+'%';
                }
                return '0.0%'
            default : return v;
        }
    },


    getLocalDate : function(){

        var siteIdx = PmhTech.Cookie.getActiveSite();
        var gmtOffset = '';
        if(siteIdx){
            gmtOffset = Ext.getStore('Site').findRecord('siteIdx',siteIdx).data.gmtOffset;
        }
        var midnight = new Date(Ext.Date.format(new Date(), 'Y-m-d') +' 00:00:00 '+gmtOffset).getTime();
        return PmhTech.Format.timeFullRenderer(new Date().getTime()-midnight);
    },
    timeFullRenderer : function(time){
        time=Math.floor(time/1000);

        var hour = Math.floor(time / 60 / 60);
        var minute = Math.floor(time / 60 % 60);
        var sec=Math.floor(time%60);

        hour = Ext.String.leftPad(hour, 2, '0');
        minute = Ext.String.leftPad(minute, 2, '0');
        sec = Ext.String.leftPad(sec, 2, '0');
        return hour+':'+minute+':'+sec;


    },
    timeRenderer : function(time) {

        time/=1000;
        var hour = Math.floor(time / 60 / 60);
        var minute = time / 60 % 60;

        hour = Ext.String.leftPad(hour, 2, '0');
        minute = Ext.String.leftPad(minute, 2, '0');

        return hour+':'+minute;
    },
    weekRawRenderer : function(rawValue){
        let dayOfWeek = {

            1: Locale['WEEK']['SUN'],
            2: Locale['WEEK']['MON'],
            4: Locale['WEEK']['THE'],
            8: Locale['WEEK']['WED'],
            16: Locale['WEEK']['THU'],
            32: Locale['WEEK']['FRI'],
            64: Locale['WEEK']['SAT'],

        };

        var result=[];

        Ext.iterate(dayOfWeek,function(key,value){

            if((rawValue&key)!=0){
                result.push(parseInt(key));

            }
        });

        return result;
    },

    weekRenderer : function(rawValue){
        let dayOfWeek = {

            1: Locale['WEEK']['SUN'],
            2: Locale['WEEK']['MON'],
            4: Locale['WEEK']['THE'],
            8: Locale['WEEK']['WED'],
            16: Locale['WEEK']['THU'],
            32: Locale['WEEK']['FRI'],
            64: Locale['WEEK']['SAT'],

        };

        switch (rawValue) {
            case 62 :
                return Locale['WEEK']['WEEKDAYS'];
            case 65 :
                return Locale['WEEK']['WEEKEND'];
            case 127 :
                return Locale['WEEK']['EVERY_DAY'];
        }

        var result = [];
        var datas = PmhTech.Format.weekRawRenderer(rawValue);

        for (var i = 0; i < datas.length; i++) {
            result.push(dayOfWeek[datas[i]]);

        }

        return result.toString();
    },

    convertListToTree: function (arrayList, id, parentId, rootId) {

        var rootNodes = [];
        var traverse = function (nodes, item, index) {

            if (nodes instanceof Array) {

                return nodes.some(function (node) {

                    if (node[id] === item[parentId]) {

                        node.children = node.children || [];
                        return node.children.push(arrayList.splice(index, 1)[0]);
                    }

                    return traverse(node.children, item, index);
                });
            }
        };

        while (arrayList.length > 0) {

            arrayList.some(function (item, index) {
                if (item[parentId] === rootId) {
                    return rootNodes.push(arrayList.splice(index, 1)[0]);
                }

                return traverse(rootNodes, item, index);
            });
        }

        return rootNodes;
    }

});