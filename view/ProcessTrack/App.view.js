sap.ui.jsview("accenture.com.ui.zmyinbox.view.ProcessTrack.App", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf accenture.com.ui.zmyinbox.viewProcessTrack.view.ProcessTrack.App
	*/ 
	getControllerName : function() {
		return "accenture.com.ui.zmyinbox.view.ProcessTrack.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf accenture.com.ui.zmyinbox.viewProcessTrack.view.ProcessTrack.App
	*/ 
	createContent : function(oController) {

		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.SplitApp();
		
		// load the master page
		var master = sap.ui.xmlview("PTMaster", "accenture.com.ui.zmyinbox.view.ProcessTrack.Master");
		master.getController().nav = this.getController();
		//master.addStyleClass('full_page_backgroundColor');
		this.app.addPage(master, true);
		
		// load the empty page 
		var empty = sap.ui.xmlview("PTEmpty", "accenture.com.ui.zmyinbox.view.ProcessTrack.Empty"); 
		this.app.addPage(empty, false);
		
		// done
		return this.app;
	},
	onBeforeShow: function(){
	    //console.log("PTapp showed!");
	    var oView=this.app.getPage("PTMaster",true);
	    var sTaskJsonModel;
	    var RB1=oView.byId("RB1");
	    var RB2=oView.byId("RB2");
	    sTaskJsonModel=sap.ui.getCore().getModel("selectedTask");
	    //in case selection of the task type does not change
	    if(!sTaskJsonModel.oData.IsInit){
	        return;
	    }
	    if(sTaskJsonModel.oData.selectedTask=="PTStart"){
	        RB1.setSelected(true);
	        RB2.setSelected(false);
	    }else{
	        RB2.setSelected(true);
	        RB1.setSelected(false);	        
	    }
	},

});