jQuery.sap.require("accenture.com.ui.zmyinbox.util.NameCard");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Formatter");
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

});