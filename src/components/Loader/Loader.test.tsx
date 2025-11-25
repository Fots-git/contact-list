import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Loader from ".";

describe("Loader", () => {
  it("should not render loader when loading is false", () => {
    const { queryByText, container } = render(<Loader loading={false} />);

    expect(queryByText(/loading/i)).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it("should render loader when loading is true", () => {
    const { getByText } = render(<Loader loading={true} />);

    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render loader with loader class when loading is true", () => {
    const { getByText } = render(<Loader loading={true} />);

    const element = getByText(/loading/i);
    expect(element).toHaveClass("loader");
  });
});
