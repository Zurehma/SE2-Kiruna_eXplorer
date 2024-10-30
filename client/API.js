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

//Export API methods
const API = {
    getDocuments
};
  
export default API;
  