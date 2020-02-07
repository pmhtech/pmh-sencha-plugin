Ext.define('PmhTech.IconButton', {
    alias: 'widget.pmh-iconbutton',
    extend: 'Ext.Button',


    initialize : function(){
        var me = this;

        me.callParent(arguments);
        
        me.on('painted',function(button){

            var arrowEl = button.el.down('.x-arrow-el');

            if (arrowEl) {
                arrowEl.remove();
            }

        });
    }
    
    
});



