const SERVER_URL = 'http://localhost:3001/api';

//request to GET http://localhost:3001/api/documents to obtain all the documents
const getDocuments = async () => {
    return await fetch(SERVER_URL + '/documents').then(handleInvalidResponse)
    .then(response => response.json());
  };
  

/**
 * Utility function to check if an answer from the server is invalid, it is shown how to use it
 * in the getDocuments 
 */
function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

const saveDocument = async (doc) => {
    try {
      const response = await fetch(SERVER_URL + '/api/document', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', },
        body: JSON.stringify({title: doc.title , stakeholder: doc.stakeholder, scale: doc.scale, issuanceDate: doc.issuanceDate, type: doc.type, connections: doc.connections, language: doc.language, description: doc.description, pages: doc.pages, lat: game.lat, long: doc.long},),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save document: ${response.statusText}`);
      }
  
      const id_doc = await response.json();
      return id_doc;
  
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  };


//Export API methods
const API = {
    getDocuments,
    saveDocument
};
  
export default API;
  
