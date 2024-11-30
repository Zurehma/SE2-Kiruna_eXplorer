/**
 * Document class
 */
class Document {
  /**
   * Document class constructor
   * @param {Number} id
   * @param {String} title
   * @param {Array<String>} stakeholders
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
    stakeholders,
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
    this.stakeholders = stakeholders;
    this.scale = Number(scale) || scale;
    this.issuanceDate = issuanceDate;
    this.type = type;
    this.connections = connections;
    this.language = language;
    this.description = description;

    if (coordinates) this.coordinates = JSON.parse(coordinates);

    if (pages) this.pages = pages;

    if (pageFrom) this.pageFrom = pageFrom;

    if (pageTo) this.pageTo = pageTo;
  }
}

export default Document;
