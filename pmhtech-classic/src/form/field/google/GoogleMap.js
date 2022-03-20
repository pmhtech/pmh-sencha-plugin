Ext.define('PmhTech.form.field.google.GoogleMap',{
    extend : 'Ext.container.Container',
    alias : 'widget.pmh-googlemap',
/*
    requires: [
        'Ext.event.Event',
        'Ext.util.KeyMap'
    ],
    zoom: 10,
    latlng:[0,0],
    googleMap: null,
    openLayer: null,
    geoEvent : {
        draw : null,
        select : null,
        modify : null
    },
    style : 'position:relative',

    removeGeoEvents : function(){
        var me = this;

        if(me.geoEvent.draw){
            me.openLayer.removeInteraction(me.geoEvent.draw);
        }
        if(me.geoEvent.select){
            me.openLayer.removeInteraction(me.geoEvent.select);
        }

        if(me.geoEvent.modify){
            me.openLayer.removeInteraction(me.geoEvent.modify);
        }

    },





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
            data :{
                width : 100,
                height : 100
            },
            tpl:[

                '<div style=" position:relative;width:800px;height:600px" class="pmh-open-layer">',
                    '<div class="map">',
                        '<div id="'+Ext.id()+ '" class="googlemap"></div>',
                        '<div id="'+Ext.id()+ '" class="openlayer"></div>',
                    '</div>',
                '</div>',
                ],
            listeners : {
                afterrender : me.onAfterRender,
                scope : me
            }
        });
        me.callParent(arguments);

    },

    onAfterRender : function(comp){
        var me = this;
        me.initOpenLayer();
        me.addEventSelect();







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
    addEventSelect : function(){
        var me = this;
        //me.removeGeoEvents();

        select_interaction = new ol.interaction.Select();

        select_interaction.getFeatures().on("add",function(e){


            var feature = e.element;
            var temp = feature.getId().split('_');
            var layerName = temp[0];
            var id = temp[1];
            me.getGeometry(layoutName,id);

        });


        me.openLayer.addInteraction(select_interaction);

        select_interaction.on('click',function(e){
            //debugger;

        });

    },

    drawGeometry : function(geomType,layoutName,id){
        var me=this;

        var layout = this.getLayer(layoutName);
        id= layoutName + '_' + id;

        var drawEvent = new ol.interaction.Draw({
            source: layout.getSource(),
            type: geomType
        });
        this.removeGeoEvents();
        this.geoEvent.draw=drawEvent;

        this.openLayer.addInteraction(drawEvent);
        drawEvent.on('drawend', function (event) {
            // give the feature this id

            me.fireEvent('drawend',this.geomType,this.layout,this.id);

            event.feature.setId(id);

        },{
            geomType : geomType,
            layout: layout,
            id : id
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
    createLayer : function(layerName, geoStyle){

        var me = this;
        var layer = new ol.layer.Vector({
            name: layerName,
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

    initOpenLayer : function(me){

        var me = this;

        me.getEl().on('mouseenter',function(){
           console.log('mouseenter')

        });

        me.getEl().on('mouseleave',function(){
            console.log('mouseleave')

        });


        var gmap = new google.maps.Map(this.getEl().dom.getElementsByClassName('googlemap')[0], {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            zoom:1.0,
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
            gmap.setZoom(view.getZoom());
        });
        view.on('change:resolution', function() {
            gmap.setZoom(view.getZoom());
        });




        var olMapDiv = this.getEl().dom.getElementsByClassName('openlayer')[0];
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
        gmap.setZoom(1);

        olMapDiv.parentNode.removeChild(olMapDiv);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

        this.googleMap = gmap;
        this.openLayer = map;

        var map = new Ext.util.KeyMap({
            target: Ext.getBody(),
            key: Ext.event.Event.ESC,
            fn: function(){

            },
            scope:me
        });
    }*/
});