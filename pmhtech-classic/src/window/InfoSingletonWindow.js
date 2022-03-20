/**
 *
 *
 * SingleTone 방식으로 Window를 생성시켜줍니다.
 *
 */
Ext.define('PmhTech.window.InfoSingletonWindow', {
    extend: 'PmhTech.window.SingletonWindow',
    alias: 'widget.pmh-info-singleton-window',
    modal: false,
    padding : 0,
    bodyPadding : 0,
    resizable: false,
    draggable: false,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addListener('resize',me.onAddResize);
        me.addListener('focusleave', me.onAddFocusLeave);

    },
    onAddResize : function(){


    },
    onAddFocusLeave : function(){
        var me = this;
        me.hide();
    }

});