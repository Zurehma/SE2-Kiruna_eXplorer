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

const getDocumentById = async (id) => {
    return await fetch(`${SERVER_URL}/documents/${id}`)
      .then(handleInvalidResponse)
      .then(response => response.json())
      .catch(error => {
        console.error(`Error fetching document with id ${id}:`, error);
        throw error; // Rilancia l'errore per gestirlo a un livello superiore
      });
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
            coordinates: { lat: doc.coordinates.lat, long: doc.coordinates.long },
        }).filter(([_, value]) => value !== '' && value !== null)
    );

    console.log(filteredDoc);

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


/** 
 * Function to get the attachments of a document given its ID. 
 */
const getAttachments = async (docID) => {
    return await fetch(`${SERVER_URL}/documents/${docID}/attachments`, {
        method: 'GET',
    }).then(handleInvalidResponse).then(response => response.json());
};

/** 
 * Function to download an attachment given its ID.
 */
const downloadAttachment = async (docID, attachmentID) => {
    try {
        // EFetch request to the server
        const response = await fetch(`${SERVER_URL}/documents/${docID}/attachments/${attachmentID}/download`, {
            method: 'GET',
        });

        // 200 if the response is correct
        if (!response.ok) {
            throw new Error(`Failed to fetch file. Status: ${response.statusText}`);
        }

        

        // Blob file gotten from the response
        const blob = await response.blob();
        if (!blob || blob.size === 0) {
            throw new Error("The file is empty or invalid.");
        }

        // Return the blob object
        return blob;
    } catch (error) {
        console.error("Download failed:", error);
        throw error;  // Propagate the error to the caller
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


/** 
 * This function logs in a user given the credentials.
 */
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

/**
 * This function retrieves the information of the currently logged-in user.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

  // Function to filter documents
  const filterDocuments = async (filters) => {
    const queryParams = new URLSearchParams();
  
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.stakeholder) queryParams.append('stakeholder', filters.stakeholder);
    if (filters.issuanceDateFrom) queryParams.append('issuanceDateFrom', filters.issuanceDateFrom);
    if (filters.issuanceDateTo) queryParams.append('issuanceDateTo', filters.issuanceDateTo);
  
    const queryString = queryParams.toString();
  
    // Form the URL properly by adding `?` if there are query parameters
    const url = `${SERVER_URL}/documents${queryString ? `?${queryString}` : ''}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      return handleInvalidResponse(response).json();
    } catch (error) {
      console.error("Error filtering documents:", error);
      throw error;
    }
  };
  

// Function to get all stakeholders
const getStakeholders = async () => {
    return await fetch(`${SERVER_URL}/documents/stakeholders`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
        .then(handleInvalidResponse)
        .then((response) => response.json());
};

// Function to get all document types
const getDocumentTypes = async () => {
    return await fetch(`${SERVER_URL}/documents/document-types`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
        .then(handleInvalidResponse)
        .then((response) => response.json());
};

//Function to delete an attachment
const deleteAttachment = async (docID, attachmentID) => {
    try {
        const response = await fetch(`${SERVER_URL}/documents/${docID}/attachments/${attachmentID}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    } catch (error) {
        throw error;
    }
}
const updateDocument = async (documentId, documentData) =>{
    const response = await fetch(`/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    });
    if (!response.ok) {
      throw new Error("Failed to update document");
    }
    return await response.json();
};

//Export API methods
const API = {
    updateDocument,
    getStakeholders,
    getDocumentTypes,
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
    getLinksDoc,
    getAttachments,
    downloadAttachment,
    filterDocuments,
    deleteAttachment,
    getDocumentById,
    updateDocument
};
  

export default API;
  
