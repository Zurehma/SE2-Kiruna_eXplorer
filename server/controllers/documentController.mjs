import DocumentDAO from "../dao/DocumentoDAO.mjs";

function DocumentController() {
  this.documentDAO = new DocumentDAO();

  this.getDocuments = () => {};

  this.addDocument = () => {};

  this.addLink = () => {};
}

export default DocumentController;
