import { Instance } from "pawnote";

// This will look for instances in a 20km radius.
const results = await Instance.findNear(45.849998, 1.25);
console.log(`Found ${results.length} instances near the given position. Listing them...\n`);

for (const geolocated of results) {
  console.log(`[${geolocated.postalCode}]`, geolocated.name, `at ${geolocated.distance.toFixed(0)}m`);

  // You can build an `Instance` quickly using this shorthand.
  // const instance = geolocated.toInstance();
}
