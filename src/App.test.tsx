import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

describe("<App> Component", () => {
  const props = {
    history: {},
    user: {},
    articles: {},
  };

  let container: any;
  let getByTestId: any;

  beforeEach(() => {
    ({ container, getByTestId } = render(
      <BrowserRouter>
        <App {...props} />
      </BrowserRouter>
    ));
  });

  it("renders without crashing", () => {
    //expect(container).toMatchSnapshot();
  });

  it("Render heading with text `Looking For Maintainers`", () => {
    expect(getByTestId("landing-heading").textContent).toBe(
      "Looking For Maintainers"
    );
  });

  it("Render sub-heading with text `Web app to find projects to contribute`", () => {
    expect(getByTestId("landing-subheading").textContent).toBe(
      "Web app to find projects to contribute"
    );
  });
});
