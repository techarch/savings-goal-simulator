// Lazy initialize our namespace context: sgs.model.coffeeconsumption
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.model.coffeeconsumption) == 'undefined') sgs.model.coffeeconsumption = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.model.coffeeconsumption loading!");

sgs.model.coffeeconsumption.initializeViewModel = function (pageSettings, scenarioName) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var viewModel = {
		scenarioName: 		ko.observable(scenarioName), 
		drinkType: 			ko.observable("Regular"), 
		drinkSize: 			ko.observable("Tall"), 
		drinkFrequency: 	ko.observable("Everyday"), 
		customFrequency:	ko.observable(1),
		drinksPerDay: 		ko.observable(1)
	}

	viewModel.drinkHasStandardSize = ko.dependentObservable(function() {
		return this.drinkType() != 'Espresso';
	}, viewModel);
	
	viewModel.drinkDaysPerWeek = ko.dependentObservable(function() {
		var count = 0;
		
		switch(this.drinkFrequency()) {
			case "Everyday":
				count = 7;
				break;
				
			case "WorkDays":
				count = 5;
				break;
				
			case "Other":
				count = this.customFrequency();
				break;
		}
		
		return count;
	}, viewModel);

	// Stub implementation to be fully implemented later on
	viewModel.costPerWeek = ko.dependentObservable(function() {
		var result = 0;
		return result;
	}, viewModel);
	
	return viewModel;
}