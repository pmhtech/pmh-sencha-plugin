/**
 *
 */
Ext.define('PmhTech.plugin.map.GoogleMap', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-google-map',
    cls : 'base-map',
    init : function(openLayer){

        var me =this;
        me.openLayer = openLayer;
        me.openLayer.initMap = Ext.Function.bind(me.initMap, me);
    },
    initMap: function(){

        var me = this;
        me.openLayer.googleMap = new google.maps.Map(me.openLayer.getEl().dom.getElementsByClassName(me.cls)[0], {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            //mapTypeId: 'satellite',
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false
        });
    }

});