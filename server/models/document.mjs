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



export default Document;
