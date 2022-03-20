Ext.define('PmhTech.window.upload.excel.upload.ExcelUploadWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.excel-upload-popup',

    requires: [
        'PmhTech.utils.Msg'
    ],
    onBtnSampleDownload : function(button){

        var grid = this.getView().down('#sampleGrid');
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Sheet1',
            fileName: this.getView().excel.fileName
        });
    },
    onBtnExcelDownload :function(button){

        var grid = this.getView().down('#excelGrid');
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Sheet1',
            fileName: this.getView().excel.fileName
        });
    },

    onExcelUpload : function(field,rawDatas){



        var grid = this.getView().down('#excelGrid');
        var store = grid.getStore();
        store.removeAll();
        var result = [];
        for(var i=0;i<rawDatas.length;i++){
            var rawData = rawDatas[i];

            var data = {};
            for(var key in rawData){
                var column = grid.down('[text='+key+']')

                if(!column){
                    PmhTech.Msg.alert('확인','업로드 양식이 잘못되었습니다.<br>양식을 다운로드 받고 난 뒤 진행하세요');
                    return;
                }
                var dataIndex = column.dataIndex;
                data[dataIndex]=rawData[key];
            }
            result.push(data);
        }

        store.loadRawData(result);

        this.getErrorMsgExcelGrid();

    },

    getErrorMsgExcelGrid :function(){

        var grid = this.getView().down('#excelGrid');
        return grid.isValidGrid();



    },
    onShow : function(comp){

        var columns = comp.excel.columns;
        var sample = comp.excel.samples;
        var excelValidator =comp.excel.validator;






        var excelGrid = comp.down('#excelGrid');
        var sampleGrid = comp.down('#sampleGrid');


        excelGrid.getStore().removeAll();
        sampleGrid.getStore().removeAll();

        excelGrid.reconfigure(columns);
        excelGrid.registerCustomValidator(excelValidator);


        sampleGrid.reconfigure(columns);

        sampleGrid.getStore().add(sample);
    },
    onBtnApply : function(button){

        var thisView = this.getView();
        var grid = thisView.down('#excelGrid');

        var names =['userId','userName'];





        var errorMsg = this.getErrorMsgExcelGrid();



        if(errorMsg.length>0){

            PmhTech.Msg.alert('확인',errorMsg);
            return;
        }

        //var submitData = grid.getSubmitData();

        var jsonList = grid.getDataValues(names);

        thisView.callbackFunc(thisView,submitData);

    },
    onBtnCancel : function(button){
        var thisView = this.getView();
        thisView.hide();
    }

});
