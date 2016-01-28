sap.ui.controller("accenture.com.ui.zmyinbox.view.ProcessTrack.App", {
	
	/**
	 * Navigates to another page
	 * @param {string} pageId The id of the next page
	 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	 */
	to : function (pageId, context) {
		
		var PTapp = this.getView().app;
		var page;
		
		// load page on demand
		var master = ("PTMaster" === pageId);
		if (PTapp.getPage(pageId, master) === null) {
			page = sap.ui.view({
				id : pageId,
				viewName : "accenture.com.ui.zmyinbox.view.ProcessTrack." + pageId.substring(2),
				type : "XML"
			});
			page.getController().nav = this;
			PTapp.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}else{
		    page = PTapp.getPage(pageId);
		}
		
		// set data context on the page
		if (context){
            var oModelFL = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZBPMHIS_SRV", false);
            var currentProcess=context.oModel.oData[context.sPath.substring(1)];
            //console.log(ProcessID);
            oModelFL.read("/BPMTASKHISSet?$filter=(ProInstanceid eq '"+currentProcess.ProInstanceid+"')",
                {success: function(data){
                    var ApproveList=data.results;
                    ApproveList.unshift({
                        ProInstanceid:currentProcess.ProInstanceid,
                        Executiontime:currentProcess.Startdate,
                        Approvestate:99,
                        Approvememo:"我发起了流程。",
                        Agentname:currentProcess.Authorname,
                        Agentid:currentProcess.Authorid
                        
                    });
                    currentProcess.oTaskHis=ApproveList;
                    oModelFL.read("/BPMOPENPROCESSHEADSet('"+currentProcess.ProInstanceid+"')/?$expand=BPMOPENPROCESSITEMSet",
                        {success: function(d){
                            currentProcess.oStatus=d;
                            page.setBindingContext(context);
                        
                    }});
                    
                    
                }});
		}
	    // show the page
		PTapp.to(pageId);

	},
	
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	}

});