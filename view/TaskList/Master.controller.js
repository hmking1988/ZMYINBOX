jQuery.sap.require("accenture.com.ui.zmyinbox.util.Formatter");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Grouper");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.Forward");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.MultiSelect");
jQuery.sap.require("accenture.com.ui.zmyinbox.util.LoadData");
jQuery.sap.require("sap.m.BusyDialog");

sap.ui.controller("accenture.com.ui.zmyinbox.view.TaskList.Master", {
	extHookChangeFilterItems: null,
	extHookChangeSortConfig: null,
	extHookChangeGroupConfig: null,
	extHookGetCustomFilter: null,
	extHookChangeMassApprovalButtons: null,
	_FILTER_CATEGORY_PRIORITY: "Priority",
	_FILTER_PRIORITY_VERY_HIGH: "VERY_HIGH",
	_FILTER_PRIORITY_HIGH: "HIGH",
	_FILTER_PRIORITY_MEDIUM: "MEDIUM",
	_FILTER_PRIORITY_LOW: "LOW",
	_FILTER_CATEGORY_COMPLETION_DEADLINE: "CompletionDeadLine",
	_FILTER_EXPIRY_DATE_OVERDUE: "Overdue",
	_FILTER_EXPIRY_DATE_DUE_IN_7_DAYS: "DueIn7days",
	_FILTER_EXPIRY_DATE_DUE_IN_30_DAYS: "DueIn30days",
	_FILTER_EXPIRY_DATE_ALL: "All",
	_FILTER_CATEGORY_TASK_DEFINITION_NAME: "TaskDefinitionName",
	_FILTER_CATEGORY_TASK_DEFINITION_ID: "TaskDefinitionID",
	_FILTER_CATEGORY_STATUS: "Status",
	_FILTER_STATUS_NEW: "READY",
	_FILTER_STATUS_IN_PROGRESS: "IN_PROGRESS",
	_FILTER_STATUS_AWAITING_CONFIRMATION: "COMPLETED",
	_FILTER_STATUS_RESERVED: "RESERVED",
	_FILTER_STATUS_NOT_RESERVED: "READY:IN_PROGRESS:EXECUTED",
	_FILTER_CATEGORY_CREATION_DATE: "CreatedOn",
	_FILTER_CREATION_DATE_TODAY: "Today",
	_FILTER_CREATION_DATE_LAST_7_DAYS: "Last7Days",
	_FILTER_CREATION_DATE_LAST_30_DAYS: "Last30Days",
	_FILTER_CREATION_DATE_ALL: "All",
	_SORT_CREATEDON: "CreatedOn",
	_SORT_CREATEDONREVERSE: "CreatedOnReverse",
	_SORT_CREATEDBYNAME: "CreatedByName",
	_SORT_PRIORITY: "Priority",
	_SORT_PRIORITY_NUMBER: "PriorityNumber",
	_SORT_TASKTITLE: "TaskTitle",
	_SORT_COMPLETIONDEADLINE: "CompletionDeadLine",
	_SORT_SAPORIGIN: "SAP__Origin",
	_SORT_INSTANCEID: "InstanceID",
	_SORT_TASKDEFINITIONID: "TaskDefinitionID",
	_SORT_TASKDEFINITIONNAME: "TaskDefinitionName",
	_SORT_STATUS: "Status",
	_SORT_CREATEDBY: "CreatedBy",
	_SORT_PROCESSOR: "Processor",
	_SORT_STARTDEADLINE: "StartDeadLine",
	_SORT_EXPIRYDATE: "ExpiryDate",
	_SORT_ISESCALATED: "IsEscalated",
	_SORT_HASCOMMENTS: "HasComments",
	_SORT_HASATTACHMENTS: "HasAttachments",
	_SORT_HASPOTENTIALOWNERS: "HasPotentialOwners",
	_SORT_CONTEXTSERVICEURL: "ContextServiceURL",
	_CUSTOM_NUMBER_LABEL: "CustomNumberLabel",
	_CUSTOM_NUMBER_VALUE: "CustomNumberValue",
	_CUSTOM_NUMBER_UNIT_LABEL: "CustomNumberUnitLabel",
	_CUSTOM_NUMBER_UNIT_VALUE: "CustomNumberUnitValue",
	_CUSTOM_OBJECT_ATTRIBUTE_LABEL: "CustomObjectAttributeLabel",
	_CUSTOM_OBJECT_ATTRIBUTE_VALUE: "CustomObjectAttributeValue",
	_GROUP_SUPPORTSRELEASE: "SupportsRelease",
	_GROUP_STATUS_ORDER: [{
		Status: "READY",
		TextKey: "group.status.ready"
	},
	{
		Status: "IN_PROGRESS",
		TextKey: "group.status.in_progress"
	},
	{
		Status: "RESERVED",
		TextKey: "group.status.reserved"
	},
	{
		Status: "COMPLETED",
		TextKey: "group.status.executed"
	}],
	aItemContextPathsToSelect: [],
	complexFilter: {
		Priority: [],
		CompletionDeadLine: [],
		TaskDefinitionID: [],
		Status: [],
		CreatedOn: [],
		CustomNumberValue: [],
		CustomNumberUnitValue: [],
		CustomObjectAttributeValue: []
	},
	sSearchPattern_Support: "",
	sFilterKey_Support: "",
	sSortKey_Support: "",
	sGroupkey_Support: "",
	
	//check if defalut group is set of not
	_GLOBLE_GROUP_SORTERS:false,
    _timeout:null,
    //check if the list has been customized
    _IS_FILTER_CHANGED:false,
    
    
	onInit: function(){
        var oView=this.getView();
        var oList=this.getView().byId("list");
        var oGroupSelect=this.getView().byId("groupSelect");
        var t=this;
        var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
        if(selectedTaskModel){
            this.complexFilter.TaskDefinitionID.push(selectedTaskModel.oData.selectedTask);
        }
        oList.addEventDelegate({
        //addEventDelegate for customizing icon color and collapsable grouping for the list
          onAfterRendering: function() {
            //set global filter
            var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
            if(selectedTaskModel.oData.selectedTask=="PTStart" || selectedTaskModel.oData.selectedTask=="PTApprove"){
                return;
            }
            //customize list
            //console.log("incon color and collapsable grouping for the list set from onAfterRendering");
            t.CustomizeList(true);
            if(selectedTaskModel.oData.IsInit){
        		var oButton=$('#Master--filter-inner');
        		for(var i in t.complexFilter){
                    t.complexFilter[i]=[];
        		}
                if(selectedTaskModel){
                    t.complexFilter.TaskDefinitionID.push("TaskDefinitionID:"+selectedTaskModel.oData.selectedTask);
                    t.sInfoHeaderFilterString="已按此过滤： 任务类型 ("+selectedTaskModel.oData.selectedTaskName+")";
                    //this.onShowFilter();
                }
                var oCount=oButton.find("span.sapMITBCount");
            	if(oCount.length>0){
        		    oCount.html("1");
        		}else{
        		    oButton.append("<span class='sapMITBCount'>1</span>");
        		}
        		selectedTaskModel.oData.IsInit=false;
            }
            
           

            
          },
        //addEventDelegate for filtering from overview page and default grouping for status
          onBeforeRendering: function(){
              //set default group option
              var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
              if(selectedTaskModel.oData.selectedTask=="PTStart" || selectedTaskModel.oData.selectedTask=="PTApprove"){
                  return;
              }
              if(!t._GLOBLE_GROUP_SORTERS){
                    //console.log("group set form TL Master:list onbeforeRendering event");
            		var sorters=[];
            		var key="Status";
    				accenture.com.ui.zmyinbox.util.Grouper.bundle = sap.ui.getCore().getModel("i18n").getResourceBundle(); 
    				var grouper = accenture.com.ui.zmyinbox.util.Grouper[key]; 
    				//console.log(new sap.ui.model.Sorter(key, true, grouper));
    				sorters.push(new sap.ui.model.Sorter(key, true, grouper)); 
            		// update binding 
            		var oBinding = oList.getBinding("items"); 
            		oBinding.sort(sorters);
            		oGroupSelect.setSelectedKey("Status");
            		t._GLOBLE_GROUP_SORTERS=sorters;
              }
          },
        }, oList);
        
	},
    setcomplexFilterHook: function(complexFilter){
        this.complexFilter=complexFilter;
    },
	CustomizeList : function (bAutoCollapse) {
	    var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
        var t=this;
        var olist=this.getView().byId("list");
        var ul = $("#Master--list-listUl");
        // helper function to show/hidden node
        function show(attr, bShow) {
          ul.find('li').each(function() {
            var item = $(this);
            if (item.attr('itemparent') === attr) {
              item.css('display', bShow ? 'inherit' : 'none');   
            }
          });
        }
        // Step C. add parrent Id as attribute in the non header LI
        var header = null;
        ul.find('li').each(function() {
          var item = $(this);
          if (item.hasClass('sapMGHLI')) {
            header = item.attr('id');
          } else {
            item.attr('itemparent', header);
            //customizing the icon
            var status=item.attr("data-listitem-status");
            var cIcon=item.find("span.sapUiIcon");
            if(status==="READY"){
                cIcon.addClass("readyItem");
            }else if(status==="RESERVED"){
                cIcon.addClass("reservedItem");
            }else if(status==="IN_PROGRESS"){
                cIcon.addClass("in_progressItem");
            }else{
                cIcon.addClass("executedItem");
            }
            if(t._GLOBLE_GROUP_SORTERS&&t._GLOBLE_GROUP_SORTERS.length==0){
                item.css('display',  'inherit' );
            }
          }
        });         
        // Step B. for each header node, do these
        
        if(bAutoCollapse){
            //only auto-acllope when naving from overview page or the filter is changed;
            if(selectedTaskModel.oData.IsInit || t._IS_FILTER_CHANGED){
                bAutoCollapse=true;
                if(t._IS_FILTER_CHANGED){
                    t._IS_FILTER_CHANGED=false;
                }
            }else{
                bAutoCollapse=false;
            }
        }
        
        
        ul.find('.sapMGHLI .sapMLIBContent').each(function() {
            var item = $(this);
            if(bAutoCollapse){
                var groupText=item[0].innerText;
                // TODO: need to change the type to the bundle type
                if(groupText=="待处理"){
                    item.addClass('listExpand'); // add expand icon to the header
                }else{
                    item.addClass('listCollapse');
                    show(item.parent().attr('id'), false);
                }
            }else{
                if(item.hasClass('listExpand')||item.hasClass('listCollapse')){
                    return;
                }
                item.addClass('listExpand'); // add expand icon to the header
            }
          
          
          // when header is created. show/hide its children LI accordingly
          // how does it know its children LI
          // see step C.
          item.click(function() {
            if (item.hasClass('listExpand')) {
              show(item.parent().attr('id'), false);
              item.removeClass('listExpand');
              item.addClass('listCollapse');
            } else {
              show(item.parent().attr('id'), true);
              item.removeClass('listCollapse');
              item.addClass('listExpand');
            }
          });
        });
	},


    handleGrowingFinished: function(evt){
        var selectedTaskModel=sap.ui.getCore().getModel('selectedTask');
        if(selectedTaskModel){
            if(selectedTaskModel.oData.selectedTask=="PTStart" || selectedTaskModel.oData.selectedTask=="PTApprove"){
                return;
            }
        }
        //customize list
        //console.log("incon color and collapsable grouping for the list set from handleGrowingFinished");
        this.CustomizeList(false);
    },

	getList: function(){
	    var list = this.getView().byId("list");
	    return list;
	},
	
	_populateAllUniqueCustomAttributes: function(p){
		var l =this.getList().getItems();
		var a=[];
		var m={};
		for(var i=0;i<l.length;i++){
			var L=l[i];
			var c=L.getBindingContext();
			if(!c){
				continue;
			}
			var v=c.getProperty(p);
			if(v&&!m.hasOwnProperty(v)){
				m[v]=true;
				a.push(v);
			}
		}
		return a;
	},
	
	_areItemsUniqueByTaskType: function(){
		var l=this.getList().getItems();
		if(!l||l.length===0){
			return false;
		}
		var a=0;
		var b=l[a].getBindingContext();
		if(!b){
			if(l.length===1){
				return false;
			}
			a+=1;
			b=l[a].getBindingContext();
		}
		var B;
		var i,c;
		for(i=a+1,c=l.length;i<c;i++){
			B=l[i].getBindingContext();
			if(B&&B.getProperty("TaskDefinitionID")!=b.getProperty("TaskDefinitionID")){
				return false;
			}
		}
		return true;
	},
	
	_findFilterKey: function(f){
		for(var a in this.complexFilter){
			var b=this.complexFilter[a];
			for(var i=0;i<b.length;i++){
				if(b[i]===f){
					return true;
				}
			}
		}
		return false;
	},
	
	_resetFilterState: function(){
		this.complexFilterBackup=this.complexFilter;this.complexFilter={
			Priority: [],
			CompletionDeadLine: [],
			TaskDefinitionID: [],
			Status: [],
			CreatedOn: [],
			CustomNumberValue: [],
			CustomNumberUnitValue: [],
			CustomObjectAttributeValue: []
		};
	},
	
	_saveFilterState: function(f){
		this._resetFilterState();
		for(var k in f){
			var a=k.split(":");
			if(!this.complexFilter[a[0]]){
				this.complexFilter[a[0]]=[];
			}
			this.complexFilter[a[0]].push(k);
		}
	},
	
	_createFilterCategory: function(t,m){
		var i=true;
		if(arguments.length==2){
			i=m;
		}
		return new sap.m.ViewSettingsFilterItem({
						text: t,
						multiSelect: i
					});
	},
	
	_createFilterItem: function(k,t){
		var f=new sap.m.ViewSettingsItem({
				text: t,
				key: k
			});
		if(this._findFilterKey(k)){
			f.setSelected(true);
		}
		return f;
	},	
	refreshInfoHeaderToolbar: function(t){
		if(!t){
			var t="";
		}
		if(this.sInfoHeaderGroupString){
		    if(t){
		        t+="; ";
		    }
			
			t+=this.sInfoHeaderGroupString;
		}
		if(this.sInfoHeaderFilterString){
		    //console.log(this.sInfoHeaderFilterString);
			if(t){
			    t+="; ";
			}
			
			t+=this.sInfoHeaderFilterString;
		}
		//console.log(t);
		this.refreshInfoHeaderToolbarForList(this.getList(),t);
		this.refreshInfoHeaderToolbarForList(this._emptyList,t);
	},
	refreshInfoHeaderToolbarForList: function(l,t){
		if(!l){
		    return;
		}
		var h=l.getHeaderToolbar();
		if(t){
			if(!h){
				h=new sap.m.Toolbar({
					    design: sap.m.ToolbarDesign.Info
				    });
				l.setHeaderToolbar(h);
			}
			h.destroyContent();
			h.addContent(new sap.m.Label({
				                text: t,
				                tooltip: t
			            }));
		}else{
			if(h){
			    l.destroyHeaderToolbar();
			}
		}
	},    
    back :function(evt){
        //rest globle group sorters
        this._GLOBLE_GROUP_SORTERS=false;
    	if (this.isMultiSelectActive()){
    	    this.onShowMultiSelect();
    	}
        app.backToTop();
    },
    onRefresh : function(fnSuccess){
        //console.log("master.onrefresh")
        //console.log("into the master list")
        //preparation
		var list = this.getView().byId("list");
		var oBinding = list.getBinding("items");
		var filters=oBinding.aFilters;
		var sorts=oBinding.aSorters;
        
		// instantiate dialog
		var t=this;
		if (!this._dialog) {
			this._dialog = sap.ui.xmlfragment("accenture.com.ui.zmyinbox.frag.BusyDialogLoadingData", this);
			this.getView().addDependent(this._dialog);
		}

		// open dialog
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
		this._dialog.open();

        //close the dialog when dataloading is done
		accenture.com.ui.zmyinbox.util.LoadData.loadTLData(null,false,true).done(
		    function(){
		        var list = t.getView().byId("list");
	        	var oBinding = list.getBinding("items");
		        oBinding.filter(filters);
		        oBinding.sort(sorts);
		        t._dialog.close();
		        if(fnSuccess){
		            fnSuccess();
		        }
		    });
			
    },
	handleListItemPress : function (evt) {
	    //console.log(!this.isMultiSelectActive());
	    if(!this.isMultiSelectActive()){
    		var context = evt.getSource().getBindingContext();
    		this.nav.to("Detail", context);	        
	    }
	},
	
	handleDoubleClick: function(evt){
	    alert("double clicked");
	},
	handleSearch : function (evt) { 
		// create model filter 
		var filters = []; 
		var query = evt.getParameter("query"); 
		if (query && query.length > 0) { 
			var filter = new sap.ui.model.Filter("TaskTitle", sap.ui.model.FilterOperator.Contains, query); 
			filters.push(filter); 
		} 
		// update list binding 
		var list = this.getView().byId("list"); 
		var binding = list.getBinding("items"); 
		binding.filter(filters); 
	},
	
	handleListSelect : function (evt) { 
	    if(!this.isMultiSelectActive()){
    		var context = evt.getParameter("listItem").getBindingContext();
    		this.nav.to("Detail", context);	        
	    }
	},
	
	handleGroup : function (evt) {
		// compute sorters 
        this._GLOBLE_GROUP_SORTERS=[];
		var item = evt.getParameter("selectedItem");
		var key = (item) ? item.getKey() : null;
		accenture.com.ui.zmyinbox.util.Grouper.bundle = this.getView().getModel("i18n").getResourceBundle(); 
		var grouper = accenture.com.ui.zmyinbox.util.Grouper[key];
		//console.log(item.getKey());
		if ("Status" == key) { 
			//console.log(new sap.ui.model.Sorter(key, true, grouper));
			this._GLOBLE_GROUP_SORTERS.push(new sap.ui.model.Sorter(key, true, grouper)); 
		}
		if("Process" == key){
		    var oSorter = new sap.ui.model.Sorter("", null,grouper);
            oSorter.fnCompare = function(a, b) {
                var agroup="";
                if(a.CustomAttributeData.results){
                    for(var i=0;i<a.CustomAttributeData.results.length;i++){
                        if(a.CustomAttributeData.results[i].Name=="Process"){
                            agroup=a.CustomAttributeData.results[i].Value;
                        }
                    }                    
                }

                var bgroup="";
                if(b.CustomAttributeData.results){
                    for(var i=0;i<b.CustomAttributeData.results.length;i++){
                        if(b.CustomAttributeData.results[i].Name=="Process"){
                            agroup=b.CustomAttributeData.results[i].Value;
                        }
                    } 
                }

                if (agroup < bgroup) return -1;
                if (agroup > bgroup) return  1;
                return 0;
            }
            this._GLOBLE_GROUP_SORTERS.push(oSorter);
		}
		// update binding 
		var list = this.getView().byId("list"); 
		var oBinding = list.getBinding("items"); 
		oBinding.sort(this._GLOBLE_GROUP_SORTERS);
	},
	
	handleFilter: function(f){
	    //console.log(this.complexFilter);
/*		var F=this.getFilter(f);
		this.sFilterKey_Support=f;
		var a=this.getAllFilters(F);
		this.getList().getBinding("items").aApplicationFilters=[];
		this.iTotalFilteredItems=this.getList().getBinding("items").filter(a).iLastEndIndex;*/
		var filters=this.getFilter(f);
		var list = this.getView().byId("list"); 
		var oBinding = list.getBinding("items");
		this._IS_FILTER_CHANGED=true;
		oBinding.filter(filters);
		
		var oButton=$('#Master--filter-inner');
		var count=0;
		for(var i in this.complexFilter){
		    for(var j=0;j<this.complexFilter[i].length;j++){
		        count++;
		    }
		}
		var oCount=oButton.find("span.sapMITBCount");
		if(oCount.length>0){
		    oCount.html(count);
		}else{
		    oButton.append("<span class='sapMITBCount'>"+count+'</span>');
		}
		
            //check if the detail view needs to be set to the empty view
    		//set the detail page to Empty if the device is not a phone
    		var deviceModel=sap.ui.getCore().getModel("device");
    		if(deviceModel.getProperty("/isNoPhone")){
    		    this.nav.to("Empty")
    		}
	},

	getFilter: function(f){
		var F=null;
		var c=null;
		var p=[];
		var d=null;
		var t=[];
		var T=[];
		var s=[];
		var S=[];
		var a=[];
		var C=null;
		var e=true;
		for(var k in f){
			e=false;
			if(f.hasOwnProperty(k)&&k){
				var K=k.split(":");
				//console.log(K);
				if(K[0]===this._FILTER_CATEGORY_PRIORITY){
					var P=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.EQ,K[1]);
					p.push(P);
				}else if(K[0]===this._FILTER_CATEGORY_COMPLETION_DEADLINE){
					if(K[1]===this._FILTER_EXPIRY_DATE_ALL){
						continue;
					}
					var b=new Date();
					if(K[1]===this._FILTER_EXPIRY_DATE_OVERDUE){
						var g=new Date();
						g.setHours(0,0,0,0);
						d=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.BT,new Date(0),g);
					}else if(K[1]===this._FILTER_EXPIRY_DATE_DUE_IN_7_DAYS){
						var h=new Date();
						h.setDate(b.getDate()+8);h.setHours(0,0,0,0);
						d=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.BT,b,h);
					}else if(K[1]===this._FILTER_EXPIRY_DATE_DUE_IN_30_DAYS){
						var j=new Date();
						j.setDate(b.getDate()+31);j.setHours(0,0,0,0);
						d=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.BT,b,j);
					}
				}else if(K[0]===this._FILTER_CATEGORY_TASK_DEFINITION_ID){
					var o=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.EQ,K[1]);
					T.push(o);
				}else if(K[0]===this._FILTER_CATEGORY_STATUS){
					var l=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.EQ,K[1]);
					S.push(l);
				}else if(K[0]===this._FILTER_CATEGORY_CREATION_DATE){
					if(K[1]===this._FILTER_CREATION_DATE_ALL){
						continue;
					}
					var b=new Date();
					if(K[1]===this._FILTER_CREATION_DATE_TODAY){
						var g=new Date();
						g.setHours(0,0,0,0);
						C=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.GE,g);
					}else if(K[1]===this._FILTER_CREATION_DATE_LAST_7_DAYS){
						var m=new Date();
						m.setDate(b.getDate()-7);m.setHours(0,0,0,0);
						C=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.GE,m);
					}else if(K[1]===this._FILTER_CREATION_DATE_LAST_30_DAYS){
						var n=new Date();
						n.setDate(b.getDate()-30);n.setHours(0,0,0,0);
						C=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.GE,n);
					}
				}else{
					var A=new sap.ui.model.Filter(K[0],sap.ui.model.FilterOperator.EQ,K[1]);
					a.push(A);
				}
			}
		}
		var q={
			selectedFilterOptions: f,
			taskDefinitionFilter: T,
			statusFilter: S,
			priorityFilter: p,
			dueDateFilter: d,
			creationDateFilter: C,
			additionalFilters: a
		};
		if(this.extHookGetCustomFilter){
			this.extHookGetCustomFilter(q);
		}
		if(e){
			return F;
		}
		var r=[];
		if(q.priorityFilter.length>1){
			var u=new sap.ui.model.Filter(q.priorityFilter,false);
			r.push(u);
		}else if(q.priorityFilter.length==1){
			r.push(q.priorityFilter[0]);
		}
/*		console.log("after push priority Fileter:")
		console.log(r);*/
		if(q.statusFilter.length>1){
			var u=new sap.ui.model.Filter(q.statusFilter,false);
			r.push(u);
		}else if(q.statusFilter.length==1){
			r.push(q.statusFilter[0]);
		}
/*		console.log("after push status Fileter:")
		console.log(r);*/
		if(q.dueDateFilter){
			r.push(q.dueDateFilter);
		}
/*		console.log("after push task type Fileter:")
		console.log(r);*/
		if(q.taskDefinitionFilter.length>1){
			var u=new sap.ui.model.Filter(q.taskDefinitionFilter,false);
			r.push(u);
		}else if(q.taskDefinitionFilter.length==1){
			r.push(q.taskDefinitionFilter[0]);
		}
/*		console.log("after push dueDate Fileter:");
		console.log(r);*/
		if(q.creationDateFilter){
			r.push(q.creationDateFilter);
		}
/*		console.log("after push CreationDate Fileter:");
		console.log(r);*/
		if(q.additionalFilters.length>1){
			var v=new sap.ui.model.Filter(q.additionalFilters,true);
			r.push(v);
		}else if(q.additionalFilters.length==1){
			r.push(q.additionalFilters[0]);
		}
/*		console.log("after push addtional Fileter:");
		console.log(r);*/
		if(r.length>1){
			F=new sap.ui.model.Filter(r,true);
		}else if(r.length==1){
			F=r[0];
		}
/*		console.log("++++++++++++++++++++");
		console.log(this.complexFilter);
		console.log(F);
		console.log("++++++++++++++++++++");*/
		return F;
	},
	
	
    onShowFilter: function(){
    		var t=this;
    		var a=t.getView().getModel("i18n").getResourceBundle();
    		
            //create filter category for priority
    		var p=this._createFilterCategory(a.getText("filter.priority"));
    		var V=this._FILTER_CATEGORY_PRIORITY+":"+this._FILTER_PRIORITY_VERY_HIGH;
    		var v=this._createFilterItem(V,a.getText("view.Workflow.priorityVeryHigh"));
    		p.addItem(v);
    		var H=this._FILTER_CATEGORY_PRIORITY+":"+this._FILTER_PRIORITY_HIGH;
    		var h=this._createFilterItem(H,
    		a.getText("view.Workflow.priorityHigh"));
    		p.addItem(h);
    		var M=this._FILTER_CATEGORY_PRIORITY+":"+this._FILTER_PRIORITY_MEDIUM;
    		var f=this._createFilterItem(M,
    		a.getText("view.Workflow.priorityMedium"));
    		p.addItem(f);
    		var L=this._FILTER_CATEGORY_PRIORITY+":"+this._FILTER_PRIORITY_LOW;
    		var l=this._createFilterItem(L,
    		a.getText("view.Workflow.priorityLow"));
    		p.addItem(l);
    		
    		//create filter category for due date
    		var d=this._createFilterCategory(a.getText("filter.dueDate"),false);
    		var O=this._FILTER_CATEGORY_COMPLETION_DEADLINE+":"+this._FILTER_EXPIRY_DATE_OVERDUE;
    		var o=this._createFilterItem(O,
    		a.getText("filter.dueDate.overdue"));
    		d.addItem(o);
    		var D=this._FILTER_CATEGORY_COMPLETION_DEADLINE+":"+this._FILTER_EXPIRY_DATE_DUE_IN_7_DAYS;
    		var b=this._createFilterItem(D,
    		a.getText("filter.dueDate.dueWithin7Days"));
    		d.addItem(b);
    		var c=this._FILTER_CATEGORY_COMPLETION_DEADLINE+":"+this._FILTER_EXPIRY_DATE_DUE_IN_30_DAYS;
    		var e=this._createFilterItem(c,a.getText("filter.dueDate.dueWithin30Days"));
    		d.addItem(e);
    		var g=this._FILTER_CATEGORY_COMPLETION_DEADLINE+":"+this._FILTER_EXPIRY_DATE_ALL;
    		var k=this._createFilterItem(g,
    		a.getText("filter.dueDate.all"));
    		d.addItem(k);
    		
    		
    		//create filter category for taskType
    		var m=this._createFilterCategory(a.getText("filter.taskType"));
    		this.aTaskTypeFilterItems=new Array();
    		var overviewModel=sap.ui.getCore().getModel("OverViewData");
    		this.aTaskTypeFilterItems=overviewModel.oData.results;
/*			for(var i=0;i<this.aTaskTypeFilterItems.length;i++){
				var q=this._FILTER_CATEGORY_TASK_DEFINITION_ID+":"+this.aTaskTypeFilterItems[i].taskDefinitionID;
				var u=this._createFilterItem(q,this.aTaskTypeFilterItems[i].taskTitle);
				m.addItem(u);
			}*/
			for(var i=0;i<this.aTaskTypeFilterItems.length;i++){
				var q=this._FILTER_CATEGORY_TASK_DEFINITION_ID+":"+this.aTaskTypeFilterItems[i].DefinitionId;
				var u=this._createFilterItem(q,this.aTaskTypeFilterItems[i].ProcessName);
				m.addItem(u);
			}
			//create filter category for status
			var w=this._createFilterCategory(a.getText("filter.status"));
			var x=this._FILTER_CATEGORY_STATUS+":"+this._FILTER_STATUS_NEW;
			var y=this._createFilterItem(x,a.getText("filter.status.new"));
			w.addItem(y);
			var z=this._FILTER_CATEGORY_STATUS+":"+this._FILTER_STATUS_IN_PROGRESS;
			var A=this._createFilterItem(z,a.getText("filter.status.inProgress"));
			w.addItem(A);
			var B=this._FILTER_CATEGORY_STATUS+":"+this._FILTER_STATUS_AWAITING_CONFIRMATION;
			var C=this._createFilterItem(B,a.getText("filter.status.awaitingConfirmation"));
			w.addItem(C);
			var E=this._FILTER_CATEGORY_STATUS+":"+this._FILTER_STATUS_RESERVED;
			var F=this._createFilterItem(E,a.getText("filter.status.reserved"));
			w.addItem(F);
			
			//create filter category for creationDate
			var G=this._createFilterCategory(a.getText("filter.creationDate"),false);
			var I=this._FILTER_CATEGORY_CREATION_DATE+":"+this._FILTER_CREATION_DATE_TODAY;
			var J=this._createFilterItem(I,a.getText("filter.creationDate.today"));
			G.addItem(J);
			var K=this._FILTER_CATEGORY_CREATION_DATE+":"+this._FILTER_CREATION_DATE_LAST_7_DAYS;
			var N=this._createFilterItem(K,a.getText("filter.creationDate.last7Days"));
			G.addItem(N);
			var Q=this._FILTER_CATEGORY_CREATION_DATE+":"+this._FILTER_CREATION_DATE_LAST_30_DAYS;
			var R=this._createFilterItem(Q,a.getText("filter.creationDate.last30Days"));
			G.addItem(R);
			var T=this._FILTER_CATEGORY_CREATION_DATE+":"+this._FILTER_CREATION_DATE_ALL;
			var U=this._createFilterItem(T,a.getText("filter.creationDate.all"));
			G.addItem(U);
			
			
			/*
			    all the filter category has been set.
			    p:priority
			    d:due date
			    m:task type
			    w:status
			    G:creationDate
			*/
			this.aFilterItems=[p,d,m,w,G];
/*    			if(this._areItemsUniqueByTaskType()){
				var W=null;
				var X=this.getList().getItems();
				if(X&&X.length>0){
					W=X[0].getBindingContext();
				}
				if(!W){
					W=X[1].getBindingContext();
				}
				var Y=this._populateAllUniqueCustomAttributes(this._CUSTOM_NUMBER_VALUE);
				Y.sort();
				if(Y.length>0 && Y.length<X.length/2){
					var Z=this._createFilterCategory(W.getProperty(this._CUSTOM_NUMBER_LABEL),false);
					this.aFilterItems.push(Z);
					for(var i=0,$=Y.length;i<$;i++){
						var _=this._CUSTOM_NUMBER_VALUE+":"+Y[i];
						var a1=this._createFilterItem(_,Y[i]);
						Z.addItem(a1);
					}
				}
				var b1=this._populateAllUniqueCustomAttributes(this._CUSTOM_NUMBER_UNIT_VALUE);
				b1.sort();
				if(b1.length>0&&b1.length<X.length/2){
					var c1=this._createFilterCategory(W.getProperty(this._CUSTOM_NUMBER_UNIT_LABEL),false);
					this.aFilterItems.push(c1);
					for(var i=0,$=Y.length;i<$;i++){
						var d1=this._CUSTOM_NUMBER_UNIT_VALUE+":"+b1[i];
						var e1=this._createFilterItem(d1,b1[i]);
						c1.addItem(e1);
					}
				}
				var f1=this._populateAllUniqueCustomAttributes(this._CUSTOM_OBJECT_ATTRIBUTE_VALUE);
				f1.sort();
				if(f1.length>0&&f1.length<X.length/2){
					var g1=this._createFilterCategory(W.getProperty(this._CUSTOM_OBJECT_ATTRIBUTE_LABEL),false);
					this.aFilterItems.push(g1);
					for(var i=0,$=f1.length;i<$;i++){
						var h1=this._CUSTOM_OBJECT_ATTRIBUTE_VALUE+":"+f1[i];
						var i1=this._createFilterItem(h1,f1[i]);
						g1.addItem(i1);
					}
				}
			}*/
/*    			if(this.extHookChangeFilterItems){
				this.extHookChangeFilterItems(this.aFilterItems);
			}*/
			var j1=new sap.m.ViewSettingsDialog({
													title: a.getText("filter.dialog.title"),
													filterItems: this.aFilterItems,
													confirm: function(k1){
														this.destroy();
														t.oFilterKeys=k1.getParameter("filterKeys");
														if(Object.keys(t.oFilterKeys).length===0){
															t.sInfoHeaderFilterString=null;
														}else{
															var l1=k1.getParameter("filterString");
															t.sInfoHeaderFilterString=l1;
														}
														t.refreshInfoHeaderToolbar();
/*														if(t.aTaskTypeFilterItems.length>1&&!t._doesFilterContainOneTaskDefinitionId(t.oFilterKeys)){
															t._removeCustomAttributesFromFilter(t.oFilterKeys);
															if(t._isListSortedByCustomAttribute()){
																t.oGroupConfigItem=null;
																t._removeCustomAttributesSorter();
															}
														}*/
														t._saveFilterState(t.oFilterKeys);
														t.handleFilter(t.oFilterKeys);
														
													},
													cancel: function(k1){
														if(t.resetInitiated){
															t.complexFilter=t.complexFilterBackup;
															t.resetInitiated=false;
														}
														this.destroy();
													},
													resetFilters: function(k1){
														t.resetInitiated=true;
														t._resetFilterState();
													}
			});
			j1.open();
    
    	},  

    onSelectAll: function(){
    	this.getList().selectAll();
    },
	isMultiSelectActive: function() {
		return (this.getList().getMode() == sap.m.ListMode.MultiSelect);
	},
	
	onShowMultiSelect: function(){
	    var oButton=this.byId("multiSelect");
	    var oButton2=this.byId("selectAll");
		if (!this.isMultiSelectActive()) {
			// Turn on multi-select.
			oButton.setIcon("sap-icon://sys-cancel");
			oButton2.setVisible(true);
			this.prepareMultiSelect();
		} else {
			// Turn off multi-select.
			oButton.setIcon("sap-icon://multi-select");
			oButton2.setVisible(false);
			this.dismissMultiSelect();
		}
	},

	prepareMultiSelect : function() {
		//this.setMultiSelectButtonActive(false);
		var aListItems = this.getList().getItems();
        

		if (aListItems.length == 0){
			// If list is empty, don't turn on multi-select.
			return;
		}

		var aFilterItems = [];
		var overviewModel=sap.ui.getCore().getModel("OverViewData");
		this.aTaskTypeFilterItems=overviewModel.oData.results;
		for(var i=0;i<this.aTaskTypeFilterItems.length;i++){
			aFilterItems.push({
								title :  this.aTaskTypeFilterItems[i].ProcessName,
								id	  :  this.aTaskTypeFilterItems[i].DefinitionId,
								origin:  "BPM"
							})
		}
		if (aFilterItems.length > 1) {
			// If multiple TaskDefinitionIDs are present,
			// then show selection dialog.
			// Do nothing if the user cancels the dialog.

			aFilterItems.sort(function(a, b) {
				if (a.title < b.title)
					return -1;
				if (a.title > b.title)
					return 1;
				return 0;
			});

			accenture.com.ui.zmyinbox.util.MultiSelect
			.openFilterDialog(aFilterItems,
			                    jQuery.proxy(this.multiSelectFilterDialogOK,this), 
			                    jQuery.proxy(this.multiSelctFilterDialogCancel,this));
		} else {
			// If we have only one TaskDefinitionID, then
			// selection dialog is not needed.

			var oFilterItem = aFilterItems[0];
			$.proxy(this.multiSelectFilterDialogOK(oFilterItem),this);
		}
	},
	multiSelectFilterDialogOK: function(oFilterItem) {        
		// Remember which listitem was selected, the sorters and filters before turning on multi-select.
		var t=this;
		var oList = this.getList();
		var oSelectedListItem = oList.getSelectedItem();
		var oBinding = oList.getBinding("items");
		this.ofilters=oBinding.aFilters;
		this.osorts=oBinding.aSorters;

		if (oSelectedListItem) {
			var oContext = oSelectedListItem.getBindingContext();
			
			this.oBeforeMultiSelectItem = {
					SAP__Origin: oContext.getProperty("SAP__Origin"),
					InstanceID: oContext.getProperty("InstanceID")
			};
		} else {
			this.oBeforeMultiSelectItem = null;
		}

		oList.removeSelections(true);
		
		//this._oControlStore.oMasterSearchField.setValue("");
		var i18nBundle = this.getView().getModel("i18n").getResourceBundle();
		var h=oList.getHeaderToolbar();
    	if(!h){
			h=new sap.m.Toolbar({
				    design: sap.m.ToolbarDesign.Info
			    });
			oList.setHeaderToolbar(h);
		}
		h.destroyContent();
		h.addContent(new sap.m.Label({
			                text: i18nBundle.getText("multi.header", i18nBundle.getText("group.taskType") +" ("+ oFilterItem.title + ")")
		            }));
		var filter1 = new sap.ui.model.Filter(this._FILTER_CATEGORY_TASK_DEFINITION_ID, sap.ui.model.FilterOperator.EQ, oFilterItem.id);
		var filter2 = new sap.ui.model.Filter(this._FILTER_CATEGORY_STATUS, sap.ui.model.FilterOperator.NE, this._FILTER_STATUS_AWAITING_CONFIRMATION);
		var filter=new sap.ui.model.Filter({filters:[filter1,filter2],and:true});
		oBinding.filter(filter);
		oList.setMode(sap.m.ListMode.MultiSelect);
		
		//set the detail page to Empty if the device is not a phone
		var deviceModel=sap.ui.getCore().getModel("device");
		if(deviceModel.getProperty("/isNoPhone")){
		    this.nav.to("Empty")
		}
		
		// Show decision buttons and hide iflter button
		var oButton=this.byId("filter");
		oButton.setVisible(false);
		if(oBinding.aIndices.length>0){
		    var oItem=oBinding.oModel.oData[oBinding.aIndices[0]];
		    accenture.com.ui.zmyinbox.util.LoadData.loadDOData(oItem.InstanceID,true)
		        .done(function(data){
                var TaskID=oItem.InstanceID;
                //set decision options for single task
                function handleDOClosure(DOKey,DOText,evt){
                    t.DOKey=DOKey;
                    t.DOText=DOText;
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
            					press: function(){
            					    t.DOText=DOText;
            					    t.DOKey=DOKey;
            					    $.proxy(t.handleMassiveProcess(),t);
            					    dialog.close();
            					    
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
                
                var oTaskEntity=oItem;
                var DOList=data.results;
                var oBar=t.byId("myMasterBar");
                var oButtonList=$("#Master--myMasterBar-BarRight").find("button").each(function(){
                    var item = $(this);
                      if(item.attr("id").indexOf("DecisionOption")>=0)
                      {
                        var button=sap.ui.getCore().byId(item.attr("id"));
                        button.destroy();
                      }                    
                });
                for(var i=0;i<DOList.length;i++){
                    var oBtn = new sap.m.Button({
                        id: "DecisionOptionMaster"+i,
                        text : DOList[i].DecisionText,
                        press: handleDOClosure(DOList[i].DecisionKey,DOList[i].DecisionText)
                      });
                    oBar.addContentRight(oBtn); 
                }

		        })
		        .fail(function(evt){
		            sap.m.MessageToast.show("获取决策列表失败");
		        })
		}
		
		
	},
	multiSelctFilterDialogCancel: function(){
	    var oButton=this.byId("multiSelect");
	    var oButton2=this.byId("selectAll");
	    oButton2.setVisible(false);
        oButton.setIcon("sap-icon://multi-select");
	},
	dismissMultiSelect: function() {
		//this.setMultiSelectButtonActive(false);

		var oList = this.getList();
		
		// Remove custom header and put back the original.

		oList.destroyHeaderToolbar();
		oList.destroyInfoToolbar();
		
		// Switch list to normal mode.
		
		oList.setMode(this.getView().getModel("device").getProperty("/listMode"));
		oList.removeSelections(true);
		var list = this.getView().byId("list"); 
		var oBinding = list.getBinding("items");
		this._IS_FILTER_CHANGED=true;
		oBinding.filter(this.ofilters);

		var oButton=this.byId("filter");
		oButton.setVisible(true);
		// Destory decision buttons
        $("#Master--myMasterBar-BarRight").find("button").each(function(){
            var item = $(this);
              if(item.attr("id").indexOf("DecisionOption")>=0)
              {
                var button=sap.ui.getCore().byId(item.attr("id"));
                button.destroy();
              }                    
        });
        var postRefresh=function(){
            //refresh header
            //console.log(this.complexFilter);
    		$.proxy(this.refreshInfoHeaderToolbar(),this);
    		//set count for the filter
    		var oButton=$('#Master--filter-inner');
    		var count=0;
    		for(var i in this.complexFilter){
    		    for(var j=0;j<this.complexFilter[i].length;j++){
    		        count++;
    		    }
    		}
    		var oCount=oButton.find("span.sapMITBCount");
    		if(oCount.length>0){
    		    oCount.html(count);
    		}else{
    		    oButton.append("<span class='sapMITBCount'>"+count+'</span>');
    		}            
        };

        
        
        //finally
        this.onRefresh($.proxy(postRefresh,this));
	},
	handleMassiveProcess: function(){
		if (!this._dialog2) {
			this._dialog2 = new sap.m.BusyDialog("massiveProcess",{title:"批量审批",text:"开始批量处理..."});
			this.getView().addDependent(this._dialog);
		}else{
			this._dialog2.setText("开始批量处理...");
		}

		// open dialog
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
		this._dialog2.open();

		
		
		
		
	    var t=this;
		var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
		var oList=this.getList();
		var SelectedItems=oList.getSelectedItems();
        var oDataModel=sap.ui.getCore().getModel("standardAPI");
        oDataModel.setUseBatch(true);
        var MPLength=SelectedItems.length;
        for(var i=0;i<SelectedItems.length;i++){
            var bindingContext=SelectedItems[i].getBindingContext();
            var path = bindingContext.getPath();
            var oItem = bindingContext.getModel().getProperty(path);
            var sPath="Decision?SAP__Origin='BPM'&InstanceID='"+oItem.InstanceID+"'&DecisionKey='"+this.DOKey+"'&Comments='"+this.DOText+"'";
            var DecisionOption=oDataModel.createBatchOperation(sPath, 'POST',null,{"Content-Type":"application/json"});
            oDataModel.addBatchChangeOperations([DecisionOption]);
            this._dialog2.setText("正在收集审批条目："+i+"/"+MPLength);
        }
        var showMessage=function(text){
            return function(){
                sap.m.MessageToast.show(text);
            }
        }
        this._dialog2.setText("正在向系统提交审批，共"+MPLength+"条审批条目");
    	oDataModel.submitBatch(
    		    function(data, response){
    		        //hanle each batch response
        		    for(var i=0;i<data.__batchResponses.length;i++){
                        /*  the structure of the response is like below
                            body: string
                            data: Object
                            headers: Object
                            statusCode: "200"
                            statusText: "OK"
                        */
        		        if(data.__batchResponses[i].__changeResponses[0].statusCode !== "200"){
        		            
        		            jQuery.sap.log.error("oData Model Batch Response Error:"+data.__batchResponses[i].response.statusCode+":"+data.__batchResponses[i].response.statusText);
                            //sap.m.MessageToast.show("部分任务处理失败");
                            t._dialog2.close();
                            t.onRefresh(showMessage("部分任务处理失败"));
                            return;
        		        }
        		    }
        		    //sap.m.MessageToast.show("部分任务处理失败");
        		    t._dialog2.close();
        		    t.onRefresh(showMessage("任务处理成功"));
    
                }, 
                function(oEvent){
                    jQuery.sap.log.error("oData Batch Response Error:"+oEvent.response.statusCode+":"+oEvent.response.statusText);
                    //sap.m.MessageToast.show("任务处理失败");
                    t._dialog2.close();
                    t.onRefresh(showMessage("任务处理失败"));
                },
                true
            );
	}
});