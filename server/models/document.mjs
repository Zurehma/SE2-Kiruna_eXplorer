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
   * @param {String | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
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
    coordinates = null,
    pages = null,
    pageFrom = null,
    pageTo = null
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
    coordinates ? (this.coordinates = JSON.parse(coordinates)) : "";
    pages ? (this.pages = pages) : "";
    pageFrom ? (this.pageFrom = pageFrom) : "";
    pageTo ? (this.pageTo = pageTo) : "";
  }
}

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
