/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.MultiSelectFilter", {
	onInit: function() {
		//this.getView().setModel(sap.ca.scfld.md.app.Application.getImpl().AppI18nModel, "i18n");
		this.getView().byId("DIALOG").addStyleClass("sapUiPopupWithPadding"); // FIXME: css fix for ui5 1.24.2-SNAPSHOT
		if (jQuery.device.is.phone) {
			var oDialog = this.getView().byId("DIALOG");
			oDialog.setStretch(true);
		}
	},
	
	openDialog: function(aFilterItems, fnOK, fnCancel) {
		this.fnOK = fnOK;
		this.fnCancel = fnCancel;
		
		// Configure dialog.
		
		var oView = this.getView();
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(aFilterItems);
		oView.byId("LIST").setModel(oModel);
		
		//oView.byId("OK_BUTTON").setEnabled(false);
		
		// Display dialog.
		
		oView.byId("DIALOG").open();	
	},
	
	closeDialog: function() {
		this.getView().byId("DIALOG").close();
	},
	
	onItemSelect: function() {
		this.closeDialog();
		
		if (this.fnOK) {
			var oFilterItem = this.getView().byId("LIST").getSelectedItem().getBindingContext().getProperty();
			this.fnOK(oFilterItem);
		}		
		
		// Enable OK button as soon as an item is selected.
		
/*		var oButton = this.getView().byId("OK_BUTTON");
		oButton.setEnabled(true);
		oButton.rerender(); // FIXME: Rerender button to show it in enabled state.*/
	},
	
/*	onOKPress: function() {
		this.closeDialog();
		
		if (this.fnOK) {
			var oFilterItem = this.getView().byId("LIST").getSelectedItem().getBindingContext().getProperty();
			this.fnOK(oFilterItem);
		}
	},
*/	
	onCancelPress: function() {
		this.closeDialog();
		
		if (this.fnCancel)
			this.fnCancel();
	}
});