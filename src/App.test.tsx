import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

it("renders without crashing", () => {
  const props = {
    history: {},
    user: {},
    articles: {},
  };

  const { container } = render(
    <BrowserRouter>
      <App {...props} />
    </BrowserRouter>
  );
  console.log(container.innerHTML);
});
