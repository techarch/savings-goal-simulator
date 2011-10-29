// Lazy initialize our namespace context: sgs.model.savingsforecast
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.model.savingsforecast) == 'undefined') sgs.model.savingsforecast = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.model.savingsforecast loading!");

sgs.model.savingsforecast.initializeViewModel = function (pageSettings) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var viewModel = {
		savingsGoalAmount: ko.observable(0), 
		savingsTargetPerMonth: ko.observable(0), 
		savingsPerMonth: ko.observable(0)
	};	

	viewModel.forecastVariancePerMonth = ko.dependentObservable(function() {
		var variance = this.savingsPerMonth() - this.savingsTargetPerMonth();
		var result = Math.round(variance * 100) / 100;
		return result;
	}, viewModel);

	viewModel.timeToGoalInMonths = ko.dependentObservable(function() {
		var timeToGoal = this.savingsGoalAmount() / this.savingsPerMonth();
		var result = Math.round(timeToGoal * 10) / 10;
		return result;
	}, viewModel);

	return viewModel;
}
