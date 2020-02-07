/**

 사용가이드

 최초 app.js 상에서


 GlobalTask와 StaticTask란 ??

 GlobalTask : App 전체적으로 광역적으로 써야하는경우
 StaticTask : 특정화면에서 종속적으로 써야하는경우

 stopAllTask : StaticTask 전체 실행중지 : Ext.Route beforehandler에 정의하면 될것같음..


 PmhTech.util.TaskUtil.setStaticTask({
 		'STACK1_TASK' : null,
 		'STACK2_TASK' : null,
 		'STACK3_TASK' : null,
 });

 PmhTech.util.TaskUtil.setGlobalTask({
 		'GLOBAL1_TASK' : null,
 		'GLOBAL2_TASK' : null,
 		'GLOBAL3_TASK' : null,
 });

 PmhTech.util.TaskUtil.initTask();


 왜 이름을 미리 등록하고 사용하냐면... 태스크 타이핑 실수를 방지하기 위하여 정의하였습니다.
 실제로.. 스케줄러이름 잘못 만들어서 계속 만들거나 제어가 안되면 App이 죽습니다.(메모리초과로 인하여)



 //매 3초마다 실행하는 Task 등록
 PmhTech.util.TaskUtil.registerTask('STACK1_TASK',function(){ console.log('AAAA)},this,3000);


 //태스크시작
 PmhTech.util.TaskUtil.start('STACK1_TASK');

 //태스크중지
 PmhTech.util.TaskUtil.stop('STACK1_TASK');


 // GlobalTask 를 제외한 모든 Task멈춤
 PmhTech.util.TaskUtil.stopAllTask();



 */
Ext.define('PmhTech.util.TaskManager', {
    alternateClassName : ['PmhTech.TaskManager'],
    extend     : 'Ext.Base',
    singleton  : true,
    initTask: function (taskInfo) {
        PmhTech.TaskInfo = {};

        PmhTech.TaskInfo = taskInfo;

        var globalScopeName = '';
        Ext.iterate(taskInfo.GLOBAL_TASK,function(key,value){
            globalScopeName=key;
            
        });
        
        
        

        var scope = Ext.ComponentQuery.query(globalScopeName)[0];

        var globalTask = PmhTech.TaskInfo.GLOBAL_TASK[globalScopeName];

        Ext.iterate(globalTask, function (key, value) {
            var taskName = key;
            PmhTech.TaskManager.createGlobalTask(taskName, scope);
        });
        
        
    },

    /**
     * @public
     *  Task 생성
     * @param {String} taskName Task 이름
     * @param {String} taskFunction 생성 콜백 함수
     * @param {String} scope 콜백 함수 scope
     * @param {String} delay task 수행 주기
     *
     */
    
    createLocalTask : function(taskName, scope){
        
        var taskType = 'PAGE_TASK';
        this.createTask(taskType, taskName, scope);
        
    },
    createGlobalTask : function(taskName, scope){
        var taskType = 'GLOBAL_TASK';
        this.createTask(taskType, taskName, scope);
        
        
    },

    getTaskFunc :function(taskName){
        return taskName.substr(5);

    },
    getTaskDelay : function(taskName){
        return parseInt(taskName.substr(1,3));

    },


    createTask: function (taskType, taskName, scope) {

        var taskInfo = PmhTech.TaskInfo;

        var widgetName = scope.xtype || scope.getView().xtype;

        if (taskInfo[taskType][widgetName][taskName]) {
            var task = taskInfo[taskType][widgetName][taskName];
            Ext.util.TaskManager.stop(task);
        }

        scope = scope.getController() || scope;

        var taskFuncName = this.getTaskFunc(taskName);




        var task = Ext.util.TaskManager.newTask({
            run: scope[taskFuncName],
            interval: this.getTaskDelay(taskName) * 1000,
            scope: scope
        });
        console.log(taskType + ' CREATE TASK : ' + taskName);


        taskInfo[taskType][widgetName][taskName] = task;
    },

    /**
     * @public
     *  Task 시작
     * @param {String} taskName Task 이름
     * @param {Boolean} 시작 여부
     *
     */
    getRealTaskName : function(taskType,widgetName,taskName){

        var pageTask = PmhTech.TaskInfo[taskType][widgetName];
        var realTaskName = null;

        Ext.iterate(pageTask,function(key,value){

            if(key.indexOf(taskName)!=-1){
                realTaskName = key;
            }
        });

        return realTaskName;
    },

    getLocalTask : function(taskName, scope){


        var widgetName = scope.xtype || scope.type;

        return this.getTask('PAGE_TASK',widgetName,taskName);

    },
    getGlobalTask : function(taskName){

        return PmhTech.TaskManager.getTask('GLOBAL_TASK','global-main',taskName);
    },



    getTask : function(taskType,widgetName,taskName){

      var realTaskName = this.getRealTaskName(taskType,widgetName,taskName);
      return PmhTech.TaskInfo[taskType][widgetName][realTaskName];

    },

    startTask: function (taskType,widgetName,realTaskName,scope,taskName) {

        if(!PmhTech.TaskInfo[taskType][widgetName]){
            return false;
        }

        var task = PmhTech.TaskInfo[taskType][widgetName][realTaskName];

        if(task && task.stopped===true){
            Ext.util.TaskManager.start(task);
            Ext.callback(taskName,task.scope,[]);
            console.log('TASK START : ' + taskName);
            return true;
        }
        return false;
    },
    stopTask: function (taskType,widgetName,realTaskName,scope,taskName) {

        var task = PmhTech.TaskInfo[taskType][widgetName][realTaskName];
        if(task){
            Ext.util.TaskManager.stop(task);
            console.log('TASK STOP : ' + taskName);
            return true;
        }
        return false;
    },


    startLocalTask : function(taskName,scope){
        var widgetName = scope.xtype || scope.getView().xtype;
        var realTaskName = this.getRealTaskName('PAGE_TASK',widgetName,taskName);
        this.startTask('PAGE_TASK',widgetName,realTaskName,scope,taskName);
    },


    stopLocalTask : function(taskName,scope){

        var widgetName = scope.xtype || scope.getView().xtype;
        var realTaskName = this.getRealTaskName('PAGE_TASK',widgetName,taskName);
        this.stopTask('PAGE_TASK',widgetName,realTaskName,scope,taskName);
    },

    startGlobalTask : function(taskName,scope){

        var widgetName = scope.xtype || scope.getView().xtype;


        var realTaskName = this.getRealTaskName('GLOBAL_TASK',widgetName,taskName);
        this.startTask('GLOBAL_TASK',widgetName,realTaskName,scope,taskName);
    },
    stopGlobalTask : function(taskName,scope){

        var widgetName = scope.xtype || scope.getView().xtype;
        var realTaskName = this.getRealTaskName('GLOBAL_TASK',widgetName,taskName);
        this.stopTask('GLOBAL_TASK',widgetName,realTaskName,scope,taskName);
    }
});