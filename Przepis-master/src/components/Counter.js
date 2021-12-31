/*
import React, {useState, useEffect} from "react";

const Counter = props => {
    // const  state = React.useState()              -to wersja bez useState w import
    const [number, setNumber] =useState(0)      //tylko w ciele komponentu czyli w propsie

    const [componentDidMount, setComponentDidMount] = useState(false)
    useEffect(() =>{
        if (componentDidMount === false) {
            console.log(' component did  mount')
            setComponentDidMount(true)
        }
        console.log('update')
    })

    return(
        <div>
            <p>{number}</p>
<button
    onClick={() => setNumber(number+1)}
        >+
</button>
</div>
    )
}
export default Counter*/
