import React from "react"
import {Button, Paper, TextField, Typography} from "@mui/material"

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
    paper: { maxWidth: 320, padding: 20 },
    typo: { variant: 'h4', fontWeight: 'bold', color: 'secondary'},
    divButton: { display: 'flex', justifyContent: 'space-around', marginTop: '16', flexWrap: 'wrap' }
}

const RegisterForm = props => {
    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const emailValidate = value => {
        const isError = !value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        setEmailError(isError)
        return isError
    }
    const [password, setPassword] = React.useState('')
    const [passwordError, setPasswordError] = React.useState(false)
    const passwordValidate = (value) => {
        const isError = (value.length < 8)
        setPasswordError(isError)
        return isError
    }
    const [repeatPassword, setRepeatPassword] = React.useState('')
    const [repeatPasswordError, setRepeatPasswordError] = React.useState(false)
    const repeatPasswordValidate = (value) => {
        const isError = (password !== value)
        setRepeatPasswordError(isError)
        return isError
    }
    const onSubmit = () => {
        const isEmailError = emailValidate(email)
        const isPasswordError = passwordValidate(password)
        const isRepeatPasswordError = repeatPasswordValidate(repeatPassword)
        if (!isEmailError && !isPasswordError && !isRepeatPasswordError){
            props._register(email, password)
        }
    }
    const submitOnEnter = evt => {
        if (evt.key === 'Enter')
            onSubmit()
    }
    return (
        <div style={styles.container}>
            <Paper style={styles.paper}>
                <Typography style={styles.typo}
                align='center'
                >
                    Zarejestruj się
                </Typography>
                <TextField
                value={email}
                onKeyPress={submitOnEnter}
                onChange={evt => {
                    setEmail(evt.target.value)
                    if (emailError) {
                        emailValidate(evt.target.value)
                    }
                }}
                label='email'
                variant='outlined'
                margin='normal'
                fullWidth
                error={emailError}
                helperText={emailError ? 'Podaj prawidłowy email!' : null}
                onBlur={() => emailValidate(email)}
                />
                <TextField
                    value={password}
                    onKeyPress={submitOnEnter}
                    onChange={evt => {
                        setPassword(evt.target.value)
                        if (passwordError) {
                            passwordValidate(evt.target.value)
                            if (repeatPasswordError) {
                                setRepeatPasswordError(evt.target.value !== repeatPassword)
                            }
                        }
                    }}
                    label='hasło'
                    variant='outlined'
                    margin='normal'
                    type='password'
                    fullWidth
                    error={passwordError}
                    helperText={passwordError ? 'Hasło musi posiadać minimum 8 znaków!' : null}
                    onBlur={() => {passwordValidate(password)
                    if (repeatPasswordError) {
                        repeatPasswordValidate(repeatPassword)
                    }
                    }}
                />
                <TextField
                    value={repeatPassword}
                    onKeyPress={submitOnEnter}
                    onChange={evt => {
                        setRepeatPassword(evt.target.value)
                        if (repeatPasswordError) {
                            repeatPasswordValidate(evt.target.value)
                        }
                    }}
                    label='powtórz hasło'
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    type='password'
                    error={repeatPasswordError}
                    helperText={repeatPasswordError ? 'Podane hasła nie mogą być różne!' : null}
                    onBlur={() => repeatPasswordValidate(repeatPassword)}
                />
                <div style={styles.divButton}>
                    <Button
                    style={styles.button}
                    color='primary'
                    variant='contained'
                    onClick={onSubmit}
                    margin='normal'
                    >
                        Zarejestruj
                    </Button>
                    <Button
                    style={styles.button}
                    color='secondary'
                    variant='contained'
                    onClick={props.toggleForm}
                    >
                        Zaloguj
                    </Button>
                </div>
            </Paper>
        </div>

    )
}
export default RegisterForm