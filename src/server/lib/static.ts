// import {
//   importGtfs,
//   closeDb,
//   openDb,
//   type ImportConfig,
//   getRoutes,
// } from "gtfs";

// const config: ImportConfig = {
//   agencies: [
//     // {
//     //   path: "./data/ASTUCE/",
//     // },
//     {
//       path: "./data/ilevia/",
//     },
//   ],
// };

// try {
//   await importGtfs(config);
// } catch (error) {
//   console.error(error);
// }

// const db = openDb(config);

// // Do some stuff here
// const routes = getRoutes(
//   {}, // No query filters
//   ["route_id", "route_short_name", "route_color"], // Only return these fields
//   [["route_short_name", "ASC"]], // Sort by this field and direction
//   { db: db }, // Options for the query. Can specify which database to use if more than one are open
// );

// console.log(routes[0]);

// // Close database connection when done.
// closeDb(db);
