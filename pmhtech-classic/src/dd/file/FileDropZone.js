/**
 *
 */
Ext.define('PmhTech.dd.file.FileDropZone', {
    extend: 'Ext.container.Container',
    alias: ['widget.pmh-file-drop-zone'],
    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    files: [],
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
        me.on({
            element: 'el',
            drop: me.drop,
            dragstart: me.addDropZone,
            dragenter: me.addDropZone,
            dragover: me.addDropZone,
            dragleave: me.removeDropZone,
            dragexit: me.removeDropZone,
            scope : me
        });


    },
    afterRender: function(){

        var me = this;


        var text =[
            '<div class="pmh-file-drop-zone">',
                '<div class="pmh-file-drop-text">* 파일을 드래그해주세요.</div>',

                '<span style="margin: 10px -49px 0" class="pmh-file-drop-image"></span>',

            '</div>'
            ];
        var html = text.join('');
        me.setHtml(html);
        me.callParent(arguments);

    },
    noop: function (e) {
        e.stopEvent();
    },

    addDropZone: function (e) {
        var thisView = this;
        if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
            return;
        }

        e.stopEvent();

        thisView.addCls('drag-over');
    },

    removeDropZone: function (e) {
        var el = e.getTarget(),
            thisView = this,
            thisEl = this.el;


        e.stopEvent();


        if (el === thisEl.dom) {
            thisView.removeCls('drag-over');
            return;
        }

        while (el !== thisEl.dom && el && el.parentNode) {
            el = el.parentNode;
        }

        if (el !== thisEl.dom) {
            thisView.removeCls('drag-over');
        }

    },

    drop: function (e) {
        var me = this;
        e.stopEvent();
        var files = e.browserEvent.dataTransfer.files || [];
        if (files) {
            me.fireEvent('dropfiles', me, files);
            me.removeCls('drag-over');
        }
    }
});