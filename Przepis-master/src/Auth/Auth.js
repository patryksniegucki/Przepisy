import React from "react"
import { connect } from "react-redux"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { registerAsyncActionCreator, loginAsyncAction, resetPasswordAsyncAction } from '../state/auth'

const Auth = props => {
    const [toggleForm, setToggleForm] = React.useState(false)

    return (
        props._isLogged ?
            props.children
            :
            toggleForm ?
                <LoginForm
                    toggleForm={() => setToggleForm(false)}
                    _login={props._login}
                    _resetPassword={props._resetPassword}
                />
                :
                <RegisterForm
                    toggleForm={() => setToggleForm(true)}
                    _register={props._register}
                />
    )
}

const mapStateToProps = state => ({
    _isLogged: state.auth.isLogged
})

const mapDispatchToProps = dispatch => ({
    _register: (email, password) => dispatch(registerAsyncActionCreator(email, password)),
    _login: (email, password) => dispatch(loginAsyncAction(email, password)),
    _resetPassword: (email, success) => dispatch(resetPasswordAsyncAction(email, success))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth)