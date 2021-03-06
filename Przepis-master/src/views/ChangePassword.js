import React from 'react'

import { connect } from 'react-redux'
import { changePasswordAsyncActionCreator } from '../state/auth'

import { TextField, Button, Typography } from '@mui/material'

const ChangePassword = props => {
    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [newPassword2, setNewPassword2] = React.useState('')

    const [oldPasswordError, setOldPasswordError] = React.useState(false)
    const [newPasswordError, setNewPasswordError] = React.useState(false)
    const [newPassword2Error, setNewPassword2Error] = React.useState(false)

    const oldPasswordValidate = (string = oldPassword) => {
        const isError = !string
        setOldPasswordError(isError)
        return isError
    }
    const newPasswordValidate = (string = newPassword) => {
        const isError = string.length < 8
        setNewPasswordError(isError)
        return isError
    }
    const newPassword2Validate = (string = newPassword2) => {
        const isError = string !== newPassword
        setNewPassword2Error(isError)
        return isError
    }

    const validateAll = () => {
        const old = oldPasswordValidate()
        const pwd = newPasswordValidate()
        const pwd2 = newPassword2Validate()
        return old || pwd || pwd2
    }

    const onSubmit = () => {
        if (!validateAll()) {
            props._changePassword(oldPassword, newPassword)
        }
    }

    const submitOnEnter = evt => {
        if (evt.key === 'Enter')
            onSubmit()
    }

    return (
        <div
            style={{ maxWidth: 320, margin: '30px auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}
        >
            <Typography
                variant='h4'
            >
                Zmień hasło:
            </Typography>
            <TextField
                value={oldPassword}
                onChange={evt => {
                    setOldPassword(evt.target.value)
                    if (oldPasswordError)
                        oldPasswordValidate(evt.target.value)
                }}
                onBlur={() => oldPasswordValidate()}
                onKeyPress={submitOnEnter}
                fullWidth
                label='Stare hasło'
                variant='outlined'
                margin='normal'
                type='password'
                error={oldPasswordError}
            />
            <TextField
                value={newPassword}
                onChange={evt => {
                    setNewPassword(evt.target.value)
                    if (newPasswordError)
                        newPasswordValidate(evt.target.value)
                }}
                onBlur={() => newPasswordValidate()}
                onKeyPress={submitOnEnter}
                fullWidth
                label='Nowe hasło'
                variant='outlined'
                margin='normal'
                type='password'
                error={newPasswordError}
                helperText={newPasswordError ? 'Nowe hasło musi mieć minimum 8 znaków.' : null}
            />
            <TextField
                value={newPassword2}
                onChange={evt => {
                    setNewPassword2(evt.target.value)
                    if (newPassword2Error)
                        newPassword2Validate(evt.target.value)
                }}
                onBlur={() => newPassword2Validate()}
                onKeyPress={submitOnEnter}
                fullWidth
                label='Powtórz nowe hasło'
                variant='outlined'
                margin='normal'
                type='password'
                error={newPassword2Error}
                helperText={newPassword2Error ? 'Hasła muszą być takie same.' : null}
            />
            <Button
                style={{ marginTop: 20 }}
                color='primary'
                variant='contained'
                onClick={onSubmit}
            >
                Zatwierdź
            </Button>

        </div>

    )
}

const mapStateToProps = state => ({
    _userEmail: state?.user?.userEmail
})

const mapDispatchToProps = dispatch => ({
    _changePassword: (oldPassword, newPassword) => dispatch(changePasswordAsyncActionCreator(oldPassword, newPassword))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword)