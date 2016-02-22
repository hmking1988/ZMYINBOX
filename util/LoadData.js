jQuery.sap.declare("accenture.com.ui.zmyinbox.util.LoadData");
accenture.com.ui.zmyinbox.util.LoadData = {
    /*
        This util funciton group is designed to contain gateway service here 
        1.to maske sure the this app can be adapt both gateway data from both ECC and BPM;
        2.to leverage the promise function in jQuery to avoid so-called "call-back pyramid";
    
    */
    //help function to load Process Track Data
    loadPTData : function(query,IsFromCache){
        /*
            query: {
                    query: query string for onlymark,
                    IStarted: track processes which I started
                    sDate: start date
                    eDate: end date
            }
            IsFromCache: load data from cache if true
        */
        var oJsonModelTask;
        //load data from cache if any
        if(IsFromCache){
            if(query.iStarted){
                oJsonModelTask=sap.ui.getCore().getModel("ProcessTrackJsonS");
            }else{
                oJsonModelTask=sap.ui.getCore().getModel("ProcessTrackJsonR");
            }
            if(oJsonModelTask){
                sap.ui.getCore().setModel(oJsonModelTask);
                return;
            }
            
        }
        if(!query.query){
            query.query="*";
        }
        if(!query.sDate){
            query.sDate="00000000"
        }
        if(!query.eDate){
            query.eDate="99999999"
        }
        var oModelTask = sap.ui.getCore().getModel("customAPI");
        oJsonModelTask = new sap.ui.model.json.JSONModel();
        var sPath="BPMMYHIS2Set/?$filter=((Startdate ge '"+query.sDate+"'and Startdate le '"+query.eDate+"') and ";
        if(query.iStarted){
            sPath=sPath+"(IStarted eq 'X' and Onlymark eq '"+query.query+"'))";
        }else{
            sPath=sPath+"(IReleased eq 'X' and Onlymark eq '"+query.query+"'))";
        }
        oModelTask.read(sPath,{
            success: function(data){
                oJsonModelTask.setData(data.results);
                //set cache for the tiles clicked in the overview page
                if(IsFromCache){
                    if(query.iStarted){
                        sap.ui.getCore().setModel(oJsonModelTask,"ProcessTrackJsonS");
                    }else{
                        sap.ui.getCore().setModel(oJsonModelTask,"ProcessTrackJsonR");
                    }                    
                }
                
                sap.ui.getCore().setModel(oJsonModelTask);
            }
        });
        return;
    },
    
    //help function to load Task List Data
    loadTLData : function(query,IsFromCache,Async){

        /*
            query: {
                    selectedTask: selected task type,
            }
            IsFromCache: load data from cache if true,
            Aysnc: in case, the caller wants to laod the data aysnc, a jquery promise will be returned.
                   the caller can resolved the json model or rejected the error event
        */
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
        var oODataJSONModel;
        if(IsFromCache){
            oODataJSONModel=sap.ui.getCore().getModel("TaskListJson");
            if(oODataJSONModel){
                sap.ui.getCore().setModel(oODataJSONModel);
                return;
            }
            
        }
        var oModel=sap.ui.getCore().getModel("standardAPI");
    	// read task collection via batch
    	oODataJSONModel = new sap.ui.model.json.JSONModel();
        oODataJSONModel.setDefaultBindingMode("TwoWay");
        var JSONDATA=[];
/*        var sPathReady="TaskCollection?$skip=0&$top=500&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27READY%27))&$inlinecount=allpages";
        var sPathReserved="TaskCollection?$skip=0&$top=500&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27RESERVED%27))&$inlinecount=allpages";		
    	var sPathInProcess="TaskCollection?$skip=0&$top=500&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27IN_PROGRESS%27))&$inlinecount=allpages";*/
//    	var sPathComplete="TaskCollection?$skip=0&$top=50&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27COMPLETED%27))&$inlinecount=allpages";
        //retrieve complete tasks within 30days or less than 100
	    var today=new Date();
	    var month=today.getMonth();
	    var year=today.getFullYear();
	    var date=today.getDate();
	    var startDate="";
	    if(date<10){
	        date="0"+date;
	    }
	    if(month<10){
	        month="0"+month;
	    }
	    if(month==0){
	        startDate=(year-1)+"12"+date;
	    }else{
	        startDate=year+"-"+month+"-"+date;
	    }
        var sPathComplete="TaskCollection?$skip=0&$top=100&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27COMPLETED%27)%20and%20CreatedOn%20ge%20datetime%27"+startDate+"T00:00:00%27)&$inlinecount=allpages"
    	var sPathNotComplete="TaskCollection/?$skip=0&$top=10010&$orderby=CreatedOn%20desc&$filter=((Status%20eq%20%27READY%27%20or%20Status%20eq%20%27RESERVED%27%20or%20Status%20eq%20%27IN_PROGRESS%27))&$inlinecount=allpages";
    	oModel.setUseBatch(true);
/*        var ReadyTasks=oModel.createBatchOperation(sPathReady, 'GET');
        var ReservedTasks=oModel.createBatchOperation(sPathReserved, 'GET');
        var InProcessTasks=oModel.createBatchOperation(sPathInProcess, 'GET');*/
        var CompleteTasks=oModel.createBatchOperation(sPathComplete, 'GET');
        var NotCompleteTasks=oModel.createBatchOperation(sPathNotComplete, 'GET');
    	//oModel.addBatchReadOperations([ReadyTasks,ReservedTasks,InProcessTasks,CompleteTasks]);
    	oModel.addBatchReadOperations([NotCompleteTasks,CompleteTasks]);
    	oModel.submitBatch(
    	    function(data, response){
    		    for(var i=0;i<data.__batchResponses.length;i++){
    		        if(data.__batchResponses[i].statusCode !== "200"){
    		            if(!bAsync){
         		            sap.m.MessageToast.show(data.__batchResponses[i].response.statusCode+":"+data.__batchResponses[i].response.statusText);
        		            continue;   		                
    		            }else{
    		                deferred.reject(data);
    		            }

    		        }
    		        if(data.__batchResponses[i].data.__count>0){
    		            var currentResults=data.__batchResponses[i].data.results;
    		            JSONDATA=JSONDATA.concat(currentResults);
/*    		            for(var j=0;j<currentResults.length;j++){
    		               JSONDATA.push(currentResults[j]); 
    		            }*/
    		        }
    		    }
    		    oODataJSONModel.setData(JSONDATA, true);
                //console.log(oODataJSONModel);
                oODataJSONModel.setSizeLimit(99999);
                sap.ui.getCore().setModel(oODataJSONModel,"TaskListJson")
                sap.ui.getCore().setModel(oODataJSONModel);
	            if(bAsync){
	                deferred.resolve(oODataJSONModel);
	            }
            }, 
            function(oEvent){
                if(bAsync){
                    deferred.reject(oEvent);
                }else{
                    sap.m.MessageToast.show(oEvent.response.statusCode+":"+oEvent.response.statusText);
                }
                
            },
            bAsync
        );
        if(bAsync){
            return deferred.promise();
        }else{
            return;
        }
        
        
    },
   
    /* help function to load Task Detail Data,including: 
           Custom Attributes, 
           Custom Attributes Definition, 
           UI Execution Link, 
           Decistion Option,
           Task History,
    */
   loadTDData : function(context,Async){
        /*
            context: binding context from 
            Aysnc: in case, the caller wants to laod the data aysnc, a jquery promise will be returned.
                   the caller can resolved the context or rejected the error event
        */
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
   
   
   
	    var TaskID=context.getProperty("InstanceID");
	    var TaskDefinitionID=context.getProperty("TaskDefinitionID");
	    //getting Custom Attributes Data
        var oModelCD = new sap.ui.model.odata.ODataModel("/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2", true);
        //sample data with 3 custom attributes
        var sPathCustomAttributesData="/TaskCollection(SAP__Origin='BPM',InstanceID='"+TaskID+"')/CustomAttributeData";
        var sPathCustomAttributesDefinition="/TaskDefinitionCollection(SAP__Origin='BPM',TaskDefinitionID='"+TaskDefinitionID+"')/CustomAttributeDefinitionData";
        var sPathUIExecutionLink="/TaskCollection(SAP__Origin='BPM',InstanceID='"+TaskID+"')/UIExecutionLink";
        var sPathDecisionOption="/DecisionOptions?SAP__Origin='BPM'&InstanceID='"+TaskID+"'";
        oModelCD.setUseBatch(true);
        var CAData=oModelCD.createBatchOperation(sPathCustomAttributesData, 'GET');
        var CADefinition=oModelCD.createBatchOperation(sPathCustomAttributesDefinition, 'GET');
        var UIELink=oModelCD.createBatchOperation(sPathUIExecutionLink, 'GET');
        var DecisionOption=oModelCD.createBatchOperation(sPathDecisionOption, 'GET',null,{"Content-Type":"application/json"});
        oModelCD.addBatchReadOperations([CAData,CADefinition,UIELink,DecisionOption]);
        var JsonData=[];
        /* TODO: 
            3/4-level callback pyramid is used here to leverage the aysnc function call;
            a better way to do this is: 
            1.using promise
            2.add asscosiation wherever necessary
            3.encapsule all http reques in one batch request
        */
        //query custom attributes data, defination and UI execution Link
		oModelCD.submitBatch(
		    function(data, response){
		        //hanle each batch response
    		    for(var i=0;i<data.__batchResponses.length;i++){
                    /*  the structure of the response is like below
                        body: string
                        data: Object
                        headers: Object
                        statusCode: "200"
                        statusText: "OK"
                    */
    		        if(data.__batchResponses[i].statusCode !== "200"){
    		            
    		            jQuery.sap.log.error("oData Model Batch Response Error:"+data.__batchResponses[i].response.statusCode+":"+data.__batchResponses[i].response.statusText);
    		            if(!bAsync){
         		            sap.m.MessageToast.show("获取待办详细信息失败");
        		            return;  		                
    		            }else{
    		                deferred.reject(data);
    		            }
    		        }
    		    }

    		    //handle Custom Attributes Data
    		    JsonData=data.__batchResponses[0].data.results;
    		    var CDDList=data.__batchResponses[1].data.results;
    		    for(var i=0;i<JsonData.length;i++){
    		        for(var j=0;j<CDDList.length;j++){
    		            if(JsonData[i].Name==CDDList[j].Name){
    		                JsonData[i].Label=CDDList[j].Label
    		            }
    		        }
    		    }
    		    context.oModel.oData[context.sPath.substring(1)].oTaskCD=JsonData;
    		    
    		    //handle UI Execution Link
    		    context.oModel.oData[context.sPath.substring(1)].UIELink=data.__batchResponses[2].data.GUI_Link;
    		    //handle decision Option
    		    context.oModel.oData[context.sPath.substring(1)].DecisonOption=data.__batchResponses[3].data.results;

    		    //querying task history
                var oModelFL = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZBPMHIS_SRV", false);
                oModelFL.read("/BPMPROCINSTANCESet('"+TaskID+"')",
                            {
                                success: function(data){
                                    var ProcessID=data.ProInstanceid.substring(35);
                                        oModelFL.read("/BPMTASKHISSet?$filter=(ProInstanceid eq '"+ProcessID+"')",
                                            {
                                                success: function(data){
                                                    var currentTask=context.oModel.oData[context.sPath.substring(1)];
                                                    var ApproveList=data.results;
                                                    oModelFL.read("/BPMMYHIS2Set('"+ProcessID+"')",
                                                    {
                                                        success: function(data){
                                                            if(data.ProInstanceid){
                                                                ApproveList.unshift({
                                                                    ProInstanceid:ProcessID,
                                                                    Executiontime:data.Startdate,
                                                                    Approvestate:99,
                                                                    Approvememo:"我发起了流程。",
                                                                    Agentname:data.Authorname,                                 
                                                                    Agentid:data.Authorid
                                                                });
                                                            }
                                                            currentTask.oTaskHis=ApproveList;
                                        		            if(!bAsync){
                                            		            return currentTask;  		                
                                        		            }else{
                                        		                deferred.resolve(context);
                                        		            }
                                                        },
                                                        error: function(event){
                                        		            if(!bAsync){
                                             		            sap.m.MessageToast.show("获取待办详细信息失败");
                                            		            return;  		                
                                        		            }else{
                                        		                deferred.reject(event);
                                        		            }                                                    
                                                        }
                                                    });
                                                },
                                                error: function(event){
                                		            if(!bAsync){
                                     		            sap.m.MessageToast.show("获取待办详细信息失败");
                                    		            return;  		                
                                		            }else{
                                		                deferred.reject(event);
                                		            }                                                    
                                                }
                                            });
                                },
                                error: function(event){
                		            if(!bAsync){
                     		            sap.m.MessageToast.show("获取待办详细信息失败");
                    		            return;  		                
                		            }else{
                		                deferred.reject(event);
                		            }                                                    
                                }
                            });
            }, 
            function(oEvent){
                jQuery.sap.log.error("oData Batch Response Error:"+oEvent.response.statusCode+":"+oEvent.response.statusText);
	            if(!bAsync){
 		            sap.m.MessageToast.show("获取待办详细信息失败");
		            return;  		                
	            }else{
	                deferred.reject(oEvent);
	            }
            },
            bAsync
        );
        if(bAsync){
            return deferred.promise();
        }else{
            return context;
        }
   },
    
    //help function to load Task Definition Collection
    loadTDCData : function(Async){
        /*
            Aysnc: in case, the caller wants to laod the data aysnc, a jquery promise will be returned.
                   the caller can resolved the context or rejected the error event
        */
        var TDCData;
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
        var oModelCD = new sap.ui.model.odata.ODataModel("/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2", true);
        var sPath="TaskDefinitionCollection ";
        oModelCD.read(sPath,{async:bAsync,
            success: function(data){
                if(bAsync){
                    deferred.resolve(data);
                }else{
                    TDCData=data;
                    return data;
                }
            },
            error: function(evt){
                if(bAsync){
                    deferred.reject(evt);
                }else{
 		            sap.m.MessageToast.show("获取任务类型列表失败");
		            return;                    
                }
            }
        })
        if(bAsync){
            return deferred.promise();
        }else{
            return TDCData;
        }
    },
    
    //help function to load Decision Option Data
    loadDOData : function(TaskID,Async){
        /*
            TaskID: task instance ID
            Aysnc: in case, the caller wants to laod the data aysnc, a jquery promise will be returned.
                   the caller can resolved the context or rejected the error event
        */
        var DOData;
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
        var oModelCD = new sap.ui.model.odata.ODataModel("/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2", true);
        var sPath="/DecisionOptions?SAP__Origin='BPM'&InstanceID='"+TaskID+"'";
        oModelCD.read(sPath,{async:bAsync,
            success: function(data){
                if(bAsync){
                    deferred.resolve(data);
                }else{
                    DOData=data;
                    return data;
                }
            },
            error: function(evt){
                if(bAsync){
                    deferred.reject(evt);
                }else{
 		            sap.m.MessageToast.show("获取决策列表失败");
		            return;                    
                }
            }
        })
        if(bAsync){
            return deferred.promise();
        }else{
            return DOData;
        }
    },
    
    //help function to load user info
    loadUserInfoData : function(UniqueName,Async){
        /*
            UniqueName: unique name in BPM
            Aysnc: in case, the caller wants to laod the data aysnc, a jquery promise will be returned.
                   the caller can resolved the context or rejected the error event
        */
        var UserInfoData;
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
        var oModelCD = new sap.ui.model.odata.ODataModel("/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2", true);
        var sPath="UserInfoCollection(SAP__Origin='BPM',UniqueName='"+UniqueName+"')";
        oModelCD.read(sPath,{async:bAsync,
            success: function(data){
                if(bAsync){
                    deferred.resolve(data);
                }else{
                    UserInfoData=data;
                    return data;
                }
            },
            error: function(evt){
                if(bAsync){
                    deferred.reject(evt);
                }else{
 		            sap.m.MessageToast.show("获取用户信息失败");
		            return;                    
                }
            }
        });
        if(bAsync){
            return deferred.promise();
        }else{
            return UserInfoData;
        }
    },


    //help function to release task
    ReleaseTask : function(TaskID,Async){
        /*
            TaskID: task instance ID
            Aysnc: in case, the caller wants to post the data aysnc, a jquery promise will be returned.
                   the caller can resolved the context or rejected the error event
        */
        var DOData;
        var bAsync=false;
        var deferred = $.Deferred();
        if(Async){
            bAsync=true;
        }
        var oModelCD = new sap.ui.model.odata.ODataModel("/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2", true);
        var sPath="Release?SAP__Origin='BPM'&InstanceID='"+TaskID+"'";
        oModelCD.create(sPath,null,{async:bAsync,
            success: function(data){
                if(bAsync){
                    deferred.resolve(data);
                }else{
                    DOData=data;
                    return data;
                }
            },
            error: function(evt){
                if(bAsync){
                    deferred.reject(evt);
                }else{
 		            sap.m.MessageToast.show("释放任务失败");
		            return;                    
                }
            }
        })
        if(bAsync){
            return deferred.promise();
        }else{
            return DOData;
        }
    },
    
    //helo function to extract Task overview Data
    loadTaskOverviewData: function(){
        var oODataJSONModel=sap.ui.getCore().getModel("TaskListJson");
        var TaskList=oODataJSONModel.oData;
        var TaskOverview={};
        var TaskOverviewList=[];
        for(var i in TaskList){
            if(TaskOverview[TaskList[i].TaskDefinitionID]){
                TaskOverview[TaskList[i].TaskDefinitionID][TaskList[i].Status]++;
                if(TaskOverview[TaskList[i].TaskDefinitionID]["CreatedOn"]<TaskList[i]["CreatedOn"]){
                    TaskOverview[TaskList[i].TaskDefinitionID]["CreatedOn"]=TaskList[i]["CreatedOn"];
                    TaskOverview[TaskList[i].TaskDefinitionID].TaskDefinitionName=TaskList[i].TaskDefinitionName;
                }
            }else{
                TaskOverview[TaskList[i].TaskDefinitionID]={};
                TaskOverview[TaskList[i].TaskDefinitionID].RESERVED=0;
                TaskOverview[TaskList[i].TaskDefinitionID].READY=0;
                TaskOverview[TaskList[i].TaskDefinitionID].IN_PROGRASS=0;
                TaskOverview[TaskList[i].TaskDefinitionID].COMPLETED=0;
                TaskOverview[TaskList[i].TaskDefinitionID][TaskList[i].Status]++;
                TaskOverview[TaskList[i].TaskDefinitionID]["CreatedOn"]=TaskList[i]["CreatedOn"];
                TaskOverview[TaskList[i].TaskDefinitionID].TaskDefinitionName=TaskList[i].TaskDefinitionName;
            }
        }
        for(var obj in TaskOverview){
            TaskOverviewList.push({
                DefinitionId:    obj,
                ProcessName:     TaskOverview[obj].TaskDefinitionName,
                Ready:           TaskOverview[obj].READY,
                Reserved:        TaskOverview[obj].RESERVED,
                Complete:        TaskOverview[obj].COMPLETED,
                Inprocess:       TaskOverview[obj].IN_PROGRASS,
            })
        }
        var oJsonModelTaskOverview = new sap.ui.model.json.JSONModel();
        oJsonModelTaskOverview.setData({results:TaskOverviewList});
        sap.ui.getCore().setModel(oJsonModelTaskOverview,"OverViewData");
        
    },
};