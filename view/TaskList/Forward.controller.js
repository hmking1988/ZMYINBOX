/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.Forward", {
		_FORWARD_DIALOG_ID: "DLG_FORWARD",
		_SEARCH_FIELD_ID: "SFD_FORWARD",
		_FORWARDER_LIST_ID: "LST_AGENTS",
		_FORWARDER_ITEM_ID: "ITM_AGENT",
		
		iMaxAgent: 100,

//	This hook method can be used to change the number of items shown in the forward screen
//	Called before the forward dialog is opened
	extHookChangeListSizeLimit: null, 
	
	onInit: function() {
	
		var oAgentList = this.getView().byId(this._FORWARDER_LIST_ID);
		oAgentList.bindProperty("showNoData", {
			path:'/agents',
			formatter: function(aAgents) {
				
				/* Overriding detail icon in the StandardListItem.
				 * By default, the icon is edit, the code changes it to customer icon. But its creating issues. So commented till API is available.
				//Changing the internal Detail icon of the StandardListItem
				for (var i=0; i<oAgentList.getItems().length; i++) {
					var item = oAgentList.getItems()[i];
					item._detailIcon = new sap.ui.core.Icon("", {src:"sap-icon://customer"}).addStyleClass("sapMLIBIconDet");
				}*/
				return (aAgents === undefined) ? false : true;
			}
		});
		
		if (jQuery.device.is.phone) {
			var oDialog = this.getView().byId(this._FORWARD_DIALOG_ID);
			oDialog.setStretch(true);
		}
	},
	
	onCancelDialog: function() {
		var oForwardDlg = this.getView().byId(this._FORWARD_DIALOG_ID);
		oForwardDlg.close(); 
	},
	
	onBeforeOpenDialog: function() {
		//NOTE: the Forward Dialog is currently only opened by APPs, there is NO internal navigation back to this Dialog.
		//e.g. from Forward Confirmation Dialog back to this dialog. 
		//For the internal navigation, need to check if the state of the dialog should be kept.
		
		var oFldSearch = this.getView().byId(this._SEARCH_FIELD_ID);
		var oFwdDlg = this.getView().byId(this._FORWARD_DIALOG_ID);
		
		// setting initial focus to searchField in the forward dialog
		oFwdDlg.setInitialFocus(oFldSearch);
		
		//remove previous search value
		oFldSearch.setValue("");
		
		//remove the previous startExernalSearch function and set it from Dialog model
		this.fnStartSearch = undefined;
		this.fnCloseDlg = undefined;
		var oDlgModel = oFwdDlg.getModel();
		if (oDlgModel) {
			this.fnStartSearch = oDlgModel.getProperty("/startSearch");
			this.fnCloseDlg = oDlgModel.getProperty("/closeDlg");
		}
		
		/**
         * @ControllerHook Change forward list size
         * This hook method can be used to change the number of items shown in the forward screen
         * Called before the forward dialog is opened
         * @callback cross.fnd.fiori.inbox.view.Forward~extHookChangeListSizeLimit
         * @return {integer} The maximum number of entries which are used for for list bindings.
         */
    	if (this.extHookChangeListSizeLimit) {
    		var iSizeLimit = this.extHookChangeListSizeLimit();
    		oDlgModel.setSizeLimit(iSizeLimit);
    		this.iMaxAgent = iSizeLimit;
    	}
	},
	
	onLiveChange: function(oEvent) {
		if (this.getView().byId(this._FORWARD_DIALOG_ID).getModel().getProperty('/isPreloadedAgents')){
			var sSearchTerm = oEvent.getParameters().newValue;
			
			var aListItems = this.getView().byId("LST_AGENTS").getItems();
			for (var i = 0; i < aListItems.length; i++) {
				var bVisibility = this.fnStartSearch(aListItems[i], sSearchTerm);
				aListItems[i].setVisible(bVisibility);
			}
			this.getView().byId("LST_AGENTS").rerender();
		}
	},
	
    onAgentSearch: function(oEvent) {
        var t=this;
		if (!this.getView().byId(this._FORWARD_DIALOG_ID).getModel().getProperty('/isPreloadedAgents')){    	
			var sSearchTerm = oEvent.getParameters().query;		
			
			if (sSearchTerm.length != 0 ) {
                var sServiceUrl = "/sap/opu/odata/IWPGW/TASKPROCESSING;mo;v=2";
    			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
				oModel.read("SearchUsers?SAP__Origin='BPM'&SearchPattern='"+sSearchTerm+"'&MaxResults"+this.iMaxAgent,{
				    success: function(oResults){
    	    			var oDialog = t.getView().byId("DLG_FORWARD");
    	    			oDialog.getModel().setProperty("/agents", []);
    	    			oDialog.getModel().setProperty("/agents", oResults.results);
    	    			t.getView().byId("LST_AGENTS").rerender();
				    },
				})
	    		
	    		//TO-DO: change this into resource model
	    		//var sNoDataText = accenture.com.ui.zmyinbox.i18n.messageBundle.getText("view.Forward.noRecipients");
	    		var sNoDataText="未找到收件人"
	    		this.getView().byId("LST_AGENTS").setNoDataText(sNoDataText);
			}
		}
	},	
	
	_findListItemById: function(sId) {
		var aListItems = this.getView().byId("LST_AGENTS").getItems();
		for(var i = 0; i < aListItems.length; i++) {
			if (aListItems[i].getId() === sId) {
				return aListItems[i];
			}
		}
	},
	
	onSelectAgent: function(oEvent) {
		var oSelectedItem = this._findListItemById(oEvent.getParameters().id);
		var t=this;
		if (oSelectedItem && oSelectedItem.getBindingContext()) {
			//1. close the current dialog at first
			this.getView().byId(this._FORWARD_DIALOG_ID).close();
			//2. open the confirmation dialog
			var oSelectedAgent = oSelectedItem.getBindingContext().getObject();
			var oDlgModel = this.getView().byId(this._FORWARD_DIALOG_ID).getModel();
			var iNumberOfSelectedItems = oDlgModel.getProperty("/numberOfItems");
			// number of items is filled only in mass approval mode, so if it's undefined, we are in the normal forward case
			var sQuestion = "testtest";
/*			if (iNumberOfSelectedItems === undefined) {
				sQuestion = sap.ca.ui.utils.resourcebundle.getText("forward.question", oSelectedAgent.DisplayName);
			} else if (iNumberOfSelectedItems == 1) {
				sQuestion = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("XMSG_MULTI_FORWARD_QUESTION", oSelectedAgent.DisplayName);
			} else {
				sQuestion = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("XMSG_MULTI_FORWARD_QUESTION_PLURAL", [iNumberOfSelectedItems, oSelectedAgent.DisplayName]);
			}*/
			var dialog = new sap.m.Dialog({
				title: '{i18n>viewForwardtitle}',
				type: 'Message',
				content: [
				    new sap.m.Text({ text: '{i18n>viewForwardQuestion}'+oSelectedAgent.DisplayName+"?" }),
					new sap.m.TextArea('confirmDialogTextarea', {
						width: '100%',
						placeholder: '{i18n>DecisionOptionComment}'
					})
				],
				beginButton: new sap.m.Button({
					text: '{i18n>viewForwardSubmit}',
					press: function () {
						var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
						dialog.close();
						t.forwardConfirmClose({sNote:sText,isConfirmed:true},oSelectedAgent);
					}
				}),
				endButton: new sap.m.Button({
					text: '{i18n>DecisionOptionCancel}',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		}
	},	
	
	forwardConfirmClose: function(oResult, oSelectedAgent) {
		var oNewResult = {};
		//call the APP forward close function
		if (oResult && oResult.isConfirmed) {
			oNewResult = {
					bConfirmed: true,
					sNote: oResult.sNote,
					oAgentToBeForwarded: oSelectedAgent //this is the confirmation dialog object
			};
		} else {
			oNewResult = {
					bConfirmed: false
			};
		}
		this.fnCloseDlg(oNewResult);
	},
	
	handleDetailPress: function(evt) {
		var oSelectedItem = this._findListItemById(evt.getParameters().id);
		var path = oSelectedItem.getBindingContext().getPath();
		var agentIndex = path.substring(8, path.length);
		var agent = this.getView().byId(this._FORWARD_DIALOG_ID).getModel().getData().agents[agentIndex];
		var oItem = evt.getSource();
		this.myEvt=oItem;
		accenture.com.ui.zmyinbox.util.NameCard.showNameCard(this,agent.UniqueName);
	}
});