sap.ui.jsview("accenture.com.ui.zmyinbox.view.TaskList.App", {


	getControllerName: function () {
		return "accenture.com.ui.zmyinbox.view.TaskList.App";
	},
	
	createContent: function (oController) {

		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.SplitApp();
    
		// load the master page
		var master = sap.ui.xmlview("Master", "accenture.com.ui.zmyinbox.view.TaskList.Master");
		master.getController().nav = this.getController();
		//master.addStyleClass('full_page_backgroundColor');
		this.app.addPage(master, true);
		
		// load the empty page 
		var empty = sap.ui.xmlview("Empty", "accenture.com.ui.zmyinbox.view.TaskList.Empty"); 
		this.app.addPage(empty, false);

		// done
		return this.app;
	},
	onBeforeShow: function(){
	    //console.log("TLapp showed!");
	    var oView=this.app.getPage("Master",true);
	    var oList=oView.byId("list");
	    var sTaskJsonModel;
	    sTaskJsonModel=sap.ui.getCore().getModel("selectedTask");
	    //in case selection of the task type does not change
	    if(!sTaskJsonModel.oData.IsInit){
	        return;
	    }
	    
	    //console.log("global filter set from app");
        var filters = [];
        var query=sTaskJsonModel.oData.selectedTask;
        var queryName=sTaskJsonModel.oData.selectedTaskName;
		var filter = new sap.ui.model.Filter("TaskDefinitionID", sap.ui.model.FilterOperator.EQ, query);
		filters.push(filter);
		// update list binding 
		var binding = oList.getBinding("items");
		binding.filter(filters);
		//set header for the selected task type
		var h=oList.getHeaderToolbar();
    	if(!h){
			h=new sap.m.Toolbar({
				    design: sap.m.ToolbarDesign.Info
			    });
			oList.setHeaderToolbar(h);
		}
		h.destroyContent();
		h.addContent(new sap.m.Label({
			                text: "已按此过滤： 任务类型 ("+queryName+")"
		            }));
		var complexFilter={
        		Priority: [],
        		CompletionDeadLine: [],
        		TaskDefinitionID: [],
        		Status: [],
        		CreatedOn: [],
        		CustomNumberValue: [],
        		CustomNumberUnitValue: [],
        		CustomObjectAttributeValue: []
        	};
        complexFilter.TaskDefinitionID.push("TaskDefinitionID:"+queryName);
	},
});