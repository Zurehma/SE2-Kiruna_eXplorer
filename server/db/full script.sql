BEGIN TRANSACTION;
DROP TABLE IF EXISTS "USER";
CREATE TABLE IF NOT EXISTS "USER" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"role"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"salt"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "DOCUMENT_TYPE";
CREATE TABLE IF NOT EXISTS "DOCUMENT_TYPE" (
	"name"	TEXT,
	PRIMARY KEY("name")
);
DROP TABLE IF EXISTS "STAKEHOLDER";
CREATE TABLE IF NOT EXISTS "STAKEHOLDER" (
	"name"	TEXT,
	PRIMARY KEY("name")
);
DROP TABLE IF EXISTS "LINK_TYPE";
CREATE TABLE IF NOT EXISTS "LINK_TYPE" (
	"name"	TEXT,
	PRIMARY KEY("name")
);
DROP TABLE IF EXISTS "DOCUMENT";
CREATE TABLE IF NOT EXISTS "DOCUMENT" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"scale"	TEXT NOT NULL,
	"issuanceDate"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"connections"	INTEGER NOT NULL,
	"language"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"coordinates"	TEXT,
	"pages"	INTEGER,
	"pageFrom"	INTEGER,
	"pageTo"	INTEGER,
	FOREIGN KEY("type") REFERENCES "DOCUMENT_TYPE"("name") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "DOCUMENT_STAKEHOLDER";
CREATE TABLE IF NOT EXISTS "DOCUMENT_STAKEHOLDER" (
	"docID"	INTEGER,
	"stakeholder"	TEXT,
	PRIMARY KEY("docID","stakeholder"),
	FOREIGN KEY("docID") REFERENCES "DOCUMENT"("id") ON DELETE CASCADE,
	FOREIGN KEY("stakeholder") REFERENCES "STAKEHOLDER"("name") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "ATTACHMENT";
CREATE TABLE IF NOT EXISTS "ATTACHMENT" (
	"docID"	INTEGER NOT NULL,
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"path"	TEXT NOT NULL,
	"format"	TEXT NOT NULL,
	FOREIGN KEY("docID") REFERENCES "DOCUMENT"("id") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "LINK";
CREATE TABLE IF NOT EXISTS "LINK" (
	"linkID"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"docID1"	INTEGER,
	"docID2"	INTEGER,
	"type"	TEXT NOT NULL,
	FOREIGN KEY("docID1") REFERENCES "DOCUMENT"("id") ON DELETE CASCADE,
	FOREIGN KEY("docID2") REFERENCES "DOCUMENT"("id") ON DELETE CASCADE,
	FOREIGN KEY("type") REFERENCES "LINK_TYPE"("name") ON DELETE CASCADE
);
DROP TRIGGER IF EXISTS "update_connections_insert";
CREATE TRIGGER update_connections_insert
AFTER INSERT ON LINK
FOR EACH ROW
BEGIN
	UPDATE DOCUMENT
	SET connections = connections + 1
	WHERE id = NEW.docID1 OR id = NEW.docID2;
END;
DROP TRIGGER IF EXISTS "document_type_delete";
CREATE TRIGGER document_type_delete
AFTER DELETE ON DOCUMENT
WHEN NOT EXISTS (SELECT * FROM DOCUMENT WHERE type = OLD.type)
BEGIN
DELETE FROM DOCUMENT_TYPE WHERE name = OLD.type;
END;
DROP TRIGGER IF EXISTS "document_type_insert";
CREATE TRIGGER document_type_insert
BEFORE INSERT ON DOCUMENT
WHEN NOT EXISTS (SELECT * FROM DOCUMENT_TYPE WHERE name = NEW.type)
BEGIN
INSERT INTO DOCUMENT_TYPE (name) VALUES (NEW.type);
END;
DROP TRIGGER IF EXISTS "document_type_update_1";
CREATE TRIGGER document_type_update_1
BEFORE UPDATE ON DOCUMENT
WHEN NOT EXISTS (SELECT * FROM DOCUMENT WHERE type = NEW.type)
BEGIN
INSERT INTO DOCUMENT_TYPE (name) VALUES (NEW.type);
END;
DROP TRIGGER IF EXISTS "document_type_update_2";
CREATE TRIGGER document_type_update_2
AFTER UPDATE ON DOCUMENT
WHEN NOT EXISTS (SELECT * FROM DOCUMENT WHERE type = OLD.type)
BEGIN
DELETE FROM DOCUMENT_TYPE WHERE name = OLD.type;
END;
DROP TRIGGER IF EXISTS "link_type_delete";
CREATE TRIGGER link_type_delete
AFTER DELETE ON LINK
WHEN NOT EXISTS (SELECT * FROM LINK WHERE type = OLD.type)
BEGIN
DELETE FROM LINK_TYPE WHERE name = OLD.type;
END;
DROP TRIGGER IF EXISTS "link_type_insert";
CREATE TRIGGER link_type_insert
BEFORE INSERT ON LINK
WHEN NOT EXISTS (SELECT * FROM LINK_TYPE WHERE name = NEW.type)
BEGIN
INSERT INTO LINK_TYPE (name) VALUES (NEW.type);
END;
DROP TRIGGER IF EXISTS "stakeholder_delete";
CREATE TRIGGER stakeholder_delete
AFTER DELETE ON DOCUMENT_STAKEHOLDER
WHEN NOT EXISTS (SELECT * FROM DOCUMENT_STAKEHOLDER WHERE stakeholder = OLD.stakeholder)
BEGIN
DELETE FROM STAKEHOLDER WHERE name = OLD.stakeholder;
END;
DROP TRIGGER IF EXISTS "stakeholder_insert";
CREATE TRIGGER stakeholder_insert
BEFORE INSERT ON DOCUMENT_STAKEHOLDER
WHEN NOT EXISTS (SELECT * FROM STAKEHOLDER WHERE name = NEW.stakeholder)
BEGIN
INSERT INTO STAKEHOLDER (name) VALUES (NEW.stakeholder);
END;
DROP TRIGGER IF EXISTS "update_connections_delete";
CREATE TRIGGER update_connections_delete
AFTER DELETE ON LINK
FOR EACH ROW
BEGIN
	UPDATE DOCUMENT
	SET connections = connections - 1
	WHERE id = OLD.docID1 OR id = OLD.docID2;
END;
INSERT INTO "USER" ("name","surname","username","role","password","salt") VALUES ('John','Doe','johndoe','Urban Planner','�­�����_���RH','���������q���9');
INSERT INTO "DOCUMENT" ("title","scale","issuanceDate","type","connections","language","description","coordinates","pages","pageFrom","pageTo") VALUES ('Compilation of responses “So what the people of Kiruna think?” (15)','Text','2007','Informative',1,'Swedish','This document is a compilation of the responses to the survey ''What is your impression of Kiruna?'' From the citizens'' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.',NULL,NULL,NULL,NULL),
 ('Detail plan for Bolagsomradet Gruvstad-spark (18)','8000','2010-10-20','Prescriptive',1,'Swedish','This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.','{"lat":67.849982,"long":20.217068}',NULL,1,32),
 ('Development Plan (41)','7500','2014-03-17','Design',2,'Swedish','The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The docment is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.','{"lat":67.852922,"long":20.281398}',111,NULL,NULL),
 ('Deformation forecast (45)','12000','2014-12-01','Technical',0,'Swedish','The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.','{"lat":67.850761,"long":20.223136}',1,NULL,NULL),
 ('Adjusted development plan (47)','7500','2015-01-01','Design',0,'Swedish','This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name ''Adjusted Development Plan91,'' and still represents the version used today after 10 years. Certainly, there are no drastic differen- ces compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.','{"lat":67.853058,"long":20.294995}',1,NULL,NULL),
 ('Detail plan for square and commercial street (50)','1000','2016-06-22','Prescriptive',0,'Swedish','This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.','{"lat":67.848606,"long":20.302761}',NULL,1,43);
INSERT INTO "DOCUMENT_STAKEHOLDER" ("docID", "stakeholder") VALUES (1, 'Kiruna kommun'),
 (1, 'Residents'),
 (2, 'Kiruna kommun'),
 (3, 'Kiruna kommun'),
 (3, 'White Arkitekter'),
 (4, 'LKAB'),
 (5, 'Kiruna kommun'),
 (5, 'White Arkitekter'),
 (6, 'Kiruna kommun');
INSERT INTO "LINK" ("docID1","docID2","type") VALUES (3,1,'Direct'),
 (3,2,'Direct');
COMMIT;
