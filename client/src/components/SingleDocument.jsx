import '../styles/SingleDocument.css';

import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

import API from '../../API';
import { MyPopup } from './MyPopup.jsx'; 


function SingleDocument(props) {
    const { id } = useParams();
    const [document, setDocument] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getDocument = async () => {
            try{
                const response = await API.getDocumentById(id);
                setDocument(response);
            } catch (error) {
               props.setError(error);
            }finally{
                setLoading(false);
            }   
        };
        getDocument();
    }, [id]);

    return (
        loading ? <p>Loading...</p> :
        <div className='documents-background '>
            <div className='myPopupStyle'>
                <div onClick={() => navigate(-1)}> 
                    <i class="bi bi-arrow-left back-icon"></i>
                    <span className="back-text">Back</span>
                </div>
                <MyPopup doc={document} setError={props.setError} loggedIn={props.loggedIn} className='myPopupStyle'/>
            </div>
        </div>
    );
}

export {SingleDocument};