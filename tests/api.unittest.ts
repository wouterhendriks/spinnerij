/*
wh runtest spinnerij.api
*/

import { reset } from "@webhare/test-backend";
import * as test from "@webhare/test";
import * as whdb from "@webhare/whdb";
import { WRDSchema } from "@webhare/wrd";
import { SpinnerijApi } from "@mod-spinnerij/js/api";

const TEST_SCHEMA_TAG = "webhare_testsuite:spinnerij";

let testSchema: WRDSchema;
let api: SpinnerijApi;

async function setup(): Promise<void> {
  await reset({
    wrdSchema: TEST_SCHEMA_TAG,
    schemaDefinitionResource: "mod::spinnerij/data/wrdschema.xml",
  });
  testSchema = new WRDSchema(TEST_SCHEMA_TAG);
  api = new SpinnerijApi(testSchema);
}

async function testGetRooms(): Promise<void> {
  const roomId = await whdb.runInWork(async () => {
    return await testSchema.insert("room", {
      wrdTitle: "Ruimte 1.19",
      subtitle: "Textielkamer",
      capacity: 40,
      description: "Industriele ruimte met vergadertafels",
    });
  });
  test.assert(roomId > 0, "Room should be inserted");

  const rooms = await api.getRooms();
  test.eq(1, rooms.length, "Should return 1 room");
  test.eq("Ruimte 1.19", rooms[0].wrdTitle, "Room title should match");
  test.eq("Textielkamer", rooms[0].subtitle, "Room subtitle should match");
  test.eq(40, rooms[0].capacity, "Room capacity should match");
}

async function testGetTenants(): Promise<void> {
  const tenantId = await whdb.runInWork(async () => {
    return await testSchema.insert("tenant", {
      wrdTitle: "Appeltjes van Oranje",
      description: "Catering",
      category: "Catering",
      room: "Ruimte Kantine",
      website: "https://appeltjesvanoranje.nl",
    });
  });
  test.assert(tenantId > 0, "Tenant should be inserted");

  const tenants = await api.getTenants();
  test.assert(tenants.length >= 1, "Should return at least 1 tenant");

  const tenant = tenants.find((t) => t.wrdTitle === "Appeltjes van Oranje");
  test.assert(tenant !== undefined, "Should find inserted tenant");
  test.eq("Catering", tenant!.category, "Tenant category should match");
  test.eq("Ruimte Kantine", tenant!.room, "Tenant room should match");
  test.eq("https://appeltjesvanoranje.nl", tenant!.website, "Tenant website should match");
}

async function testGetSupplyDemandItems(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("supplyDemand", {
      type: "aanbod",
      wrdTitle: "Vergadertafel met stoelen",
      description: "Ik heb een tafel over",
      author: "Chris Hudepohl",
      organization: "Spinnerij",
      email: "chris@spinnerijoosterveld.nl",
    });
  });

  const items = await api.getSupplyDemandItems();
  test.assert(items.length >= 1, "Should return at least 1 item");

  const item = items.find((i) => i.wrdTitle === "Vergadertafel met stoelen");
  test.assert(item !== undefined, "Should find inserted item");
  test.eq("aanbod", item!.type, "Item type should match");
  test.eq("Chris Hudepohl", item!.author, "Item author should match");
}

async function testGetReports(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("report", {
      category: "verlichting",
      description: "Lamp in gang 2e verdieping doet het niet",
      reporterName: "Jan Jansen",
      reporterEmail: "jan@example.nl",
      status: "open",
    });
  });

  const reports = await api.getReports();
  test.assert(reports.length >= 1, "Should return at least 1 report");

  const report = reports.find((r) => r.description === "Lamp in gang 2e verdieping doet het niet");
  test.assert(report !== undefined, "Should find inserted report");
  test.eq("verlichting", report!.category, "Report category should match");
  test.eq("open", report!.status, "Report status should match");
  test.eq("Jan Jansen", report!.reporterName, "Reporter name should match");
}

async function testGetReservations(): Promise<void> {
  await whdb.runInWork(async () => {
    // First insert a room to reference
    const roomId = await testSchema.insert("room", {
      wrdTitle: "Ruimte 0.10",
      subtitle: "Spinzaal",
      capacity: 80,
    });

    const reservationDate = new Date("2026-05-01T14:00:00Z");
    await testSchema.insert("reservation", {
      room: roomId,
      date: reservationDate,
      requesterName: "Piet de Vries",
      requesterEmail: "piet@example.nl",
      description: "Teamvergadering",
      status: "aangevraagd",
    });
  });

  const reservations = await api.getReservations();
  test.assert(reservations.length >= 1, "Should return at least 1 reservation");

  const reservation = reservations.find((r) => r.description === "Teamvergadering");
  test.assert(reservation !== undefined, "Should find inserted reservation");
  test.eq("aangevraagd", reservation!.status, "Reservation status should match");
  test.eq("Piet de Vries", reservation!.requesterName, "Requester name should match");
}

test.run([setup, testGetRooms, testGetTenants, testGetSupplyDemandItems, testGetReports, testGetReservations]);
