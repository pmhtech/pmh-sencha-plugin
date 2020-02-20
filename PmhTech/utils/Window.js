Ext.define('PmhTech.utils.Window', {
    extend: 'Ext.Base',
    alternateClassName : ['PmhTech.Utils.Window'],
    singleton: true,
    showPopup: function (widgetName, options) {
        var popup = Ext.ComponentQuery.query(widgetName)[0];

        if (!popup) {

            var popupParam ={
                renderTo : options.renderTo,
                height : options.height,
                width : options.width
            }

            if(!options.renderTo){
                delete popupParam.renderTo
            }
            if(!options.height){
                delete popupParam.height
            }
            if(!options.width){
                delete popupParam.width
            }
            popup = Ext.widget(widgetName,popupParam);
        }

        if (!options.callbackScope) {
            alert('callbackScope :SCOPE 미지정');
        }
        popup.initSingleTone(options);
        popup.show();
        Ext.WindowManager.bringToFront(popup);
        return popup;

    },
    printHTML: function (html) {


        Ext.callback(function () {
            var myWindow = window.open('', '', 'width=1200,height=1000');
            var task = new Ext.util.DelayedTask(function () {

                myWindow.location.reload();
                myWindow.document.write('<html><head>');
                myWindow.document.write('<title>' + 'Title' + '</title>');
                myWindow.document.write('</head><body>');
                myWindow.document.write(html);
                myWindow.document.write('</body></html>');
                myWindow.focus();

                if (Ext.isIE === true) {
                    var OLECMDID = 7;
                    var PROMPT = 1;
                    var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
                    document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
                    WebBrowser.ExecWB(OLECMDID, PROMPT);
                } else {
                    myWindow.print();
                }
            });

            task.delay(500);
        }, Samjong.browserArea);
    }
});


