Ext.define('PmhTech.overrides.panel.Table',{
    override : 'Ext.panel.Table',
    bindStore: function(store, initial) {
      var me = this;
      me.callParent(arguments);

      if(me.getBind()){

          var bindStore = me.getBind().store.getValue();

          if(bindStore){
              if(store.id==bindStore.id){
                  me.fireEvent('storeready',me);
              }
          }else{
              me.fireEvent('storeready',me);
          }
      }else{
          me.fireEvent('storeready',me);
      }
    },
})