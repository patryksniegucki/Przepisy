import React from "react";
import { connect } from "react-redux";
import { addRecipeAsyncActionCreator } from '../state/recipes'
import { InputAdornment, TextField, Typography, Button } from "@mui/material";
import Ingredients from "../components/Ingredients";

const MAX_NAME_LENGTH = 46
const MIN_NAME_LENGTH = 4
const MAX_DESCRIPTION_LENGTH = 741
const MIN_DESCRIPTION_LENGTH = 36
const MAX_TIME = 600

const styles = {
    div: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    input: { maxWidth: 370, margin: '10px 0' },
    title: { fontWeight: 'bold', margin: 30 },
    link: { fontsize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' },
    randomPhoto: { marginTop: -10, marginBottom: 10, cursor: 'pointer', color: 'blue' }
}

const AddRecipe = props => {
    const formInStorage = JSON.parse(localStorage.getItem('form')) || {}

    React.useEffect(() => {
        const form = {
            name,
            description,
            ingredients,
            time,
            photo
        }
        localStorage.setItem('form', JSON.stringify(form))
    })

    const [name, setName] = React.useState(formInStorage.name || '')
    const [nameError, setNameError] = React.useState(false)
    const nameValidate = (value) => {
        const validValue = value && value.replace(/\s{2,}/g, ' ')          //usuwa wszystkie spacje po za jedną jeśli zrobimy ich wiele w jednym miejscu
        if (value !== validValue) {
            setName(validValue)
        }
        const isError = !validValue || validValue.length < MIN_NAME_LENGTH            //wywala errora jesli value(dlugosc) jest mniejsze niz 4
        setNameError(isError)
        return isError
    }
    const setValidName = (string) => {
        if (string.length < MAX_NAME_LENGTH) {
            setName(string)
        }
    }

    // zaczynam description

    const [description, setDescription] = React.useState(formInStorage.description || '')
    const [descriptionError, setDescriptionError] = React.useState(false)
    const descriptionValidate = value => {
        const validValue = value && value.replace(/\s{2,}/g, ' ')
        if (value !== validValue) {
            setDescription(validValue)
        }
        const isError = !validValue || validValue.length < MIN_DESCRIPTION_LENGTH
        setDescriptionError(isError)
        return isError
    }
    const setValidDescription = (string) => {
        if (string.length < MAX_DESCRIPTION_LENGTH) {
            setDescription(string)
        }
    }

    // zaczynam time (czas przyrzadzenia)
    const [time, setTime] = React.useState(formInStorage.time || '')
    const [timeError, setTimeError] = React.useState(false)
    const timeValidate = (value) => {
        value = Number(Number(value).toFixed(2))
        setTime(value)
        const isError = value < 1
        setTimeError(isError)
        return isError
    }
    const setValidTime = value => {
        setTime(value < 0 ? 0 : value > MAX_TIME ? MAX_TIME : value)
    }

    const [photo, setPhoto] = React.useState(formInStorage.photo || '')
    const [photoError, setPhotoError] = React.useState(false)
    const photoValidate = value => {
        const isError = !value || !value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)
        setPhotoError(isError)
        return isError
    }

    const [ingredients, setIngredients] = React.useState(formInStorage.ingredients || [])
    const [ingredientsError, setIngredientsError] = React.useState(false)
    const ingredientsValidate = value => {
        const isError = value.length === 0
        setIngredientsError(isError)
        return isError
    }

    const onSubmit = () => {
        const isNameError = nameValidate(name)
        const isDescriptionError = descriptionValidate(description)
        const isIngredientsError = ingredientsValidate(ingredients)
        const isTimeError = timeValidate(time)
        const isPhotoError = photoValidate(photo)

        if (!isNameError && !isDescriptionError && !isIngredientsError && !isTimeError && !isPhotoError) {
            const form = {
                name,
                description,
                ingredients,
                time,
                photo,
            }

            props._addRecipe(form)
                .then(() => {
                    setName('')
                    setDescription('')
                    setIngredients([])
                    setTime('')
                    setPhoto('')
                })
                .catch(() => { })
        }
    }

    const inputs = [
        {
            label: 'Nazwa',
            value: name,
            onChange: setValidName,
            error: nameError,
            validate: nameValidate,
            helperText: 'Wymagane minimum 4 znaki',
        },
        {
            label: 'Składniki',
        },
        {
            label: 'Opis',
            value: description,
            onChange: setValidDescription,
            error: descriptionError,
            validate: descriptionValidate,
            helperText: 'Wymagane minimum 36 znaków',
            multiline: true,
        },
        {
            label: 'Czas przygotowania',
            value: time,
            onChange: setValidTime,
            error: timeError,
            validate: timeValidate,
            helperText: 'Wymagany prawidłowy czas przygotowania',
            type: 'number',
            InputProps: {
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }
        },
        {
            label: 'Zdjęcie',
            value: photo,
            onChange: setPhoto,
            error: photoError,
            validate: photoValidate,
            helperText: 'Wymagany prawidłowy adres URL',
            placeholder: 'http://'
        }
    ]
    return (
        <div
            style={styles.div}
        >
            <Typography
                style={styles.title}
                align='center'
                variant='h5'
                color='secondary'
            >
                Dodaj przepis.
                <br />
                Przepis zostanie dodany do{' '}
                <Typography
                    style={styles.link}
                    display='inline'
                    color='primary'
                    onClick={() => props.history.push('/your-recipes')}
                >
                    Twojej listy.
                </Typography>
            </Typography>
            {inputs.map(input => input.label === 'Składniki' ?
                <Ingredients
                    key={input.label}
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    ingredientsError={ingredientsError}
                    setIngredientsError={setIngredientsError}
                />
                :
                <TextField
                    key={input.label}
                    style={styles.input}
                    variant='outlined'
                    fullWidth
                    label={input.label}
                    value={input.value}
                    error={input.error}
                    helperText={input.error && input.helperText}
                    onChange={evt => {
                        input.onChange(evt.target.value)
                        if (input.error) {
                            input.validate(evt.target.value)        //by nie byc jedna litera wstecz musi przekazac wartosc evt.target.value
                        }
                    }}
                    onBlur={() => input.validate(input.value)}
                    multiline={input.multiline}
                    type={input.type || 'text'}
                    InputProps={input.InputProps}
                    placeholder={input.placeholder}
                />
            )}
            <Typography
                style={styles.randomPhoto}
                onClick={() => {
                    setPhoto('https://source.unsplash.com/random')
                    setPhotoError(false)
                }}
            >
                (losowe zdjęcie)
            </Typography>
            <Button
                color='primary'
                variant='contained'
                onClick={onSubmit}
            >
                Dodaj Przepis
            </Button>
        </div>
    )
}
const mapStateToProps = state => ({
    _userEmail: state?.auth?.email,
})

const mapDispatchToProps = dispatch => ({
    _addRecipe: (form) => dispatch(addRecipeAsyncActionCreator(form))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddRecipe)