/**
 *
 */
Ext.define('PmhTech.widget.slider.PmhSliderWidget', {
    extend: 'Ext.panel.Panel',
    alias : ['widget.pmh-slider-widget','widget.pmh-slider'],
    minHeight: 90,
    sliderTitle : '',
    sliderStyle : '',
    sliderSize : 140,
    initComponent : function(){
        var me = this;

        var suffix = '';

        if(me.vertical===true) {
            suffix = '-vertical';
        }


        Ext.apply(me,{
            data : {
                startValue: 0,
                endValue: 150,
                maxDeg: 50,
                minDeg: 30,
                current: 40
            },
            tpl : [

                '<div class="multi-bar'+suffix+'" style="width:'+me.sliderSize+'px;'+me.sliderStyle+'">',
                '<div class="multi-bar-marker-title">{[this.getTitle(values)]}</div>',
                '<div class="multi-bar-content">',
                '<div class="multi-bar-marker-content">',



                '<div class="multi-bar-marker marker-value" style="left:{[this.getBarWidth(\"current\",values)]}%;">',
                    '<div class="multi-bar-marker-value"></div>',

                    '<tpl if="values.current">',
                        '<div class="current-gauge-meter">',
                            '<div class="fa fa-caret-down"></div>',
                            '<p class="multi-bar-marker-value-label">{[this.getCurrent(values)]}</p>',
                        '</div>',
                    '</tpl>',
                '</div>',
                '</div>',

                '<div class="multi-bar-box">',
                '{[this.getRange(\"min-range\",values)]}',
                '{[this.getRange(\"allow-range\",values)]}',
                '{[this.getRange(\"max-range\",values)]}',
                '</div>',

                '<div class="multi-bar-value-content">',
                //'<div class="multi-bar-initVal">{startValue}</div>',
                '<div class="multi-bar-marker " style="left:{[this.getBarWidth(\"minDeg\",values)]}%;">',
                    '<div class="multi-bar-marker-value">' ,
                        '<div class="gauge-meter">',
                            '<div class="fa fa-caret-up"></div>',
                        '<tpl if="values.minDeg!=values.maxDeg">',
                            '<div class="bar-prefix">Min</div>',
                            '<div class="bar-value">{minDeg}<span>{unit}</span></div>',
                        '</tpl>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="multi-bar-marker" style="left:{[this.getBarWidth(\"current\",values)]}%;">',
                '<div class="indicator">|</div>',
                '</div>',

                '<div class="multi-bar-marker" style="left:{[this.getBarWidth(\"maxDeg\",values)]}%;">',
                    '<div class="multi-bar-marker-value">' ,
                        '<div class="gauge-meter">',
                            '<div class="fa fa-caret-up"></div>',
                            '<tpl if="values.minDeg!=values.maxDeg">',
                                '<div class="bar-prefix">Max</div>',
                            '<tpl else>',
                                '<div class="bar-prefix">기준치</div>',
                            '</tpl>',
                            '<div class="bar-value">{maxDeg}<span>{unit}</span></div>',
                        '</div>',
                    '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',

                ,{
                    getTitle : function(primaryPreset){
                        return me.sliderTitle;
                    },
                    getCurrent : function(values){

                        var current = parseInt(values.current ||0);
                        return current+values.unit;

                    },
                    getBarWidth : function(prefix,values){
                        var width =0;
                        var startValue = values.startValue; //50
                        var endValue = values.endValue- startValue;     //150

                        var minDeg = values.minDeg-startValue; //100
                        var maxDeg = values.maxDeg-startValue;
                        var current = values.current - startValue;

                        var minRange = minDeg/endValue;
                        var allowRange = (maxDeg-minDeg)/endValue;
                        var maxRange = 1-(minRange+allowRange);
                        switch(prefix){
                            case 'minDeg' :
                                width= minRange;
                                break;
                            case 'maxDeg' :
                                width= minRange+allowRange;
                                break;
                            case 'current':
                                width = current/endValue;

                                if(width<0){
                                    width=0;
                                }else if(width>1){
                                    width=1;
                                }
                                break;
                            case 'min-range' :
                                width= minRange;
                                break;
                            case 'allow-range' :
                                width= allowRange;
                                break;
                            case 'max-range' :
                                width= maxRange;
                                break;
                        }
                        return width*100;
                    },
                    getRange: function(prefix,values){


                        var clazzName = 'multi-bar-bar ' +prefix;

                        var width = this.getBarWidth(prefix,values);
                        return Ext.String.format('<div class="{0}" style="width:{1}%"></div>',clazzName,width);
                    }
                }]
        });
        me.callParent(arguments);

    }
});
