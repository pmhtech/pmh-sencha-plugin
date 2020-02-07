Ext.define('PmhTech.override.chart.legend.SpriteLegend', {
    override: 'Ext.chart.legend.SpriteLegend',

    isXType: function (xtype) {
        return xtype === 'sprite';
    },


    getItemId: function () {
        return this.getId();
    }
});