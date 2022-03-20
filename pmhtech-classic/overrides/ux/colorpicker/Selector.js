Ext.define('PmhTech.overrides.ux.colorpicker.Selector', {
    override: 'Ext.ux.colorpick.Selector',
    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Base',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.ux.colorpick.ColorMap',
        'Ext.ux.colorpick.ColorPreview',
        'Ext.ux.colorpick.SliderAlpha',
        'Ext.ux.colorpick.SliderHue',
        'Ext.ux.colorpick.SliderSaturation',
        'Ext.ux.colorpick.SliderValue'
    ],

    // Splits up view declaration for readability
    // "Map" and HEX/R/G/B fields
    getMapAndHexRGBFields: function(childViewModel) {
        var me = this,
            fieldMargin = { top: 0, right: me.fieldPad, bottom: 0, left: 0 },
            fieldWidth = me.fieldWidth;

        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 10 0 0',
            items: [
                // "MAP"
                {
                    xtype: 'colorpickercolormap',
                    reference: 'colorMap',
                    flex: 1,
                    bind: {
                        position: {
                            bindTo: '{selectedColor}',
                            deep: true
                        },
                        hue: '{selectedColor.h}'
                    },
                    listeners: {
                        handledrag: 'onColorMapHandleDrag'
                    }
                },
                // HEX/R/G/B FIELDS
                {
                    xtype: 'container',
                    layout: 'hbox',

                    defaults: {
                        labelAlign: 'top',
                        labelSeparator: '',
                        requireFlag : false,

                        onChange: function() {
                            // prevent data binding propagation if bad value
                            if (this.isValid()) {
                                // this is kind of dirty and ideally we would extend these fields
                                // and override the method, but works for now
                                Ext.form.field.Base.prototype.onChange.apply(this, arguments);
                            }
                        }
                    },

                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'HEX',
                        flex: 1,
                        bind: '{hex}',
                        margin: fieldMargin,
                        regex: /^#[0-9a-f]{6}$/i,
                        readonly: me.getHexReadOnly()
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'R',
                        bind: '{red}',
                        width: fieldWidth,
                        hideTrigger: true,
                        maxValue: 255,
                        minValue: 0,
                        margin: fieldMargin
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'G',
                        bind: '{green}',
                        width: fieldWidth,
                        hideTrigger: true,
                        maxValue: 255,
                        minValue: 0,
                        margin: fieldMargin
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'B',
                        bind: '{blue}',
                        width: fieldWidth,
                        hideTrigger: true,
                        maxValue: 255,
                        minValue: 0,
                        margin: 0
                    }]
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and H field
    getSliderAndHField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;

        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'colorpickersliderhue',
                    reference: 'hueSlider',
                    flex: 1,
                    bind: {
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onHueSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'H',
                    requireFlag : false,
                    labelAlign: 'top',
                    labelSeparator: '',
                    bind: '{hue}',
                    hideTrigger: true,
                    maxValue: 360,
                    minValue: 0,
                    margin: 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and S field
    getSliderAndSField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;

        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: {
                right: me.fieldPad,
                left: me.fieldPad
            },
            items: [
                {
                    xtype: 'colorpickerslidersaturation',
                    reference: 'satSlider',
                    flex: 1,
                    bind: {
                        saturation: '{saturation}',
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onSaturationSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    requireFlag : false,
                    fieldLabel: 'S',
                    labelAlign: 'top',
                    labelSeparator: '',
                    bind: '{saturation}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    margin: 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and V field
    getSliderAndVField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;

        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'colorpickerslidervalue',
                    reference: 'valueSlider',
                    flex: 1,
                    bind: {
                        value: '{value}',
                        hue: '{selectedColor.h}'
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onValueSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'V',
                    requireFlag : false,
                    labelAlign: 'top',
                    labelSeparator: '',
                    bind: '{value}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    margin: 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and A field
    getSliderAndAField: function(childViewModel) {
        var me = this,
            fieldWidth = me.fieldWidth;

        return {
            xtype: 'container',
            viewModel: childViewModel,
            cls: Ext.baseCSSPrefix + 'colorpicker-escape-overflow',
            width: fieldWidth,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: {
                left: me.fieldPad
            },
            items: [
                {
                    xtype: 'colorpickerslideralpha',
                    reference: 'alphaSlider',
                    flex: 1,
                    bind: {
                        alpha: '{alpha}',
                        color: {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    },
                    width: fieldWidth,
                    listeners: {
                        handledrag: 'onAlphaSliderHandleDrag'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'A',
                    requireFlag : false,
                    labelAlign: 'top',
                    labelSeparator: '',
                    bind: '{alpha}',
                    hideTrigger: true,
                    maxValue: 100,
                    minValue: 0,
                    margin: 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Preview current/previous color squares and OK and Cancel buttons
    getPreviewAndButtons: function(childViewModel, config) {
        // selected color preview is always shown
        var items = [{
            xtype: 'colorpickercolorpreview',
            flex: 1,
            bind: {
                color: {
                    bindTo: '{selectedColor}',
                    deep: true
                }
            }
        }];

        // previous color preview is optional
        if (config.showPreviousColor) {
            items.push({
                xtype: 'colorpickercolorpreview',
                flex: 1,
                bind: {
                    color: {
                        bindTo: '{previousColor}',
                        deep: true
                    }
                },
                listeners: {
                    click: 'onPreviousColorSelected'
                }
            });
        }

        // Ok/Cancel buttons are optional
        if (config.showOkCancelButtons) {
            items.push({
                    xtype: 'button',
                    text: 'OK',
                    margin: '10 0 0 0',
                    padding: '10 0 10 0',
                    handler: 'onOK'
                },
                {
                    xtype: 'button',
                    text: 'Cancel',
                    margin: '10 0 0 0',
                    padding: '10 0 10 0',
                    handler: 'onCancel'
                });
        }

        return {
            xtype: 'container',
            viewModel: childViewModel,
            width: 70,
            margin: '0 0 0 10',
            items: items,
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        };
    }
});
