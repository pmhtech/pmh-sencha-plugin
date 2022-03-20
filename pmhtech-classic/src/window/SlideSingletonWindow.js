/**
 *
 *
 * SingleTone 방식으로 Window를 생성시켜줍니다.
 *
 */
Ext.define('PmhTech.window.SlideSingletonWindow', {
    extend: 'PmhTech.window.SingletonWindow',
    alias: ['widget.pmh-slide-singleton-window','widget.slide-singleton-window'],

    requires: [
        'PmhTech.utils.Form',
        'PmhTech.utils.Msg'
    ],
    ui : 'singleton-window',
    maximizable: true,
    showHideDuration : 500,
    resizable: false,
    draggable: false,
    y: 108,
    x: window.innerWidth,
    modal: false,
    showLoadMask : true,
    viewModel : {},
    initComponent: function () {
        var me = this;
        me.height = window.innerHeight -(me.y+4);

        me.callParent(arguments);
        me.addListener('beforeshow',me.onAddBeforeShow);
        me.addListener('show',me.onAddShow);
        me.addListener('hide',me.onAddHide);
        me.addListener('hidecollapse',me.onHideCollapse);

    },
    afterRender : function(){

        var me = this;
        Ext.getBody().addListener('mousedown',function(e){


            Ext.defer(function(){
                var slideSingleTone = Ext.ComponentQuery.query('slide-singleton-window[hidden=false]')[0];
                if(slideSingleTone && slideSingleTone.completeShow===true && slideSingleTone.ignoreCollapse==false){
                    var mouseX = e.pageX;
                    var mouseY = e.pageY;


                    var startX =slideSingleTone.getPosition()[0];
                    var endX = startX+slideSingleTone.getWidth();
                    var startY =slideSingleTone.getPosition()[1];
                    var endY =slideSingleTone.getPosition()[1];


                    var isFocusX =!(startX<mouseX && endX>mouseX);
                    var isFocusY =!(startY<mouseY && endY>mouseY);
                    var visibleWindow = Ext.ComponentQuery.query('singleton-window[hidden=false]').length>=2
                    var visibleMessageBox = Ext.ComponentQuery.query('messagebox[hidden=false]').length==1;

                    if(isFocusX && isFocusY && !visibleWindow && !visibleMessageBox){

                        slideSingleTone.fireEvent('hidecollapse');
                    }
                }

                if(slideSingleTone){
                    Ext.defer(function(){
                        slideSingleTone.ignoreCollapse=false;
                    },50);
                }


            },100);

        });

        Ext.getBody().addListener('resize',function(){

            var slideWindow = Ext.ComponentQuery.query('slide-singleton-window[hidden=false]')[0];
            if(slideWindow){

                var x =window.innerWidth-slideWindow.getWidth();
                slideWindow.setHeight(window.innerHeight -(slideWindow.y+2));
                slideWindow.setX(x);
                slideWindow.focus();
            }
        });
        me.callParent(arguments);

    },

    onAddHide : function(){
        var me = this;
        me.completeShow=false;
    },
    onAddShow : function(){
        var me =this;
        me.setLoading(true);


    },
    onAddBeforeShow : function(){
        var me = this;

        var width = me.width;
        var windowWidth = window.innerWidth;

        Ext.create('Ext.fx.Anim', {
            target : me,
            duration: me.showHideDuration,
            from: {
                y : 110,
                width : width,
                x: windowWidth,
            },
            to: {
                y : 110,
                width : width,
                x: windowWidth -width,
            },
            callback : function(){
                me.fireEvent('showanim');
                me.completeShow=true;
            }
        });
        return true;
    },

    hideAnim: function () {

        var me = this;
        var width = me.width;

        Ext.create('Ext.fx.Anim', {
            target: me,
            duration: me.showHideDuration,
            to: {
                y: 104,
                width: width,
                x: window.innerWidth,
            },
            from: {
                y: 104,
                width: width,
                x: window.innerWidth - width,
            },
            callback : function(){
                me.hide();
                me.completeShow=false;
            }
        });
    },
    onHideCollapse: function () {


        var me = this;
        var forms = me.query('form');

        var isDirty = forms.length == 0 ? false : PmhTech.Form.isDirty(forms);
        if (!isDirty) {
            me.hideAnim();
            return;
        }
        me.completeShow=false;
        PmhTech.Msg.confirm('확인', '입력중인 데이터가 존재합니다.<br>창을 닫으시겠습니까?', {
            yesFunc: function(){
                me.hideAnim();
            },
            noFunc: function () {
                me.completeShow=true;
            }
        });
    }
});