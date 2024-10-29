/**
 * Document class
 */
class Document {
  /**
   * Document class constructor
   * @param {Number} id
   * @param {String} title
   * @param {String} stakeholder
   * @param {Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {Number} connections
   * @param {String} language
   * @param {String} description
   * @param {Number | null} pages
   * @param {String | null} lat
   * @param {String | null} long
   */
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

/**
 * Document types enum
 */
const DOCUMENT_TYPES = {
  INFORMATIVE: "Informative",
};

/**
 * Check if the input type is a valid document type
 * @param {String} type
 * @returns The document type if it founds a match otherwise undefined
 */
export const isDocumentType = (type) => {
  if (typeof type !== "string") {
    return undefined;
  }

  return Object.values(DOCUMENT_TYPES).find((DOCUMENT_TYPE) => DOCUMENT_TYPE.toLowerCase().trim() === type.toLowerCase().trim());
};

export default Document;
