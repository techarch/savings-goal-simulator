// Lazy initialize our namespace context: sgs.mediator.savingsgoal
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.mediator) == 'undefined') sgs.mediator = { }
if (typeof(sgs.mediator.savingsgoal) == 'undefined') sgs.mediator.savingsgoal = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.mediator.savingsgoal loading!");

sgs.mediator.savingsgoal.createViewMediator = function (pageSettings, pageViewModel) {
	// Create the view Savings Goal view-specific view model
	var viewModel = sgs.model.savingsgoal.initializeViewModel(pageSettings);

	// Save the view model
	sgs.mediator.savingsgoal.setViewModel(viewModel);	

	// Ask KnockoutJS to data-bind the view model to the view
	var viewNode = $('#savings-goal-view-container')[0];
	ko.applyBindings(viewModel, viewNode);
	
	if (typeof(console) != 'undefined' && console) console.info("sgs.mediator.savingsgoal ready!");
}

sgs.mediator.savingsgoal.setupViewDataBindings = function(x, y) {
	// Declare the HTML element-level data bindings
	$("#savings-goal-amount")			.attr("data-bind","value: savingsGoalAmount");
	$("#savings-max-duration")		.attr("data-bind","value: savingsMaxDuration");
	$("#savings-target-per-month")	.attr("data-bind","text: savingsTargetPerMonthFormatted()");

	// Ask KnockoutJS to data-bind the view model to the view
	var viewNode = $('#savings-goal-view')[0];
	var viewModel = sgs.mediator.savingsgoal.getViewModel();
		
	ko.applyBindings(viewModel, viewNode);
	
	// Apply masking to the savings goal amount and max duration input fields 
    viewModel.savingsGoalAmountMask.attach($("#savings-goal-amount")[0]);
    viewModel.savingsMaxDurationMask.attach($("#savings-max-duration")[0]);	
	
	// Initialize default for value models linked to masked fields 
	var pageSettings = GetPageSettings();
	viewModel.savingsGoalAmount(pageSettings.defaultSavingsGoal || 0);
	viewModel.savingsMaxDuration(pageSettings.defaultSavingsMaxDuration || 0);
	
	// Subscribe to interesting value model changes
	viewModel.savingsTargetPerMonthFormatted.subscribe(function() {
		$("#savings-target-per-month")
			.effect('highlight', { color: 'LightGreen' }, 3000); // for 3 seconds
	});
	
	if (typeof(console) != 'undefined' && console) 
			console.info("sgs.mediator.setupViewDataBindings done!");
}

sgs.mediator.savingsgoal.getViewModel = function() {
	return $(document).data("sgs.model.savingsgoal.viewmodel");
}

sgs.mediator.savingsgoal.setViewModel = function(viewModel) {
	$(document).data("sgs.model.savingsgoal.viewmodel", viewModel);
}

