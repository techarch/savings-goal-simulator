// Lazy initialize our namespace context: sgs.model.savingsgoal
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.model) == 'undefined') sgs.model = { }
if (typeof(sgs.model.savingsgoal) == 'undefined') sgs.model.savingsgoal = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.model.savingsgoal loading!");

sgs.model.savingsgoal.initializeViewModel = function (pageSettings) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var viewModel = {
		savingsGoalAmount: ko.observable(pageSettings.defaultSavingsGoal || 0), // dollars
		savingsMaxDuration: ko.observable(6) // months
	};
	
	viewModel.savingsTargetPerMonth = ko.dependentObservable(function() {
		var result = 0;
		if (this.savingsMaxDuration() > 0) {
			result = this.savingsGoalAmount() / this.savingsMaxDuration();
		}
		return result;
	}, viewModel);
	
	return viewModel;
}

/*
$(document).ready(function () {
	if (typeof(console) != 'undefined' && console) console.info("sgs.model.savingsgoal ready!");
});
*/