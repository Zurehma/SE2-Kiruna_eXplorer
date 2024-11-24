import '../styles/SingleDocument.css';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import API from '../../API';
import { MyPopup } from './MyPopup.jsx'; 


function SingleDocument(props) {
    const { id } = useParams();
    console.log(id)
    const [document, setDocument] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDocument = async () => {
            try{
                const response = await API.getDocumentById(id);
                setDocument(response.data);
                //Add the id field to the document object
                setDocument({...response.data, id});
            } catch (error) {
               props.setError(error);
            }finally{
                setLoading(false);
                console.log(document)
            }   
        };
        getDocument();
    }, [id]);

    return (
        loading ? <p>Loading...</p> :
        <div className='documents-background '>
            <MyPopup doc={document} setError={props.setError} loggedIn={props.loggedIn}/>
        </div>
    );
}

export {SingleDocument};