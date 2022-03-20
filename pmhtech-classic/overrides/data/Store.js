/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.overrides.data.Store', {
    override: 'Ext.data.Store',

    requires: [
        'Ext.data.Model'
    ],

    findCount : function(fieldName,value){
      var store = this;

      var count = 0;
      for(var i=0;i<store.getCount();i++){
          var rec = store.getAt(i);
          if(rec.get(fieldName)==value){
              count= count+1;
          }
      }
      return count;
    },
    copyRecords : function(){
        var me = this;
        var datas = [];
        for(var rec of me.data.items){

            var data = rec.copy();
            delete data.id;
            datas.push(Ext.create('Eznwell.data.Model',data));
        }
        return datas;
    },

    copy: function () {
        var me = this;



        var datas = [];
        me.each(function(r){


            var data = r.copy();
            delete data.id;
            datas.push(data);
        });

        var store = Ext.create(this.$className,{
            data : datas
        });
        return store;
    },
    loadRawData : function(data,append){
        var me = this;

        me.callParent(arguments);

        if(me.getProxy() && me.getProxy().type=='memory'){

            me.fireEvent('load',me);
        }
    }
});