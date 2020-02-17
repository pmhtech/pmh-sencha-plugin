Ext.define('PmhTech.container.gis.OpenLayer', {
    extend: 'Ext.container.Container',
    alias: 'widget.pmh-openlayer',

    requires: [
        'PmhTech.plugin.map.GoogleMap',
        'PmhTech.plugin.openlayer.Interaction'
    ],

    zoom: 10,
    plugins : [{
        ptype : 'pmh-google-map'
    },{
        ptype : 'pmh-openlayer-interaction'
    }],
    latlng:[0,0],
    googleMap: null,
    openLayer: null,
    style : 'position:relative',
    isSelect : false,
    onUnselect : function(coordinates){

        var me = this;
        if(me.isSelect &&me.getSelection().length==0){
            me.isSelect=false;
            me.fireEvent('unselect',me,coordinates);
        }
    },

    onMapClick : function(coordinates){
        var me = this;
        me.fireEvent('mapclick',me,coordinates);
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

        var content = this.getEl().dom.getElementsByClassName('openlayer-popup')[0];

        var overlay = new ol.Overlay(({ element:content }));
        var olMapDiv = this.getEl().dom.getElementsByClassName('openlayer')[0];
        var map = new ol.Map({
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({kinetic: null})]),
            target: olMapDiv,
            overlays : [overlay],
            view: view
        });

        map.on('singleclick', function (evt) {
            var coordinate = evt.coordinate;

            // EPSG:3857 - Google Mercator
            // EPSG:4326 - WGS84 경위도
            me.data.clickPosition = coordinate;
            me.onMapClick(coordinate);


            setTimeout(function(){
                me.onUnselect(coordinate);
            },150);









            overlay.setPosition(coordinate);
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

                '<div style=" position:relative;width:800px;height:600px" class="pmh-open-layer">',
                    '<div class="map">',
                        '<div id="'+Ext.id()+ '" class="googlemap"></div>',
                        '<div id="'+Ext.id()+ '" class="openlayer"></div>',
                    '</div>',
                    '<div id="'+Ext.id()+ '" class="openlayer-popup"></div>',
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
    draw : function(geomType,layoutName,id){
        this.onDraw(geomType,layoutName,id);
    },
    moidfy : function(){
        this.onModify()

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