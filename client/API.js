const SERVER_URL = 'http://localhost:3001/api';

/**
 * Utility function to check if an answer from the server is invalid.
 */
function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

// Function to get all documents
const getDocuments = async () => {
    return await fetch(`${SERVER_URL}/documents`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};


 
//Upload files
const uploadFiles = async (docID, formData) => {
    try {
      const response = await fetch(`${SERVER_URL}/documents/${docID}/attachments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          
        },
        body: formData
      });
  
      // Gestione degli errori di risposta
      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = await response.text();
          throw new Error(`File upload error: ${errorMessage}`);
        } else {
          throw new Error(`Unexpected error: ${response.statusText}`);
        }
      }
  
      // Se la risposta va a buon fine, restituiamo i dati dell'allegato creato
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error; // Lancia di nuovo l'errore per gestirlo a un livello superiore
    }
};
  


const getTypeDocuments = async () => {
    return await fetch(`${SERVER_URL}/documents/document-types` , {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json());
};
  
// Function to get types of scales
const getTypeScale = async () => {
    return await fetch(`${SERVER_URL}/documents/scale-types`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of links
const getTypeLinks = async () => {
    return await fetch(`${SERVER_URL}/documents/link-types`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get linked documents
const getLinksDoc = async (documentId) => {
    return  await fetch(`${SERVER_URL}/documents/links/${documentId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(handleInvalidResponse)
        .then(response => response.json());
};


// Function to save a document
const saveDocument = async (doc) => {

    const filteredDoc = Object.fromEntries(
        Object.entries({
            title: doc.title,
            stakeholder: doc.stakeholder,
            scale: doc.scale,
            issuanceDate: doc.issuanceDate,
            type: doc.type,
            description: doc.description,
            language: doc.language,
            pages: doc.pages,
            pageFrom: doc.pageFrom,
            pageTo: doc.pageTo,
            lat: doc.latitude, 
            long: doc.longitude 
        }).filter(([_, value]) => value !== '' && value !== null)
    );

    try {
        const response = await fetch(`${SERVER_URL}/documents/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(filteredDoc),
        });
        
        return handleInvalidResponse(response).json();
    } catch (error) {
        throw error;
    }
};


const setLink = async (linkData) => {
    try {
        const response = await fetch(`${SERVER_URL}/documents/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                id1: linkData.document1,
                ids: linkData.document2,
                type: linkData.linkType
            }),
            credentials: 'include',
        });
        return handleInvalidResponse(response).json();
    } catch (error) {
        throw error;
    }
};



  const logIn = async (credentials) => {
    try {
        const response = await fetch(SERVER_URL + '/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });
        return handleInvalidResponse(response);
    } catch (error) {
        throw error
    }
};

  /**
  * This function destroy the current user's session (executing the log-out).
  */
  const logOut = async() => {
    return await fetch(SERVER_URL + '/sessions/logout', {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleInvalidResponse);
  }
  const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
  };



//Export API methods
const API = {
    getDocuments,
    saveDocument,
    logIn,
    logOut,
    getTypeDocuments,
    getTypeScale,
    getTypeLinks,
    setLink,
    getUserInfo,
    uploadFiles,
    getLinksDoc
};
  

export default API;
  
