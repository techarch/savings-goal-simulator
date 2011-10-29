// Lazy initialize our namespace context: sgs.model.consumptionscenarios
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.model.consumptionscenarios) == 'undefined') sgs.model.consumptionscenarios = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.model.consumptionscenarios loading!");

sgs.model.consumptionscenarios.initializeViewModel = function (pageSettings) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var current 		= sgs.model.coffeeconsumption.initializeViewModel (pageSettings, "Current");
	var proposed 	= sgs.model.coffeeconsumption.initializeViewModel (pageSettings, "Proposed");

	var viewModel = {
		currentConsumption: 		ko.observable(current),
		proposedConsumption: 	ko.observable(proposed)
	};
	
	// Stub implementation to be fully implemented later on
	viewModel.savingsPerWeek = ko.dependentObservable(function() {
		var result = 0;
		return result;
	}, viewModel);

	viewModel.savingsPerMonth = ko.dependentObservable(function() {
		var perMonth = this.savingsPerWeek() * 4;
		var result = Math.round(perMonth * 100) / 100;
		return result;
	}, viewModel);

	return viewModel;
}
