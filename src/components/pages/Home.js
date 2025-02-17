import styles from "./Home.module.css"
import LinkButton from "../layout/LinkButton"

export default function Home(){
    return (
        <section className = {styles.home_container}>
            <h1>Bem vindo ao <span>Cost</span></h1>
            <p>Comece a gerenciar seus projetos agora mesmo!</p>
            <LinkButton to="/newproject" text ="Criar Projeto"></LinkButton>
        </section>
    )
}