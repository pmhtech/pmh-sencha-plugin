Ext.define('PmhTech.window.file.PmhFileUploadWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pmh-fileupload-window',

    requires: [
        'PmhTech.utils.Msg'
    ],

    onShow : function(thisView){
        thisView.params = thisView.params || {};
        thisView.maxFileSize = thisView.params.maxFileSize || thisView.maxFileSize;

        thisView.maxFileCount =thisView.params.maxFileCount || thisView.maxFileCount;
        thisView.allowMimeType=thisView.params.allowMimeType || [];


        var store = thisView.down('grid').getStore();

        store.loadRawData(thisView.params.files);

        var multiple = thisView.maxFileCount==1 ? false : true;

        var multiFileField = thisView.down('multi-filefield');
        multiFileField.fileInputEl.set({ multiple: multiple });

    },
    onHide : function(thisView){
        thisView.uploadFiles=[];
        thisView.down('grid').getStore().removeAll();
    },


    onChangeFile : function(me,files){

        var thisView = this.getView();
        var store = this.getView().down('grid').getStore();
        var result = [];
        var fileCount = store.getCount()+files.length;

        if(files.length>thisView.maxFileCount){
            PmhTech.Msg.alert('확인','최대 '+thisView.maxFileCount+'개의 파일만 선택하세요.');
            return false;
        }
        if(fileCount>thisView.maxFileCount){
            PmhTech.Msg.alert('확인','최대 '+thisView.maxFileCount+'개의 파일만 업로드할수 있습니다.</br>기존 파일을 삭제후 다시 추가하세요.');
            return false;
        }



        var mimeType= thisView.allowMimeType ||[];

        mimeType= mimeType.join('|');

        for(var i=0;i<files.length;i++){
            var file = files[i];
            if(file.type.search(mimeType)==-1){
                PmhTech.Msg.alert('확인', '['+file.name+']은 업로드 할 수 없는 파일형식입니다.');
                return false;
            }
        }

        for(var i=0;i<files.length;i++){
            var file = files[i];

            var data ={
                originalName: file.name,
                fileSize : file.size,
                lastModified: file.lastModified
            }

            var findIdx = store.findBy(function(rec){

                if( rec.get('originalName')==data.name &&
                    rec.get('fileSize')==data.size      &&
                    rec.get('lastModified')==data.lastModified
                ){
                    return true;
                }
                return false;
            });
            if(findIdx==-1){
                store.add(data);
                thisView.uploadFiles.push(file);
            }
        }
    },
    onBtnDelete: function(button){
        var grid = this.getView().down('grid');
        var records = grid.getSelectionModel().getSelection();

        if(records.length==0){
            PmhTech.Msg.alert('확인','선택한 파일이 없습니다.');
            return false;
        }

        PmhTech.Msg.confirm('확인','선택한 파일을 업로드에서 제외시키겠습니까??',function(){
            grid.store.remove(records);
        })


    },
    onBtnCancel: function(button){
        this.getView().hide();
    },
    onBtnUploadFile : function(button){
        var thisView = this.getView();
        thisView.fireEvent('uploadfile',thisView,thisView.uploadFiles);
    }
});
