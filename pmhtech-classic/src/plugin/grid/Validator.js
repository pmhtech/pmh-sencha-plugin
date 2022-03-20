/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.plugin.grid.Validator', {
    extend: 'Ext.AbstractPlugin',
	alias: 'plugin.pmh-grid-validator',
    mixins :[

        'Ext.mixin.Bindable'
    ],


    /**
     * @cfg {String}
     * ErrorMessage Format 설정</br>
     *  {0} : rowIndex
     *  {1} : fieldLabel
     *  {2} : errorMessage
     */
    validateStartRow: 0,
    errorFormat : '[{0}행] <span style="font-weight:400">[{1}]</span> {2}',
    init: function (grid) {
        var me = this;
        me.grid = grid;
        me.grid.isValidGrid = Ext.Function.bind(me.isValidGrid,me);
        me.grid.getColumnError = Ext.Function.bind(me.getColumnError,me);


        var customValidator = me.customValidator;

        if(me.customValidator){
            if(Ext.isString(me.customValidator)){
                customValidator = me.grid.controller[me.customValidator];

            }
            me.grid.customValidator = Ext.Function.bind(customValidator,me);
        }
    },

    /**
     *
     *  입력된값과 Combobox의 Value가 일치하는지 확인하는 함수
     *
     * @returns {String}
     * @param value
     * @param rowIdx {Number}
     * @param editor
     * @returns {String|null} errorMessage 리턴 오류가 없을경우 null 리턴
     */
    getComboError : function(value,rowIdx,editor){

        var error = null;
        var valueField = editor.valueField;
        if(editor.isXType('combobox') && editor.forceSelection===true){

            if(editor.getStore().findRecord(valueField,value)==null){
                error= '코드값이 잘못되었습니다.';
            }
        }
        return error;
    },
    getDefaultError: function(value,rowIdx,editor){
        return editor.getErrors(value||null)[0];
    },

    getCustomError: function(value, rowIdx, editor, store, grid){

        var me = this;
        if(Ext.isFunction(me.grid.customValidator)){

            var error = me.grid.customValidator(value, rowIdx, editor, store, grid);
            return error;
        }
        return null;
    },


    getErrorMessage : function(rowIdx,fieldLabel,error){
        var me = this;
        if(error){
            return Ext.String.format(me.errorFormat, rowIdx+1,fieldLabel, error);
        }
        return null;
    },


    getColumnError : function(value, rowIdx, editor,  store, grid){
        var me = this;
        if(me.validateStartRow>rowIdx){
            return null;
        }

        if(!editor){
            return null;
        }


        var fieldLabel = editor.fieldLabel;
        var error = me.getComboError(value,rowIdx,editor);
        error = me.getErrorMessage(rowIdx,fieldLabel,error);
        if (error) {
            return error;
        }

        error = me.getDefaultError(value,rowIdx,editor);
        error = me.getErrorMessage(rowIdx,fieldLabel,error);
        if (error) {
            return error;
        }

        error = me.getCustomError(value, rowIdx, editor, store, grid);
        error = me.getErrorMessage(rowIdx,fieldLabel,error);
        if (error) {
            return error;
        }
        return null;

    },


    /**
     *  Grid의 Validation 체크를 한다.
     * @returns {String|Boolean}  오류가 존재한느경우 ErrorMessage 그렇지않을경우 true
     */
    isValidGrid:function(){

        var me = this;
        var grid = me.grid;
        var store = grid.getStore();

        var columns = grid.query('[dataIndex]');
        var totalErrors = [];

        for(var rowIdx=me.validateStartRow;rowIdx<store.getCount();rowIdx++) {

            var rec = store.getAt(rowIdx);

            var rowErrors = [];


            for (var j = 0; j < columns.length; j++) {





                var column = columns[j];

                var editor=null;

                if(column.isXType('widgetcolumn')){
                    editor = column.getWidget(rec);

                }else if(Ext.isFunction(column.getEditor)){
                    editor = column.getEditor();
                }


                if (!editor) {
                    continue;
                }
                editor.fieldLabel = column.text;
                var value = rec.data[column.dataIndex];
                var error = this.getColumnError(value, rowIdx, editor,  store, grid);

                if(error){
                    rowErrors.push(error);
                }
            }

            if(rowErrors.length>0){
                totalErrors.push(rowErrors);
            }
        }

        var result = [];
        for(var i=me.validateStartRow;i<totalErrors.length;i++){

            var rowErrorCount = totalErrors[i].length;
            var message = totalErrors[i][0];


            if(rowErrorCount>=2){

                message = Ext.String.format('{0} <span style="font-weight:400">외 ({1}건</span>)' ,message,rowErrorCount-1);
            }
            result.push(message);
        }

        return result.join('</br>');
    },

});