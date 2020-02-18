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
    popup : {
        selectPopup : null,
        clickPopup : null
    },
    latlng:[0,0],
    googleMap: null,
    openLayer: null,
    style : 'position:relative',

    showPopup : function(popupType,coordinates){
        var me = this;

        var popupName = popupType+'Popup';
        var overlay = me.openLayer.getOverlayById(popupName);
        overlay.setPosition(coordinates);
        me.popup[popupName].show();
        overlay.setVisible(true);

    },
    hidePopup : function(popupType){
        var me = this;
        var popupName = popupType+'Popup';
        var overlay = me.openLayer.getOverlayById(popupName);
        overlay.setVisible(false);

        me.popup[popupName].hide();
    },

    test : function(coordinates){

        for(var i=0;i<coordinates.length;i++){
            var result=ol.proj.transform(coordinates[i], 'EPSG:3857', 'EPSG:4326');

        }
    },
    initOpenLayer : function(me){

        var me = this;

        var view = new ol.View({
         //   projection: 'EPSG:4326',
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

        var selectPopupEl = this.getEl().select('.pmh-select-popup').elements[0];
        var clickPopupEl = this.getEl().select('.pmh-click-popup').elements[0];


        me.popup.selectPopup = Ext.widget('panel',{
            height : 100,
            title : 'SelectPopup',
            width : 200,
            renderTo : selectPopupEl
        });

        me.popup.selectPopup.show();
        me.popup.selectPopup.hide();

        me.popup.clickPopup = Ext.widget('panel',{
            height : 100,
            title : 'ClickPopup',
            width : 200,
            renderTo : clickPopupEl
        });

        me.popup.clickPopup.show();
        me.popup.clickPopup.hide();

        var clickOverlay =new ol.Overlay(({
            id : 'clickPopup',
            element:clickPopupEl
        }));

        var selectOverlay =new ol.Overlay(({
            id : 'selectPopup',
            element:selectPopupEl
        }));


        var olMapDiv = this.getEl().dom.getElementsByClassName('open-layer')[0];
        var map = new ol.Map({
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({kinetic: null})]),
            target: olMapDiv,
            overlays : [selectOverlay,clickOverlay],
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
                    '<div id="'+Ext.id()+ '" class="pmh-select-popup"></div>',
                    '<div id="'+Ext.id()+ '" class="pmh-click-popup"></div>',
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
        debugger;
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

        this.googleMap.setZoom(view.getZoom());
        var zoom = this.googleMap.getZoom();
        return zoom;

    },

    setCenter: function(lat,lng){
        var me = this;
        var center = ol.proj.transform([lng,lat],  'EPSG:4326','EPSG:3857');

        this.openLayer.getView().setCenter(center);
        this.googleMap.setCenter(new google.maps.LatLng(lat, lng));
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
    getFeatureId: function(layoutName,geoId){
        var me = this;
        return me.id+'-'+layoutName+'-'+geoId;
    },
    setGeometry:function(layoutName,geoId,geometry){
        var format = new ol.format['GeoJSON']();

        var layout = this.getLayer(layoutName);
        var featureId = this.getFeatureId(layoutName,geoId);
        var feature = layout.getSource().getFeatureById(featureId);

        if(!feature){

            feature= new ol.Feature();
            feature.setId(featureId);
            feature.setProperties({
                layoutName : layoutName,
                geoId : geoId
            });
            layout.getSource().addFeature(feature);
        }

        feature.setGeometry(new ol.geom[geometry.type](geometry.coordinates));
    },
    getGeometry :function(layoutName,geoId){

        var format = new ol.format['GeoJSON']();
        var layout = this.getLayer(layoutName);
        var featureId = this.getFeatureId(layoutName,geoId);
        var feature = layout.getSource().getFeatureById(featureId)
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