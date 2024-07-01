import React, { useContext, useState, useRef } from "react";
import Alert from "../login/Alert";
import { AlertContext } from "../../contexts/alertContext";
import { AlertTypeContext } from "../../contexts/alertTypeContext";
import { AlertColorContext } from "../../contexts/alertColorContext";
import { registerPlace } from "../../services/places/registerPlace";
import Header from "../home/Header"
import { useNavigate } from "react-router-dom";
import '../../styles/global.css'
import '../../styles/new_places.css'

const initialFormState = {
    title: '',
    desc: '',
    image: '',
    endereco: '',
    horario:''
};


export default function NewPlaces(){
    const navigate = useNavigate();

    const [form, setForm] = useState(initialFormState)
    const [image, setImage] = useState('')
    const fileInputRef = useRef(null);
    const [showAlert, setShowAlert] = useContext(AlertContext)
    const [alertType, setAlertType] = useContext(AlertTypeContext)
    const [alertColor, setAlertColor] = useContext(AlertColorContext);
    const token = localStorage.getItem("token")
   
    function handleAlert(state, type, color=null) {
        setShowAlert(state)
        setAlertType(type)
        setAlertColor(color)

        setTimeout(() => {
            setShowAlert(false);
          }, 2000)
    }


    function handleChange(event){
        setForm({...form, [event.target.name]:event.target.value})
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
          setImage(file)
          };
    }

    function handleSubmit(event){
        event.preventDefault();
        console.log(form)

        if(form.title && form.desc && form.endereco && form.horario && image){
            
             registerPlace(form.title, form.endereco,  form.horario, form.desc, image, token)
                      .then((data)=>{

                        handleAlert(true, 'Cadastro realizado com sucesso', 'success')
                        setForm(initialFormState); // Redefinir o formulário
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = ''; // Redefinir o campo de entrada de arquivo
                                }
                        navigate(-1);
                      })
                      .catch((error) => {
                        handleAlert(true, 'Algum erro ocorreu durante o cadastro, tente novamente', 'danger')  
                
                          console.log(error.response.status)
                         
                      } )
        

                }else{
                    handleAlert(true, 'Preencha todos os campos', 'danger')    
                
            }

    } 
    


    return(
        <>
        <Alert></Alert>
        <Header />
        <div className='background mainContainerPlaces'>

       

                <form className='subcontainer' onSubmit={handleSubmit}>
                <h1 className='placeTitle'>Cadastro de pontos turísticos</h1>

                <h3 className='titlePlaces'>Título</h3>
                <input className='inputTitle' type="text" name='title' value={form.title} onChange={handleChange}/>

                <h3 className='titlePlaces'>Endereço</h3>
                <input className='inputTitle' type="text" name='endereco' value={form.endereco} onChange={handleChange}/>

                <h3 className='titlePlaces'>Horário de funcionamento</h3>
                <input className='inputTitle' type="text" name='horario' value={form.horario} onChange={handleChange}/>

                <h3 className='titlePlaces'>Descrição</h3>
                <textarea className= 'inputDesc' name='desc' value={form.desc} onChange={handleChange}/>

                <h3 className='titlePlaces'>Imagem do ponto turístico</h3>
                {image && <img className="imagem" src={URL.createObjectURL(image)} alt={form.title} />}
                <input className='inputFile' type="file" ref={fileInputRef} onChange={handleImageChange}/>

                <button className='button cadastrar' type="submit">Cadastrar</button>
                </form>

        </div>
        </>
    )
}