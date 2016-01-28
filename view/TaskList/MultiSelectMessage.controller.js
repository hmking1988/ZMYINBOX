/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("accenture.com.ui.zmyinbox.util.MultiSelect");
sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.MultiSelectMessage", {
	onInit: function() {
		//this.getView().setModel(sap.ca.scfld.md.app.Application.getImpl().AppI18nModel, "i18n");		
	},
	
	openDialog: function(aSuccessList, aErrorList, fnClose) {
		this.aSuccessList = aSuccessList;
		this.aErrorList = aErrorList;
		this.fnClose = fnClose;
		
		// Create table items.
		
		var oView = this.getView();
		var i18nBundle = oView.getModel("i18n").getResourceBundle();

		var aTableItems = [];
		
		if (aSuccessList.length > 0) {
			var oItem = {	
					name: i18nBundle.getText(aSuccessList.length > 1 ? "multi.success_plural" : "multi.success", aSuccessList.length),
					icon: "sap-icon://sys-enter",
					state: sap.ui.core.ValueState.Success,
					itemStatusList: aSuccessList,
					detailTitle: i18nBundle.getText("multi.success_detail"),
			};
			
			aTableItems.push(oItem);
		}
		
		if (aErrorList.length > 0) {
			var oItem = {	
					name: i18nBundle.getText(aErrorList.length > 1 ? "multi.error_plural" : "multi.error", aErrorList.length),
					icon: "sap-icon://error",
					state: sap.ui.core.ValueState.Error,
					itemStatusList: aErrorList,
					detailTitle: i18nBundle.getText("multi.error_detail")
			};
			
			aTableItems.push(oItem);
		}
		
		// Configure dialog.
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			title: i18nBundle.getText(aTableItems.length > 1 ? "multi.title_plural" : "multi.title", aTableItems.length),
			items: aTableItems
		});
		oView.setModel(oModel);
		
		// Display dialog.
		
		oView.byId("DIALOG").open();	
	},
	
	closeDialog: function() {
		this.getView().byId("DIALOG").close();
	},
	
	onItemSelect: function(oEvent) {
		this.closeDialog();

		var oDetailInfo = oEvent.getSource().getBindingContext().getProperty();
		var that = this;
		
		accenture.com.ui.zmyinbox.util.MultiSelect.openDetailDialog(oDetailInfo, this.fnClose, function() {
			accenture.com.ui.zmyinbox.util.MultiSelect.openMessageDialog(that.aSuccessList, that.aErrorList, that.fnClose);
		});
	},
	
	onOKPress: function() {
		this.closeDialog();

		if (this.fnClose)
			this.fnClose();
	}
});