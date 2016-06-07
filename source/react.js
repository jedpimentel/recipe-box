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


function hardReset() {
	if (confirm("Are you sure you want to undo all edits and return this app to its default information? This is meant for debugging/demo purposes and all edits will be lost.")) {
		localStorage.clear();
		location.reload();
	}
	
	
}

// is this used ?
var IngredientListItem = React.createClass({
	render: function() {
		return (
			<div>{this.props.name}</div>
		);
	}
});

var IngredientList = React.createClass({
	render: function() {
		return (
			<div>
				ingredients
			</div>
		);
	} 
});

var RecipeDescription = React.createClass({
	render: function() {
		return (
		<div>
			<IngredientList />
			This is where the directions go
		</div>
		);
	}
});


// shown/unshown when clicking the recipe name
var RecipeDetails = React.createClass({
	
	render: function() {
		var ingredientList = this.props.recipe.ingredients.map(function(entry, index) {
			return <li key={entry+" ingredient "+index+1}>{entry}</li>
		});
		return(
			<div className="recipe-details">
				<ul className="recipe-ingredients">
					{ingredientList}
				</ul>
				<div className="recipe-directions">{this.props.recipe.directions}</div>
			</div>
		) 
	}
});

//small version, only shows the title
//is contained inside the RecipeBig version
var RecipeSmall = React.createClass({
	switchDisplaySize: function() {
		//switch between title line, and title line with details under it
		
		console.log('clicked', this);
		var currentDisplayType = this.props.rootElement.state.displayFormat;
		var newDisplayType = (currentDisplayType == 'minimized' )?'maximized' : 'minimized';
		console.log('from', currentDisplayType, 'to', newDisplayType)
		this.props.rootElement.setDisplayType(newDisplayType);
	}, 
	render: function() {
		return (
			<div className="recipe-name" onClick={this.switchDisplaySize}> 
				<h2> {this.props.recipe.name} </h2>
			</div>
		)
	}
});

//big version, shows all the info
var RecipeBig = React.createClass({
	getInitialState: function() {
		return {clickCount: 0};
	},
	goToEditMode: function() {
		console.log(this.state.clickCount);
		if (this.props.rootElement.props.editState() === false) {
			this.props.rootElement.setDisplayType('edit');
		} else if (this.state.clickCount >= 4) {
			alert('please save or cancel any pending edits before edditing another recipe');
		} else {
			this.setState({clickCount: this.state.clickCount + 1})
		} 
	},
	deleteRecipe: function() {
		console.log("TODO: delete this recipe");
		this.props.rootElement.setDisplayType('delete');
	},
	confirmDelete: function() {
		function confirmDelete() {
			if(window.confirm("Are you sure you want to delete " + this.props.recipe.name + "?")) {
				console.log('deleting...', this)
				this.deleteRecipe();
			} else {
				;
			}
		}
		setTimeout(confirmDelete.bind(this), 0);
	},
	render: function() {
		var thereIsAnActiveEditBox = this.props.rootElement.props.editState();
		var subduedButton = thereIsAnActiveEditBox? 'subdued-button' : '';
		return (
			<div className="recipe" >
				<div className="recipe-name-bar" >
					<RecipeSmall recipe={this.props.recipe} rootElement={this.props.rootElement} />
					<div className="recipe-buttons">
						<button onClick={this.goToEditMode} className={subduedButton}>edit</button>
						<button onClick={this.confirmDelete}>delete</button>
					</div>
				</div>
				<RecipeDetails recipe={this.props.recipe} />
			</div>
		);
	}
});

//edit version,
//used to create or edit a recipe, formatted similar to big version
//defaultRecipe 'defaultRecipe' needs to be replaced with a better solution.
//pending changes are saved in state, once changes are saved, the updated data is sent to the parent to be used as props
//props=saved state=notSaved
var RecipeEdit = React.createClass({
	getInitialState: function() {
		var defaultRecipe = new RecipeDataItem(
		'name',
		['ingredient1', 'ingredient2', 'ingredient3' ],
		'description'
		)
		var initialStateRecipe = ( this.props.hasOwnProperty('recipe') ? this.props.recipe : defaultRecipe );
		var initialIngredients = initialStateRecipe.ingredients.slice();
		
		console.log(initialIngredients)
		return {
			'recipe': initialStateRecipe,
			'name': initialStateRecipe.name,
			'directions': initialStateRecipe.directions,
			'ingredients': initialIngredients,
		}
	},
	handleChange: function(event) {
		goBoopBeep();
		this.setState({})
	},
	updateRecipeName: function(event) {
		goBoopBeep();
		this.setState({name: event.target.value})
	},
	updateRecipeDirections: function(event) {
		goBoopBeep();
		this.setState({directions: event.target.value})
	},
	updateIngredientItem: function(index) {
		return function(event) {
			var newIngredientState = this.state.ingredients;
			newIngredientState[index] = event.target.value;
			this.setState({ingredients: newIngredientState})
		}.bind(this)
	},
	removeIngredientItem: function(index) {
		return function() {
			var newIngredients = this.state.ingredients;
			
			newIngredients.splice(index, 1);
			if (newIngredients.length === 0) {
				// all recipes need at least one ingredient
				newIngredients.push('');
			}
			console.log(newIngredients)
			this.setState({ingredients: newIngredients})
			console.log(this.state);
		}.bind(this);
		
	},
	addIngredientItem: function() {
		
		
		var emptyIngredient = ['boop'];
		this.setState({ingredients: this.state.ingredients.concat(emptyIngredient)})
		
	},
	transformToMaximized: function() {
		
		this.props.rootElement.props.editState(false);
		this.props.rootElement.setDisplayType('maximized');
	},
	cancelEdit: function() {
		// disregard current state of this element and switch to a non-edit view
		// TODO: if it was meant as a "new" recipe, this option should delete the recipe.
		//this.props.rootElement.setState({displayFormat: 'maximized'}) 
		
		// if this was an existing recipe (else assume it was a new/tentative recipe)
		console.log(this.props)
		if (this.props.hasOwnProperty('recipe')) {
			// revert to orinal state
			this.setState({
			'recipe': this.props.recipe,
			'name': this.props.recipe.name,
			'directions': this.props.recipe.directions,
			'ingredients': this.state.recipe.ingredients,
			})
		} else {
			// delete the recipe
			// the following setDisplayType might need be moved to the previous if
		}
		this.transformToMaximized();
	},
	saveEdit: function() {
		// validate that data exists
		// remove blank ingredient entries
		
		// update root's data
		console.log('saving...');
		var newRecipe = new RecipeDataItem(this.state.name, this.state.ingredients.slice(0), this.state.directions);
		
		console.log('saving...');
		this.props.rootElement.props.updateRecipeData(newRecipe);
		this.transformToMaximized();
	},
	render: function() {
		// value from 'props' was the saved/original value, value in 'state' is the unsaved value
		var recipeName = this.props.recipe.name;
		var removeIngredientItem = this.removeIngredientItem;
		var updateIngredientItem = this.updateIngredientItem;
		var ingredientChildren = this.state.ingredients.map(function(item, index) {
			var keyName = recipeName + index;
			return (
				<div key={keyName} index={index} >
					<input type="text" name={"recipe-ingredient-"+index} value={item} onChange={updateIngredientItem(index)} />
					<button type="button" onClick={removeIngredientItem(index)} ingredientIndex={index}>delete</button>
				</div>
			);
		});
		return (
			<form className="recipe" >
				<div>RECIPE NAME</div>
				<input type="text" name="recipe-name" value={this.state.name} onChange={this.updateRecipeName} />
				<div>RECIPE INGREDIENTS</div>
				<div>
					{ingredientChildren}
					<button type="button" onClick={this.addIngredientItem}>new ingredient</button> 
				</div> 
				<div>RECIPE DIRECTIONS</div>
				<input type="text" name="recipe-directions" value={this.state.directions} onChange={this.updateRecipeDirections} />
				<br />
				<button type="button" onClick={this.saveEdit}>save</button>
				<button type="button" onClick={this.cancelEdit}>cancel</button>
			</form>
		);
	}
})

//contains all possible states of a single recipe
// DISPLAY FORMAT LEGEND: 
// 'minimized' : only entry name is shown
// 'maximized' : entre is shown completely
// 'edit' : can edit or delete the entry
var RecipeItem = React.createClass({
	getInitialState: function() {
		console.log('rendering container', this.props.recipe); 
		var recipeData;
		var displayFormat;
		if (this.props.recipe === undefined) {
			var blankRecipe = new RecipeDataItem('burger', ['first', 'second', 'third'], 'cook it until edible');
			recipeData = blankRecipe;
			displayFormat = 'edit';
		} else {
			recipeData = this.props.recipe;
			displayFormat = 'minimized';
		}
		
		return {
			// the `delete` display format isn't a real view, instead it's used as part of the rube goldberg machine that deletes recipes
			validDisplayFormats: ['minimized', 'maximized', 'edit', 'delete'],
			displayFormat: displayFormat,
			recipe: recipeData,
		}
	},
	setDisplayType: function(type) {
		console.log('setting diplay type');
		if (this.state.validDisplayFormats.indexOf(type) === -1) {
			console.log(type, 'is not a valid display format, must be one of', this.sate.validdisplayFormats);
			return;
		}
		if (type === 'delete') {
			this.props.updateRecipeData('delete');
			return;
		}
		this.setState({displayFormat: type});
		if (type === 'edit') {
			this.props.editState(true);
		}
	},
	render: function() {
		// I has used 'state' instead of 'prop' when sending values to the recepies, this caused a huge bug where the ingredient list sizes wheren't updated when a list item was added or removed, even though text changes had no issue.
		var formatType = this.state.displayFormat;
		if (formatType === 'minimized') {
			return <RecipeSmall recipe={this.props.recipe} rootElement={this} />
		}
		if (formatType === 'maximized') {
			return <RecipeBig recipe={this.props.recipe} rootElement={this} />
		}
		if (formatType === 'edit') {
			return <RecipeEdit recipe={this.props.recipe} rootElement={this} updateRecipeData={this.props.updateRecipeData} />
		}
		
		console.log("unrecognized displayState, please check possible RecipeItem state names");
		return (
			<RecipeBig recipe={this.props.recipe} />
		);
	}
});

var RecipeContainer = React.createClass({
	getInitialState: function() {
		
		var recipeData = [];
		//console.log(localStorage.getItem('recipe data'))
		//localStorage.clear();
		
		if(localStorage.getItem('recipe data') !== null){
			// local storage exists
			console.log('thanks for coming back :D');
			recipeData = JSON.parse(localStorage.getItem('recipe data'));
		} else {
			// load the default recipes
			console.log('welcome to the recipe app');
			recipeData.push(new RecipeDataItem('pizza', ['first', 'second', 'third'], 'cook it until edible'));
			recipeData.push(new RecipeDataItem('spaghetti', ['first', 'second', 'third'], 'cook it until edible'));
			recipeData.push(new RecipeDataItem('pancakes', ['first', 'second', 'third'], 'cook it until edible'));
			
			localStorage.setItem('recipe data', JSON.stringify(recipeData));
		}
		
		console.log(JSON.parse(localStorage.getItem('recipe data')));
		return {
			recipeData: recipeData,
			editState: false,
		} 
	},
	editState: function(bool) {
		//set or check if any recipe is currently being editted
		//only one recipe should be editted at a time, since the current save button would write every recipe string into local storage
		if (arguments.length === 0) {
			return this.state.editState;
		} else {
			this.setState({editState: bool})
		}
	},
	updateRecipeData: function(index) {
		return function(recipe) {
			
			
			
			
			console.log('attempting to save ' + recipe + ' in index ' + index);
			
			var newData = this.state.recipeData.slice(0);
			
			
			if (recipe === 'delete') {
				// replacing the recipe data with a 'delete' string means use clicked the 'delete' button
				console.log('deleting...')
				newData = newData.filter(function(el, indx, arr) {return indx !== index});
			} else {
				newData[index] = recipe;
				
			}
			this.setState({recipeData: newData})
			localStorage.setItem('recipe data', JSON.stringify(newData));
			 
		}.bind(this)
		
		
	},
	newBlankRecipe: function() {
		
		
		
		console.log("creating a new blank recipe...");
		var newRecipeState = this.state.recipeData;
		
		var blankRecipe = undefined;
		newRecipeState.push(blankRecipe);
		
		
		this.editState(true);
		this.setState({recipeData: newRecipeState}); 
	},
	render: function() {
		var editState = this.editState;
		var updateFunction = this.updateRecipeData;
		var recipeEntries = this.state.recipeData.map(function(entry, index) {
			var keyValue = (entry === undefined)? "newRecipe" : entry.name; 
			console.log('rendering', entry);
			return (
				<RecipeItem recipe={entry} key={keyValue} updateRecipeData={updateFunction(index)} editState={editState} />
			);
		});
		var newRecipeButton;
		if (this.editState() === false) {
			newRecipeButton = <button onClick={this.newBlankRecipe} id={"button-add-new"} >ADD NEW</button>
		}
		return (
			<div>
				{recipeEntries}
				{newRecipeButton}
				<button onClick={hardReset} id={'button-reset-app'} >Reset App</button>
			</div>
			
		);
	}
}); 



// DELETE ??? ? ? ? ? ? ? 
var RecipeTitle = React.createClass({
	render: function() {
		return (
			<div>
				recepe name
				edit
				delete
				<RecipeDescription />
			</div>
		);
	}
});

var RecipeApp = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Recipes!</h1>
				<RecipeContainer />
			</div>
		);
	}
	
})

ReactDOM.render(
	<RecipeApp />,
	document.getElementById('main')
);


function goBoopBeep() {
	console.log(['boop', 'beep'][Math.floor(Math.random() * 2 )]);
}