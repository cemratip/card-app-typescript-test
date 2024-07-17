import { server } from "../src/server"
import Prisma from "../src/db";

jest.mock("../src/db", () => ({
  entry: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the entry CRUD functions
const createMock = jest.mocked(Prisma.entry.create as jest.Mock);
const findManyMock = jest.mocked(Prisma.entry.findMany as jest.Mock);
const findUniqueMock = jest.mocked(Prisma.entry.findUnique as jest.Mock);
const updateMock = jest.mocked(Prisma.entry.update as jest.Mock);
const deleteMock = jest.mocked(Prisma.entry.delete as jest.Mock);

describe("Entry Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an entry with default inputs", async () => {
    const defaultEntry = {
      title: "",
      description: "",
      created_at: new Date(),
      scheduled_at: new Date(),
    };

    createMock.mockResolvedValue(defaultEntry);

    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: defaultEntry,
    });

    expect(response.statusCode).toBe(200);
    const createdEntry = JSON.parse(response.payload);
    expect(createdEntry.title).toEqual(defaultEntry.title);
    expect(createdEntry.description).toEqual(defaultEntry.description);
    expect(new Date(createdEntry.created_at)).toEqual(defaultEntry.created_at);
    expect(new Date(createdEntry.scheduled_at)).toEqual(defaultEntry.scheduled_at);
  });

  it("should create an entry with custom inputs", async () => {
    const mockEntry = {
      title: "Test Title",
      description: "Test Description",
      created_at: new Date("01-01-2050"),
      scheduled_at: new Date("01-01-2100"),
    };

    createMock.mockResolvedValue(mockEntry);

    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: mockEntry,
    });

    expect(response.statusCode).toBe(200);
    const createdEntry = JSON.parse(response.payload);
    expect(createdEntry.title).toEqual(mockEntry.title);
    expect(createdEntry.description).toEqual(mockEntry.description);
    expect(new Date(createdEntry.created_at)).toEqual(mockEntry.created_at);
    expect(new Date(createdEntry.scheduled_at)).toEqual(mockEntry.scheduled_at);
  });

  it("should return a 500 error when trying to create an invalid entry", async () => {
    const mockEntry = {
      title: "Test Title",
      description: "Test description",
    };

    createMock.mockRejectedValue(new Error());

    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: mockEntry,
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload).msg).toEqual("Error creating entry");
  });

  it("should retrieve all entries when entries exist", async () => {
    const mockEntries = [
      {
        title: "Title 1",
        description: "Description 1",
        created_at: "01-01-2050",
        scheduled_at: "01-01-2100",
      },
      {
        title: "Title 2",
        description: "Description 2",
        created_at: "01-01-2050",
        scheduled_at: "01-01-2100",
      },
    ];

    findManyMock.mockResolvedValue(mockEntries);

    const response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockEntries);
  });

  it("should retrieve all entries when no entries exist", async () => {
    const mockEntries: any[] = [];

    findManyMock.mockResolvedValue(mockEntries);

    const response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockEntries);
  });

  it("should retrieve an entry by id", async () => {
    const mockEntry = {
      id: "1",
      title: "Test Title",
      description: "Test Description",
      created_at: new Date("01-01-2050"),
      scheduled_at: new Date("01-01-2100"),
    };

    findUniqueMock.mockResolvedValue(mockEntry);

    const response = await server.inject({
      method: "GET",
      url: "/get/1",
    });

    expect(response.statusCode).toBe(200);
    const foundEntry = JSON.parse(response.payload);
    expect(foundEntry.title).toEqual(mockEntry.title);
    expect(foundEntry.description).toEqual(mockEntry.description);
    expect(new Date(foundEntry.created_at)).toEqual(mockEntry.created_at);
    expect(new Date(foundEntry.scheduled_at)).toEqual(mockEntry.scheduled_at);
  });

  it("should return a 500 error when trying to retrieve a non-existent entry by id", async () => {
    findUniqueMock.mockResolvedValue(null);

    const response = await server.inject({
      method: "GET",
      url: "/get/1",
    });

    expect(response.statusCode).toBe(500);
  });

  it("should update an entry", async () => {
    const mockEntry = {
      id: "1",
      title: "Updated Title",
      description: "Updated Description",
      created_at: "01-01-2050",
      scheduled_at: "01-01-2100",
    };

    updateMock.mockResolvedValue(mockEntry);
    findUniqueMock.mockResolvedValue(mockEntry);

    const updateResponse = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: mockEntry,
    });

    const retrieveResponse = await server.inject({
      method: "GET",
      url: "/get/1",
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(retrieveResponse.statusCode).toBe(200);
    expect(JSON.parse(updateResponse.payload).msg).toEqual("Updated successfully");
    expect(JSON.parse(retrieveResponse.payload)).toEqual(mockEntry);
  });

  it("should partially update an entry", async () => {
    const initialEntry = {
      id: "1",
      title: "Title",
      description: "Description",
      created_at: "01-01-2050",
      scheduled_at: "01-01-2100",
    };

    const updateEntry = {
      title: "Updated Title",
      description: "Updated Description",
    };

    const updatedEntry = {
      ...initialEntry,
      ...updateEntry,
    };

    updateMock.mockResolvedValue(updatedEntry);
    findUniqueMock.mockResolvedValue(updatedEntry);

    const updateResponse = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: updateEntry,
    });

    const retrieveResponse = await server.inject({
      method: "GET",
      url: "/get/1",
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(JSON.parse(updateResponse.payload).msg).toEqual("Updated successfully");
    expect(retrieveResponse.statusCode).toBe(200);
    expect(JSON.parse(retrieveResponse.payload)).toEqual(updatedEntry);
  });

  it("should return a 500 error when trying to update a non-existent entry", async () => {
    const mockEntry = {
      id: "1",
      title: "Updated Title",
      description: "Updated Description",
      created_at: new Date("01-01-2050"),
      scheduled_at: new Date("01-01-2100"),
    };

    updateMock.mockRejectedValue(new Error());

    const response = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: mockEntry,
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload).msg).toEqual("Error updating");
  });

  it("should delete an entry by id", async () => {
    deleteMock.mockResolvedValue({ id: "1" });

    const response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).msg).toEqual("Deleted successfully");
  });

  it("should return a 500 error when trying to delete a non-existent entry", async () => {
    deleteMock.mockRejectedValue(new Error());

    const response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload).msg).toEqual("Error deleting entry");
  });
});