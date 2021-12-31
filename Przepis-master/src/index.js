import React from 'react'       //rzeczy z reacta
import ReactDOM from 'react-dom'

import { Provider } from "react-redux";     //rzeczy z reduxa
import { store } from './store'

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import App from './App'
import './main.css'
import { autoLoginAsyncActionCreator } from '../src/state/auth'

store.dispatch(autoLoginAsyncActionCreator())

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
)