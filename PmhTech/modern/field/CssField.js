Ext.define('PmhTech.field.CssField',{
    alias : 'widget.pmh-cssfield',
    extend : 'Ext.Container',
    style : 'align-items: center;',

    fontSize : 10,
    size : 42,
    width : null,
    height : null,
    defaultStyle : {
        width : 45,
        height : 45,
        borderColor : 'red',
        background : 'transparent',
        fontSize : '',
        margin: '0 auto;'
    },
    selectStyle : {
        width : 45,
        height : 45,
        borderColor : 'red',
        background : 'transparent',
        fontSize : '',
        margin: '0 auto;'
    },
    value :false,
    data :{
        superInputValue : null,
        superScript : null,
        superScriptColor : null
    },



    tpl :[

        '{[this.showSuperScript(values)]}',
        '<div class="x-cssfield" style="cursor: pointer;margin:{margin} border:1px solid {borderColor}; color:{color};background:{background};width:{width};height:{height};line-height:{lineHeight};font-size:{fontSize};border-radius:{borderRadius};text-align: center;">',
        '{text}',
        '</div>'
        ,{
            showSuperScript: function(values){

                var name = values.superScript;

                if(name){
                    var color = values.superScriptColor;
                    if(!color){
                        color = 'black'
                    }
                    return Ext.String.format('<div style="text-align:center;color:{0};">{1}</div>',color,name);
                }
                return '';
            }
        }
    ],
    initialize : function(){
        var me = this;


        me.callParent(arguments);

        me.on('painted',function(){

            me.changeColor(me.getValue());
            me.bodyElement.dom.style.width='100%';
            me.bodyElement.dom.style.height='100%';
            me.bodyElement.on('click',function(){
                me.setValue(!me.getValue());
                me.fireEvent('change',me,me.getValue,!me.getValue());
            });
        });
    },
    setValue: function(value){
        this.value = value;
        this.changeColor(value);
    },
    getValue : function(value){
        return this.value;
    },
    changeColor : function(value){
        var me = this;
        var data ={
            text : me.text,
            superInputValue  : me.superInputValue,
            superScript      : me.superScript,
            superScriptColor : me.superScriptColor
        };


        Ext.apply(data,me.defaultStyle);
        switch(me.cssType){
            case 'circle' :
                data.width = data.width||'11.428vw' ;
                data.height = data.height||'11.428vw' ;
                data.lineHeight = data.lineHeight||'11.428vw' ;
                data.margin = data.margin||'0 auto;' ;
                break;
            case 'square' :
                data.lineHeight = data.height;
                data.margin = data.margin;
                break;
        }


        if(me.cssType=='circle'){
            data.borderRadius='50%';
        }else{
            data.borderRadius='0%';
        }
        if(value===true){
            Ext.apply(data,me.selectStyle);
        }


        me.setData(data);

    }


});