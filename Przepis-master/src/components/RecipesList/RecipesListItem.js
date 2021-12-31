import React from "react"
import imgPlaceholder from '../../img/img-placehoder.svg'
import { Typography } from "@mui/material"
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const styles = {
    container: {
        position: 'relative', width: 220, height: 220, margin: 7,
        cursor: 'pointer', overflow: 'hidden'
    },
    img: {
        height: '100%', minWidth: '100%',
        backgroundImage: 'url(' + imgPlaceholder + ')',
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: '800ms'
    },
    description: {
        position: 'absolute', bottom: 0, height: '48%',
        width: '100%', backgroundColor: 'rgba(0,0,0,0.4)'
    },
    title: { color: 'white', marginLeft: 20, marginTop: 15, fontWeight: 'bold' },
    timeDiv: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    timeIcon: { width: 17, color: 'white' },
    subtitle: { color: 'white', justifyContent: 'inline', fontSize: 14, marginLeft: 3, marginRight: 15 }
}

const RecipesListItem = props => {
    return (
        <div style={styles.container}
            onClick={() => {
                props.changeRoute(props.route + '/' + props.data.key)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }}
        >
            <img
                style={styles.img}
                className={'recipe-list-item__img'}
                src={props.data.photo}
                alt={props.data.name}
                onError={evt => evt.target.src = imgPlaceholder}
            />
            <div style={styles.description}>
                <Typography
                    style={styles.title}
                >
                    {props.data.name}
                </Typography>
                <div style={styles.timeDiv}>
                    <AccessTimeIcon style={styles.timeIcon} />
                    <Typography
                        style={styles.subtitle}
                    >
                        {props.data.time}min
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default RecipesListItem