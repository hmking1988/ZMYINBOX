jQuery.sap.declare("accenture.com.ui.zmyinbox.util.Grouper");
accenture.com.ui.zmyinbox.util.Grouper = {
		
		bundle : null, // somebody has to set this
		
		
		Status : function (oContext) { 
				var status = oContext.getProperty("Status"); 
				var text = accenture.com.ui.zmyinbox.util.Grouper.bundle.getText("StatusText" + status, "?");
				return { key: status, text: text };
		},
		
		Process : function(oContext){
		    var CustomAttributeData = oContext.getProperty("CustomAttributeData");
		    var text=accenture.com.ui.zmyinbox.util.Grouper.bundle.getText("ProcessTextOther");
		    if(CustomAttributeData.results){
                for(var i=0;i<CustomAttributeData.results.length;i++){
                    if(CustomAttributeData.results[i].Name=="Process"){
                        text=CustomAttributeData.results[i].Value;
                        console.log(text);
                    }
                }
		    }

		    return {key:text,text:text}
		    
		}

};