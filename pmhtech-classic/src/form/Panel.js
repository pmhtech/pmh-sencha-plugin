/**
 *
 */
Ext.define('PmhTech.form.Panel', {
    extend: 'Ext.form.Panel',
    alias: ['widget.pmh-form', 'widget.pmh-formpanel'],

    requires: [
        'PmhTech.plugin.form.DirtyChecker',
        'PmhTech.plugin.form.ReadOnly',
        'PmhTech.plugin.form.Validator'
    ],
    bodyStyle:{},
    trackResetOnLoad: false,
    initComponent: function () {





        var me = this;
        var plugins =[
            {
                ptype: 'pmh-form-validator'
            }, {
                ptype: 'pmh-form-dirty-checker'
            }, {
                ptype: 'pmh-form-readonly'
            }
        ];

        if(me.frameColor===true){
            me.bodyStyle['background'] = '#F1F1F1';
        }
        me.plugins = me.plugins || [];
        me.plugins= plugins.concat(me.plugins);

        me.callParent(arguments);
    },
    forceReset: function() {
        var me = this;
        me.getForm().reset(true);

        var items = me.getForm().getFields().items
        for(var i=0;i<items.length;i++){
            var field= items[i];
            field.resetToInitialValue();
            field.fireEvent('reset',field);

        }
    }
});