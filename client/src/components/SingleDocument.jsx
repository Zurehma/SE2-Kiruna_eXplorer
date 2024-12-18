import '../styles/SingleDocument.css';

import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import API from '../../API';
import { MyPopup } from './MyPopup.jsx'; 
import updateDocument from './Filters/UpdateDocument.js';

function SingleDocument(props) {
    const { id } = useParams();
    const [document, setDocument] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getDocument = async () => {
            try{
                const response = await API.getDocumentById(id);
                const updated = updateDocument(response);
                setDocument(updated);
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
            <div className='myPopupStyle myPopupContainer'>
                <Button onClick={() => navigate(-1)} className="back-button">
                    <i className="bi bi-arrow-left back-icon me-1"></i>
                    Back
                </Button>
                <MyPopup doc={document} setError={props.setError} loggedIn={props.loggedIn} className='myPopupStyle'/>
            </div>
        </div>
    );
}

export {SingleDocument};