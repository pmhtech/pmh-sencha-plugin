/**
 *
 */
Ext.define('PmhTech.overrides.grid.Panel',{
    override : 'Ext.grid.Panel',

    multiRowColumn : false,
    initComponent : function(){
        var me = this;
        me.callParent(arguments);
        me.addListener('afterrender',me.onAddAfterRender,me);
    },
    onAddAfterRender : function(){
        var me = this;
        var columns = me.getColumns() ||[] ;

        for(var i=0;i<columns.length;i++){
            var column = columns[i];
            var renderer =column.renderer;

            if(Ext.isFunction(renderer) && renderer.name=='numberRenderer'){
                column.align='right';
            }else if(Ext.isEmpty(column.align)){
                column.align='center';
            }
            if(me.multiRowColumn===true) {
                column.tdCls = 'x-grid-middle-align';
            }
        }
    }
});