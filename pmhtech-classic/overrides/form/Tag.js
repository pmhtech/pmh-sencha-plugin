/**
 *
 */
Ext.define('PmhTech.overrides.form.Tag', {
    override: 'Ext.form.field.Tag',
    initComponent : function(){
        var me = this;

        me.callParent(arguments);
        me.addListener('beforequery',me.onAddBeforeQuery)


    },
    onAddBeforeQuery: function(queryPlan,eOpts){
        var me = this;
        var query = queryPlan.query;

        if(me.minChars<=query.length){
            return true;
        }
        return false;
    }
});
