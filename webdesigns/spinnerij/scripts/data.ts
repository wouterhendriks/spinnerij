/*
wh run mod::spinnerij/webdesigns/spinnerij/scripts/data.whscr
*/

import { SpinnerijApi } from "@mod-spinnerij/js/api";

export async function getData(apiOverride?: SpinnerijApi) {
  const api = apiOverride ?? new SpinnerijApi();

  const [rooms, tenants, supplyDemandItems, reports, reservations] = await Promise.all([
    api.getRooms(),
    api.getTenants(),
    api.getSupplyDemandItems(),
    api.getReports(),
    api.getReservations(),
  ]);

  return { rooms, tenants, supplyDemandItems, reports, reservations };
}
