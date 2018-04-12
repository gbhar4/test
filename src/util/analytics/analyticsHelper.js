let omniture = {};

if (typeof window !== 'undefined' && window.s_c_il && window.s_c_il[1]) {
  omniture = window.s_c_il[1];
}

export function trackLink (trackingData, linkName) {
  try {
    Object.assign(omniture, trackingData);
    omniture.tl(true, 'o', linkName || 'custom link');
    Object.assign(omniture, { linkTrackEvents: 'none', linkTrackVars: 'none' });
  } catch (err) {
    console.warn(err);
  }
}

export function trackPageEvent (trackingData) {
  try {
    Object.assign(omniture, trackingData);
    omniture.tl();
    Object.assign(omniture, { linkTrackEvents: 'none', linkTrackVars: 'none' });
  } catch (err) {
    console.warn(err);
  }
}
