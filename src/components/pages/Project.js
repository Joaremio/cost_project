import styles from "./Projecte.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import Message from "../layout/Message";
import ProjectForm from "../project/ProjectForm"
import ServiceForm from "../services/ServiceForm"
import {parse, v4 as uuidv4} from 'uuid'
import ServiceCard from "../services/ServiceCard";


export default function Project() {
    const { id } = useParams();
    const [project, setProject] = useState({});
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState();

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setServices(data.service || []);
            })
            .catch((err) => console.log(err));
    }, [id]);

    function createService(project) {
        setMessage("");
    
        // Certificando-se de que a lista de serviços está inicializada como um array
        if (!project.service) {
            project.service = [];
        }
    
        const lastService = project.service[project.service.length - 1];
    
        // Verifique se há pelo menos um serviço na lista
        if (lastService) {
            lastService.id = uuidv4();
    
            const lastServiceCost = lastService.cost;
    
            // Calculando o novo custo
            const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);
    
            // Verificando se o orçamento foi ultrapassado
            if (newCost > parseFloat(project.budget)) {
                setMessage("Orçamento ultrapassado, verifique o valor do serviço");
                setType("error");
                project.service.pop(); // Remover o último serviço adicionado
                return false;
            }
    
            project.cost = newCost;
        }
    
        // Enviando os dados atualizados para o servidor
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
               setShowServiceForm(false)
            })
            .catch((err) => console.log(err));
    }
    

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    function editPost(updatedProject) {
        setMessage("");

        if (updatedProject.budget < updatedProject.cost) {
            setMessage("O orçamento não pode ser menor que o custo do projeto!");
            setType("error");
            return;
        }

        fetch(`http://localhost:5000/projects/${updatedProject.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProject),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setShowProjectForm(false);
                setMessage("Projeto atualizado!");
                setType("success");
            })
            .catch((err) => console.log(err));
    }

    function removeService(id, cost) {


        const servicesUpdated = project.service.filter(
            (service)=>service.id !== id
        )

        const projectUpdated = project;

        projectUpdated.service = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)


        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectUpdated),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(projectUpdated);
                setServices(servicesUpdated);
                setMessage("Serviço removido com sucesso!");
                setType("success");
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category?.name}
                                    </p>
                                    <p>
                                        <span>Total de orçamento:</span> {project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado:</span> {project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_from_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm handleSubmit={createService} btnText="Criar Serviço" projectData={project} />
                                )}
                                <h2>Serviços</h2>
                                <div className={styles.project_services}>
                                {services.length > 0 ? (
                                services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    handleRemove={() => removeService(service.id, service.cost)}
                                />
                            ))
                        ) : (<p>Não há serviços cadastrados</p>)}
                                </div>
                            </div>
                        </div>
                        
                    </Container>
                    
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

