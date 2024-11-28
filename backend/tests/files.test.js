const request = require("supertest");
const app = require("../index");

jest.mock("@google-cloud/storage", () => ({
    Storage: jest.fn().mockImplementation(() => ({
        bucket: jest.fn().mockReturnThis(),
        getFiles: jest.fn(async () => [
            [
                { name: "file1.txt" },
                { name: "file2.txt" },
            ],
        ]),
    })),
}));

describe("GET /files", () => {
    it("should return a list of files", async () => {
        const res = await request(app).get("/files");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "file1.txt" }),
                expect.objectContaining({ name: "file2.txt" }),
            ])
        );
    });
});
