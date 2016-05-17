jQuery.sap.declare("accenture.com.ui.zmyinbox.util.HelperFunction");
accenture.com.ui.zmyinbox.util.HelperFunction = {
    GetBrowserType: function (){
         //get userAgent from browser
        var userAgent = navigator.userAgent;
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera";
        }
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } 
        if (userAgent.indexOf("Chrome") > -1){
          return "Chrome";
         }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } 
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }
    },
    
    SystemRoute: function(){
	   var pathName=window.location.host;
	   var BPMHost=""
	   if(pathName.indexOf("erpq")>=0){
	       BPMHost ="http://znbb-bpmq-01.zhenergy.com.cn:50000"; 
	   }else if(pathName.indexOf("erpt")>=0){
	       BPMHost = "http://znbb-bpmt-01.zhenergy.com.cn:50000"; 
	   }else if(pathName.indexOf("erpp")>=0){
	       BPMHost ="http://znbb-bpmprd.zhenergy.com.cn:50000";
	   }else{
	       BPMHost = "http://znbb-bpmd-01.zhenergy.com.cn:50000"; 
	   }
	   return BPMHost;
      
    },
    
    URLEnhance:function(ExecutionURL,InstanceId){
        var BPMHost=this.SystemRoute();
        var BrowserType=this.GetBrowserType();
        var EchancedURL=BPMHost
                        +"/webdynpro/dispatcher/sap.com/tc~bpem~wdui~taskinstance/ATaskExecution?taskId="
                        +InstanceId
                        +"&showLogOff=false";
        var CSSURL="&sap-cssurl="+BPMHost+"/com.sap.ui.lightspeed/themes/sap_corbu/ls/";
        switch(BrowserType){
            case "IE":
                CSSURL+="ls_ie6.css";
            break;
            case "FF":
                CSSURL+="ls_nn7.css";
            break;
            case "Chrome":
                CSSURL+="ls_sf3.css";
            break;
            default:
                CSSURL+="ls_nn7.css";
            break;
        }
        //check if the execution ui is using webdynpro tech
        if(ExecutionURL.indexOf("tc~bpem~wdui~taskinstance")>=0){
            //check if the execution ui is not using webdynpro ABAP
            if(ExecutionURL.indexOf("com.sap.portal.appintegrator.sap.WebDynpro")<0){
                EchancedURL+=CSSURL;
            }else{
                //if the execution ui is uing wd ABAP then the constructed url can not be used for safari
                    EchancedURL=ExecutionURL;
            }
        }else{
            //no need to enhance
            EchancedURL=ExecutionURL;
        }
        return EchancedURL;
    },
    URLEnhance2:function(ExecutionURL){
        var BPMHost=this.SystemRoute();
        var BrowserType=this.GetBrowserType();
        var EchancedURL=BPMHost
                        +ExecutionURL
                        +"&showLogOff=false";
        var CSSURL="&sap-cssurl="+BPMHost+"/com.sap.ui.lightspeed/themes/sap_corbu/ls/";
        switch(BrowserType){
            case "IE":
                CSSURL+="ls_ie6.css";
            break;
            case "FF":
                CSSURL+="ls_nn7.css";
            break;
            case "Chrome":
                CSSURL+="ls_sf3.css";
            break;
            default:
                CSSURL+="ls_nn7.css";
            break;
        }
        //check if the execution ui is using webdynpro tech
        if(ExecutionURL.indexOf("tc~bpem~wdui~taskinstance")>=0){
            //check if the execution ui is not using webdynpro ABAP
            if(ExecutionURL.indexOf("com.sap.portal.appintegrator.sap.WebDynpro")<0){
                EchancedURL+=CSSURL;
            }else{
                //if the execution ui is uing wd ABAP then the constructed url can not be used for safari
                    EchancedURL=ExecutionURL;
            }
        }else{
            //no need to enhance
            EchancedURL=ExecutionURL;
        }
        return EchancedURL;
    },
};