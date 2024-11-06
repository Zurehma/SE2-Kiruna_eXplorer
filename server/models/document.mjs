/**
 * Document class
 */
class Document {
  /**
   * Document class constructor
   * @param {Number} id
   * @param {String} title
   * @param {String} stakeholder
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {Number} connections
   * @param {String} language
   * @param {String} description
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @param {String | null} lat
   * @param {String | null} long
   */
  constructor(
    id,
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    connections,
    language,
    description,
    pages = null,
    pageFrom = null,
    pageTo = null,
    lat = null,
    long = null
  ) {
    this.id = id;
    this.title = title;
    this.stakeholder = stakeholder;
    this.scale = Number(scale) || scale;
    this.issuanceDate = issuanceDate;
    this.type = type;
    this.connections = connections;
    this.language = language;
    this.description = description;
    this.pages = Number(pages) || null;
    this.pageFrom = pageFrom;
    this.pageTo = pageTo;
    this.lat = lat;
    this.long = long;
  }
}

/**
 * Document types enum
 */
const DOCUMENT_TYPES = {
  INFORMATIVE: "Informative",
  PRESCRIPTIVE: "Prescriptive",
  MATERIAL: "Material",
  DESIGN: "Design",
  TECHNICAL: "Technical",
};

/**
 * Get the document type values
 * @returns {Array<String>} An array of document type values
 */
export const getDocumentTypes = () => {
  return Object.values(DOCUMENT_TYPES);
};

/**
 * Check if the input type is a valid document type
 * @param {String} type
 * @returns {String | undefined} The document type if it founds a match otherwise undefined
 */
export const isDocumentType = (type) => {
  if (typeof type !== "string") {
    return undefined;
  }

  return Object.values(DOCUMENT_TYPES).find((DOCUMENT_TYPE) => DOCUMENT_TYPE.toLowerCase().trim() === type.toLowerCase().trim());
};

/**
 * Scale type enum
 */
const SCALE_TYPES = {
  BLUEPRINT_EFFECTS: "Blueprint/effects",
  TEXT: "Text",
  GENERIC: "1:n",
};

/**
 * Get the document type values
 * @returns {Array<String>} An array of scale type values
 */
export const getScaleTypes = () => {
  return Object.values(SCALE_TYPES);
};

/**
 * Check if the input type is a valid scale type
 * @param {String} scale
 * @returns {String | undefined} The scale type if it founds a match otherwise undefined
 */
export const isScaleType = (scale) => {
  if (typeof scale !== "string") {
    return undefined;
  }

  return Object.values(SCALE_TYPES).find(
    (SCALE_TYPE) => SCALE_TYPE.toLowerCase().trim() === scale.toLowerCase().trim() && SCALE_TYPES.GENERIC !== SCALE_TYPE
  );
};

/**
 * Link type enum
 */
const LINK_TYPES = {
  DIRECT: "Direct",
  COLLATERAL: "Collateral",
  PROJECTION: "Projection",
  UPDATE: "Update",
};

/**
 * Get the link type values
 */
export const getLinkTypes = () => {
  return Object.values(LINK_TYPES);
};

/**
 * Check if the input type is a valid link type
 * @param {String} link
 * @returns {String | undefined} The link type if it founds a match otherwise undefined
 */
export const isLinkType = (link) => {
  if (typeof link !== "string") {
    return undefined;
  }

  return Object.values(LINK_TYPES).find((LINK_TYPE) => LINK_TYPE.toLowerCase().trim() === link.toLowerCase().trim());
};

export default Document;