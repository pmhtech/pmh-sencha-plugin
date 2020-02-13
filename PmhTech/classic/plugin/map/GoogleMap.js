Ext.define('PmhTech.plugin.map.GoogleMap', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-google-map',
    cls : 'googlemap',
    init : function(openLayer){

        var me =this;


        openLayer.googleMap = new google.maps.Map(this.getEl().dom.getElementsByClassName('googlemap')[0], {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false
        });

       // me.form.getOriginalValues = Ext.Function.bind(me.getOriginalValues, me);


    }

});