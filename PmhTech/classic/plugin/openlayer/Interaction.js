Ext.define('PmhTech.plugin.openlayer.Interaction', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-openlayer-interaction',

    init : function(openLayer){
        var me = this;
        me.openLayer= openLayer;

        me.openLayer.addSelectInteraction = Ext.Function.bind(me.addSelectInteraction, me);
        me.openLayer.onDraw = Ext.Function.bind(me.onDraw, me);
    },
    interaction:{
        select : null,
        modify : null,
        draw : null
    },
    removeInteraction : function(eventName){
        var me = this;
        var openLayer =me.openLayer.openLayer;

        openLayer.removeInteraction(me.interaction[eventName]);

    },
    addInteraction : function(eventName,event){

        var me = this;
        var openLayer =me.openLayer.openLayer;

        me.interaction[eventName]=event;
        openLayer.addInteraction(event);

    },

    addSelectInteraction:function(){
        var me = this;
        var selectEvent = new ol.interaction.Select();
        me.removeInteraction('draw');
        me.addInteraction('select',selectEvent);

        var selectFeatures = selectEvent.getFeatures();

        selectFeatures.on('add', function (event) {
            var asdf = me;
            var props = event.element.getProperties();

            me.openLayer.getGeometry(props.layoutName,props.geoId);


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
        me.addInteraction('draw',drawEvent);


        me.openLayer.fireEvent('drawstart',geomType,layoutName,id);

        drawEvent.on('drawend', function (event) {


            var featureId = me.openLayer.getFeatureId(this.layoutName,this.geoId);

            event.feature.setId(featureId);
            event.feature.setProperties({
                layoutName: layoutName,
                geoId : geoId
            })
            me.openLayer.fireEvent('drawend',this.geomType,this.layoutName,this.geoId);
            me.addSelectInteraction();

        },{
            geomType : geomType,
            layoutName: layoutName,
            geoId : geoId
        });
    },


});