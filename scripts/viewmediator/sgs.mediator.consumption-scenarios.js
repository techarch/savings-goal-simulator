// Lazy initialize our namespace context: sgs.mediator.consumptionscenarios
if (typeof(sgs) == 'undefined') sgs = { }
if (typeof(sgs.mediator) == 'undefined') sgs.mediator = { }
if (typeof(sgs.mediator.consumptionscenarios) == 'undefined') sgs.mediator.consumptionscenarios = { }

if (typeof(console) != 'undefined' && console) console.info("sgs.mediator.consumptionscenarios loading!");

sgs.mediator.consumptionscenarios.createViewMediator = function (pageSettings) {
	// Create the view Consumption Scenarios view-specific view model
	var viewModel = sgs.model.consumptionscenarios.initializeViewModel(pageSettings);
	
	// Declare the HTML element-level data bindings for the Current Habits column
	$("#current-drink-type  input[type=radio]")
		.attr("data-bind","checked: currentConsumption().drinkType");
	$("#current-drink-size input[type=radio]")
		.attr("data-bind","checked: currentConsumption().drinkSize " +
				", enable: currentConsumption().drinkHasStandardSize");
	$("#current-drink-frequency input[type=radio]")
		.attr("data-bind","checked: currentConsumption().drinkFrequency");
	$("#current-custom-frequency")						
		.attr("data-bind","value: currentConsumption().customFrequency");
	$("#current-drinks-per-day")
		.attr("data-bind","value: currentConsumption().drinksPerDay");
	$("#current-cost-per-week")
		.attr("data-bind","text: currentConsumption().costPerWeek");
	
	// Declare the HTML element-level data bindings for the Proposed Change column
	$("#proposed-drink-type input[type=radio]")
		.attr("data-bind","checked: proposedConsumption().drinkType");
	$("#proposed-drink-size input[type=radio]")
		.attr("data-bind","checked: proposedConsumption().drinkSize" +
				", enable: proposedConsumption().drinkHasStandardSize");
	$("#proposed-drink-frequency input[type=radio]")
		.attr("data-bind","checked: proposedConsumption().drinkFrequency");
	$("#proposed-custom-frequency")							 
		.attr("data-bind","value: proposedConsumption().customFrequency");
	$("#proposed-drinks-per-day")								 
		.attr("data-bind","value: proposedConsumption().drinksPerDay");
	$("#proposed-cost-per-week")
		.attr("data-bind","text: proposedConsumption().costPerWeek");
	$("#savings-per-week")
		.attr("data-bind","text: savingsPerWeek");
	
	// Ask KnockoutJS to data-bind the view model to the view
	var viewNode = $('#consumption-scenarios-view')[0];
	ko.applyBindings(viewModel, viewNode);

	// Save the view model
	sgs.mediator.consumptionscenarios.setViewModel(viewModel);	

	// Set the pricing based on the Coffee Pricing view model
	var priceList = sgs.mediator.coffeepricing.getViewModel();
	viewModel.pricing(priceList);
	
	if (typeof(console) != 'undefined' && console) console.info("sgs.mediator.coffeeconsumption ready!");
}

sgs.mediator.consumptionscenarios.getViewModel = function() {
	return $(document).data("sgs.model.consumptionscenarios.viewmodel");
}

sgs.mediator.consumptionscenarios.setViewModel = function(viewModel) {
	$(document).data("sgs.model.consumptionscenarios.viewmodel", viewModel);
}
