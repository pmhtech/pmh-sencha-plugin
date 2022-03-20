Ext.define('PmhTech.form.field.google.address.AddressCombo',{
    extend : 'Ext.form.field.ComboBox',
    alias : 'widget.pmh-google-addr-combo',

    requires: [
        'Ext.data.Store'
    ],
    label: 'Choose State',
    labelAlign : 'top',
    queryMode: 'local',
    displayField: 'addr',
    valueField: 'addr',
    longitude : null,
    latitude:null,
    forceSelection : true,
    displayTpl : ['{[this.convert(values)]}',{

        convert : function(values){
           return values.addr;
        }
    }],



    itemTpl : ['{[this.convert(values)]}',{

        convert : function(values){


            var input = this.scope.inputElement.getValue();
            input = input.substr(input.lastIndexOf(' ')+1);

            var length = input.length;

            var mainText = values.structured_formatting.main_text;
            var fullAddr = values.addr;

            var preMainText = mainText.substr(mainText.lastIndexOf(input),length);
            var suffxMainText = mainText.substr(length);



            var preaddr =  fullAddr.substr(0,fullAddr.lastIndexOf(mainText));

            var temp = fullAddr.substr(fullAddr.lastIndexOf(mainText));
            preaddr+=temp.substr(0,temp.lastIndexOf(input));
            var addr =temp.substr(temp.lastIndexOf(input),length);
            var suffixaddr = temp.substr(temp.lastIndexOf(input)+length);

            var tpl = [
                    '<div class="pac-item">',
                    '<span class="pac-icon"><i class="fa fa-map-marker" style="zoom: 160%;"></i></span>',
                    '<span class="pac-item-query">',
                    '<span class="pac-matched">{0}</span>{1}</span>',
                    '<span>{2} <span class="pac-matched">{3}</span>',
                    '{4}</span>',
                    '</div>'
            ];

            return Ext.String.format(tpl.join(''),preMainText,suffxMainText,preaddr,addr,suffixaddr);

        }
    }],
    store : Ext.create('Ext.data.Store',{
    fields : [{name : 'addr', convert : function(v,rec){

        if(Ext.isArray(rec.data.terms)){

            rec.data.addr = Ext.Array.slice(Ext.pluck(rec.data.terms,'value').reverse(),1).join(' ');
        }

        return rec.data.addr;


    }}],
    data : [{

    }]

    }),
    getLongitude: function(){
        return this.longitude;
    },
    getLatitude: function(){
        return this.latitude;
    },

    setLongitude:function(longitude){
        this.longitude=longitude;
    },

    setLatitude:function(latitude){
        this.latitude=latitude;
    },

    listeners : {
        keyup : function(comp,e,text){
            var me = this;





            if(e &&e.isSpecialKey()){
                return;
            }

            var value = comp.inputElement.getValue() || text;

            if(value){

                var serarchObj = {
                    input: value,
                    componentRestrictions :{country : 'kr'}
                };



                comp.autoCompleteService.getPlacePredictions(serarchObj, function(predictions, status){


                    if(predictions){

                        comp.getStore().loadRawData(predictions);
                        if(Ext.isString(text)){


                            comp.setValue(predictions[0].addr);

                        }else{
                            if(!comp.expanded){
                                comp.onExpandTap();
                            }
                        }
                    }

                });
            }
        },
        select : function(combo,rec,events){




            var me = this;
            if(rec.data.place_id){

                me.placesService.getDetails({
                    placeId: rec.data.place_id
                }, function (place, status) {
                    me.latitude= place.geometry.location.lat();
                    me.longitude= place.geometry.location.lng();
                    me.placeId = rec.data.place_id;

                    combo.collapse();
                });
            }


        },
        painted : function(comp){

            comp.getItemTpl()[1].scope = comp;

            comp.getPicker().setItemConfig(null);

            comp.autoCompleteService = new google.maps.places.AutocompleteService();
            comp.placesService = new google.maps.places.PlacesService(document.getElementById('map'));
            comp.geoCoder = new google.maps.Geocoder;

            if(comp.latitude && comp.longitude){

                comp.geoCoder.geocode({'location':{lat :comp.latitude, lng : comp.longitude}
                },function(results,status){

                    var text = results[0].formatted_address;
                    comp.placeId=results[0].place_id;

                    comp.fireEvent('keyup',comp,null,text);
                });
            }
        }
    }
});