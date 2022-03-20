/**
 *
 */
Ext.define('PmhTech.plugin.openlayer.Interaction', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-openlayer-interaction',
    selectable : false,
    init : function(gisContainer){
        var me = this;
        me.gisContainer= gisContainer;

        me.gisContainer.initInteraction = Ext.Function.bind(me.initInteraction, me);
        me.gisContainer.addSelectInteraction = Ext.Function.bind(me.addSelectInteraction, me);
        me.gisContainer.getSelection = Ext.Function.bind(me.getSelection, me);
        me.gisContainer.startDraw = Ext.Function.bind(me.startDraw, me);
        me.gisContainer.select = Ext.Function.bind(me.select, me);
        me.gisContainer.startModify = Ext.Function.bind(me.startModify, me);
        me.gisContainer.isSelected=  Ext.Function.bind(me.isSelected, me);
        me.gisContainer.getInteraction =  Ext.Function.bind(me.getInteraction , me);
        me.gisContainer.removeInteraction=Ext.Function.bind(me.removeInteraction , me);


    },
    interaction:{
        select : null,
        modify : null,
        draw : null
    },

    /**
     * 지도상의 Geometry 선택유무
     * @returns {boolean}
     */
    isSelected: function(){
        var me = this;
      return me.selectable;
    },

    /**
     * OpenLayer의 Interaction Mode 가져오기
     *
     * @returns {string}
     */
    getInteraction : function(){

        var me = this;
        if(me.interaction.modify){
            return 'modify';
        }
        if(me.interaction.draw){
            return 'draw';
        }
        if(me.interaction.select){
            return 'select';
        }


    },

    /**
     * Open Layer Interaction 초기화
     */
    initInteraction : function(){

        var me =this;
        var openLayer = me.gisContainer.openLayer;


        /**
         * Single Click시 실행
         */
        openLayer.on('singleclick', function (evt) {


            var mode = me.getInteraction();

            if(mode=='modify'){
                return;
            }

            var coordinate = evt.coordinate;


            // EPSG:3857 - Google Mercator
            // EPSG:4326 - WGS84 경위도
            me.gisContainer.data.clickPosition = coordinate;

            me.selectable=false;
            var layerName = null;

            /**
             *  Feature가 선택될때 Layer이름 을 설정
             */
            openLayer.forEachFeatureAtPixel(
                evt.pixel,
                function (feature, layer) {
                    if(layer){

                        if(layerName!=null){
                            return;
                        }
                        me.selectable=true;
                        layerName = layer.get('name');
                    }
                }
            );


            me.onClick(coordinate,layerName);

            me.onDeselect(coordinate);



        });

    },
    /**
     * Open Layer의 interaction 을 제거한다.
     * @param eventName
     */
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

    /**
     * 지도상에 선택된 모든 폴리건을 가져온다.
     * @returns {[]}
     */
    getSelection: function(){
        var me = this;

        var props = Ext.pluck(me.interaction.select.getFeatures().getArray(),'values_');
        var result =[];
        for(var i=0;i<props.length;i++) {
            var prop = props[0];

            result.push({
                layerName :prop.layerName,
                geoId :prop.geoId,
                geometry :{
                    type: prop.geometry.getType(),
                    coordinates : prop.geometry.getCoordinates()
                }
            });
        }
        return result;

    },


    /**
     *
     * 지도를 클릭했을때 Event
     *
     * @param coordinates
     * @param layerName
     */
    onClick : function(coordinates,layerName){

        var me = this;
        me.gisContainer.fireEvent('click',me.gisContainer,coordinates,layerName);
    },

    select : function(datas){
      var me = this;


      var selectEvent = me.interaction.select;
      var features =[];

      for(var i=0;i<datas.length;i++){
          var layerName = datas[i].layerName;
          var geoId = datas[i].geoId;
          var featureId = me.gisContainer.getFeatureId(layerName,geoId);
          var feature = me.gisContainer.getLayer(layerName).getSource().getFeatureById(featureId);
          selectEvent.getFeatures().push(feature)
          features.push(feature);

      }

    },

    /**
     * 폴리건 선택시 Event
     * @param layerName
     * @param geoId
     * @param geometry
     */

    onSelect : function(layerName,geoId,geometry){


        var me = this;
        if(me.selectable==true) {
            me.gisContainer.fireEvent('select', me.gisContainer, layerName, geoId, geometry);
        }
    },

    /**
     * 폴리건 선택해재시 Event
     * @param layerName
     * @param geoId
     * @param geometry
     */
    onDeselect : function(coordinates){
        var me = this;
        if(me.selectable==false && me.getSelection().length>0){
            me.gisContainer.fireEvent('deselect',me.gisContainer,coordinates);
        }
    },
    addSelectInteraction:function(){
        var me = this;
        var selectEvent = new ol.interaction.Select();
        me.removeInteraction('draw');
        me.removeInteraction('modify');
        me.addInteraction('select',selectEvent);

        var selectFeatures = selectEvent.getFeatures();

        selectFeatures.on('add', function (event) {

            var data = event.element.getProperties();

            var layerName = data.layerName;
            var geoId = data.geoId;
            var geometry =  {
                type: data.geometry.getType(),
                coordinates : data.geometry.getCoordinates()
            };
            me.onSelect(layerName,geoId,geometry);
        });

    },

    startModify: function(){
        var me = this;

        me.removeInteraction('draw');

        var features = me.interaction.select.getFeatures();
        features.on('add',function(event){

            var feature = event.element;



        });

        var modifyEvent = new ol.interaction.Modify({
            features: features,
            // delete vertices by pressing the SHIFT key
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        me.addInteraction('modify',modifyEvent);


    },
    /**
     *
     * @param geomType  {Polygon Type}
     * @param layerName {Layout이름}
     * @param geoId     {Feature Id}
     */
    startDraw: function(geomType,layerName,geoId){

        var me=this;

        var layout = me.gisContainer.getLayer(layerName);


        var drawEvent = new ol.interaction.Draw({
            source: layout.getSource(),
            type: geomType
        });
        me.removeInteraction('select');
        me.removeInteraction('draw');
        me.addInteraction('draw',drawEvent);


     //   me.gisContainer.fireEvent('drawstart',geomType,layerName,id);

        /**
         * Draw 완료시 실행
         */
        drawEvent.on('drawend', function (event) {




            var featureId = me.gisContainer.getFeatureId(this.layerName,this.geoId);

            event.feature.setId(featureId);
            event.feature.setProperties({
                layerName: layerName,
                geoId : geoId
            });

            me.addSelectInteraction();

        },{
            geomType : geomType,
            layerName: layerName,
            geoId : geoId
        });
    },
});