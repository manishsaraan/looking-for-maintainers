import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '.';

describe('<Home> Component', () => {
  const props = {
    history: {},
    user: {},
    articles: {},
  };

  let getByPlaceholderText: any;
  let getByTestId: any;
  let getByText: any;

  beforeEach(() => {
    ({ getByPlaceholderText, getByText, getByTestId } = render(
      <BrowserRouter>
        <Home {...props} />
      </BrowserRouter>
    ));
  });

  describe('Heading Section', () => {
    it('renders without crashing', () => {
      //expect(container).toMatchSnapshot();
    });

    it('Render heading with text `Looking For Maintainers`', () => {
      expect(getByTestId('landing-heading').textContent).toBe(
        'Looking For Maintainers'
      );
    });

    it('Render sub-heading with text `Web app to find projects to contribute`', () => {
      expect(getByTestId('landing-subheading').textContent).toBe(
        'Web app to find projects to contribute'
      );
    });

    it('Renders to `/explore` path after clicking `Explore Projects` button', () => {
      getByText('Explore Projects').click();

      expect(window.location.pathname).toBe('/explore');
    });
  });

  describe('Motivation Section', () => {
    it('Renders heading with text `Motivation`', () => {
      expect(getByText('Motivation')).toBeTruthy();
    });

    it('Renders heading with given text', () => {
      expect(
        getByText(
          "Most projects on GitHub die because their authors can't find new contributors."
        )
      ).toBeTruthy();
    });

    it('Renders heading with given text', () => {
      const motivationSubHeadingText =
        'Looking For Maintainers will help project owners to find new contributors and contributors to find exciting projects.';

      expect(getByTestId('landing-text').textContent).toBe(
        motivationSubHeadingText
      );
    });

    it('Renders heading with text `sdfsdfasfasfddsf`', () => {
      const repoLink =
        'https://github.com/manishsaraan/looking-for-maintainers';

      getByText('View it on GitHub');

      expect(getByText('View it on GitHub').href).toBe(repoLink);
    });
  });

  describe('NewsLetter Section', () => {
    it('sd', () => {
      expect(getByText('Subscribe Newsletter')).toBeTruthy();
    });

    it('Renders node with text `If you want to get notifications about new projects, please subscribe.`', () => {
      expect(
        getByText(
          'If you want to get notifications about new projects, please subscribe.'
        )
      ).toBeTruthy();
    });

    it('Renders node with text `Zero spam of course, unsubscribe any time.`', () => {
      expect(
        getByText('Zero spam of course, unsubscribe any time.')
      ).toBeTruthy();
    });
  });
});
