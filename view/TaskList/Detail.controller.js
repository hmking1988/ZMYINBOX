jQuery.sap.require("accenture.com.ui.zmyinbox.util.Formatter");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Forward");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.HelperFunction");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.NameCard");
jQuery.sap.require("sap.m.MessageBox"); 
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.Detail", {
	onInit: function() {
	    var t=this;
	    var oTiemline=this.byId("idTimeline");
	    oTiemline.addEventDelegate({
	        onAfterRendering:function(){
	            var ul = $("#Detail--idTimeline-content");
                ul.find('li').each(function() {
                    var item = $(this);
                    //customizing the icon
                    var cIcon=item.find("span.sapUiIcon");
                    var status=cIcon.attr("aria-label")
                    if(status==="employee-approvals"){
                        cIcon.addClass("acceptLabel");
                    }else if(status==="employee-rejections"){
                        cIcon.addClass("rejectionLabel");
                    }else if(status==="activity-individual"){
                        cIcon.addClass("submitLabel");
                    }else if(status==="delete"){
                        cIcon.addClass("cancelLabel");
                    }else{
                        cIcon.addClass("submitLabel");
                    }
/*                    cIcon.css("color","white");
                    cIcon.mouseover(
                        function(){
                        cIcon.css("color","white");
                        }                
                    )
                    cIcon.mouseout(
                        function(){
                        cIcon.css("color","white");
                        }                
                    )
                    cIcon.mouseenter(
                        function(){
                        cIcon.css("color","white");
                        }                
                    )
                    cIcon.mouseleave(
                        function(){
                        cIcon.css("color","white");
                        }
                    )*/
                })
	        },
	        
	    },oTiemline);
	    
	},
	onBeforeRendering:function(){
	},
	onAfterRendering:function(){
	},	

	
	
	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	},
	

	
	
/*	handleIconTabBarSelect: function(evt){
	    //bind approval history timeline
    	var oTimelineFL = this.byId("idTimeline");
    	var oTlItemFL = this.byId("idTimelineItem");
    	oTimelineFL.bindAggregation("content", {
    	    path: "oTaskHis",
    	    template: oTlItemFL});  
	},*/

    handleClaim : function (evt) {
        var oDataModel=sap.ui.getCore().getModel("standardAPI");
        var oConext=evt.getSource().getBindingContext();
        var TaskID=evt.getSource().getBindingContext().getProperty("InstanceID");
        var oCButton=this.byId("claimButton");
        var oRButton=this.byId("releaseButton");
        oDataModel.create("Claim?SAP__Origin='BPM'&InstanceID='"+TaskID+"'",null,
                        {
                            success: function(data,response){
                                sap.m.MessageToast.show("领取任务成功");
                                var oTaskEntity=oConext.oModel.oData[oConext.sPath.substring(1)];
                                oTaskEntity.TaskSupports.Claim=false;
                                oTaskEntity.TaskSupports.Release=true;
                                oTaskEntity.Status="RESERVED";
                                oCButton.setVisible(false);
                                oRButton.setVisible(true);
                                var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
                                selectedTaskModel.oData.IsInit=true;
                                TaskList.rerender();
                            },
                            error: function(){
                                sap.m.MessageToast.show("领取任务失败");
                            }
                        }
                        );
    },

	
	handleRelease : function (evt) {
        var oDataModel=sap.ui.getCore().getModel("standardAPI");
	    var oItem = this.byId("TaskInfoForm");
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oItemData = bindingContext.getModel().getProperty(path);
        var TaskID=oItemData.InstanceID;
        var oCButton=this.byId("claimButton");
        var oRButton=this.byId("releaseButton");
        oDataModel.create("Release?SAP__Origin='BPM'&InstanceID='"+TaskID+"'",null,
                        {
                            success: function(data,response){
                                sap.m.MessageToast.show("释放任务成功");
                                var oTaskEntity=oConext.oModel.oData[oConext.sPath.substring(1)];
                                oTaskEntity.TaskSupports.Claim=true;
                                oTaskEntity.TaskSupports.Release=false;
                                oTaskEntity.Status="READY";
                                oCButton.setVisible(true);
                                oRButton.setVisible(false);
                                var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
                                selectedTaskModel.oData.IsInit=true;
                                TaskList.rerender();
                            },
                            error: function(){
                                sap.m.MessageToast.show("释放任务失败");
                            }
                        }
                        );
	},
	handleCancel : function (evt) {
        var t=this;
	    var oItem = this.byId("TaskInfoForm");
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oItemData = bindingContext.getModel().getProperty(path);
        var TaskID=oItemData.InstanceID;
		var dialog = new sap.m.Dialog({
				title: '{i18n>viewCanceltitle}',
				type: 'Message',
				content: [
				    new sap.m.Text({ text: '{i18n>viewCancelQuestion}'+"?" }),
					new sap.m.TextArea('confirmDialogTextarea', {
						width: '100%',
						placeholder: '{i18n>viewCancelComment}'
					})
				],
				beginButton: new sap.m.Button({
					text: '{i18n>viewCancelSubmit}',
					press: function () {
						var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
						dialog.close();
						t.submitCancel(TaskID,sText);
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
	},
	
	submitCancel: function(TaskID,sText){
	    var oDataModel=sap.ui.getCore().getModel("customAPI");
        oDataModel.create("BPMPROCCANCELSet",{Taskid:TaskID,Comment:sText},
                        {
                            success: function(data,response){
                                sap.m.MessageToast.show("工作流取消成功");
                            },
                            error: function(){
                                sap.m.MessageToast.show("工作流取消失败");
                            }
                        }
                        );	    
	},
	
	
	handleOpen: function(evt){
        var UIELink=evt.getSource().getBindingContext().getProperty("UIELink");
        var oConext=evt.getSource().getBindingContext();
        var oCButton=this.byId("claimButton");
        var oRButton=this.byId("releaseButton");
        var oTaskEntity=oConext.oModel.oData[oConext.sPath.substring(1)];
        oTaskEntity.Status="IN_PROGRESS";
        TaskList.rerender();
        var sLink=accenture.com.ui.zmyinbox.util.HelperFunction.URLEnhance(UIELink,oTaskEntity.InstanceID);
        //var sLink=oTaskEntity.UIELink;
        window.open(sLink);
        
        
/*	var oOverlayContainer = new sap.ui.ux3.OverlayContainer({
		openButtonVisible: false
	});
              
    var oHTML = new sap.ui.core.HTML({preferDOM:true,content:"<iframe src='"+sLink+"'  style='height: 100%; width: 100%;' ></iframe>"});        
    oOverlayContainer.addContent(oHTML);
    oOverlayContainer.attachClose($.proxy(this.autoRelease,this));
	if(!oOverlayContainer.isOpen()){
		oOverlayContainer.open();
	}*/
	},
	autoRelease: function(evt){
	    var t=this;
	    var oItem = this.byId("TaskInfoForm");
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oCButton=this.byId("claimButton");
        var oRButton=this.byId("releaseButton");
        var oTaskEntity = bindingContext.getModel().getProperty(path);
        accenture.com.ui.zmyinbox.util.LoadData.ReleaseTask(oTaskEntity.InstanceID,true)
            .done(function(data){
                sap.m.MessageToast.show("自动释放任务成功");
                sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.Master").onRefresh();
/*                oTaskEntity.TaskSupports.Claim=true;
                oTaskEntity.TaskSupports.Release=false;
                oTaskEntity.Status="READY";
                oCButton.setVisible(true);
                oRButton.setVisible(false);
                var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
                selectedTaskModel.oData.IsInit=true;
                TaskList.rerender();*/
            })
            .fail(function(evt){
                sap.m.MessageToast.show("自动释放任务失败或审批已通过，请刷新");
            })
        
	},
	attachUserNameClicked : function(evt){
	    var oItem = evt.getSource();
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oItemData = bindingContext.getModel().getProperty(path);
        var UniqueName=accenture.com.ui.zmyinbox.util.Formatter.getUniqueName(oItemData.Agentid);
	    this.myEvt=oItem;
        accenture.com.ui.zmyinbox.util.NameCard.showNameCard(this,UniqueName);
	},
    onForwardPopUp: function(evt) {
        var bindingContext = this.getView().getBindingContext();
        var path = bindingContext.getPath();
        var oItem = bindingContext.getModel().getProperty(path);
		var sOrigin = oItem.SAP__Origin;
		var sInstanceID = oItem.InstanceID;	

		accenture.com.ui.zmyinbox.util.Forward.open(
			jQuery.proxy(this.startForwardFilter, this),
			jQuery.proxy(this.closeForwardPopUp, this)
		);

/*		this.oDataManager.readPotentialOwners(sOrigin, sInstanceID,
			jQuery.proxy(this._PotentialOwnersSuccess, this));*/
    },
	startForwardFilter: function(oListItem, sQuery) {
		sQuery = sQuery.toLowerCase();
		var sFullName = oListItem.getBindingContext().getProperty("DisplayName").toLowerCase();
		var sDepartment = oListItem.getBindingContext().getProperty("Department").toLowerCase();

		return (sFullName.indexOf(sQuery) != -1) ||
			(sDepartment.indexOf(sQuery) != -1);
	},
	closeForwardPopUp: function(oResult) {
		if (oResult && oResult.bConfirmed) {
            var oContext = this.getView().getBindingContext();
            var path = oContext.getPath();
            var oItem = oContext.getModel().getProperty(path);
			var TaskID = oItem.InstanceID;	
            var oDataModel=sap.ui.getCore().getModel("standardAPI");
            oDataModel.create("Forward?SAP__Origin='BPM'&InstanceID='"+TaskID+"'&ForwardTo='"+oResult.oAgentToBeForwarded.UniqueName+"'&Comments='"+oResult.sNote+"'",null,
                            {
                                success: function(data,response){
                                    sap.m.MessageToast.show("转发任务成功");
                                    // TODO: remove the forwared entry from list
                                },
                                error: function(){
                                    sap.m.MessageToast.show("转发任务失败");
                                }
                            }
                            );
		}
	},
});