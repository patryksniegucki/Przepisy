import React from "react";
import {Typography} from "@mui/material"
import { Link } from 'react-router-dom'
import logo from '../img/restaurant.png'


const styles= {
    typo: { variant: 'h4', fontWeight: 'bold', color: 'secondary', paddingTop: '50px', paddingLeft: '75px', paddingRight: '75px', maxWidth: '600', margin: '60px auto 30px auto', fontSize: '1.5rem', font: 'bold'},
    link: { color: '#5271ff', textDecoration: 'none', fontWeight: 'bold' },
    img: { width: 200, height: 200, margin: 'auto', display: 'block' }
}

const Dashboard = props => {
    return(
        <div>
            <Typography style={styles.typo}
            align='center'
            >
            Aplikacja przepisy, jest aplikacją zaliczeniową na studia podyplomowe.
            Stworzona przeze mnie (Patryka Śnieguckiego), składa się z paru widoków takich jak ta strona (strona główna),
            <Link to='/add-recipe' style={styles.link}> dodaj przepis</Link>,<Link to='/your-recipes' style={styles.link}> twoje przepisy</Link>, <Link to='/recipes' style={styles.link}> wszystkie przepisy</Link>. Dodatkowo użytkownik, ma możliwość zarejestrowania się, logowania,
            wylogowania, <Link to='/change-password' style={styles.link}> zmiany hasła</Link> i zmiany hasła poprzez zewnętrzny link. Wszystko to współpracuje z bazą danych firebase.
            </Typography>
            <img
                style={styles.img}
                src={logo}
                alt='logo'
            />
        </div>
    )
}

export default Dashboard