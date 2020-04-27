import ReactGA from "react-ga";

interface GAInterface {
  init(trackingId: string): void;
  pageView(trackingId: string): void;
  addEvent(data: any): void;
}

export default class GA {
  static init = (trackingId: string) => {
    ReactGA.initialize(trackingId);
  };

  static pageView = (page: string) => {
    ReactGA.set({ page });
    ReactGA.pageview(page);
  };

  static addEvent = (data: any) => {
    ReactGA.event(data);
  };
}
