    /*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("accenture.com.ui.zmyinbox.util.MultiSelect");

accenture.com.ui.zmyinbox.util.MultiSelect = (function() {
	var oFilterView = null;
	var oMessageView = null;
	var oDetailView = null;
	
	return {
		openFilterDialog: function(aFilterItems, fnOK, fnCancel) {
			if (!oFilterView) {
				oFilterView = new sap.ui.view({
					viewName: "accenture.com.ui.zmyinbox.view.TaskList.MultiSelectFilter",
					type:     sap.ui.core.mvc.ViewType.XML
				});				
			}
			
			oFilterView.getController().openDialog(aFilterItems, fnOK, fnCancel);
		},
		
		openMessageDialog: function(aSuccessList, aErrorList, fnClose) {
			if (!oMessageView) {
				oMessageView = new sap.ui.view({
					viewName: "accenture.com.ui.zmyinbox.view.TaskList.MultiSelectMessage",
					type:     sap.ui.core.mvc.ViewType.XML					
				});
			}
			
			oMessageView.getController().openDialog(aSuccessList, aErrorList, fnClose);
		},
		
		openDetailDialog: function(oDetailInfo, fnClose, fnBack) {
			if (!oDetailView) {
				oDetailView = new sap.ui.view({
					viewName: "accenture.com.ui.zmyinbox.view.TaskList.MultiSelectDetail",
					type:     sap.ui.core.mvc.ViewType.XML					
				});
			}
			
			oDetailView.getController().openDialog(oDetailInfo, fnClose, fnBack);
		}
	};
}());