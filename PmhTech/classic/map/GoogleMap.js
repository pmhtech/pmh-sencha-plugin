Ext.define('PmhTech.classic.map.GoogleMap',{
    extend : 'Ext.container.Container',
    alias : 'widget.pmh-googlemap',

    style : 'position: relative',
    zoom: 10,
    latlng:[0,0],
    map : null,
    googleMap: null,
    openLayer: null,



    setZoom : function(value){
        this.googleMap.setZoom(value);
        this.openLayer.getView().setZoom(value);


    },
    getZoom : function(){

        this.googleMap.setZoom(view.getZoom());
        var zoom = this.googleMap.getZoom();
        return zoom;

    },

    setLatLng: function(lat,lng){


        var center = [lng,lat];

        var center = ol.proj.transform([lng,lat],  'EPSG:4326','EPSG:3857');

        this.openLayer.getView().setCenter(center);
        this.googleMap.setCenter(new google.maps.LatLng(lat, lng));

    },
    getLatLng : function(){
        return[this.googleMap.getCenter().lat(),this.googleMap.getCenter().lng()]

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
                scope : me
            }
        });
        me.callParent(arguments);

    },

    onAfterRender : function(comp){
        var me = this;
        me.initOpernLayer();

        var geoStyle={
            fill : {
                color: 'rgba(255, 255, 255, 0.2)'
            },
            stroke:{
                color: '#ffcc33',
                width: 2
            },image:{
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            }

        };


        me.createVector('site',geoStyle);

        var geometry = {"type":"Polygon","coordinates":[[[12895668.907950811,3996700.712448078],[12203687.030629972,2354899.6350341886],[13340420.566366304,2408851.6032803226],[12895668.907950811,3996700.712448078]]]};

        me.setGeometry('site','1',geometry);
        //me.drawGeometry('Polygon','site','1',);

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



    drawGeometry(geomType,layoutName,id){
        var layout = this.getLayer(layoutName);
        id= layoutName + '_' + id;

        var drawEvent = new ol.interaction.Draw({
            source: layout.getSource(),
            type: geomType
        });
        this.openLayer.addInteraction(drawEvent);
        drawEvent.on('drawend', function (event) {
            // give the feature this id
            event.feature.setId(id);

        });


    },
    setGeometry:function(layoutName,id,geometry){
        var format = new ol.format['GeoJSON']();

        var layout = this.getLayer(layoutName);
        id= layoutName + '_' + id;
        var feature = layout.getSource().getFeatureById(id);
        if(!feature){
            feature= new ol.Feature();
            feature.setId(id);
            layout.getSource().addFeature(feature);
        }

        feature.setGeometry(new ol.geom[geometry.type](geometry.coordinates));


    },
    getGeometry :function(layoutName,id){

        var format = new ol.format['GeoJSON']();

        var layout = this.getLayer(layoutName);
        id= layoutName + '_' + id;
        var feature = layout.getSource().getFeatureById(id)
        return format.writeGeometryObject(feature.getGeometry());
    },
    createVector : function(vectorName, geoStyle){
        var vector = new ol.layer.Vector({
            name: vectorName,
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill(geoStyle.fill),
                stroke: new ol.style.Stroke(geoStyle.stroke),
                image: new ol.style.Circle(geoStyle.image)
            })
        });

        this.openLayer.addLayer(vector);

    },

    initOpernLayer : function(){
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



        var olMapDiv = document.getElementById('olmap');
        var map = new ol.Map({
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
        this.openLayer = map;
    }
});