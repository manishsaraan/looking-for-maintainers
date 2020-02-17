import ReactGA from 'react-ga';

export default class GA {
    static init = (trackingId: any) => {
        ReactGA.initialize(trackingId);
    }

    static pageView = (page: any) => {
        console.log(page)
        ReactGA.set({ page });
        ReactGA.pageview(page);
    }

    static addEvent = (data: any) => {
        ReactGA.event(data);
    }
}