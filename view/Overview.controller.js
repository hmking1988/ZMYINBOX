jQuery.sap.require("accenture.com.ui.zmyinbox.util.LoadData");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.HelperFunction");


sap.ui.controller("accenture.com.ui.zmyinbox.view.Overview", {
    onInit : function () {
        accenture.com.ui.zmyinbox.util.LoadData.loadTLData();
        accenture.com.ui.zmyinbox.util.LoadData.loadTaskOverviewData();
        //load user logon info
        var oModelUser= new sap.ui.model.json.JSONModel();
        oModelUser.loadData("/sap/bc/ui2/start_up");
        sap.ui.getCore().setModel(oModelUser,"UserModel");
        
        //bind auto logoff to close tab event
            $(window).bind('beforeunload', function(e) {
                $.ajax({
                    type:"POST",
                    url:accenture.com.ui.zmyinbox.util.HelperFunction.SystemRoute()+"/irj/servlet/prt/portal/prtroot/com.sap.portal.navigation.masthead.LogOutComponent?logout_submit=true",
                    async:false
                })
               $.ajax({
                   type: "GET",
                   url: "/sap/public/bc/icf/logoff?keepMYSAPSSO2Cookie=true",  //Clear SSO cookies: SAP Provided service to do that
                   aysnc:false,
                   success: function(data){
                        if (!document.execCommand("ClearAuthenticationCache")) {  
                             //"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
                             $.ajax({
                                           type: "GET",
                                           url: "/sap/opu/odata/SAP/ZBPMHIS_SRV/BPMMYHIS2Set/", //any URL to a Gateway service  
                                           username: 'dummy', //dummy credentials: when request fails, will clear the authentication header  
                                           password: 'dummy',
                                           async:false,
                                           statusCode: { 401: function() {  
                                                     //This empty handler function will prevent authentication pop-up in chrome/firefox  
                                           } },
                                           error: function() {
                                                //alert('reached error of wrong username password')
                                           }
                            });
                        }
                   }
                })
                return;
            });

        //add eventdelegate for onAfterShow so that the data will refresh everytime
	    var oView=this.getView();
	    oView.addEventDelegate({
	        onAfterShow: function(){
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
        	        startDate=year+""+month+""+date;
        	    }
                //set process tarck statistic data using jquery
                var sServiceUrl = "/sap/opu/odata/SAP/ZBPMHIS_SRV/";
                var oModel = new sap.ui.model.json.JSONModel();
                var startProcess = oView.byId("startProcess");
                $.ajax({
                    url: sServiceUrl+"BPMMYHIS2Set/$count?$filter=Startdate ge '"+startDate+"' and IStarted eq 'X'",
                        success: function (data) {
                            oModel.setData({
                            	startValue:data
                            });
                        }
                }); 
                startProcess.setModel(oModel);
                var oModelSp = new sap.ui.model.json.JSONModel();
                var shenPiProcess = oView.byId("shenPiProcess");
                $.ajax({
                    url: sServiceUrl+"BPMMYHIS2Set/$count?$filter=Startdate ge '"+startDate+"' and IReleased eq 'X'",
                        success: function (data) {
                            oModelSp.setData({
                            	shenPiValue:data
                            });
                        }
                }); 
                shenPiProcess.setModel(oModelSp);
                
                //set task overview data for the overview page
                accenture.com.ui.zmyinbox.util.LoadData.loadTaskOverviewData();
                //this is to fix the custom tile issue for ie
                if("IE"==accenture.com.ui.zmyinbox.util.HelperFunction.GetBrowserType()){
                    //console.log("overview page rerendered for IE");
                    oView.rerender();
                }
/*                var oJsonModelTask = new sap.ui.model.json.JSONModel();
                var oModelTask=sap.ui.getCore().getModel("customAPI");
                oModelTask.read("/BPMTASKVIEWSet",{
                    success: function(data){
                        oJsonModelTask.setData(data);
                        sap.ui.getCore().setModel(oJsonModelTask,"OverViewData");
                        //this is to fix the custom tile issue for ie
                        if("IE"==accenture.com.ui.zmyinbox.util.HelperFunction.GetBrowserType()){
                            //console.log("overview page rerendered for IE");
                            oView.rerender();
                        }
                    }
                });*/
	        },
	    },oView);
	},
	
	onRefresh: function(evt){
	            var oView=this;
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
        	        startDate=year+""+month+""+date;
        	    }
                //set process tarck statistic data using jquery
                var sServiceUrl = "/sap/opu/odata/SAP/ZBPMHIS_SRV/";
                var oModel = new sap.ui.model.json.JSONModel();
                var startProcess = oView.byId("startProcess");
                $.ajax({
                    url: sServiceUrl+"BPMMYHIS2Set/$count?$filter=Startdate ge '"+startDate+"' and IStarted eq 'X'",
                        success: function (data) {
                            oModel.setData({
                            	startValue:data
                            });
                        }
                }); 
                startProcess.setModel(oModel);
                var oModelSp = new sap.ui.model.json.JSONModel();
                var shenPiProcess = oView.byId("shenPiProcess");
                $.ajax({
                    url: sServiceUrl+"BPMMYHIS2Set/$count?$filter=Startdate ge '"+startDate+"' and IReleased eq 'X'",
                        success: function (data) {
                            oModelSp.setData({
                            	shenPiValue:data
                            });
                        }
                }); 
                shenPiProcess.setModel(oModelSp);
                
                //set task overview data for the overview page
        		// instantiate dialog
        		var t=this;
        		if (!this._dialog) {
        			this._dialog = sap.ui.xmlfragment("accenture.com.ui.zmyinbox.frag.BusyDialogLoadingData", this);
        			this.getView().addDependent(this._dialog);
        		}
        
        		// open dialog
        		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
        		this._dialog.open();
        
                //close the dialog when dataloading is done
        		accenture.com.ui.zmyinbox.util.LoadData.loadTLData(null,false,true).done(
        		    function(){
        		        accenture.com.ui.zmyinbox.util.LoadData.loadTaskOverviewData();
        		        t._dialog.close();
        		    });
/*                var oJsonModelTask = new sap.ui.model.json.JSONModel();
                var oModelTask=sap.ui.getCore().getModel("customAPI");
                oModelTask.read("/BPMTASKVIEWSet",{
                    success: function(data){
                        oJsonModelTask.setData(data);
                        sap.ui.getCore().setModel(oJsonModelTask,"OverViewData");
                        //this is to fix the custom tile issue for ie
                        if("IE"==accenture.com.ui.zmyinbox.util.HelperFunction.GetBrowserType()){
                            //console.log("overview page rerendered for IE");
                            oView.rerender();
                        }
                            
                    }
                });*/
	},
	handleEditPress : function (evt) {
		var oTileContainer = this.getView().byId("container");
		var newValue = ! oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
		evt.getSource().setText(newValue ? "Done" : "Edit");
	},

	handleBusyPress : function (evt) {
		var oTileContainer = this.getView().byId("container");
		var newValue = ! oTileContainer.getBusy();
		oTileContainer.setBusy(newValue);
		evt.getSource().setText(newValue ? "Done" : "Busy state");
	},

	handleTileDelete : function (evt) {
		var tile = evt.getParameter("tile");
		evt.getSource().removeTile(tile);
	},
    logoff:function(){
           $.ajax({  
               type: "GET",  
               url: "/sap/public/bc/icf/logoff",  //Clear SSO cookies: SAP Provided service to do that  
            }).done(function(data){ //Now clear the authentication header stored in the browser  
                                if (!document.execCommand("ClearAuthenticationCache")) {  
                                     //"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
                                     $.ajax({  
                                                   type: "GET",  
                                                   url: "/sap/opu/odata/SAP/ZBPMHIS_SRV/BPMMYHIS2Set/", //any URL to a Gateway service  
                                                   username: 'dummy', //dummy credentials: when request fails, will clear the authentication header  
                                                   password: 'dummy',  
                                                   statusCode: { 401: function() {  
                                                             //This empty handler function will prevent authentication pop-up in chrome/firefox  
                                                   } },  
                                                   error: function() {  
                                                        //alert('reached error of wrong username password')  
                                                   }  
                                    });  
                                }
                                window.location.replace("/sap/public/bc/icf/logoff");
            })
    },
    
    downloadhelp: function(){
        window.open("http://erp.zhenergy.com.cn/demo.sap.com~test123/helpdoc/PH3_26_user_guide_zmyinbox.pdf");
    },
    handleUserItemPressed : function(oEvent) {
		var oButton = oEvent.getSource();

        // create action sheet only once
        if (!this._actionSheet) {
          this._actionSheet = sap.ui.xmlfragment(
            "accenture.com.ui.zmyinbox.frag.ActionSheet",
            this
          );
          this.getView().addDependent(this._actionSheet);
        }
    
        this._actionSheet.openBy(oButton);
	},
	handleMenuItemPress: function(oEvent) {
		if(oEvent.getParameter("item").getSubmenu()) {
			return;
		}
	
		var msg = "";
		if(oEvent.getParameter("item").getMetadata().getName() == "sap.ui.unified.MenuTextFieldItem") {
			msg = "'" + oEvent.getParameter("item").getValue() + "' entered";
		}
		else {
			msg = "'" + oEvent.getParameter("item").getText() + "' pressed";
		}
	
		//console.log(msg);
		this.logoff();
		
	},
	
	onOpenTaskListWithFilter : function(evt){
	    var sTaskJsonModel;
	    sTaskJsonModel=sap.ui.getCore().getModel("selectedTask");
	    var selectedTaskName=evt.getSource().getCustomData()[0].getValue();
	    var selectedTask=evt.getSource().getCustomData()[1].getValue();
	    //console.log(selectedTask);
	    //console.log(selectedTaskName);
	    var query;
	    if(sTaskJsonModel){
	        if(sTaskJsonModel.oData.selectedTask==selectedTask){
	            //in case the task type does not change
	            sTaskJsonModel.oData.IsInit=true;
	        }else{
	             sTaskJsonModel.oData.selectedTask=selectedTask
	             sTaskJsonModel.oData.selectedTaskName=selectedTaskName
	             sTaskJsonModel.oData.IsInit=true;
	        }
	    }else{
            sTaskJsonModel= new sap.ui.model.json.JSONModel();
            query={selectedTask: selectedTask,selectedTaskName: selectedTaskName,IsInit:true};
    	    sTaskJsonModel.setData(query);
    	    sap.ui.getCore().setModel(sTaskJsonModel,"selectedTask");	        
	    }

        accenture.com.ui.zmyinbox.util.LoadData.loadTLData(query,true);
	    app.to("TaskList");
	},
	onPTStart : function(evt){
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
	        startDate=year+""+month+""+date;
	    }
	    var query={
	        iStarted: "X",
	        sDate:startDate
	    };
	    var sTaskJsonModel;
	    sTaskJsonModel=sap.ui.getCore().getModel("selectedTask");
	    var selectedTask="PTStart"
        var query2;
	    if(sTaskJsonModel){
	        if(sTaskJsonModel.oData.selectedTask==selectedTask){
	            //in case the task type does not change
	            sTaskJsonModel.oData.IsInit=false;
	        }else{
	             sTaskJsonModel.oData.selectedTask=selectedTask
	             sTaskJsonModel.oData.IsInit=true;
	        }
	    }else{
            sTaskJsonModel= new sap.ui.model.json.JSONModel();
            query2={selectedTask: selectedTask,IsInit:true};
    	    sTaskJsonModel.setData(query2);
    	    sap.ui.getCore().setModel(sTaskJsonModel,"selectedTask");	        
	    }
	    accenture.com.ui.zmyinbox.util.LoadData.loadPTData(query,true);
	    app.to("ProcessTrack");
	    //ProcessTrack.app.to("PTEmpty");

	},
	onPTApprove : function(evt){
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
	        startDate=year+""+month+""+date;
	    }
	    var query={
	        iReleased: "X",
	        sDate:startDate
	    };
	    var sTaskJsonModel;
	    sTaskJsonModel=sap.ui.getCore().getModel("selectedTask");
	    var selectedTask="PTApprove"
        var query2;
	    if(sTaskJsonModel){
	        if(sTaskJsonModel.oData.selectedTask==selectedTask){
	            //in case the task type does not change
	            sTaskJsonModel.oData.IsInit=false;
	        }else{
	             sTaskJsonModel.oData.selectedTask=selectedTask
	             sTaskJsonModel.oData.IsInit=true;
	        }
	    }else{
            sTaskJsonModel= new sap.ui.model.json.JSONModel();
            query2={selectedTask: selectedTask,IsInit:true};
    	    sTaskJsonModel.setData(query2);
    	    sap.ui.getCore().setModel(sTaskJsonModel,"selectedTask");	        
	    }
	    accenture.com.ui.zmyinbox.util.LoadData.loadPTData(query,true);
	    app.to("ProcessTrack");
	    //ProcessTrack.app.to("PTEmpty");
	},

});