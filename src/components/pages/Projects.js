import Message from "../layout/Message";
import { useLocation } from "react-router-dom";
import styles from "./Project.module.css"
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";

export default function Projects() {

    const [projects,setProjects] = useState([]);
    const location = useLocation()
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState("");
    let message = '';
    if(location.state){
        message=location.state.message
    }

    useEffect(()=>{
        fetch('http://localhost:5000/projects',{
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
            },
        }).then(resp=>resp.json())
          .then(data=>{
            setProjects(data)
            setRemoveLoading(true)
        }).catch(err=>console.log(err))
    },[])

    function removeProject(id){
        fetch(`http://localhost:5000/projects/${id}`,{method:"DELETE",headers:{"Content-Type": "application/json"}}).then((resp)=>resp.json()).then(
            (data)=>{
                setProjects(projects.filter((project)=>project.id !== id))
                setProjectMessage("Projeto deletado com sucesso!")
            }
        ).catch((err)=>console.log(err))
    }






    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text ="Criar Projeto"></LinkButton>
            </div>
            {message && (
                <Message msg = {message} type = "success"/>
            )}
            {projectMessage && (
                <Message msg = {projectMessage} type = "success"/>
            )}
            <Container customClass="start">
                {projects.length > 0 && projects.map((project)=>(
                    <ProjectCard 
                    id = {project.id}
                    name = {project.name} 
                    budget = {project.budget}
                    category = {project.category.name}
                    key = {project.id}
                    handleRemove={removeProject}
                    />
                ))}
                {!removeLoading && <Loading/>}
                {removeLoading && projects.length===0 && (
                    <p>Não há projetos cadastrados</p>
                )
                }
            </Container>
        </div>
    )
}