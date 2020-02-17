Ext.define('PmhTech.plugin.openlayer.Interaction', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-openlayer-interaction',

    init : function(openLayer){
        var me = this;
        me.openLayer= openLayer;

        me.openLayer.addSelectInteraction = Ext.Function.bind(me.addSelectInteraction, me);
        me.openLayer.getSelection = Ext.Function.bind(me.getSelection, me);
        me.openLayer.onDraw = Ext.Function.bind(me.onDraw, me);
        //me.openLayer.onModify = Ext.Function.bind(me.onModify, me);
    },
    interaction:{
        select : null,
        modify : null,
        draw : null
    },
    removeInteraction : function(eventName){
        var me = this;
        var openLayer =me.openLayer.openLayer;

        if(eventName=='select'){
            me.openLayer.isSelect=false;
        }

        openLayer.removeInteraction(me.interaction[eventName]);
        me.interaction[eventName]=null;

    },
    addInteraction : function(eventName,event){

        var me = this;
        var openLayer =me.openLayer.openLayer;

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
    addSelectInteraction:function(){
        var me = this;
        var selectEvent = new ol.interaction.Select();
        me.removeInteraction('draw');
        me.addInteraction('select',selectEvent);

        var selectFeatures = selectEvent.getFeatures();

        selectFeatures.on('add', function (event) {

            var props = me.getSelection();
            me.openLayer.isSelect=true;
            var data = event.element.getProperties();

            var layoutName = data.layoutName;
            var geoId = data.geoId;
            var geometry =  {
                type: data.geometry.getType(),
                coordinates : data.geometry.getCoordinates()
            };

            me.openLayer.fireEvent('select',layoutName,geoId,geometry);

        });

    },

    onDraw: function(geomType,layoutName,geoId){

        var me=this;

        var layout = this.openLayer.getLayer(layoutName);


        var drawEvent = new ol.interaction.Draw({
            source: layout.getSource(),
            type: geomType
        });
        me.removeInteraction('select');
        me.removeInteraction('draw');
        me.addInteraction('draw',drawEvent);


     //   me.openLayer.fireEvent('drawstart',geomType,layoutName,id);

        drawEvent.on('drawend', function (event) {




            var featureId = me.openLayer.getFeatureId(this.layoutName,this.geoId);

            event.feature.setId(featureId);
            event.feature.setProperties({
                layoutName: layoutName,
                geoId : geoId
            });

            var geometry = me.openlayer.getGeometry(layoutName,geoId);



         //   me.openLayer.fireEvent('drawend',this.geomType,this.layoutName,this.geoId);
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