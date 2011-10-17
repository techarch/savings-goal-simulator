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
		savingsGoalAmountFormatted: ko.observable(""), 
		savingsGoalAmountMask: new Mask("$#,###", "number"),
		savingsMaxDuration: ko.observable(6) // months
	};
	
	
	viewModel.savingsGoalAmount = ko.dependentObservable({
		owner: viewModel,
		read: function () {
			// Get the current formatted value model
			var formatted_amt = this.savingsGoalAmountFormatted();
			
			// Unformat the value
			var amt = this.savingsGoalAmountMask.strippedValue;
			
			// Convert the result to a float
			if (amt.length == 0) { amt = 0 };
			return parseFloat(amt);
		},
		write: function (value) {
			// Format the passed in value using the mask
			var formatted_value = this.savingsGoalAmountMask.updateFormattedValue(value);
			
			// Update the savingsGoalAmountFormatted value model
			this.savingsGoalAmountFormatted(formatted_value);
			return value;
		}
	});	
	
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