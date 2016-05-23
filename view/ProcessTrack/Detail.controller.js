jQuery.sap.require("accenture.com.ui.zmyinbox.util.NameCard");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Formatter");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.HelperFunction");
sap.ui.controller("accenture.com.ui.zmyinbox.view.ProcessTrack.Detail", {
    onInit: function() {
	    var t=this;
	    var oTiemline=this.byId("idTimeline");
	    oTiemline.addEventDelegate({
	        onAfterRendering:function(){
	            //console.log("time line onafterrendering");
	            var ul = $("#PTDetail--idTimeline-content");
                ul.find('li').each(function() {
                    var item = $(this);
                    //customizing the icon
                    var cIcon=item.find("span.sapUiIcon");
                    var status=cIcon.attr("aria-label");
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
	        onBeforeRendering:function(){
	            //console.log("time line onbeforerendering");
	        }
	        
	    },oTiemline);
	    
	},
	handleNavButtonPress : function (evt) {
		this.nav.back("PTMaster");
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
	handleOpen: function(evt){
	    var oItem = evt.getSource();
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oItemData = bindingContext.getModel().getProperty(path);
        var dict={
        	"SD-销售价格确认":"/webdynpro/resources/demo.sap.com/zjenergy~wd~sd/DRJGApp?batchcode=",
        	"SD-销售订单":"/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fBPMFolder!2fiView!2fVA03?sap-config-mode=true&AutoStart=true&DynamicParameter=VBAK-VBELN=",
        	"项目物料需求计划流程":"/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fBPMFolder!2fiView!2fZPSE00081?sap-config-mode=true&AutoStart=true&DynamicParameter=P_SPSNRO="
        };
        if(oItemData.Onlymarkdec.indexOf("项目物料需求计划流程")>=0){
        	var UIELink=dict["项目物料需求计划流程"]+oItemData.Onlymark;
        }else{
        	var UIELink=dict[oItemData.Onlymarkdec]+oItemData.Onlymark;
        }

        var sLink=accenture.com.ui.zmyinbox.util.HelperFunction.URLEnhance2(UIELink);
        //var sLink=oTaskEntity.UIELink;
        window.open(sLink);
	},
	handleProcess: function(evt){
	    var oItem = evt.getSource();
	    var bindingContext=oItem.getBindingContext();
        var path = bindingContext.getPath();
        var oItemData = bindingContext.getModel().getProperty(path);
        var UIELink="/webdynpro/dispatcher/sap.com/tc~bpem~wdui~procvis/AProcessVisualization?processInstanceId="+oItemData.ProInstanceid;
        var sLink=accenture.com.ui.zmyinbox.util.HelperFunction.URLEnhance2(UIELink);
        //var sLink=oTaskEntity.UIELink;
        window.open(sLink);        
	}

});