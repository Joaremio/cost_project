import styles from "./LinkButton.module.css"
import {Link} from "react-router-dom"

export default function LinkButton({to, text}){
    return(
        <Link to={to} className={styles.btn}>
            {text}
        </Link>
    )
}