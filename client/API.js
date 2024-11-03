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
    return await fetch(`${SERVER_URL}/documents/documents`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of documents
const getTypeDocuments = async () => {
    return await fetch(`${SERVER_URL}/documents/document-types`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of scales
const getTypeScale = async () => {
    return await fetch(`${SERVER_URL}/documents/scale-types`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of links
const getTypeLinks = async () => {
    return await fetch(`${SERVER_URL}/documents/link-types`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to save a document
const saveDocument = async (doc) => {
    try {
        const response = await fetch(`${SERVER_URL}/documents/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: doc.title,
                stakeholders: doc.stakeholders,
                scale: doc.scale,
                nValue: doc.nValue,
                issuanceDate: doc.issuanceDate,
                type: doc.type,
                language: doc.language,
                pages: doc.pages,
                lat: doc.latitude,
                long: doc.longitude,
                description: doc.description
            }),
            credentials: 'include',
        });
        return handleInvalidResponse(response).json();
    } catch (error) {
        console.error("Error saving document:", error);
        throw error;
    }
};

const setLink = async (linkData) => {
    try {
        const response = await fetch(`${SERVER_URL}/documents/:id/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document1: linkData.document1,
                document2: linkData.document2,
                linkType: linkData.linkType
            }),
            credentials: 'include',
        });
        return handleInvalidResponse(response).json();
    } catch (error) {
        console.error("Error saving link:", error);
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
        console.error("Login failed:", error);
        throw error;
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
};
  

export default API;
  
