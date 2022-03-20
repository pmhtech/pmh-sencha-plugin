Ext.define('PmhTech.container.photo.PhotoContainer', {
    alias: ['widget.pmh-photo-container', 'widget.photo-container'],
    extend: 'Ext.panel.Panel',
    fileIdProperty: '',
    data: {
        downloadUrl: '',
    },
    trashIcon: true,

    constructor: function (config) {
        var me = this;
        config.tpl = ['<div style="position:relative;height: 100%;">',
            '<tpl if="this.isExist(values)">',
            '<div style="border:1px solid gray;width:{[this.getWidth()]};height:{[this.getHeight()]}; background: url({downloadUrl}) center no-repeat; background-size: contain">',
            '</div>',
            '<div id="{[this.getId(values)]}" class="pmh-photo">',
            '<div class="pmh-icon-trash"></div>',
            '</div>',
            // '<i id="{[this.getId(values)]}" class="x-fa fa-trash-alt" style="position:relative;top: -65px;left: 20px;font-size: 35px;cursor:pointer;visibility:hidden"></i>',
            '</tpl>',
            '</div>',
            {

                getHeight: function () {
                    return me.height + 'px';
                },
                getWidth: function () {
                    return me.width + 'px';
                },
                isExist: function (values) {

                    if (values.downloadUrl) {
                        return true;
                    }
                    return false;
                },
                getId: function (values) {


                    var id = Ext.id();
                    Ext.defer(function (values) {

                        var el = Ext.get(this.id);


                        if(!el){
                            return null;
                        }
                        el.on('click', function () {

                            var fileIdProperty = me.fileIdProperty;
                            var fileId = this.values[fileIdProperty];

                            me.fireEvent('itemremoveclick', me, fileId);

                        }, this);
                    }, 100, {
                        id: id,
                        values: values

                    });
                    return id;

                }
            }]

        me.callParent([config])

    },

    afterRender: function (data) {

        var me = this;

        me.callParent(arguments);
    },

    sdf: [
        '<div style="position:relative;height: 100%;">',
        '<tpl if="this.isExist(values)">',
        '<img src="{downloadUrl}" draggable="false" style="position:relative;width: 100%;border:1px solid gray;height:100%">',
        '<i id="{[this.getId(values)]}" class="x-fa fa-trash-alt" style="position:relative;top: -65px;left: 20px;font-size: 35px;cursor:pointer;visibility:hidden"></i>',
        '</tpl>',
        '</div>',
        {
            isExist: function (values) {

                if (values.downloadUrl) {
                    return true;
                }
                return false;
            },
            getId: function (values) {


                var me = this;
                var id = Ext.id();
                Ext.defer(function (values) {

                    var el = Ext.get(this.id);
                    el.setVisible(me.scope.trashIcon);

                    el.on('click', function () {

                        var fileIdProperty = me.scope.fileIdProperty;
                        var fileId = this.values[fileIdProperty];

                        me.scope.fireEvent('itemremoveclick', me.scope, fileId);

                    }, this);

                }, 50, {
                    id: id,
                    values: values

                });
                return id;

            }
        }]

});