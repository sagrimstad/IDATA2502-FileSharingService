const request = require("supertest");
const app = require("../index");

jest.mock("@google-cloud/storage", () => ({
    Storage: jest.fn().mockImplementation(() => ({
        bucket: jest.fn().mockReturnValue({
            file: jest.fn().mockReturnValue({
                createWriteStream: jest.fn(() => ({
                    on: jest.fn((event, callback) => {
                        if (event === "finish") {
                            setImmediate(callback);
                        }
                        if (event === "error") {
                            setImmediate(() => callback(new Error("Mock error")));
                        }
                    }),
                    end: jest.fn(),
                })),
            }),
        }),
    })),
}));

let server;

beforeAll(() => {
    server = app.listen(4000);
});

afterAll(async () => {
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
});

describe("POST /upload", () => {
    it("should return 400 if no file is uploaded", async () => {
        const res = await request(server).post("/upload");
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("No file uploaded");
    });

    it("should return 200 for a successful upload", async () => {
        const mockFile = Buffer.from("test content");
        const res = await request(server)
            .post("/upload")
            .attach("file", mockFile, "test.txt");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("File uploaded successfully");
        expect(res.body).toHaveProperty("url");
    }, 10000); // Increase timeout
});
