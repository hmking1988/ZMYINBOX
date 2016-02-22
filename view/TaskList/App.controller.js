jQuery.sap.require("accenture.com.ui.zmyinbox.util.LoadData");


sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.App", {
	
	/**
	 * Navigates to another page
	 * @param {string} pageId The id of the next page
	 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	 */
	to : function (pageId, context) {
		
		var TLapp = this.getView().app;
		// load page on demand
		var master = ("Master" === pageId);
		if (TLapp.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "accenture.com.ui.zmyinbox.view.TaskList." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			TLapp.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}
		
		// show the page
		TLapp.to(pageId);
		
		// set data context on the page
		if (context) {
		    //console.log(context);
		    //loading task data async
		    accenture.com.ui.zmyinbox.util.LoadData.loadTDData(context,true)
		    .done(function (oContext){
		        //setting binding context for the detail view
                var page = TLapp.getPage(pageId);
                page.setBindingContext(oContext);
                
                //set decision options for single task
                function handleDOClosure(DOKey,DOText,evt){
                    return function(){
            			var dialog = new sap.m.Dialog({
            				title: '{i18n>DecisionOptionConfirm}',
            				type: 'Message',
            				content: [
            				    new sap.m.Text({ text: '{i18n>DecisionOptionText}'+DOText }),
            					new sap.m.TextArea('confirmDialogTextarea', {
            						width: '100%',
            						placeholder: '{i18n>DecisionOptionComment}'
            					})
            				],
            				beginButton: new sap.m.Button({
            					text: '{i18n>DecisionOptionSubmit}',
            					press: function () {
            						var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
                                    var oDataModel=sap.ui.getCore().getModel("standardAPI");
                                    var TaskID=oContext.oModel.oData[context.sPath.substring(1)].InstanceID;
                                    oDataModel.create("Decision?SAP__Origin='BPM'&InstanceID='"+TaskID+"'&DecisionKey='"+DOKey+"'&Comments='"+sText+"'",null,
                                                    {
                                                        success: function(data,response){
                                                            sap.m.MessageToast.show("任务处理成功");
                                                            var oJsonModel=sap.ui.getCore().getModel();
                                                            var oTaskEntity=oJsonModel.oData[oContext.sPath.substring(1)];
                                                            oTaskEntity.TaskSupports.Claim=false;
                                                            oTaskEntity.TaskSupports.Release=false;
                                                            oTaskEntity.Status="COMPLETED";
                                                            var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
                                                            selectedTaskModel.oData.IsInit=true;
                                                            TaskList.rerender();
                                                            dialog.close();
                                                        },
                                                        error: function(){
                                                            sap.m.MessageToast.show("任务处理失败");
                                                            dialog.close();
                                                        }
                                                    }
                                                    );
            						
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
                }
                
                var oTaskEntity=oContext.oModel.oData[oContext.sPath.substring(1)];
                var DOList=oTaskEntity.DecisonOption;
                var oBar=page.byId("mybar");
                var oButtonList=$("#Detail--mybar-BarRight").find("button").each(function(){
                    var item = $(this);
                      if(item.attr("id").indexOf("DecisionOption")>=0)
                      {
                        var button=sap.ui.getCore().byId(item.attr("id"));
                        button.destroy();
                      }                    
                });
                //in case the task is completed or there is no custom action defined for this task
                if(oTaskEntity.Status=="COMPLETED" || DOList.length==0){
                    return;
                }
                for(var i=0;i<DOList.length;i++){
                    var oBtn = new sap.m.Button({
                        id: "DecisionOption"+i,
                        text : DOList[i].DecisionText,
                        press: handleDOClosure(DOList[i].DecisionKey,DOList[i].DecisionText)
                      });
                    oBar.addContentRight(oBtn); 
                }

		    })
		    .fail(function(){
		        sap.m.MessageToast.show("获取待办详细信息失败");
		    })
		    //loading task data sync
/*		    accenture.com.ui.zmyinbox.util.LoadData.loadTDData(context);
            var page = TLapp.getPage(pageId);
            page.setBindingContext(context);*/
		}
	},
	
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	}
});