INSERT INTO document (id, title, stakeholder, scale, issuanceDate, type, connections, language, pages, description, lat, long)
VALUES (2, 'Compilation of responses “So what the people of Kiruna think?”', 'Kiruna kommun/Residents', 'Text', '2007', 'Informative document', '3', 'Swedish', 1, 'This document is a compilation of the responses to the survey', "67.8557", "20.2255");


DELETE FROM document WHERE id = 2;