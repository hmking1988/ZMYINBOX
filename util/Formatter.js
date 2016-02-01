jQuery.sap.declare("accenture.com.ui.zmyinbox.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
accenture.com.ui.zmyinbox.util.Formatter = {
		_statusStateMap : { "READY" : "Success", "RESERVED" : "Warning", "IN_PROGRESS":"Warning" },
		UserInfo : function(name,id){
		    return name+"("+id+")";
		},
		
		
		listItemClass : function(value){
		    var sClass;
		    if(value==="RESERVED"){
		        sClass="reservedItem";
		    }else if(value==="IN_PROGRESS"){
		        sClass="in_progressItem";
		    }else if(value==="READY"){
		        sClass="readyItem";
		    }else{
		        sClass="executedItem";
		    }
		    return sClass;		    
		},
		taskTitle : function(name,title){
		    var taskTitle="";
		    if(name){
		        taskTitle+=name+"："+title;
		    }else{
		        taskTitle=title;
		    }
		    return taskTitle;
		},
		processor : function(status){
		    var processorName="";
		    var oUserInfo=sap.ui.getCore().getModel("UserModel");
		    if(status!="READY"){
		        processorName=oUserInfo.oData.fullName;
		    }else{
		        processorName="暂无处理人"
		    }
		    return processorName;
		},
		statusText : function (value) { 
			var bundle = this.getModel("i18n").getResourceBundle(); 
			return bundle.getText("StatusText" + value, "?"); 
		},
		prostatusText : function (value) { 
			var bundle = this.getModel("i18n").getResourceBundle(); 
			return bundle.getText("ProcessText" + value, "?"); 
		},
		priorityText : function (value) { 
			var bundle = this.getModel("i18n").getResourceBundle(); 
			return bundle.getText("PriorityText" + value, "?"); 
		}, 
		statusState : function (value) {
			var map = accenture.com.ui.zmyinbox.util.Formatter._statusStateMap; 
			return (value && map[value]) ? map[value] : "None"; 
		},
		statusIcon: function (value) {
		    var sIcon;
		    if(value==="RESERVED"){
		        sIcon="sap-icon://crm-service-manager";
		    }else if(value==="IN_PROGRESS"){
		        sIcon="sap-icon://begin";
		    }else if(value==="READY"){
		        sIcon="sap-icon://action";
		    }else{
		        sIcon="sap-icon://complete";
		    }
		    return sIcon;
		},
		statusCustonData : function (value) {
			 
			return value ? value : "None"; 
		},
		approveIcon:function (value) {
		    var sIcon;
		    if(value==0){
		        sIcon="sap-icon://employee-approvals";
		    }else if(value==1){
		        sIcon="sap-icon://employee-rejections";
		    }else if(value==2){
		        sIcon="sap-icon://activity-individual";
		    }else if(value==3){
		        sIcon="sap-icon://delete";
		    }else{
		        sIcon="sap-icon://activity-individual";
		    }
		    return sIcon;
		},
		approveText:function (value) {
		    var sText;
		    if(value==0){
		        sText="：审批同意";
		    }else if(value==1){
		        sText="：审批拒绝";
		    }else if(value==2){
		        sText="：重新提交";
		    }else if(value==3){
		        sText="：作废流程";
		    }else{
		        sText="：发起流程";
		    }
		    return sText;
		},
		date : function (value) {
			if (value) { 
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm"});
				return oDateFormat.format(new Date(value)); 
			} else {
				return value; 
			} 
		},
		quantity : function (value) { 
			try { 
					return (value) ? parseFloat(value).toFixed(0) : value; 
			} catch (err) { 
					return "Not-A-Number"; 
			}
			
		},
		formatterForwardUserIcon : function (sMimeType, sIconUrl) {
			if (sMimeType) {
				return sIconUrl;
			} else {
				return "sap-icon://person-placeholder";
			}
		},

		
		formatterAgentName: function(sDisplayName, sUniqueName) {
			if (sDisplayName) {
				return sDisplayName+"("+sUniqueName+")";
			} else {
				return sUniqueName;
			}
		},
		formatterCommentsIcon : function (sMimeType, sIconUrl) {
			if (sMimeType) {
				return sIconUrl;
			} else {
				return null;
			}
		},
		getEmployeeAddress: function (oAddress) {
			var sAddress = "";
			jQuery.each(oAddress, function(key, value) {
				if (jQuery.type(value) === "string") {
					value = value.trim();
					sAddress = value ? sAddress + value + " " : sAddress + value;
				}
			});
			return sAddress;
		},
		claimButtonVisible: function(status){
		  var bVisible=false;
		  if(status=="READY"){
		      bVisible=true;
		  }
		  return bVisible;
		},
		releaseButtonVisible: function(status){
		  var bVisible=false;
		  if(status=="RESERVED"){
		      bVisible=true;
		  }
		  return bVisible;
		},
		forwardButtonVisible: function(status){
		  var bVisible=false;
		  if(status=="RESERVED"||status=="READY"||status=="IN_PROGRESS"){
		      bVisible=true;
		  }
		  return bVisible;
		},
		openButtonVisible: function(status){
		  var bVisible=false;
		  var deviceModel=sap.ui.getCore().getModel("device");
		  if(deviceModel.getProperty("/isNoPhone")){
    		  if(status=="RESERVED"||status=="READY"||status=="IN_PROGRESS"){
    		      bVisible=true;
    		  }
		  }

		  return bVisible;
		},
		cancelButtonVisible: function(CreatedBy){
		  var bVisible=false;
		  var oUserInfo=sap.ui.getCore().getModel("UserModel").getData();
		  if(oUserInfo.id.toLowerCase()==CreatedBy){
    		  bVisible=true;
		  }
		  //autorization control for ECC 200 test
		  var user=oUserInfo.id.toLowerCase();
		  if(user=="ac-linlw"||user=="ac-map"||user=="ac-liuc"||user=="ac-lisj"){
		      console.log(user);
		  }else{
		      bVisible=false;
		  }

		  return bVisible;
		},
		NameCardUserIcon : function (sMimeType, sIconUrl) {
			if (sMimeType) {
				return sIconUrl;
			} else {
				return "./img/person-placeholder.png";
			}
		},
        getUniqueName : function(Agentid){
            var name;
            //in case the username is from bpm local ume
            if(Agentid.indexOf("USER.PRIVATE_DATASOURCE.un:")>=0){
                name=Agentid.substring(27);
            //in case the username if from LDAP
            }else if(Agentid.indexOf("USER.CORP_LDAP.")){
                name=Agentid.substring(15);
            }else{
                name=Agentid;
            }
            return name;
        },
};