/**
 *
 */
Ext.define('PmhTech.widget.square.PmhSquareWidget', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.pmh-square-widget', 'widget.pmh-square'],
    initComponent : function(){
        var me = this;

        Ext.apply(me,{
            padding : 10,
            tpl :[
                '<div class="pmh-square">',
                    '{[this.getCss(values)]}',
                '</div>',
                {
                    getCss :function(values){

                        var current = values.current;
                        var maxDeg = values.maxDeg;
                        var minDeg = values.minDeg;
                        var unit = values.unit;

                        var rangeCss = 'allow-text';

                        if(current<minDeg){
                            rangeCss = 'min-text';
                        }else if(current>maxDeg){
                            rangeCss = 'max-text';
                        }

                        var result =Ext.String.format('<div class="text {0} ">{1} ({2})</div>',rangeCss,current,unit);

                        return result;
                    },
                }
            ],
        });

        me.callParent(arguments);

    }
});
