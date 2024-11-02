import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import DocumentRoutes from "../../../routes/documentRoutes.mjs";

describe("DocumentRoutes", () => {
  let documentRoutes = new DocumentRoutes();

  describe("POST api/documents", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    test("", () => {
      expect(1).toBe(1);
    });
  });
});
