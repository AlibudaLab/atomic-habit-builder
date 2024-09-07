import isClient from './isClient';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    gtag: any;
  }
}

export const logPageview = (url: string) => {
  if (!isClient()) {
    return;
  }

  window.gtag('config', GOOGLE_ANALYTICS_ID, {
    page_path: url,
  });
};

export const logEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const logEventSimple = ({
  eventName,
  category,
}: {
  eventName: string;
  category: string;
}) => {
  window.gtag('event', eventName, {
    event_category: category,
    event_label: eventName,
    value: 1,
  });
};
