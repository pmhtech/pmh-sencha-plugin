/**
 *
 */
Ext.define('PmhTech.utils.Window', {
    extend: 'Ext.Base',

    requires: [
        'Ext.util.Cookies'
    ],

    browserPopupTarget : '_browserPopup',
    alternateClassName : ['PmhTech.Window'],
    singleton: true,

    /**
     * Convenient shorthand to create a widget by its xtype or a config object.
     *
     *      var button = Ext.widget('button'); // Equivalent to Ext.create('widget.button');
     *
     *      var panel = Ext.widget('panel', { // Equivalent to Ext.create('widget.panel')
     *          title: 'Panel'
     *      });
     *
     *      var grid = Ext.widget({
     *          xtype: 'grid',
     *          ...
     *      });
     *
     * If a {@link Ext.Component component} instance is passed, it is simply returned.
     *
     * @member Ext
     * @param {String} name The xtype of the widget to create.
     * @param {Object} config The configuration object for the widget constructor.
     * @return {Object} The widget instance
     */
    showPopup: function (widgetName, options) {
        var popup = Ext.ComponentQuery.query(widgetName)[0];
        var viewModel = null;

        if(options.viewModel){
            viewModel = Ext.clone(options.viewModel);
            delete options.viewModel;
        }
        if (!popup) {
            var config = options|| {};
            popup = Ext.widget(widgetName,config);
        }

        Ext.apply(popup,options);

        if(viewModel){

            Ext.iterate(viewModel.data,function(key,value){
               popup.getViewModel().set(key,value);
            });
        }
        popup.show();


        Ext.WindowManager.bringToFront(popup);
        return popup;
    },

    showSlidePopup : function(widgetName,options){

        var popup = Ext.ComponentQuery.query(widgetName+'[hidden=false]')[0];

        if(popup){

            var oldData = popup.getViewModel().getData();
            var newData =options.viewModel.data;

            var isEqual = true;
            for(var key in newData){
                if(newData[key]!=oldData[key]){
                    isEqual=false;
                    break;
                }
            }

            if(isEqual){
                popup.ignoreCollapse=true;
                return;
            }
            popup.ignoreCollapse=false;
            popup.hide();
        }
        return PmhTech.Window.showPopup(widgetName,options);
    },

    showInfoPopup: function (widgetName, options) {
        options.modal=false;
        var popup = PmhTech.Window.showPopup(widgetName,options);
        popup.fireEvent('show',popup);
        return popup;
    },


    getBrowserPopupParam : function(){
        return Ext.decode(Ext.util.Cookies.get('happymint-popup-param'));
    },

    closeBrowserPopup : function(){
        //Ext.util.Cookies.clear('happymint-popup-param');
        window.open('about:blank', PmhTech.Window.browserPopupTarget).close();

    },


    initBrowserPopup : function(){
        var urlParam = location.search;
        var findIdx = urlParam.indexOf('popupWidget');

        if(findIdx==-1){
            return false;
        }

        var popupWidget = urlParam.substr(1+12);

        Ext.widget('browser-main',{
            items : [{
                xtype : popupWidget,
            }]
        });
        return true;
    },
    showBrowserPopup : function(widgetName,params){

        var origin = location.origin+location.pathname;
        var url =origin+'?popupWidget='+widgetName;


        Ext.util.Cookies.set('happymint-popup-param',Ext.encode(params));
        window.open(url, PmhTech.Window.browserPopupTarget, ', menubar=no, status=no, toolbar=no,location=no,width=1200,height=1000');

    }
});


