/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.MultiSelectDetail", {
	onInit: function() {
		var oView = this.getView();
		
		//oView.setModel(sap.ca.scfld.md.app.Application.getImpl().AppI18nModel, "i18n");	

		var oDialog = oView.byId("DIALOG");

		// FIXME: display back button in header needs the following hack.
		
		oDialog._createHeader();
		oDialog.getAggregation("_header").addContentLeft(new sap.m.Button({
			type: sap.m.ButtonType.Back,
			press: jQuery.proxy(this.onBackPress, this)
		}));
	},
	
	openDialog: function(oDetailInfo, fnClose, fnBack) {
		this.fnClose = fnClose;
		this.fnBack = fnBack;
		
		// Create detail message.
		
		var i18nBundle = this.getView().getModel("i18n").getResourceBundle();
		
		var sMessage = "";

		for (var i = 0; i < oDetailInfo.itemStatusList.length; i++) {
			var oItemStatus = oDetailInfo.itemStatusList[i];
			
			if (sMessage.length > 0)
				sMessage += "\n";
			
			sMessage += i18nBundle.getText("multi.itemstatus", [oItemStatus.InstanceID, oItemStatus.SAP__Origin]) + "\n";
			sMessage += oItemStatus.message + "\n";
		}
		
		// Configure dialog.
		
		var oView = this.getView();
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(jQuery.extend({}, oDetailInfo, {
			detailMessage: sMessage
		}));
		oView.setModel(oModel);
		
		// Display dialog.
		
		oView.byId("DIALOG").open();	
	},
	
	closeDialog: function() {
		this.getView().byId("DIALOG").close();
	},
	
	onOKPress: function() {
		this.closeDialog();

		if (this.fnClose)
			this.fnClose();
	},
	
	onBackPress: function() {
		this.closeDialog();
		
		if (this.fnBack)
			this.fnBack();
	}
});