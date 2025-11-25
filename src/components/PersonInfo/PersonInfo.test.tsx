import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import PersonInfo from ".";

describe("PersonInfo", () => {
  const baseContact = {
    id: 1,
    firstNameLastName: "John Doe",
    jobTitle: "Software Engineer",
    emailAddress: "john@example.com",
  };

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof PersonInfo>>
  ) => {
    const props: React.ComponentProps<typeof PersonInfo> = {
      data: baseContact,
      selected: false,
      onToggle: jest.fn(),
      ...overrides,
    };

    const utils = render(<PersonInfo {...props} />);
    const card = utils.container.firstChild as HTMLElement;

    return {
      props,
      card,
      ...utils,
    };
  };

  it("should render name, title and email", () => {
    const { getByText } = setup();

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Software Engineer")).toBeInTheDocument();
    expect(getByText("john@example.com")).toBeInTheDocument();
  });

  it("should render initials from first and last name", () => {
    const { container } = setup();
    const avatar = container.querySelector(".avatar") as HTMLElement;

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent("JD");
  });

  it("should call onToggle when clicked", async () => {
    const user = userEvent.setup();
    const { card, props } = setup();

    await user.click(card);

    expect(props.onToggle).toHaveBeenCalledTimes(1);
  });

  it("should apply selection outline when selected is true", () => {
    const { card } = setup({ selected: true });

    expect(card).toHaveStyle("outline: 3px solid #4f46e5");
  });

  it("should remove outline when not selected", () => {
    const { card } = setup({ selected: false });

    expect(card).toHaveStyle("outline: none");
  });

  it("should render avatar, name, title and email in correct structure", () => {
    const { container } = setup();
    const avatar = container.querySelector(".avatar");
    const info = container.querySelector(".info");
    const name = container.querySelector(".name");
    const title = container.querySelector(".title");
    const email = container.querySelector(".email");

    expect(avatar).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  it("should use order=0 when selected", () => {
    const { card } = setup({ selected: true });

    expect(card).toHaveStyle("order: 0");
  });

  it("should use order=1 when not selected", () => {
    const { card } = setup({ selected: false });

    expect(card).toHaveStyle("order: 1");
  });
});
