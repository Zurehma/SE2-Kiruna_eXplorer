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

// Function to get types of documents
const getTypeDocuments = async () => {
    return await fetch(`${SERVER_URL}/document-types`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of scales
const getTypeScale = async () => {
    return await fetch(`${SERVER_URL}/scales`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to get types of links
const getTypeLinks = async () => {
    return await fetch(`${SERVER_URL}/link-types`)
        .then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to save a document
const saveDocument = async (doc) => {
    try {
        const response = await fetch(`${SERVER_URL}/document`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: doc.title,
                stakeholders: doc.stakeholders,
                scale: doc.scale,
                nValue: doc.nValue,
                issuanceDate: doc.issuanceDate,
                type: doc.type,
                connections: doc.connections,
                language: doc.language,
                pages: doc.pages,
                latitude: doc.latitude,
                longitude: doc.longitude,
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

// Function to save a link
const setLink = async (linkData) => {
    try {
        const response = await fetch(`${SERVER_URL}/links`, {
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

// Exporting all API functions
export default {
    getDocuments,
    getTypeDocuments,
    getTypeScale,
    getTypeLinks,
    saveDocument,
    setLink,
};
