import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../view/App";

test("renders learn react link", () => {
    render(<App />);
    const visualizationElem = screen.getByText(/Visualization/i);
    expect(visualizationElem).toBeInTheDocument();
});
