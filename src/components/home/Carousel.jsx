import React, { useState, useEffect } from "react";
import { getAllPlaces } from "../../services/places/getAllPlaces";
import { deletePlace } from "../../services/places/deletePlace";
import { useNavigate } from "react-router-dom";
/**
 * Componente Carousel
 *
 * Este componente representa o Carousel exibido na página Places.
 * 
 */

export default function Carousel(){
    const navigate = useNavigate();

    const [listPlaces, setListPlaces] = useState([])
    const token = localStorage.getItem("token")
    const isAdmin = localStorage.getItem("isAdmin") == "true"

    useEffect(() => {
         setPlaces()
       }, [])

     function setPlaces(){

         getAllPlaces(token)
             .then((data) => {
                console.log(data)
                setListPlaces(data)
             })
             .catch((error) => {
                 console.log(error)
            })
     }

     function editPlace(place) {
        localStorage.setItem('update-place', JSON.stringify(place))
        navigate('/admin/update-place')
     }
  
     function removePlace(id) {
        const confirm = window.confirm("Tem certeza de que deseja remover esta atração?")
        if (confirm) {
            deletePlace(id, token)
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error.response.status)
                 
            })
        }
     }

    return(

        <section className="carousel slide" id="carousel">
            
        <div className="carousel-inner">
            
            {listPlaces && listPlaces.map((place, index) => (
                    <div key={index} className={"carousel-item section" + (index == 0 ? " active" : "")}>
                        <h1 className="mainTitle">{place.name}</h1>
                        <img className="imagem" src={place.image} alt={place.name} />
                        <p className="descricao">{place.description}</p>
                        <button className="btn-info" data-bs-toggle="modal" data-bs-target={`#modal${index}`}>Mais informações</button>
                        {isAdmin && <div><button className="btn-info" data-bs-toggle="modal" onClick={() => editPlace(place)}>Editar informações</button></div>}
                        {isAdmin && <div><button className="btn-remove" data-bs-toggle="modal" onClick={() => removePlace(place._id)}>Remover atração</button></div>}
                        <div className="modal" id={`modal${index}`} tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3 className="modal-title">Endereço e horário de funcionamento</h3>
                                        <button className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body text-start">
                                        <h4><strong>Endereço:</strong>{place.address}</h4>
                                        <br></br>
                                        <h4><strong>Horário de funcionamento:</strong>{place.openingHours}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
           
            <button className="carousel-control-prev" data-bs-target='#carousel' data-bs-slide='prev'>
                <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" data-bs-target='#carousel'data-bs-slide='next'>
            <span className="carousel-control-next-icon icon"></span>
            </button>

            
        </div>
        

    </section>
    
    )
}