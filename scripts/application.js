// Lazy initialize our namespaces
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.mediator) == 'undefined') sgs.mediator = { }

if (typeof(console) != 'undefined' && console) console.info("Application loading!");

function InitializeApplication() {
	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeApplication starting ...");
	
	// Configure the ViewLoader
	$(document).viewloader({
		logLevel: "debug",
		success: function (successfulResolution) {
			InitializeViewMediators();
		},			
		error: function (failedResolution) {
			// Loading failed somehow
			if (typeof(console) != 'undefined' && console) {
				console.error("index.html page failed to load");	
			}
		}
	});

	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeApplication done ...");	
}

function GetPageSettings() {
	return $(document).data("sgs.pagesettings");
}

function SetPageSettings(pageSettings) {
	$(document).data("sgs.pagesettings", pageSettings);
}

function InitializeViewMediators() {
	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeViewMediators starting ...");
	
	// Initialize our page-wide settings
	var pageSettings = { 	defaultSavingsGoal: 500,
										defaultSavingsMaxDuration: 6
									}
									
	// Save the page-wide settings
	SetPageSettings(pageSettings);
	
	// Create / launch our view mediator(s)
	sgs.mediator.savingsgoal.createViewMediator(pageSettings);
	sgs.mediator.coffeepricing.createViewMediator(pageSettings);
	sgs.mediator.consumptionscenarios.createViewMediator(pageSettings);
	sgs.mediator.savingsforecast.createViewMediator(pageSettings);

	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeViewMediators done ...");	
}

if (typeof(console) != 'undefined' && console) console.info("Application loaded!");
