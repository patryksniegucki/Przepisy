import React from "react"
import { connect } from "react-redux"
import {
    deleteRecipeAsyncActionCreator,
    getRecipesAsyncActionCreator,
    editRecipeAsyncActionCreator
} from "../state/recipes"
import { Typography } from "@mui/material";
import RecipesList from "../components/RecipesList";
import SingleRecipe from "./SingleRecipe";
import MultiAutocompleteInput from "../components/MultiAutocompleteInput"

const styles = {
    refresh: { cursor: 'pointer', color: 'blue' },
    autocomplete: { maxWidth: 700, margin: '30px auto' },
    noRecipes: { cursor: 'pointer' }
}

class UserRecipes extends React.Component {
    state = {
        selectedItem: []
    }

    setSelectedItem = (items) => this.setState({ selectedItem: items })

    componentDidMount() {
        this.getData()
    }


    getData = () => {
        this.props._getData()
    }

    render() {
        if (this.props._isFetching) {

            const recipesToShow = this.props._recipes.filter(recipe => {
                const ingredients = recipe.ingredients.map(el => el.ingredient)
                return this.state.selectedItem.reduce((red, el) => ingredients.includes(el) ? red : false, true) //sprawdza czy wszystkie sie zawieraja
                // return this.state.selectedItem.reduce((red, el) => ingredients.includes(el) ? true : red, false) //sprawdza czy ktorykolwiek element sie zawiera
            })

            if (this.props._isError) {
                return (
                    <div>
                        <Typography
                            variant='h4'
                            align='center'
                            color='error'
                        >
                            Nie udało się wyświetlić przepisów
                        </Typography>
                        <Typography
                            style={styles.refresh}
                            variant='h4'
                            align='center'
                            onClick={this.getData}>
                            Odśwież stronę!
                        </Typography>
                    </div>
                )
            }
            if (this.props._recipes.length === 0) {
                return (
                    <div>
                        <Typography
                            variant='h4'
                            align='center'
                            color='grey'
                        >
                            Nie dodałeś jeszcze przepisu
                        </Typography>
                        <Typography
                            style={styles.noRecipes}
                            variant='h4'
                            align='center'
                            color='primary'
                            onClick={() => this.props.history.push('/add-recipe')}
                        >
                            Dodaj przepis
                        </Typography>
                    </div>
                )
            }

            if (this.props.match.params.id) {
                const recipe = this.props._recipes.find(el => el.key === this.props.match.params.id)
                return <SingleRecipe
                    data={recipe}
                    param={this.props.match.params.id}
                    isEditable={true}
                    back={() => this.props.history.push('/your-recipes')}
                    _deleteRecipe={this.props._deleteRecipe}
                    _editRecipe={this.props._editRecipe}
                />
            }
            return (
                <div>
                    <div style={styles.autocomplete}>
                        <MultiAutocompleteInput
                            label='Jakie posiadasz składniki?'
                            placeholder='Wprowadź posiadane produkty'
                            suggestions={this.props._suggestions}
                            selectedItem={this.state.selectedItem}
                            setSelectedItem={this.setSelectedItem}
                        />
                    </div>
                    <RecipesList
                        data={recipesToShow}
                        route='/your-recipes'
                        changeRoute={this.props.history.push}
                    />
                    {recipesToShow.length === 0 &&
                        <Typography
                            color='secondary'
                            align='center'
                            variant='h4'
                        >
                            Nie ma przepisu pasującego do wymienionych składników
                        </Typography>
                    }
                </div>
            )
        }
        return null
    }
}


const mapStateToProps = state => ({
    _isError: state.recipes.isError,
    _recipes: state.recipes.recipes,
    _suggestions: state.recipes.suggestions,
    _isFetching: state.fullScreenCircuralProgress.circurals.length === 0
})

const mapDispatchToProps = dispatch => ({
    _getData: () => dispatch(getRecipesAsyncActionCreator()),
    _deleteRecipe: (key, success, error) => dispatch(deleteRecipeAsyncActionCreator(key, success, error)),
    _editRecipe: (form, key, success, error) => dispatch(editRecipeAsyncActionCreator(form, key, success, error))
})



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserRecipes)