/**
 * @author Constantin
 * Detects browser type based of either Akamai header, or user agent.
 *
 * TODO: it should only be done once (cookie?)
 * TODO: improve implementation, there is more info we can get from the user-agent string (useful for tracking)
 */
export function detectDevice (req) {
  let agent;
  let {DESKTOP, TABLET, MOBILE} = DEVICE_TYPES;
  let akamaiHeader = req.get('x-tcp-device');
  let userAgent = req.get('user-agent');

  if (typeof akamaiHeader === 'string' && akamaiHeader) {
    agent = akamaiHeader.toLowerCase();
  } else {
    if (/iPhone/i.test(userAgent)) {
      agent = MOBILE;
    } else if (/iPad/i.test(userAgent)) {
      agent = TABLET;
    } else if (/Android/i.test(userAgent)) {
      if (/Mobile/i.test(userAgent)) {
        agent = MOBILE;
      } else {
        agent = TABLET;
      }
    } else {
      agent = DESKTOP;
    }
  }

  // eventually we would need to return more details, (iphone vs android, versions, etc) for now, just keeping deviceType
  return {
    deviceType: agent
  };
}

const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
};
