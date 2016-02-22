jQuery.sap.declare("accenture.com.ui.zmyinbox.util.NameCard");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.LoadData");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Formatter");
accenture.com.ui.zmyinbox.util.NameCard = {
    showNameCard: function(t,UniqueName) {
        //console.log(UniqueName);
        accenture.com.ui.zmyinbox.util.LoadData.loadUserInfoData(UniqueName,true)
        .done(function(data){
    		var oPopover = new sap.m.Popover({
    			showHeader : false,
    			placement : sap.m.PlacementType.Auto,
    			contentHeight : "87px",
    			contentWidth : "300px"
    		});
    		var vCardName = new sap.ui.commons.Label();
    		var oVCard = new sap.suite.ui.commons.BusinessCard({
    			firstTitle : vCardName,
    			secondTitle : data.Company+","+data.Department,
    			width : "298px"
    		});
    		var oContent = new sap.ui.commons.layout.MatrixLayout({
    			widths : ["30px", "100px"]
    		});
    		oContent.createRow(new sap.ui.commons.TextView({
    			text : "电话:"
    		}), new sap.ui.commons.TextView({
    			text : data.MobilePhone
    		}));
    		oContent.createRow(new sap.ui.commons.TextView({
    			text : "Email:"
    		}), new sap.ui.commons.TextView({
    			text : data.Email
    		}));
    		oVCard.setContent(oContent);
    		oPopover.addContent(oVCard);
    		var UserName=accenture.com.ui.zmyinbox.util.Formatter.formatterAgentName(data.LastName+data.FirstName,data.UniqueName)
    		vCardName.setText(UserName);
    		var UserIcon=accenture.com.ui.zmyinbox.util.Formatter.NameCardUserIcon(data.mime_type,data.__metadata.media_src)
    		oVCard.setIconPath(UserIcon);
    		oPopover.openBy(t.myEvt);
            })
        .fail(function(evt){
            sap.m.MessageToast.show("获取用户信息失败");
        })

	}
};