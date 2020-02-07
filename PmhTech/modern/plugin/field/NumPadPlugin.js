
Ext.define('PmhTech.plugin.field.NumPadPlugin', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.pmhnumpad',
    /**
     * 
     * @returns {{side: string, padding: number, items: *[], listeners: {element: string, tap: cfg.listeners.tap, touchstart: cfg.listeners.touchstart, touchend: cfg.listeners.touchend}}}
     */
    createNumPad: function () {
        var me = this;

        var cfg = {
            side: 'bottom',
            padding : 0,
            items: [{
                xtype: 'component',
                data: {
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4,
                    five: 5,
                    six: 6,
                    seven: 7,
                    eight: 8,
                    nine: 9
                },
                tpl: [
                    '<div class="numpad-area">',
                    '<div class="numpad-num"><p>{one}</p></div>',
                    '<div class="numpad-num"><p>{two}</p></div>',
                    '<div class="numpad-num" style="border-right-width:1px;"><p>{three}</p></div>',

                    '<div class="numpad-num"><p>{four}</p></div>',
                    '<div class="numpad-num"><p>{five}</p></div>',
                    '<div class="numpad-num" style="border-right-width:1px;"><p>{six}</p></div>',

                    '<div class="numpad-num" ><p>{seven}</p></div>',
                    '<div class="numpad-num" ><p>{eight}</p></div>',
                    '<div class="numpad-num" style="border-right-width:1px;"><p>{nine}</p></div>',

                    '<div class="numpad-icon" style="border-bottom-width:1px;">',
                        '<div class="numpad-reset"></div>',
                    '</div>',
                    '<div class="numpad-num" style="border-bottom-width:1px;"><p>0</p></div>',
                    '<div class="numpad-icon" style="border-bottom-width:1px;border-right-width:1px;">',
                        '<div class="numpad-back"></div>',
                    '</div>',

                    '</div>']
            }],
            listeners : {
                element: 'element',
                tap : function(e,target){
                    var value = me.field.getValue()|| '';

                    var input = '';
                    value= value+'';
                    value = value.replace(/[^0-9]/g,"");

                    var cls = e.target.classList[0];

                    var currentTarget =(cls=='numpad-num' || cls=='numpad-icon') ? e.target : e.target.parentElement;
                    var className = currentTarget.classList[0];



                    if(className=='numpad-num'){
                        var input =currentTarget.innerText.trim();



                        me.field.setValue(value+input);
                    }
                    else if(className=='numpad-icon'){

                        if(currentTarget.innerHTML.indexOf('numpad-back')!=-1){
                            if(value.length!=0){
                                input = value.substr(0,value.length-1);
                                me.field.setValue(input);

                            }
                        }else if(currentTarget.innerHTML.indexOf('numpad-reset')!=-1){
                            me.field.setValue(null);
                        }


                    }
                },
                touchstart : function(e,target){

                    var cls = e.target.classList[0];
                    var currentTarget =(cls=='numpad-num' || cls=='numpad-icon') ? e.target : e.target.parentElement;

                    var className = currentTarget.classList[0];
                    currentTarget.className= className+' '+className+'-press';
                },
                touchend : function(e,target){


                    var cls = e.target.classList[0];
                    var currentTarget =(cls=='numpad-num' || cls=='numpad-icon') ? e.target : e.target.parentElement;
                    var className = currentTarget.classList[0];
                    currentTarget.className= className;

                }
            }
        };


        return cfg;

    },
    getRawValue: function(){


        var value = this.field.getValue();
        var rawData = value.replace(/[^0-9]/g,"");
        return rawData;

    },


    init: function (field) {
        var me = this;


        me.field = field;

        field.setReadOnly(true);
        field.getRawValue= Ext.Function.bind(me.getRawValue,me);






        this.numPadArea = Ext.Viewport.setMenu(this.createNumPad(), {
            side: 'bottom'
        });


        field.addListener('painted',function(thisField){

            thisField.el.on('click',function(el){
                Ext.Viewport.setMenu(me.numPadArea, {
                    side: 'bottom',
                    cover: true
                });

                Ext.Viewport.toggleMenu('bottom');

            });
        });
    }
});
