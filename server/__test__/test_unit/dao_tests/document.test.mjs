import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import db from "../../../db/db.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";

jest.mock("../../../db/db.mjs");

/**
 * @type {DocumentDAO}
 */
let documentDAO;

describe("DocumentDAO - addDocument", () => {
  beforeEach(() => {
    documentDAO = new DocumentDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Insert successful", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback.call({ lastID: 0, changes: 1 }, null);
    });

    const result = await documentDAO.addDocument(
      "example",
      "example",
      100,
      "2024-02-12",
      "Informative",
      "english",
      "Lore ipsum...",
      null,
      null,
      null
    );

    expect(result.lastID).toBeGreaterThanOrEqual(0);
    expect(result.changes).toBe(1);
    expect(mockDBRun).toHaveBeenCalled();
  });

  test("DB error", async () => {
    const error = new Error("");

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(error);
      return {};
    });

    const result = documentDAO.addDocument("example", "example", 100, "2024-02-12", "Informative", "english", "Lore ipsum...", null, null, null);

    await expect(result).rejects.toEqual(error);
    expect(mockDBRun).toHaveBeenCalled();
  });
});
