Ext.define('PmhTech.classic.map.GoogleMap',{
    extend : 'Ext.container.Container',
    alias : 'widget.pmh-googlemap',

    style : 'position: relative',
    zoom: 10,
    latlng:[0,0],
    map : null,
    googleMap: null,
    openLayerMap: null,



    setZoom : function(value){
        this.googleMap.setZoom(value);
        this.map.getView().setZoom(value);

    },
    getZoom : function(){
        var zoom = this.googleMap.getZoom();
        return zoom;

    },

    setLatLng: function(lat,lng){


        var center = [lng,lat];

        var center = ol.proj.transform([lng,lat],  'EPSG:4326','EPSG:3857');

        this.map.getView().setCenter(center);
        this.googleMap.setCenter(new google.maps.LatLng(lat, lng));

    },
    getLatLng : function(){


    },


    initComponent: function(){
        var me= this;

        Ext.apply(me,{


            html :'' +
                '<div style=" position: relative;height:'+me.height+'px;width:'+me.width+'px">' +
                '<div id="map" class="map">' +
                '    <div id="gmap" class="fill"></div>' +
                '    <div id="olmap" class="fill"></div>' +
                '</div>' +
                '</div>',
            listeners : {
                afterrender : me.onAfterRender,
                drawPoly : me.onDrawPoly,
                scope : me
            }
        });
        me.callParent(arguments);

    },
    onDrawPoly : function(){
        var me = this;
        draw_interaction = new ol.interaction.Draw({
            source: me.vectorLayer.getSource(),
            type: /** @type {ol.geom.GeometryType} */'Polygon'
        });

        // add it to the map
        me.map.addInteraction(draw_interaction);

        // when a new feature has been drawn...
        draw_interaction.on('drawend', function (event) {
            // create a unique id
            // it is later needed to delete features
            var id = Ext.id();
            // give the feature this id
            event.feature.setId(id);
            // save the changed data
            //saveData();
        });

    },
    onAfterRender : function(comp){
        var me = this;
        me.loadMap();

    },

    loadMap : function(){
        var gmap = new google.maps.Map(document.getElementById('gmap'), {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false
        });

        var view = new ol.View({
            // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
            maxZoom: 21
        });
        view.on('change:center', function() {
            var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
        });
        view.on('change:resolution', function() {
            gmap.setZoom(view.getZoom());
        });

        var vector_layer = new ol.layer.Vector({
            name: 'my_vectorlayer',
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),

                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),

                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        var olMapDiv = document.getElementById('olmap');
        var map = new ol.Map({
            layers: [vector_layer],
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({kinetic: null})]),
            target: olMapDiv,
            view: view
        });
        view.setCenter([0, 0]);
        view.setZoom(1);

        olMapDiv.parentNode.removeChild(olMapDiv);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

        this.googleMap = gmap;
        this.map = map;
        this.vectorLayer = vector_layer;

        this.fireEvent('drawPoly');
    },

    saveData : function(){


    },
    initMap : function(comp){



    },
    getValues:function(){


    },
    setValues: function(){

    },
    setValue:function(layerName,geoJson){

    },
    getValue:function(layerName){

    }




});