Ext.define('PmhTech.plugin.openlayer.Interaction', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-openlayer-interaction',
    selected : false,
    init : function(gisContainer){
        var me = this;
        me.gisContainer= gisContainer;

        me.gisContainer.initInteraction = Ext.Function.bind(me.initInteraction, me);
        me.gisContainer.addSelectInteraction = Ext.Function.bind(me.addSelectInteraction, me);
        me.gisContainer.getSelection = Ext.Function.bind(me.getSelection, me);
        me.gisContainer.startDraw = Ext.Function.bind(me.startDraw, me);
        me.gisContainer.isSelected=  Ext.Function.bind(me.isSelected, me);

    },
    interaction:{
        select : null,
        modify : null,
        draw : null
    },
    isSelected: function(){
        var me = this;
      return me.selected;
    },

    initInteraction : function(){

        var me =this;
        var openLayer = me.gisContainer.openLayer;


        openLayer.on('singleclick', function (evt) {

            var coordinate = evt.coordinate;

            // EPSG:3857 - Google Mercator
            // EPSG:4326 - WGS84 경위도
            me.gisContainer.data.clickPosition = coordinate;

            me.selected=false;
            openLayer.forEachFeatureAtPixel(
                evt.pixel,
                function (feature, layer) {
                    me.selected=true;
                }
            );
            me.onClick(coordinate);
            me.onDeselect(coordinate);



        });

    },
    removeInteraction : function(eventName){
        var me = this;
        var openLayer =me.gisContainer.openLayer;

        if(eventName=='select'){
            me.selected=false;
        }

        openLayer.removeInteraction(me.interaction[eventName]);
        me.interaction[eventName]=null;

    },
    addInteraction : function(eventName,event){

        var me = this;
        var openLayer =me.gisContainer.openLayer;

        me.interaction[eventName]=event;
        openLayer.addInteraction(event);

    },
    getSelection: function(){
        var me = this;

        var props = Ext.pluck(me.interaction.select.getFeatures().getArray(),'values_');
        var result =[];
        for(var i=0;i<props.length;i++) {
            var prop = props[0];

            result.push({
                layoutName :prop.layoutName,
                geoId :prop.geoId,
                geometry :{
                    type: prop.geometry.getType(),
                    coordinates : prop.geometry.getCoordinates()
                }
            });
        }
        return result;

    },


    onClick : function(coordinates){

        var me = this;
        me.gisContainer.fireEvent('click',me.gisContainer,coordinates);
    },
    onSelect : function(layoutName,geoId,geometry){


        var me = this;
        if(me.selected==true) {
            me.gisContainer.fireEvent('select', me.gisContainer, layoutName, geoId, geometry);
        }
    },
    onDeselect : function(coordinates){
        var me = this;
        if(me.selected==false && me.getSelection().length>0){
            me.gisContainer.fireEvent('deselect',me.gisContainer,coordinates);
        }
    },
    addSelectInteraction:function(){
        var me = this;
        var selectEvent = new ol.interaction.Select();
        me.removeInteraction('draw');
        me.addInteraction('select',selectEvent);

        var selectFeatures = selectEvent.getFeatures();

        selectFeatures.on('add', function (event) {

            var data = event.element.getProperties();

            var layoutName = data.layoutName;
            var geoId = data.geoId;
            var geometry =  {
                type: data.geometry.getType(),
                coordinates : data.geometry.getCoordinates()
            };
            me.onSelect(layoutName,geoId,geometry);
        });

    },
    startDraw: function(geomType,layoutName,geoId){

        var me=this;

        var layout = this.gisContainer.getLayer(layoutName);


        var drawEvent = new ol.interaction.Draw({
            source: layout.getSource(),
            type: geomType
        });
        me.removeInteraction('select');
        me.removeInteraction('draw');
        me.addInteraction('draw',drawEvent);


     //   me.gisContainer.fireEvent('drawstart',geomType,layoutName,id);

        drawEvent.on('drawend', function (event) {




            var featureId = me.gisContainer.getFeatureId(this.layoutName,this.geoId);

            event.feature.setId(featureId);
            event.feature.setProperties({
                layoutName: layoutName,
                geoId : geoId
            });

            var geometry = me.gisContainer.getGeometry(layoutName,geoId);



         //   me.gisContainer.fireEvent('drawend',this.geomType,this.layoutName,this.geoId);
            me.addSelectInteraction();

        },{
            geomType : geomType,
            layoutName: layoutName,
            geoId : geoId
        });
    },
    onMoidfy: function () {

    }


});