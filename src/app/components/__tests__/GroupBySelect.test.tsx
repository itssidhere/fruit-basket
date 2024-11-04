import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { GroupBySelect } from "../GroupBySelect";

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("GroupBySelect", () => {
  it("renders all grouping options", async () => {
    const onChange = jest.fn();
    renderWithTheme(<GroupBySelect value="None" onChange={onChange} />);

    // Open the dropdown
    const dropdownButton = screen.getByRole("button");
    await userEvent.click(dropdownButton);

    // Get the listbox options container
    const listbox = screen.getByRole("listbox");

    // Now, check for options within the listbox
    expect(within(listbox).getByText("None")).toBeInTheDocument();
    expect(within(listbox).getByText("Family")).toBeInTheDocument();
    expect(within(listbox).getByText("Order")).toBeInTheDocument();
    expect(within(listbox).getByText("Genus")).toBeInTheDocument();
  });

  it("calls onChange when a new option is selected", async () => {
    const onChange = jest.fn();
    renderWithTheme(<GroupBySelect value="None" onChange={onChange} />);

    // Open the dropdown
    const dropdownButton = screen.getByRole("button");
    await userEvent.click(dropdownButton);

    // Select 'Family'
    const familyOption = screen.getByText("Family");
    await userEvent.click(familyOption);

    expect(onChange).toHaveBeenCalledWith("Family");
  });

  it("shows the current selected value", () => {
    const onChange = jest.fn();
    renderWithTheme(<GroupBySelect value="Family" onChange={onChange} />);

    expect(screen.getByRole("button")).toHaveTextContent("Family");
  });
});
