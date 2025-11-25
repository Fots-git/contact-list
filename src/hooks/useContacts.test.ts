import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import apiData from "../api";
import { Contact, useContacts } from "./useContacts";

jest.mock("../api", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedApiData = apiData as jest.MockedFunction<typeof apiData>;

const createContact = (id: number): Contact => ({
  id,
  firstNameLastName: `User ${id}`,
  jobTitle: `Job ${id}`,
  emailAddress: `user${id}@example.com`,
});

const firstBatch: Contact[] = Array.from({ length: 10 }, (_, i) =>
  createContact(i + 1)
);

const secondBatch: Contact[] = Array.from({ length: 10 }, (_, i) =>
  createContact(i + 11)
);

describe("useContacts", () => {
  beforeEach(() => {
    mockedApiData.mockReset();
  });

  it("should fetch first batch of contacts on mount", async () => {
    mockedApiData.mockResolvedValueOnce(firstBatch as any);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.contacts).toHaveLength(10);
    expect(result.current.contacts[0]).toEqual(firstBatch[0]);
    expect(result.current.error).toBeNull();
  });

  it("should append next batch on loadMore", async () => {
    mockedApiData
      .mockResolvedValueOnce(firstBatch as any)
      .mockResolvedValueOnce(secondBatch as any);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(result.current.contacts).toHaveLength(10));

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.contacts).toHaveLength(20));

    expect(result.current.contacts[0]).toEqual(firstBatch[0]);
    expect(result.current.contacts[10]).toEqual(secondBatch[0]);
    expect(mockedApiData).toHaveBeenCalledTimes(2);
  });

  it("should handle error and retry", async () => {
    mockedApiData
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(firstBatch as any);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(result.current.error).toBe("boom"));

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.contacts).toHaveLength(10);
  });

  it("should toggle selection", async () => {
    mockedApiData.mockResolvedValueOnce(firstBatch as any);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(result.current.contacts).toHaveLength(10));

    const id = firstBatch[0].id;

    act(() => {
      result.current.toggleSelect(id);
    });

    expect(result.current.isSelected(id)).toBe(true);
    expect(result.current.selectedCount).toBe(1);

    act(() => {
      result.current.toggleSelect(id);
    });

    expect(result.current.isSelected(id)).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it("should keep contacts reference stable when toggling", async () => {
    mockedApiData.mockResolvedValueOnce(firstBatch as any);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(result.current.contacts).toHaveLength(10));

    const refBefore = result.current.contacts;
    const id = firstBatch[1].id;

    await act(async () => {
      result.current.toggleSelect(id);
      result.current.toggleSelect(id);
    });

    const refAfter = result.current.contacts;

    expect(refAfter).toBe(refBefore);
  });
});
