import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from '@mui/material/IconButton'
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import SettingsIcon from "@mui/icons-material/Settings"

import { openDrawerActionCreator } from "../state/drawer"
import { logoutActionCreator } from "../state/auth"

import logo from '../img/logo.png'

const styles = {
    toolbar: { justifyContent: 'space-between' },
    logo: { cursor: 'pointer' },
    link: { textDecoration: 'none', color: 'black' },
    logOutButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
}

const MenuAppBar = props => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const isOpen = Boolean(anchorEl)

    const handleMenu = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar style={styles.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={props._drawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img
                        onClick={() => props.history.push('/')}
                        style={styles.logo}
                        src={logo}
                        alt='logo'
                    />
                    <div style={styles.logOutButton}>
                        <div >{props._userEmail}</div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMenu}
                        >
                            <SettingsIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={isOpen}
                            onClose={handleClose}
                        >
                            <Link to='/change-password' style={styles.link}>
                                <MenuItem onClick={handleClose}>Zmień hasło</MenuItem>
                            </Link>
                            <Link to='/' style={styles.link}>
                                <MenuItem onClick={props._logout}>Wyloguj sie</MenuItem>
                            </Link>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

const mapStateToProps = (state) => ({
    _userEmail: state?.auth?.email,
})

const mapDispatchToProps = (dispatch) => ({
    _drawerOpen: () => dispatch(openDrawerActionCreator()),
    _logout: () => dispatch(logoutActionCreator())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MenuAppBar))