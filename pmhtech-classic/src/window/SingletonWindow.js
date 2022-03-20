/**
 *
 *
 * SingleTone 방식으로 Window를 생성시켜줍니다.
 *
 */
Ext.define('PmhTech.window.SingletonWindow', {
    extend: 'Ext.window.Window',
    alias : ['widget.pmh-singleton-window','widget.singleton-window'],
    ui : 'singleton-window',
    autoShow : false,
    requires: [
        'Ext.layout.container.VBox'
    ],
    padding : '0 20 0 20 0',
    border : false,
    viewModel : {},
    frame : false,
    autoRender: true,
    hidden : true,
    modal: true,
    width: 800,
    closable: true,
    closeAction: 'hide',
    floating: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    }
});