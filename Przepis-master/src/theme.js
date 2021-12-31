import { createTheme } from '@mui/material/styles'
import { grey, blue } from '@mui/material/colors'


export default  createTheme({
    palette: {
        primary: {
            light: blue[200],
            main: '#5271ff' ,
            dark: blue[900],
        },
        secondary: {
            light: grey[400],
            main: grey[600],
            dark: grey[900],
        },
    },
});