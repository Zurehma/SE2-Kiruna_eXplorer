class Document {
  constructor(id, title, stakeholder, scale, issuanceDate, type, connections, language, description, pages = null, lat = null, long = null) {
    this.id = id;
    this.title = title;
    this.stakeholder = stakeholder;
    this.scale = scale;
    this.issuanceDate = issuanceDate;
    this.type = type;
    this.connections = connections;
    this.language = language;
    this.description = description;
    this.pages = pages;
    this.lat = lat;
    this.long = long;
  }
}

export const DOCUMENT_TYPES = {
  INFORMATIVE: "Informative",
};

export default Document;
