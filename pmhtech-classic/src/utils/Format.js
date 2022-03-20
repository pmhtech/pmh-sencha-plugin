/**
 * Ext.util.Format의 확장으로 문자열 포맷팅을 합니다.
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
Ext.define('PmhTech.utils.Format', {
    extend: 'Ext.Base',
    alternateClassName: ['PmhTech.Format'],
    requires: [
        'Ext.util.Format'
    ],
    singleton: true,


    getAge : function(birthDate){

        var now = Ext.Date.format(new Date(),'Ymd')+'000000';
        var today = Ext.Date.parse(now,'YmdHis');

        var age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;


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
     *  Grid상의 Value값을 combo값 기반으로 반환한다.
     *
     * @param {Number|String} value
     * @param {Object}  metaData
     * @param {Ext.data.Model}  record
     * @param {Number}  rowIndex
     * @param {Number}  colIndex
     * @param {Ext.data.Store}  store
     * @returns {string}
     */
    comboRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        var result = [];
        var values = Ext.isArray(value) ? value : [value];


        var combo = metaData.column.getEditor();
        var comboStore = combo.getStore();

        for(var i=0; i<values.length; i++){
            var value = Ext.isEmpty(values[i])? '' : values[i];

            var findRec = comboStore.findRecord(combo.valueField, value);
            if(comboStore.isTreeStore){
                findRec =comboStore.getRoot().findChild(combo.valueField,value,true);
            }

            if (findRec == null) {
                if(value==''){
                    continue;
                }
                result.push(value);
            }else{
                result.push(findRec.get(combo.displayField));
            }
        }
        return result.toString();
    },
    /**
     *
     *  Date 또는 Ymd 형식의 텍스트를 리턴한다.
     *
     *      @example
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
     * @param {Date | string} value
     * @returns {string}
     */
    date : function(v,format){
        if(!format){
            format = 'Y-m-d'
        }


        if(Ext.isEmpty(v) || v.length==0){
            return v;
        }

        if (Ext.isDate(v)) {
            return Ext.util.Format.date(v, format)
        }

        var convertFormat = format.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
        var v = v.replaceAll('-','').replaceAll(':','').replaceAll(' ','');

        if (convertFormat.length == 3) {
            v = v.substr(0, 8);
        }

        var date = Ext.Date.parse(v,convertFormat);
        return Ext.util.Format.date(date, format);

    },
    dateRenderer : function(format){
        if(!format){
            format = 'Y-m-d'
        }
        return function(v){

            if(Ext.isEmpty(v) || v.length==0){
                return v;
            }

            if (Ext.isDate(v)) {
                return Ext.util.Format.date(v, format)
            }

            var convertFormat = format.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
            var v = v.replaceAll('-','').replaceAll(':','').replaceAll(' ','');

            if (convertFormat.length == 3) {
                v = v.substr(0, 8);
            }
            var date = Ext.Date.parse(v,convertFormat);
            return Ext.util.Format.date(date, format);
        }
    },
    /**
     * #,###의 형식으로 리턴한다.
     * @param {Number} value
     */
    numberRenderer: function (value, defaultValue) {
        if(Ext.isEmpty(value)|| value==0){
            if (Ext.isEmpty(defaultValue)) {
                return '-';
            }
            value = defaultValue;
        }

        return Ext.util.Format.number(value, '#,###')
    },
    phoneNumberRenderer : function(value){

        var temp = value.replaceAll('-','');

        //전화번호 앞자리 가져오기
        var first = temp.indexOf('02')==0 ? temp.substr(0,2) : temp.substr(0,3);

        //전화번호 2번째 3번째 가져오기
        var remain =temp.substr(first.length);

        var second = remain.length==7 ? remain.substr(0,3) :remain.substr(0,4);
        var third = (remain.length==7)? remain.substring(3) :remain.substr(4);

        return Ext.String.format('{0}-{1}-{2}',first,second,third);

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
    convertJsonToGetParam : function(json){

        var result = [];
        for(var key in json){

            var val = json[key];

            if(val){
                result.push(key+'='+val);
            }
        }
        return result.join('&');
    },

    timeRenderer : function(time) {

        time/=1000;
        var hour = Math.floor(time / 60 / 60);
        var minute = time / 60 % 60;

        hour = Ext.String.leftPad(hour, 2, '0');
        minute = Ext.String.leftPad(minute, 2, '0');

        return hour+':'+minute;
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