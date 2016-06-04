'use strict';

/*
I apologize if my code gives you a headache.
I'm still learning how to even use React at all as I write this
some of the stuff is stuck with gum, as refactoring would be impractical


*/

function RecipeDataItem(name, ingredients, directions) {
	this.name = name;
	this.ingredients = ingredients;
	this.directions = directions;
}

var recipeData = [];
recipeData.push(new RecipeDataItem('pizza', ['first', 'second', 'third'], 'cook it until edible'));
recipeData.push(new RecipeDataItem('spaghetti', ['first', 'second', 'third'], 'cook it until edible'));
recipeData.push(new RecipeDataItem('pancakes', ['first', 'second', 'third'], 'cook it until edible'));

console.log(recipeData);

var IngredientListItem = React.createClass({
	displayName: 'IngredientListItem',

	render: function render() {
		return React.createElement(
			'div',
			null,
			this.props.name
		);
	}
});

var IngredientList = React.createClass({
	displayName: 'IngredientList',

	render: function render() {
		return React.createElement(
			'div',
			null,
			'ingredients'
		);
	}
});

var RecipeDescription = React.createClass({
	displayName: 'RecipeDescription',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(IngredientList, null),
			'This is where the directions go'
		);
	}
});

// shown/unshown when clicking the recipe name
var RecipeDetails = React.createClass({
	displayName: 'RecipeDetails',


	render: function render() {
		var ingredientList = this.props.recipe.ingredients.map(function (entry, index) {
			return React.createElement(
				'li',
				{ key: entry + " ingredient " + index + 1 },
				entry
			);
		});
		return React.createElement(
			'div',
			{ className: 'recipe-details' },
			React.createElement(
				'ul',
				{ className: 'recipe-ingredients' },
				ingredientList
			),
			React.createElement(
				'div',
				{ className: 'recipe-directions' },
				this.props.recipe.directions
			)
		);
	}
});

//small version, only shows the title
//is contained inside the RecipeBig version
var RecipeSmall = React.createClass({
	displayName: 'RecipeSmall',

	switchDisplaySize: function switchDisplaySize() {
		//switch between title line, and title line with details under it

		console.log('clicked', this);
		var currentDisplayType = this.props.rootElement.state.displayFormat;
		var newDisplayType = currentDisplayType == 'minimized' ? 'maximized' : 'minimized';
		console.log('from', currentDisplayType, 'to', newDisplayType);
		this.props.rootElement.setDisplayType(newDisplayType);
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'recipe-name', onClick: this.switchDisplaySize },
			React.createElement(
				'h2',
				null,
				' ',
				this.props.recipe.name,
				' '
			)
		);
	}
});

//big version, shows all the info
var RecipeBig = React.createClass({
	displayName: 'RecipeBig',

	goToEditMode: function goToEditMode() {
		this.props.rootElement.setDisplayType('edit');
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'recipe' },
			React.createElement(
				'div',
				{ className: 'recipe-name-bar' },
				React.createElement(RecipeSmall, { recipe: this.props.recipe, rootElement: this.props.rootElement }),
				React.createElement(
					'div',
					{ className: 'recipe-buttons' },
					React.createElement(
						'button',
						{ onClick: this.goToEditMode },
						'edit'
					),
					React.createElement(
						'button',
						null,
						'herp-a-derp'
					)
				)
			),
			React.createElement(RecipeDetails, { recipe: this.props.recipe }),
			';'
		);
	}
});

//edit version,
//used to create or edit a recipe, formatted similar to big version
//defaultRecipe 'defaultRecipe' needs to be replaced with a better solution.
//pending changes are saved in state, once changes are saved, the updated data is sent to the parent to be used as props
//props=saved state=notSaved
var RecipeEdit = React.createClass({
	displayName: 'RecipeEdit',

	getInitialState: function getInitialState() {
		var defaultRecipe = new RecipeDataItem('name', ['ingredient1', 'ingredient2', 'ingredient3'], 'description');
		var initialStateRecipe = this.props.hasOwnProperty('recipe') ? this.props.recipe : defaultRecipe;
		var initialIngredients = initialStateRecipe.ingredients.slice();

		console.log(initialIngredients);
		return {
			'recipe': initialStateRecipe,
			'name': initialStateRecipe.name,
			'directions': initialStateRecipe.directions,
			'ingredients': initialIngredients
		};
	},
	handleChange: function handleChange(event) {
		goBoopBeep();
		this.setState({});
	},
	updateRecipeName: function updateRecipeName(event) {
		goBoopBeep();
		this.setState({ name: event.target.value });
	},
	updateRecipeDirections: function updateRecipeDirections(event) {
		goBoopBeep();
		this.setState({ directions: event.target.value });
	},
	updateIngredientItem: function updateIngredientItem(index) {
		return function (event) {
			var newIngredientState = this.state.ingredients;;
			newIngredientState[index] = event.target.value;
			this.setState({ ingredients: newIngredientState });
		}.bind(this);
	},
	removeIngredientItem: function removeIngredientItem(index) {
		return function () {
			var newIngredients = this.state.ingredients;

			newIngredients.splice(index, 1);
			if (newIngredients.length === 0) {
				// all recipes need at least one ingredient
				newIngredients.push('');
			}
			console.log(newIngredients);
			this.setState({ ingredients: newIngredients });
			console.log(this.state);
		}.bind(this);
	},
	cancelEdit: function cancelEdit() {
		// disregard current state of this element and switch to a non-edit view
		// TODO: if it was meant as a "new" recipe, this option should delete the recipe.
		//this.props.rootElement.setState({displayFormat: 'maximized'})

		// if this was an existing recipe (else assume it was a new/tentative recipe)
		console.log(this.props);
		if (this.props.hasOwnProperty('recipe')) {
			// revert to orinal state
			this.setState({
				'recipe': this.props.recipe,
				'name': this.props.recipe.name,
				'directions': this.props.recipe.directions,
				'ingredients': this.state.recipe.ingredients
			});
		} else {
			// delete the recipe
			// the following setDisplayType might need be moved to the previous if
		}
		this.props.rootElement.setDisplayType('maximized');
	},
	saveEdit: function saveEdit() {
		// validate that data exists
		// remove blank ingredient entries

		// update root's data
		this.props.rootElement.setDisplayType('maximized');

		var newRecipe = new RecipeDataItem(this.state.name, this.state.ingredients, this.state.directions);
		this.props.rootElement.props.updateRecipeData(newRecipe);
	},
	render: function render() {
		// value from 'props' was the saved/original value, value in 'state' is the unsaved value
		var recipeName = this.props.recipe.name;
		var removeIngredientItem = this.removeIngredientItem;
		var updateIngredientItem = this.updateIngredientItem;
		var ingredientChildren = this.state.ingredients.map(function (item, index) {
			var keyName = recipeName + index;
			return React.createElement(
				'div',
				{ key: keyName, index: index },
				React.createElement('input', { type: 'text', name: "recipe-ingredient-" + index, value: item, onChange: updateIngredientItem(index) }),
				React.createElement(
					'button',
					{ type: 'button', onClick: removeIngredientItem(index), ingredientIndex: index },
					'delete'
				)
			);
		});
		return React.createElement(
			'form',
			{ className: 'recipe' },
			React.createElement(
				'div',
				null,
				'RECIPE NAME'
			),
			React.createElement('input', { type: 'text', name: 'recipe-name', value: this.state.name, onChange: this.updateRecipeName }),
			React.createElement(
				'div',
				null,
				'RECIPE INGREDIENTS'
			),
			React.createElement(
				'div',
				null,
				ingredientChildren
			),
			React.createElement(
				'div',
				null,
				'RECIPE DIRECTIONS'
			),
			React.createElement('input', { type: 'text', name: 'recipe-directions', value: this.state.directions, onChange: this.updateRecipeDirections }),
			React.createElement('br', null),
			React.createElement(
				'button',
				{ type: 'button', onClick: this.cancelEdit },
				'cancel'
			),
			React.createElement(
				'button',
				{ type: 'button', onClick: this.saveEdit },
				'save'
			)
		);
	}
});

//contains all possible states of a single recipe
// DISPLAY FORMAT LEGEND:
// 'minimized' : only entry name is shown
// 'maximized' : entre is shown completely
// 'edit' : can edit or delete the entry
var RecipeItem = React.createClass({
	displayName: 'RecipeItem',

	getInitialState: function getInitialState() {
		return {
			validDisplayFormats: ['minimized', 'maximized', 'edit'],
			displayFormat: 'minimized'
		};
	},
	setDisplayType: function setDisplayType(type) {
		console.log('setting diplay type');
		if (this.state.validDisplayFormats.indexOf(type) === -1) {
			console.log(type, 'is not a valid display format, must be one of', this.sate.validdisplayFormats);
			return;
		}
		this.setState({ displayFormat: type });
	},
	render: function render() {
		var formatType = this.state.displayFormat;
		if (formatType === 'minimized') {
			return React.createElement(RecipeSmall, { recipe: this.props.recipe, rootElement: this });
		}
		if (formatType === 'maximized') {
			return React.createElement(RecipeBig, { recipe: this.props.recipe, rootElement: this });
		}
		if (formatType === 'edit') {
			return React.createElement(RecipeEdit, { recipe: this.props.recipe, rootElement: this, updateRecipeData: this.props.updateRecipeData });
		}

		console.log("unrecognized displayState, please check possible RecipeItem state names");
		return React.createElement(RecipeBig, { recipe: this.props.recipe });
	}
});

var RecipeContainer = React.createClass({
	displayName: 'RecipeContainer',

	getInitialState: function getInitialState() {
		// recipeData is a global variable
		return { recipeData: recipeData };
	},
	updateRecipeData: function updateRecipeData(index) {
		return function (recipe) {
			var newData = this.state.recipeData;
			newData[index] = recipe;
			this.setState({ recipeData: newData });
		}.bind(this);
	},
	render: function render() {
		var updateFunction = this.updateRecipeData;
		var recipeEntries = this.state.recipeData.map(function (entry, index) {
			return React.createElement(RecipeItem, { recipe: entry, key: index, updateRecipeData: updateFunction(index) });
		});
		return React.createElement(
			'div',
			null,
			recipeEntries
		);
	}
});

// DELETE ??? ? ? ? ? ? ?
var RecipeTitle = React.createClass({
	displayName: 'RecipeTitle',

	render: function render() {
		return React.createElement(
			'div',
			null,
			'recepe name edit delete',
			React.createElement(RecipeDescription, null)
		);
	}
});

var RecipeApp = React.createClass({
	displayName: 'RecipeApp',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h1',
				null,
				'Recipes!'
			),
			React.createElement(RecipeContainer, null)
		);
	}

});

ReactDOM.render(React.createElement(RecipeApp, null), document.getElementById('main'));

function goBoopBeep() {
	console.log(['boop', 'beep'][Math.floor(Math.random() * 2)]);
}