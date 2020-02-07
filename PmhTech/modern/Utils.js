Ext.define('PmhTech.Utils', {
    extend: 'Ext.Base',
    singleton : true,

    /**
     * Form Validation 함수
     * 오류가 있을경우 에러메시지를 띄어준다
     *
     * @param {Ext.form.Panel} formpanel
     * @returns {boolean}
     */
    isValidForm: function(formpanel){

        formpanel.validate();

        var fields = formpanel.query('field');

        var errMsg = [];
        for(var i=0;i<fields.length;i++){

            var field=fields[i];

            if(field.getRequired() && Ext.isString(field.getValue())){
                field.setValue(field.getValue().trim());

            }


            var msg =fields[i].getErrorMessage();
            if(msg){
                errMsg.push(msg);
            }
        }
        if(errMsg.length==0){
            return true;
        }


        PmhTech.Msg.alert('확인',errMsg.join('<br>'));


        return false;

    },

    /**
     *
     *  Single Tone 방식의 Sencha Popup 띄어주는 함수
     * @param {String} widgetName  띄우고자 하는 팝업위젯명
     * @param {Object} options  사용될 파라미터
     */
    showPopup: function (widgetName, options) {

        var popup = Ext.ComponentQuery.query(widgetName)[0];

        if (!popup) {
            popup = Ext.widget(widgetName);
        }

        if(window.farotaBridge){
            window.farotaBridge.setQueueLength(1);


            var toast = Ext.ComponentQuery.query('sheet')[0];

            if(toast){
                toast.hide();
            }

        }

        if (!options.callbackScope) {
            alert('callbackScope :SCOPE 미지정');
        }
        popup.options = options;
        popup.show();

        return popup;

    },

    /**
     *
     *  Array 를 Tree 형태로 변환
     *
     *  상위 아이디, 아이디 로 구성된 배열을
     *  Tree 구조로 변환
     *
     *
     * @param arrayList  Array
     * @param {String} id    아이디 컬럼명
     * @param {String} parentId  상위아이디 컬럼명
     * @param {String} rootId   최상단 root아이디값
     * @returns {Array}  Tree Json
     */
    convertListToTree: function (arrayList, id, parentId, rootId) {

        var rootNodes = [];
        var traverse = function (nodes, item, index) {

            if (nodes instanceof Array) {

                return nodes.some(function (node) {


                    node.leaf = true;
                    if (node[id] === item[parentId]) {

                        node.leaf = false;
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
    },
    /**
     *
     * @param clazz GlobalContent내의 Class명
     * @param params PageParamter
     */
    nextPage : function(clazz,params){

        var rootNode = Ext.getStore('Navigation').getRoot();

        var findRec = rootNode.findChild('MENU_URI',params.menuUri,true);
        var menuGroup = false;
        if(!findRec){
            findRec = rootNode.findChild('SHORT_URI',params.menuUri,true);
            PmhTech.Cookie._pageHis[params.menuUri]=params;
            params.menuUri = findRec.childNodes[0].data.MENU_URI;
            menuGroup = true;
        }

        if(findRec!=null){

            if(!menuGroup){
                PmhTech.Cookie._pageHis[params.menuUri]=params;
            }

            var me = this;
            FarotaApp.app.getController('MenuController').redirectTo(params.menuUri);

        }else{
            alert('잘못된 MENU입니다.');

        }
        



    },

    loadCookie : function(){
        var cookieValue = Ext.util.Cookies.get('_farota_his_');

        if(Ext.isEmpty(cookieValue)|| cookieValue=='null'){
            return {};
        }

        return Ext.decode(Ext.util.Base64.decode(cookieValue))

    },
    setSideMenuParams : function(button,activePage,nextParams){
        var globalNorth = Ext.ComponentQuery.query('global-north')[0].getController();
        Ext.callback(globalNorth.onBtnToggleMenu,globalNorth,[button,activePage,nextParams]);
    },
    setDeviceCommand: function(thingUri, commandWater){

        var findIdx = Ext.getStore('DeviceAll').find('thingUri',thingUri);

        if(findIdx!=-1){
            Ext.getStore('DeviceAll').getAt(findIdx).set('switchOnOff',commandWater);
            Ext.getStore('GroupDevice').updateDeviceData();
        }




        
    }
});
