Ext.define('PmhTech.container.gis.GisContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.pmh-gis-container',

    requires: [
        'PmhTech.plugin.map.GoogleMap',
        'PmhTech.plugin.openlayer.Interaction'
    ],
    defaultGCS : 'EPSG:3857',
    zoom: 10,
    plugins : [{
        ptype : 'pmh-google-map'
    },{
        ptype : 'pmh-openlayer-interaction'
    }],
    defaultPopupSize:{
        width : 200,
        height : 200
    },
    popup : {
        selectPopup : null,
        clickPopup : null,
        mouseOver : false,
    },
    latlng:[0,0],
    googleMap: null,
    openLayer: null,
    style : 'position:relative',

    reconfigurePopup : function(popupType,widgetName,shortName){
        var me = this;
        var interaction = me.getInteraction();
        if(interaction=='draw' || interaction=='modify'){
            return false;
        }

        var popup = me.popup[popupType+'Popup'];
        var popupItems = popup.items.items;

        Ext.ComponentQuery.query('gis-info-popup')[0].setTitle(shortName);

        popupItems.forEach(function(item){
            item.hide();
        });


        var widget = popup.down(widgetName);

        if(!widget){
            widget = Ext.widget(widgetName);
            popup.add(widget);
        }
        widget.show();

        return widget;


    },
    showPopup : function(popupType,coordinates){
        var me = this;

        var interaction = me.getInteraction();

        //Polygon을 draw, modify중에는 팝업을 띄우지 않는다.

        if(interaction=='draw' || interaction=='modify'){
            return false;
        }
        var popupName = popupType+'Popup';
        var overlay = me.openLayer.getOverlayById(popupName);


        overlay.setPosition(coordinates);
        overlay.setVisible(true);
        me.popup[popupName].show();


    },
    hidePopup : function(popupType){
        var me = this;
        var popupName = popupType+'Popup';
        var overlay = me.openLayer.getOverlayById(popupName);
        me.popup[popupName].setHidden(true);
        overlay.setVisible(false);


    },

    initOpenLayer : function(me){

        var me = this;

        var view = new ol.View({
            // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
            maxZoom: 21
        });



        view.on('change:center', function() {
            var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            me.googleMap.setCenter(new google.maps.LatLng(center[1], center[0]));
            me.googleMap.setZoom(view.getZoom());
        });
        view.on('change:resolution', function() {
            me.googleMap.setZoom(view.getZoom());
        });

        var selectPopupEl = this.getEl().down('.pmh-select-popup');
        var clickPopupEl = this.getEl().down('.pmh-click-popup');

        me.popup.selectPopup = Ext.widget('gis-info-popup',{
            renderTo : selectPopupEl.dom,
            gisContainer : me,
            width: 200,
            height : 300,
        });
        me.popup.selectPopup.show();
        me.popup.selectPopup.hide();

       /* me.popup.clickPopup = Ext.widget('container',{
            title : 'clickPopup',
            height : me.defaultPopupSize.height,
            width : me.defaultPopupSize.width,
            renderTo : clickPopupEl.down('.popup-detail').dom
        });

       // me.popup.clickPopup.show();
      //  me.popup.clickPopup.hide();

        var clickOverlay =new ol.Overlay(({
            id : 'clickPopup',
            element:clickPopupEl.dom
        }));
*/


        var selectOverlay =new ol.Overlay(({
            id : 'selectPopup',
            element:selectPopupEl.dom
        }));


        var olMapDiv = this.getEl().dom.getElementsByClassName('open-layer')[0];
        var map = new ol.Map({
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({kinetic: null})]),
            target: olMapDiv,
            overlays : [selectOverlay,/*clickOverlay*/],
            view: view
        });

        view.setCenter([0, 0]);

        view.setZoom(me.zoom);
        me.googleMap.setZoom(me.zoom);

        olMapDiv.parentNode.removeChild(olMapDiv);
        me.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
        this.openLayer = map;

    },

    initComponent: function(){
        var me= this;
        Ext.apply(me,{
            data : {
                clickPosition :[],
                center:{

                },layout : {


                }

            },
            tpl:[

                '<div style=" position:relative;width:800px;height:600px" class="pmh-open-gis-container">',

                    '<div class="map">',
                        '<div id="'+Ext.id()+ '" class="base-map"></div>',
                        '<div id="'+Ext.id()+ '" class="open-layer"></div>',
                    '</div>',
                    '<div id="'+Ext.id()+ '" class="pmh-select-popup">',

                    '</div>',
                    '<div id="'+Ext.id()+ '" class="pmh-click-popup">' ,

                    '</div>',
                '</div>',
            ],
            listeners : {
                afterrender : me.onAfterRender,

                draw: Ext.emptyFn,
                modify: Ext.emptyFn,

                scope : me
            }
        });
        me.callParent(arguments);

    },

    onAfterRender : function(comp){
        var me = this;
        me.initMap();
        me.initOpenLayer();



        me.initInteraction();
        me.addSelectInteraction();

        me.setCenter(34.43899833929228, 126.25914688280196);
        me.setZoom(10);
    },

    setZoom : function(value){
        var me = this;
        this.openLayer.getView().setZoom(value);
        me.fireEvent('zoom',me,value);

    },
    getZoom : function(){

        var me = this;
        me.googleMap.setZoom(view.getZoom());
        var zoom = me.googleMap.getZoom();
        return zoom;
    },

    setCenter: function(lat,lng){
        var me = this;
        var center = ol.proj.transform([lng,lat],  'EPSG:4326','EPSG:3857');


        this.openLayer.getView().setCenter(center);
        me.googleMap.setCenter(new google.maps.LatLng(lat, lng));
        me.fireEvent('changecenter',me,lat,lng);

    },
    getCenter : function(){
        return[ this.googleMap.getCenter().lat(),
                this.googleMap.getCenter().lng()
        ]

    },
    getLayer: function(layerName){
        var layers =this.openLayer.getLayers().getArray();

        for(var i=0;layers.length;i++){
            if(layers[i].get('name')== layerName){
                return layers[i];
            }
        }
        return null;
    },
    getFeatureId: function(layerName,geoId){
        var me = this;
        return me.id+'-'+layerName+'-'+geoId;
    },
    setGeometry:function(layerName,geoId,geometry){
        var format = new ol.format['GeoJSON']();

        var layout = this.getLayer(layerName);
        var featureId = this.getFeatureId(layerName,geoId);
        var feature = layout.getSource().getFeatureById(featureId);

        if(!feature){

            feature= new ol.Feature();
            feature.setId(featureId);
            feature.setProperties({
                layerName : layerName,
                geoId : geoId
            });
            layout.getSource().addFeature(feature);
        }

        feature.setGeometry(new ol.geom[geometry.type](geometry.coordinates));
    },
    getGeometry :function(layerName,geoId){

        var format = new ol.format['GeoJSON']();
        var layout = this.getLayer(layerName);
        var featureId = this.getFeatureId(layerName,geoId);
        var feature = layout.getSource().getFeatureById(featureId)

        if(feature==null){
            return null;
        }


        var result =format.writeGeometryObject(feature.getGeometry());
        return result;
    },
    createLayer : function(layerName, zIndex, geoStyle){

        var me = this;
        var layer = new ol.layer.Vector({
            name: layerName,
            zIndex : zIndex,
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill(geoStyle.fill),
                stroke: new ol.style.Stroke(geoStyle.stroke),
                image: new ol.style.Circle(geoStyle.image)
            })
        });
        me.openLayer.addLayer(layer);
        return layer;
    },
});