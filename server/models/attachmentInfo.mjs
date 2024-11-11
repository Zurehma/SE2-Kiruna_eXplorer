/**
 * Attachment info class
 */

class AttachmentInfo {
  constructor(id, docID, name, path, format) {
    this.id = id;
    this.docID = docID;
    this.name = name;
    this.path = path;
    this.format = format;
  }
}

export default AttachmentInfo;
