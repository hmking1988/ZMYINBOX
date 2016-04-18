<!--

    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved

-->
<core:View xmlns:core="sap.ui.core" 
            xmlns="sap.m"
			controllerName="accenture.com.ui.zmyinbox.view.TaskList.MultiSelectDetail" 
			xmlns:html="http://www.w3.org/1999/xhtml">
	<Dialog id="DIALOG" contentWidth="25rem" title="{/detailTitle}" state="{/state}" icon="{/icon}">
		<content>
			<TextArea value="{/detailMessage}" editable="false" height="12.5em" width="100%" />
		</content>
		
		<endButton>
			<Button text="{i18n>dialog.ok}" press="onOKPress" />
		</endButton>
	</Dialog>
</core:View>