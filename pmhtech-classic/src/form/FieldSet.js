/**
 *
 */
Ext.define('PmhTech.form.FieldSet',{
    extend : 'Ext.panel.Panel',
    alias : 'widget.pmh-fieldset',

    requires: [
        'Ext.form.field.Base',
        'Ext.layout.container.Column'
    ],
    cls : 'pmh-fieldset',
    margin: '0 0 0 0',
    frame : true,
    header : {
        style : {
            borderColor : 'transparent'
        }
    },
    bodyStyle :{
        background : 'var(--panel-frame-color)'
    },
    layout: {
        type: 'column'
    },
    defaultCfgs: {
        columnWidth : .333,
        labelWidth: 70,
        margin: '5 10 5 0'
    },
    bodyPadding: '10 0 10 15',

    initComponent : function(){
        var me = this;

        if(Ext.isEmpty(me.title)){
            me.header = false;
            me.bodyStyle['borderRadius']='5px';
        }

        me.defaults = Ext.apply(Ext.clone(me.defaultCfgs),me.defaults);

        // me.addListener('resize',me.onAddResize,me);
        me.callParent(arguments);
    },

    onAddResize : function(){
        var me =this;
        var width = me.getWidth();
        var redraw = false;
        var minWidth = Ext.form.field.Base.minWidth;
        for(var i=0; i<me.items.items.length; i++){
             var item =me.items.items[i]


            if(item.getWidth()==minWidth){

                if(item.columnWidth!=.5){
                    item.columnWidth=.5;
                    redraw=true;

                }
            }
            if(item.columnWidth != item.oriColumnWidth){
                if(width>minWidth*(item.oriColumnWidth*10)){
                    item.columnWidth = item.oriColumnWidth;
                    redraw=true;
                }

            }
        }

        if(redraw){
            this.updateLayout();
        }

    }
});