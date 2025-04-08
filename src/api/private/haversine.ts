// Equatorial mean radius of Earth, in meters.
const R = 6378137;

// Helper functions.
const squared = (x: number): number => x * x;
const toRad   = (x: number): number => x * Math.PI / 180;
const hav     = (x: number): number => squared(Math.sin(x / 2));

/**
 * Applies the following formula :
 * `hav(theta) = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLon - aLon)`
 *
 * @returns {number} Distance in meters.
 */
export const haversine = (a: [lat: number, lon: number], b: [lat: number, lon: number]): number => {
  const aLat = toRad(a[0]);
  const bLat = toRad(b[0]);
  const aLng = toRad(a[1]);
  const bLng = toRad(b[1]);

  const ht = hav(bLat - aLat) + Math.cos(aLat) * Math.cos(bLat) * hav(bLng - aLng);
  return 2 * R * Math.asin(Math.sqrt(ht));
};
