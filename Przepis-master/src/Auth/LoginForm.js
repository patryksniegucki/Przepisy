import React from "react"
import {Button, Paper, TextField, Typography, Collapse} from "@mui/material"

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
    paper: { maxWidth: 320, padding: 20 },
    typo: { variant: 'h4', fontWeight: 'bold', color: 'secondary'},
    divButton: { display: 'flex', justifyContent: 'space-around', marginTop: '16', flexWrap: 'wrap' },
    forgottenPassword: { margin: 10}
}

const LoginForm = props => {
    const[email, setEmail] = React.useState('')
    const[emailError, setEmailError] = React.useState(false)
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

    const onSubmit = () => {
        const isEmailError = emailValidate(email)
        const isPasswordError = passwordValidate(password)
        if (!isEmailError && !isPasswordError){
            props._login(email, password)
        }
    }

    const submitOnEnter = evt => {
        if (evt.key === 'Enter')
            onSubmit()
    }

    const [isForgotPasswordPanelOpen, setIsForgotPasswordPanelOpen] = React.useState(false)
    const[forgotEmail, setForgotEmail] = React.useState('')
    const[forgotEmailError, setForgotEmailError] = React.useState(false)
    const forgotEmailValidate = value => {
        const isError = !value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        setForgotEmailError(isError)
        return isError
    }

    const forgotOnSubmit = () => {
        const isEmailError = forgotEmailValidate(forgotEmail)
        if (!isEmailError){
            props._resetPassword(forgotEmail, () => setIsForgotPasswordPanelOpen(false))
        }
    }

    const forgotSubmitOnEnter = evt => {
        if (evt.key === 'Enter')
            forgotOnSubmit()
    }

    return (
        <div style={styles.container}>
            <Paper style={styles.paper}>
                <Typography style={styles.typo}
                align='center'>
                    Zaloguj się
                </Typography>
                <TextField
                value={email}
                onChange={evt => {
                    setEmail(evt.target.value)
                    if (emailError){
                        emailValidate(evt.target.value)
                    }
                }}
                onBlur={() => emailValidate(email)}
                onKeyPress={submitOnEnter}
                fullWidth={true}
                margin='normal'
                label='email'
                variant='outlined'
                error={emailError}
                helperText={emailError && 'Podaj prawidłowy email!'}
                />
                <TextField
                    value={password}
                    onChange={evt => {
                        setPassword(evt.target.value)
                        if(passwordError){
                            passwordValidate(evt.target.value)
                        }
                    }}
                    onBlur={() => passwordValidate(password)}
                    onKeyPress={submitOnEnter}
                    fullWidth
                    margin='normal'
                    label='hasło'
                    variant='outlined'
                    type='password'
                    error={passwordError}
                    helperText={passwordError && 'Podaj hasło'}
                />
                <div style={styles.divButton}>
                    <Button
                    color='primary'
                    variant='contained'
                    onClick={onSubmit}
                    >
                        Zaloguj
                    </Button>
                    <Button
                    color='secondary'
                    variant='contained'
                    onClick={props.toggleForm}
                    >
                        Rejestracja
                    </Button>
                    <Button
                    style={styles.forgottenPassword}
                    onClick={() => setIsForgotPasswordPanelOpen(!isForgotPasswordPanelOpen)}>
                        Zapomniałem Hasła
                    </Button>
                </div>
                <Collapse in = {isForgotPasswordPanelOpen}>
                    <TextField
                        value={forgotEmail}
                        onChange={evt => {
                            setForgotEmail(evt.target.value)
                            if (forgotEmailError){
                                forgotEmailValidate(evt.target.value)
                            }
                        }}
                        onBlur={() => forgotEmailValidate(forgotEmail)}
                        onKeyPress={forgotSubmitOnEnter}
                        fullWidth={true}
                        margin='normal'
                        label='Email'
                        variant='outlined'
                        error={forgotEmailError}
                        helperText={forgotEmailError && 'Podaj prawidłowy email!'}
                    />
                <Button
                color='primary'
                variant='contained'
                fullWidth
                onClick={forgotOnSubmit}
                >
                    Wyślij
                </Button>
                </Collapse>

            </Paper>
        </div>
    )
}

export default LoginForm