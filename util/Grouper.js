jQuery.sap.declare("accenture.com.ui.zmyinbox.util.Grouper");
accenture.com.ui.zmyinbox.util.Grouper = {
		
		bundle : null, // somebody has to set this
		
		
		Status : function (oContext) { 
				var status = oContext.getProperty("Status"); 
				var text = accenture.com.ui.zmyinbox.util.Grouper.bundle.getText("StatusText" + status, "?");
				return { key: status, text: text };
		},

};