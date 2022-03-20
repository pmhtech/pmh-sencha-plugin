/**
 *
 */
Ext.define('PmhTech.plugin.dd.DragDropReorderPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.drag-drop-reorder',

    requires: [
        'Ext.dd.DragZone',
        'Ext.dd.DropZone'
    ],
    init: function(comp) {
        this.comp = comp;
        var me = this;
        comp.addListener('afterrender',me.onAfterRender,comp);
        this.callParent(arguments);
    },
    onAfterRender : function(){
        var thisComp = this;

        // Locate the panel title and use this for drag source
        var dragSource = this.getEl();
        var dropTarget = this.getEl();

        var dragZone = new Ext.dd.DragZone(dragSource, {
            getDragData: function (e) {
                var sourceEl = e.getTarget();
                var parentComp =thisComp.ownerCt;

                var  d;
                if (sourceEl) {

                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    var itemIdx = parentComp.items.findIndex('id', this.id);

                    var el = Ext.fly(sourceEl);
                    return {
                        ddel: d,
                        sourceEl: sourceEl,
                        repairXY: el.getXY(),
                        comp: thisComp,
                        parentComp: parentComp,
                        itemIdx: itemIdx
                    }
                }
            },
            getRepairXY: function () {
                return this.dragData.repairXY;
            }
        });

        var dropZone = new Ext.dd.DropZone(dropTarget, {
            getTargetFromEvent: function (e) {
                var cmp =Ext.get(this.id).component;

                return cmp;
            },
            onNodeEnter: function (target, dd, e, data) {},
            onNodeOut: function (target, dd, e, data) {

                thisComp.removeCls('my-panel-highlight');
            },

            onNodeOver: function (target, dd, e, data) {
                var itemIdx = data.parentComp.items.findIndex('id',this.id);
                if (itemIdx === data.itemIdx) {
                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                }

                thisComp.addCls('my-panel-highlight');
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            onNodeDrop: function (target, dd, e, data) {
                var itemIdx = data.parentComp.items.findIndex('id',this.id);
                var parentComp = data.parentComp;


                if (itemIdx === data.itemIdx) {
                    return false;
                }

                var reorder = {};
                for (var x = 0; x < parentComp.items.getCount(); x++) {
                    reorder[x] = x;
                }

                thisComp.removeCls('my-panel-highlight');

                var fromIdx = data.itemIdx;
                var toIdx = itemIdx;

                reorder[fromIdx] = toIdx;
                reorder[toIdx] = fromIdx;

                parentComp.items.reorder(reorder);
                parentComp.updateLayout();
                thisComp.fireEvent('afternodedrop',thisComp);
                return true;
            }

        });
    }
});