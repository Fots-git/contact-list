import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Controls from ".";

jest.mock("../Loader", () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) =>
    loading ? <div data-testid="loader">Loading...</div> : null,
}));

describe("Controls", () => {
  const setup = (
    overrides?: Partial<React.ComponentProps<typeof Controls>>
  ) => {
    const props: React.ComponentProps<typeof Controls> = {
      loading: false,
      error: null,
      onRetry: jest.fn(),
      onLoadMore: jest.fn(),
      ...overrides,
    };

    const utils = render(<Controls {...props} />);

    const loadMoreButton = utils.getByRole("button", { name: /load more/i });
    const retryButton = utils.queryByRole("button", { name: /retry/i });
    const loader = utils.queryByTestId("loader");

    return {
      props,
      loadMoreButton,
      retryButton,
      loader,
      ...utils,
    };
  };

  it("should always render Load more button", () => {
    const { loadMoreButton } = setup();
    expect(loadMoreButton).toBeInTheDocument();
  });

  it("should render loader when loading is true", () => {
    const { loader } = setup({ loading: true });
    expect(loader).toBeInTheDocument();
  });

  it("should not render loader when loading is false", () => {
    const { loader } = setup({ loading: false });
    expect(loader).not.toBeInTheDocument();
  });

  it("should render error message and Retry button when error is present", () => {
    const errorMessage = "Something went wrong";
    const { retryButton, getByText } = setup({ error: errorMessage });

    expect(getByText(errorMessage)).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
  });

  it("should not render error block when error is null", () => {
    const { queryByText, queryByRole } = setup({ error: null });

    expect(queryByText(/something went wrong/i)).not.toBeInTheDocument();
    expect(queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });

  it("should call onLoadMore when Load more button is clicked and not loading", async () => {
    const user = userEvent.setup();
    const { loadMoreButton, props } = setup({ loading: false });

    await user.click(loadMoreButton);

    expect(props.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("should call onRetry when Retry button is clicked and not loading", async () => {
    const user = userEvent.setup();
    const { retryButton, props } = setup({
      loading: false,
      error: "Error message",
    });

    if (!retryButton) {
      throw new Error("Retry button should be rendered for this test");
    }

    await user.click(retryButton);

    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });

  it("should disable buttons when loading is true", () => {
    const { loadMoreButton, retryButton } = setup({
      loading: true,
      error: "Error message",
    });

    expect(loadMoreButton).toBeDisabled();

    if (!retryButton) {
      throw new Error("Retry button should be rendered for this test");
    }

    expect(retryButton).toBeDisabled();
  });
});
