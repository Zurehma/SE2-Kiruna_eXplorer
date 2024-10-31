const SERVER_URL = 'http://localhost:3001';
//import dayjs from 'dayjs';

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

const API = {saveDocument};
export default API;