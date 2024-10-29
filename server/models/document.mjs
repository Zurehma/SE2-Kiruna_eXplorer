function Document(id, title, stakeholder, scale, issuaceDate, type, connections, language, pages, description) {
  this.id = id;
  this.title = title;
  this.stakeholder = stakeholder;
  this.scale = scale;
  this.issuaceDate = issuaceDate;
  this.type = type;
  this.connections = connections;
  this.language = language;
  this.pages = pages;
  this.description = description;
}

export default Document;