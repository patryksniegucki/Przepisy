import { URL } from '../consts/firebase'
import { circuralProgress } from "./fullScreenCircuralProgress"
import { addSnackbar } from "./snackbars"
import mapObjectToArray from "../utilities/mapObjectToArray"
import { authRequest } from "./auth"

const SAVE_RECIPES = 'recipes/SAVE_RECIPE'
const ERROR_ON_GET = 'recipes/ERROR_ON_GET'

export const getAllRecipesAsyncActionCreator = () => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users.json'))
        .then(({ data }) => {
            const recipes = [];

            for (const dataProp in data) {
                for (const innerProp in data[dataProp]) {
                    for (const inerInerProp in data[dataProp][innerProp]) {
                        recipes.push({ ...data[dataProp][innerProp][inerInerProp], key: inerInerProp });

                    }
                }
            }
            dispatch(saveRecipesActionCreator(recipes))
        })
        .catch((err) => {
            dispatch(errorOnGetRecipesActionCreator())
        })
        .finally(() => {
            dispatch(circuralProgress.remove())
        })
}

export const addRecipeAsyncActionCreator = form => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes.json', 'post', form))
        .then(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Przepis dodany prawidłowo'))
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Przepis nie został dodany, wystąpił błąd', 'red'))
            return Promise.reject()
        })
}

export const getRecipesAsyncActionCreator = () => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes.json'))
        .then((response) => {
            const mappedData = mapObjectToArray(response.data)
            dispatch(saveRecipesActionCreator(mappedData))
            dispatch(circuralProgress.remove())
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(errorOnGetRecipesActionCreator())
        })
}

export const deleteRecipeAsyncActionCreator = (key, success, error) => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'delete'))
        .then(() => {
            const recipes = getState().recipes.recipes
            const recipesAfterDelete = recipes.filter(recipe => recipe.key !== key)
            dispatch(saveRecipesActionCreator(recipesAfterDelete))
            dispatch(addSnackbar('Przepis został usunięty'))
            dispatch(circuralProgress.remove())
            success()
        })
        .catch(() => {
            dispatch(addSnackbar('Przepis nie został usunięty', 'red'))
            dispatch(circuralProgress.remove())
            error()
        })
}

export const editRecipeAsyncActionCreator = (form, key, success, error) => (dispatch, getState) => {
    const userId = getState().auth.userId
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'patch', form))
        .then(() => {
            const recipes = getState().recipes.recipes
            const recipesAfterEdit = recipes.map(recipe => {
                if (recipe.key === key) {
                    return form
                }
                return recipe

            })
            dispatch(saveRecipesActionCreator(recipesAfterEdit))
            dispatch(addSnackbar('Przepis edytowano poprawnie'))
            dispatch(circuralProgress.remove())
            success()
        })
        .catch(() => {
            dispatch(addSnackbar('Edycja przepisu nie powiodła się', 'red'))
            dispatch(circuralProgress.remove())
            error()
        })
}

const saveRecipesActionCreator = recipes => {
    const suggestions = recipes
        .reduce((red, el) => [...red, ...el.ingredients], [])       //reduce, najpierw zwracamy red(reduce) czyli wszystko co jest w red ktora potem przekazujemy, a dopiero potem element z tablicy
        // .map(el => el.ingredient)
        .reduce((red, el) => red.includes(el.ingredient) ? red : [...red, el.ingredient], [])
    return {
        type: SAVE_RECIPES,
        recipes,
        suggestions
    }
}

const errorOnGetRecipesActionCreator = () => ({ type: ERROR_ON_GET })

const initialState = {
    recipes: [],
    suggestions: [],
    isError: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_RECIPES:
            return {
                ...state,
                isError: false,
                recipes: action.recipes,
                suggestions: action.suggestions
            }
        case ERROR_ON_GET:
            return {
                ...state,
                isError: true
            }
        default:
            return state
    }
}