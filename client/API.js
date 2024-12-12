const SERVER_URL = "http://localhost:3001";

/**
 * Utility function to check if an answer from the server is invalid.
 */
function handleInvalidResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  let type = response.headers.get("Content-Type");
  if (type !== null && type.indexOf("application/json") === -1) {
    throw new TypeError(`Expected JSON, got ${type}`);
  }
  return response;
}

// Function to get all documents
const getDocuments = async (filters = undefined, all = false) => {
  const documents = [];
  let nextURI = `${SERVER_URL}/api/documents`;

  if (filters) {
    const queryParams = new URLSearchParams();

    if (filters.type) queryParams.append("type", filters.type);
    if (filters.stakeholder) queryParams.append("stakeholder", filters.stakeholder);
    if (filters.issuanceDateFrom) queryParams.append("issuanceDateFrom", filters.issuanceDateFrom);
    if (filters.issuanceDateTo) queryParams.append("issuanceDateTo", filters.issuanceDateTo);
    if (filters.pageNo) queryParams.append("pageNo", filters.pageNo);

    const queryString = queryParams.toString();
    nextURI += `?${queryString}`;
  }

  if (all) {
    do {
      const data = await fetch(nextURI)
        .then(handleInvalidResponse)
        .then((response) => response.json());
      documents.push(...data.elements);
      nextURI = data.next ? `${SERVER_URL}${data.next}` : undefined;
    } while (nextURI);

    return documents;
  }

  return await fetch(nextURI)
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

const getDocumentById = async (id) => {
  return await fetch(`${SERVER_URL}/api/documents/${id}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .catch((error) => {
      console.error(`Error fetching document with id ${id}:`, error);
      throw error; // Rilancia l'errore per gestirlo a un livello superiore
    });
};

//Upload files
const uploadFiles = async (docID, formData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${docID}/attachments`, {
      method: "POST",
      credentials: "include",
      headers: {},
      body: formData,
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
  return await fetch(`${SERVER_URL}/api/documents/document-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Function to get types of scales
const getTypeScale = async () => {
  return await fetch(`${SERVER_URL}/api/documents/scale-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Function to get types of links
const getTypeLinks = async () => {
  return await fetch(`${SERVER_URL}/api/documents/link-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Function to get linked documents
const getLinksDoc = async (documentId) => {
  return await fetch(`${SERVER_URL}/api/documents/links/${documentId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

/**
 * Function to get the attachments of a document given its ID.
 */
const getAttachments = async (docID) => {
  return await fetch(`${SERVER_URL}/api/documents/${docID}/attachments`, {
    method: "GET",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

/**
 * Function to download an attachment given its ID.
 */
const downloadAttachment = async (docID, attachmentID) => {
  try {
    // EFetch request to the server
    const response = await fetch(`${SERVER_URL}/api/documents/${docID}/attachments/${attachmentID}/download`, {
      method: "GET",
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
    throw error; // Propagate the error to the caller
  }
};

const setLink = async (linkData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id1: linkData.document1,
        ids: linkData.document2,
        type: linkData.linkType,
      }),
    });
    return handleInvalidResponse(response).json();
  } catch (error) {
    console.error("Error setting link:", error);
    throw error;
  }
};

/**
 * This function logs in a user given the credentials.
 */
const logIn = async (credentials) => {
  try {
    const response = await fetch(SERVER_URL + "/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    return handleInvalidResponse(response);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * This function destroy the current user's session (executing the log-out).
 */
const logOut = async () => {
  return await fetch(SERVER_URL + "/api/sessions/logout", {
    method: "DELETE",
    credentials: "include",
  }).then(handleInvalidResponse);
};

/**
 * This function retrieves the information of the currently logged-in user.
 */
const getUserInfo = async () => {
  return await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Function to get all stakeholders
const getStakeholders = async () => {
  return await fetch(`${SERVER_URL}/api/documents/stakeholders`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Function to get all document types
const getDocumentTypes = async () => {
  return await fetch(`${SERVER_URL}/api/documents/document-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

//Function to delete an attachment
const deleteAttachment = async (docID, attachmentID) => {
  try {
    await fetch(`${SERVER_URL}/api/documents/${docID}/attachments/${attachmentID}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    throw error;
  }
};

// Function to delete a document
const deleteDocument = async (docID) => {
  try {
    await fetch(`${SERVER_URL}/api/documents/${docID}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

const saveDocument = async (doc) => {
  const filteredDoc = Object.fromEntries(
    Object.entries({
      title: doc.title,
      stakeholders: doc.stakeholders,
      scale: doc.scale,
      issuanceDate: doc.issuanceDate,
      type: doc.type,
      description: doc.description,
      language: doc.language,
      pages: doc.pages,
      pageFrom: doc.pageFrom,
      pageTo: doc.pageTo,
      coordinates: doc.coordinates,
    }).filter(([_, value]) => value !== "" && value !== null && value !== undefined) // Filtra campi vuoti/nulli
  );
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(filteredDoc),
    });
    return handleInvalidResponse(response).json();
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
};

const updateDocument = async (documentId, doc) => {
  const filteredDoc = Object.fromEntries(
    Object.entries({
      title: doc.title,
      stakeholders: doc.stakeholders,
      scale: doc.scale,
      issuanceDate: doc.issuanceDate,
      type: doc.type,
      description: doc.description,
      language: doc.language,
      pages: doc.pages,
      pageFrom: doc.pageFrom,
      pageTo: doc.pageTo,
      coordinates: doc.coordinates,
    }).filter(([_, value]) => value !== "" && value !== null && value !== undefined) // Filtra campi vuoti/nulli
  );

  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(filteredDoc),
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};
const allExistingLinks = async () => {
  return await fetch(`${SERVER_URL}/api/documents/allExistingLinks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

const deleteLink = async (linkID) => {
  console.log(linkID);
  
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/link/${linkID}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete the link.");
    }

    return;
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
};

//Export API methods
const API = {
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
  deleteAttachment,
  getDocumentById,
  updateDocument,
  allExistingLinks,
  deleteDocument,
  deleteLink
};

export default API;
