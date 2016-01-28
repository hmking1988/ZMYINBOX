jQuery.sap.require("accenture.com.ui.zmyinbox.util.LoadData");

sap.ui.controller("accenture.com.ui.zmyinbox.view.ProcessTrack.Master", {
    onInit :function(evt){
    },
    back :function(evt){
        app.backToTop();
    },
    onQuery :function(evt){
        var query={};
        query.iStarted=this.byId("RB1").getProperty('selected');
        query.query=this.byId("onlymark").getProperty('value');
        query.sDate=this.byId("startDate").getProperty('value');
        query.eDate=this.byId("endDate").getProperty('value');
        accenture.com.ui.zmyinbox.util.LoadData.loadPTData(query);
        //ProcessTrack.app.to("PTEmpty");
    },
    handleRowSelect :function(evt){
		var context = evt.getSource().getBindingContext();
		this.nav.to("PTDetail", context);
    },
});