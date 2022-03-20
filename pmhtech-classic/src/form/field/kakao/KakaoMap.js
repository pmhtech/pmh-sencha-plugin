Ext.define('PmhTech.form.field.kakao.KakaoMap',{
    alias : ['widget.pmh-kakao-map','widget.kakao-map'],
    extend : 'Ext.container.Container',
    address : null,
    data : {
        address : null
    },
    initComponent : function(){
        var me = this;

        Ext.apply(me,{
            tpl :[
                '<div id="{[this.getId(values)]}" style="height:100%"></div>'
            ,{
                getId : function(values){


                    var id = Ext.id();

                    Ext.defer(function(){

                        var mapOption = {
                            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                            level: 3 // 지도의 확대 레벨
                        };

                        var mapContainer = Ext.get(this.mapId).dom;
                        var markerName = this.markerName;

                        // 지도를 생성합니다
                        var map = new kakao.maps.Map(mapContainer, mapOption);

                        // 주소-좌표 변환 객체를 생성합니다
                        var geocoder = new kakao.maps.services.Geocoder();

                        // 주소로 좌표를 검색합니다
                        geocoder.addressSearch(this.address, function(result, status) {

                            // 정상적으로 검색이 완료됐으면
                            if (status === kakao.maps.services.Status.OK) {

                                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                                // 결과값으로 받은 위치를 마커로 표시합니다
                                var marker = new kakao.maps.Marker({
                                    map: map,
                                    position: coords
                                });

                                // 인포윈도우로 장소에 대한 설명을 표시합니다
                                var infowindow = new kakao.maps.InfoWindow({
                                    content: '<div style="width:150px;text-align:center;padding:6px 0;">'+markerName+'</div>'
                                });
                                infowindow.open(map, marker);

                                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                                map.setCenter(coords);
                            }
                        });

                    },150,{
                        me : this,
                        mapId : id,
                        address : values.address,
                        markerName : values.markerName
                    });
                    return id;

                }}]
        });
        me.callParent(arguments);
    },
    setMapData: function(mapData){
        var me = this;
        me.setData({
            address :mapData.address,
            markerName : mapData.markerName
        });
    },
    mapRefresh : function(){

    }
});