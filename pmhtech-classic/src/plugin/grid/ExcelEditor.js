/**
 *
 *
 *
 * Grid 에서 엑셀처럼 에디트 할수있는 플러그인
 *
 */
Ext.define('PmhTech.plugin.grid.ExcelEditor', {
	extend: 'Ext.grid.plugin.CellEditing',
	alias: 'plugin.pmh-grid-excel-editor',
	clicksToEdit : 1,
	listeners : {
		edit : function(editor,context){

			if(context.column.editor.vtype=='date'){
				var dataIndex = context.column.dataIndex;
				var record = context.record;
				var field = context.column.editor;

				var date = Ext.Date.parse(context.value,field.format);
				if(Ext.isDate(date)){
					var newVal = Ext.Date.format(date,field.submitFormat);
					record.set(dataIndex,newVal);
				}
			}
		}
	},

	onEditorKey: function (field, e) {
		var k = e.getKey(),
			newCell, g = this.grid,
			ed = g.activeEditor;
		var numberOfRows = grid.getStore().getCount();
		var maxrow = numberOfRows - 1;
		var shift = e.shiftKey;
		var last = g.lastEdit;
		if (k == e.TAB) {
			if (e.shiftKey) {
				var newrow = ed.row - 1;
				if (newrow < 0) {
					var newrow = maxrow;
				}
				newCell = g.walkCells(newrow, ed.col, -1, this.acceptsNav, this);
			}
			else {
				var newrow = ed.row + 1;
				if (newrow > maxrow) {
					var newrow = 0;
				}
				newCell = g.walkCells(newrow, ed.col, 1, this.acceptsNav, this);
			}
			e.stopEvent();
		}
		else if (k == e.ENTER) {
			var nexrow = last.row + 1;
			var prerow = last.row - 1;
			if (nexrow > maxrow) {
				var nexrow = 0;
			}
			if (prerow < 0) {
				var prerow = maxrow;
			}
			if (this.moveEditorOnEnter !== false) {
				if (shift) {
					newCell = g.walkCells(prerow, last.col, -1, this.acceptsNav, this);
				}
				else {
					newCell = g.walkCells(nexrow, last.col, 1, this.acceptsNav, this);
				}
			}
		}
		else if (k == e.ESC) {
			e.stopEvent();
			ed.cancelEdit();
			g.getView().focusCell(ed.row, ed.col);
		}
		else if (k == e.DOWN) {
			ed.completeEdit();
			e.stopEvent();
			var newrow = ed.row + 1;
			if (newrow > maxrow) {
				var newrow = 0;
			}
			newCell = g.walkCells(newrow, ed.col, 1, this.acceptsNav, this);
			ed.field.focus(true);
		}
		else if (k == e.UP) {
			ed.completeEdit();
			e.stopEvent();
			var newrow = ed.row - 1;
			if (newrow < 0) {
				var newrow = maxrow;
			}
			newCell = g.walkCells(newrow, ed.col, -1, this.acceptsNav, this);
			ed.field.focus(true);
		}
		if (newCell) {
			g.startEditing(newCell[0], newCell[1]);
		}
	}

});
