// Lazy initialize our namespaces
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.mediator) == 'undefined') sgs.mediator = { }

if (typeof(console) != 'undefined' && console) console.info("Application loading!");

function InitializeApplication() {
	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeApplication starting ...");
	
	// Initialize our page-wide settings
	var pageSettings = { 	defaultSavingsGoal: 500,
										defaultSavingsMaxDuration: 6
									}
	
	// Create / launch our view mediator(s)
	sgs.mediator.savingsgoal.createViewMediator(pageSettings);
	sgs.mediator.consumptionscenarios.createViewMediator(pageSettings);

	if (typeof(console) != 'undefined' && console) 
		console.info("InitializeApplication done ...");	
}

if (typeof(console) != 'undefined' && console) console.info("Application loaded!");
