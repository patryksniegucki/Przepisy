import React from "react"
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import DotIcon from '@mui/icons-material/Brightness1'
import imgPlaceholder from '../img/img-placehoder.svg'
import EditRecipe from "../components/EditRecipe";


const styles = {
    backToRecipes: { cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' },
    paper: { padding: 20, maxWidth: 600, margin: '20px auto' },
    paperDiv: { display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'flex-end' },
    paperDiv2: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, margin: '20px 20px 0 20px' },
    titleOfRecipe: { maxWidth: 264, wordBreak: 'break-word' },
    timeOfRecipe: { fontSize: 12 },
    ingredientsOfRecipe: { marginTop: 5 },
    ingredientsList: { marginTop: -5 },
    ingredientsItemIcon: { marginRight: -40 },
    ingredientsListItem: { paddingTop: 0, paddingBottom: 0 },
    ingredientsDotIcon: { width: 7 },
    ingredientsListItemText: { marginTop: 0, marginBottom: 0 },
    ingredientsPrimaryTypographyProps: { fontSize: 14 },
    imgAround: { width: 264, maxHeight: 264, position: 'relative', margin: '0 auto' },
    img: { width: '100%', maxHeight: 264, backgroundImage: 'url(' + imgPlaceholder + ')', backgroundSize: 'cover', backgroundPosition: 'center' },
    descriptionDiv: { width: '100%', marginTop: 25 },
    description: { wordBreak: 'break-word', whiteSpace: 'pre-line', marginTop: 20 },
    containerEditDelete: { width: '100%', marginTop: 25, display: 'flex', justifyContent: 'flex-end' },
    deleteButton: { margin: 10 },
    editButton: { margin: 10 }
}

const SingleRecipe = props => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    if (!props.data) {
        return (
            <div>
                <Typography
                    variant='h4'
                    color='secondary'
                    align='center'>
                    Nie znaleziono przepisu o tym identyfikatorze:
                    <br />
                    {props.param}
                </Typography>
                <Typography
                    style={styles.backToRecipes}
                    variant='h4'
                    color='primary'
                    align='center'
                    onClick={props.back}
                >
                    Wróć do przepisów
                </Typography>
            </div>
        )
    }

    return (
        <Paper
            style={styles.paper}>
            <div
                style={styles.paperDiv}>
                <div
                    style={styles.paperDiv2}>
                    <Typography
                        style={styles.titleOfRecipe}
                        variant='h5'
                        align='center'
                        color='secondary'
                        gutterBottom
                    >
                        <b>{props.data.name.toUpperCase()}</b>
                    </Typography>
                    <Typography
                        style={styles.timeOfRecipe}
                        align='center'
                        color='secondary'
                        gutterBottom
                        paragraph>
                        <b>Czas przygotowania: {props.data.time} min</b>
                    </Typography>
                    <Typography
                        style={styles.ingredientsOfRecipe}
                        align='center'
                        color='secondary'
                        gutterBottom
                    >
                        <b>Składniki:
                        </b>
                    </Typography>
                    <List
                        style={styles.ingredientsList}>
                        {props.data.ingredients.map((el, index) => (
                            <ListItem
                                style={styles.ingredientsListItem}
                                key={el.ingredient + el.quantity + index}
                            >
                                <ListItemIcon
                                    style={styles.ingredientsItemIcon}>
                                    <DotIcon
                                        style={styles.ingredientsDotIcon} />
                                </ListItemIcon>
                                <ListItemText
                                    style={styles.ingredientsListItemText}
                                    primary={el.ingredient + ' - ' + el.quantity}
                                    primaryTypographyProps={styles.ingredientsPrimaryTypographyProps} />
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div
                    style={styles.imgAround}>
                    <img
                        style={styles.img}
                        src={props.data.photo}
                        alt={props.data.name}
                        onError={evt => evt.target.src = imgPlaceholder}
                    />
                </div>
            </div>
            <div
                style={styles.descriptionDiv}>
                <Typography
                    variant='h5'
                    align='center'
                    gutterBottom
                    color='secondary'
                >
                    Sposób przygotowania:

                </Typography>
                <Typography
                    style={styles.description}
                    align='center'
                >
                    {props.data.description}
                </Typography>
            </div>
            {props.isEditable && (<div
                style={styles.containerEditDelete}
            >
                <Button
                    style={styles.deleteButton}
                    variant='contained'
                    color='secondary'
                    onClick={() => setIsDeleteDialogOpen(true)}
                >
                    Usuń
                </Button>
                <Button
                    style={styles.editButton}
                    variant='contained'
                    color='primary'
                    onClick={() => setIsEditDialogOpen(true)}
                >
                    Edytuj
                </Button>
            </div>)}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                aria-labelledby="title-delete-window"
                aria-describedby="description-delete-window"
            >
                <DialogTitle id="title-delete-window">
                    <b>{"Czy na pewno chcesz usunąć przepis!?"}</b>
                </DialogTitle>
                <DialogContent
                    align='center'>
                    <DialogContentText id="description-delete-window">
                        <p>Przepis zostanie całkowicie usunięty z aplikacji.
                            <br />Nie będzie można cofnąć tej operacji.
                            <br />Czy na pewno chcesz tego dokonać?</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            props._deleteRecipe(
                                props.param,
                                props.back,
                                () => setIsDeleteDialogOpen(false))
                        }}
                        color={'secondary'}>
                        Usuń
                    </Button>
                    <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        autoFocus
                        color={'primary'}>
                        Anuluj
                    </Button>
                </DialogActions>
            </Dialog>
            {isEditDialogOpen &&
                <EditRecipe
                    // open={isEditDialogOpen}
                    onClose={setIsEditDialogOpen}
                    data={props.data}
                    aria-labelledby="title-edit-window"
                    aria-describedby="description-edit-window"
                    _editRecipe={props._editRecipe}
                />
            }
        </Paper>
    )
}

export default SingleRecipe