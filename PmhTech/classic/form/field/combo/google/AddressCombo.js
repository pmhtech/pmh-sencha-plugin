Ext.define('PmhTech.form.field.combo.google.AddressCombo',{
    extend : 'Ext.form.field.ComboBox',
    alias : 'widget.pmh-google-addr-combo',
    label: 'Choose State',
    queryMode: 'remote',
    displayField: 'address',
    valueField: 'address',
    minChars: 1,
    initComponent : function(){
        var me = this;
        Ext.apply(me,{
            store : Ext.create('Ext.data.Store',{
                fields : [
                    {name : 'address', convert : function(v,rec){
                            if(rec.data){
                                rec.data.address= rec.data.description.split(' ').slice(1).join(' ')
                            }
                            return rec.data.address;
                        }
                    }
                ],
                proxy: {
                    type: 'ajax',
                    method : 'GET',
                    url: frontHost+'/map/location/address',
                },
                listeners : {
                    beforeload : function( store, operation){

                        PmhTech.Ajax.request({
                            url : frontHost+'/map/location/address',
                            method : 'GET',
                            params : {
                                input : me.getRawValue()
                            },
                            success : function(resObj){
                                me.store.loadRawData(resObj.predictions);
                                me.expand();
                            }

                        });
                        return false;
                    }
                }
            }),
        });


        me.callParent(arguments);
    },
   tpl :  [
        '<tpl for=".">',
            '<div class="x-boundlist-item pac-item">',
                '<span class="pac-icon"><i class="fa fa-map-marker" style="zoom: 160%;"></i></span>',
                    '<span class="pac-item-query">',
                            '{[this.mainText(values,\'main_text\')]}' ,
                    '<span class="pac-secondary">',
                            '{[this.mainText(values,\'secondary_text\')]}',
                    '</span>',
                '</span>',
            '</div>',
        '</tpl>',
        {
            mainText : function(values,type){

                var formatText = values.structured_formatting;

                if(!formatText){
                    return;
                }

                var mainText = formatText[type];

                var matchArr = formatText[type+'_matched_substrings'] ||[];
                var matchTxt =[];
                for(var i=0;i<matchArr.length;i++){
                    var pos = matchArr[i];
                    matchTxt.push(mainText.substr(pos.offset,pos.length));
                }

                for(var i=0;i<matchTxt.length;i++){

                    var matchStr= matchTxt[i];
                    var result ='<span class="pac-matched">'+matchStr+'</span>';

                    mainText=mainText.replace(new RegExp(matchStr,'gi'),result);
                }
                return mainText;

            }
        }
    ]
});