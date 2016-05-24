/*
I apologize if my code gives you a headache.

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
		);
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
	goToEditMode: function() {
		this.props.rootElement.setDisplayType('edit');
	},
	render: function() {
		return (
			<div className="recipe" >
				<div className="recipe-name-bar" >
					<RecipeSmall recipe={this.props.recipe} rootElement={this.props.rootElement} />
					<div className="recipe-buttons">
						<button onClick={this.goToEditMode}>edit</button>
						<button>herp-a-derp</button>
					</div>
				</div>
				<RecipeDetails recipe={this.props.recipe} />;
			</div>
		);
	}
});

//edit version,
//used to create or edit a recipe, formatted similar to big version
var RecipeEdit = React.createClass({
	render: function() {
		return (
			<div className="recipe" >
				<div>{this.props.recipe.name}</div>
				<div>{this.props.recipe.directions}</div>
				<button>cancel</button>
				<button>save</button>
			</div>
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
		return {
			validDisplayFormats: ['minimized', 'maximized', 'edit'],
			displayFormat: 'minimized',
		}
	},
	setDisplayType: function(type) {
		console.log('setting diplay type');
		if (this.state.validDisplayFormats.indexOf(type) === -1) {
			console.log(type, 'is not a valid display format, must be one of', this.sate.validdisplayFormats);
			return;
		}
		this.setState({displayFormat: type});
	},
	render: function() {
		var formatType = this.state.displayFormat;
		if (formatType === 'minimized') {
			return <RecipeSmall recipe={this.props.recipe} rootElement={this} />
		}
		if (formatType === 'maximized') {
			return <RecipeBig recipe={this.props.recipe} rootElement={this} />
		}
		if (formatType === 'edit') {
			return <RecipeEdit recipe={this.props.recipe} rootElement={this} />
		}
		
		console.log("unrecognized displayState, please check possible RecipeItem state names");
		return (
			<RecipeBig recipe={this.props.recipe} />
		);
	}
});

var RecipeContainer = React.createClass({
	render: function() {
		var recipeEntries = this.props.recipeData.map(function(entry, index) {
			return (
				<RecipeItem recipe={entry} key={index} />
			);
		});
		return (
			<div>{recipeEntries}</div>
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
				<RecipeContainer recipeData={recipeData} />
			</div>
		);
	}
	
})

ReactDOM.render(
	<RecipeApp />,
	document.getElementById('main')
);