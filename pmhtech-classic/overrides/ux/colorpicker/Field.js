Ext.define('PmhTech.overrides.ux.colorpicker.Field',{
    override : 'Ext.ux.colorpick.Field',
    renderTo: Ext.getBody(),
    beforeBodyEl: [
        '<div class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch ssp-color-picker-swatch">' ,
        '<div id="{id}-swatchEl" data-ref="swatchEl" class="' + Ext.baseCSSPrefix ,
        'colorpicker-field-swatch-inner"></div>' ,
        '</div>'
    ],

})