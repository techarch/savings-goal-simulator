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
		pricing: 		ko.observable(null), 
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
		// Get the base price
		if (this.pricing() == null) {
			return 0;
		}
		
		var basePrice 	= this.pricing().getCoffeeBeveragePrice(this.drinkType(), this.drinkSize());
		var dailyCost 	= basePrice * this.drinksPerDay();
		var weeklyCost	= dailyCost * this.drinkDaysPerWeek();
		var result 		= Math.round(weeklyCost * 100) / 100;

		return result;
	}, viewModel);
	
	viewModel.costPerWeekFormatted = ko.dependentObservable(function() {
		var result = this.costPerWeek();
		var formattedResult = accounting.formatMoney(result, "$", 2, ",", ".");  ;
		return formattedResult;
	}, viewModel);
		
	return viewModel;
}