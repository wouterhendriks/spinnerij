/*
wh run mod::spinnerij/scripts/seed.ts
*/

import { run } from "@webhare/cli";
import * as whdb from "@webhare/whdb";
import { spinnerijSchema } from "wh:wrd/spinnerij";

run({
  async main() {
    await whdb.beginWork();

    // Rooms (domain)
    const rooms = await Promise.all([
      spinnerijSchema.insert("room", {
        wrdTitle: "Atelier 1",
        subtitle: "Creatieve werkruimte op de begane grond",
        capacity: 8,
        description: "Lichte ruimte met hoge plafonds, ideaal voor kunstenaars en makers.",
      }),
      spinnerijSchema.insert("room", {
        wrdTitle: "Vergaderzaal De Spoel",
        subtitle: "Vergaderruimte op de eerste verdieping",
        capacity: 20,
        description: "Volledig uitgeruste vergaderzaal met beamer en whiteboard.",
      }),
      spinnerijSchema.insert("room", {
        wrdTitle: "Werkplaats Noord",
        subtitle: "Gedeelde werkplaats",
        capacity: 12,
        description: "Werkplaats met gereedschap, werkbanken en afzuiging.",
      }),
    ]);

    console.log(`✅ ${rooms.length} rooms created`);

    // Tenants
    const tenants = await Promise.all([
      spinnerijSchema.insert("tenant", {
        wrdTitle: "Studio Draadwerk",
        description: "Textielkunst en macramé workshops",
        category: "creatief",
        room: "Atelier 1",
        website: "https://studiodraadwerk.nl",
      }),
      spinnerijSchema.insert("tenant", {
        wrdTitle: "Brouwerij De Spil",
        description: "Ambachtelijk bierbrouwerij en proeflokaal",
        category: "horeca",
        room: "Werkplaats Noord",
        website: "https://brouwerijdespil.nl",
      }),
      spinnerijSchema.insert("tenant", {
        wrdTitle: "Cowork Oost",
        description: "Flexibele werkplekken voor zzp'ers en startups",
        category: "kantoor",
        room: "Vergaderzaal De Spoel",
        website: "https://coworkoost.nl",
      }),
      spinnerijSchema.insert("tenant", {
        wrdTitle: "Yoga & Meer",
        description: "Yogalessen, meditatie en ademwerk",
        category: "sport",
        room: "Atelier 1",
        website: "https://yogaenmeer.nl",
      }),
    ]);

    console.log(`✅ ${tenants.length} tenants created`);

    // Supply & Demand
    const supplyDemand = await Promise.all([
      spinnerijSchema.insert("supplyDemand", {
        type: "aanbod",
        wrdTitle: "Lasapparaat te leen",
        description: "MIG/MAG lasapparaat beschikbaar voor huurders. Neem contact op via e-mail.",
        author: "Jan de Vries",
        organization: "Brouwerij De Spil",
        email: "jan@brouwerijdespil.nl",
        date: new Date("2026-04-10"),
      }),
      spinnerijSchema.insert("supplyDemand", {
        type: "vraag",
        wrdTitle: "Gezocht: gedeelde opslagruimte",
        description: "Op zoek naar ca. 10m2 opslagruimte om materialen te stallen. Graag op de begane grond.",
        author: "Lisa Bakker",
        organization: "Studio Draadwerk",
        email: "lisa@studiodraadwerk.nl",
        date: new Date("2026-04-12"),
      }),
    ]);

    console.log(`✅ ${supplyDemand.length} supply/demand items created`);

    // Reports
    const reports = await Promise.all([
      spinnerijSchema.insert("report", {
        category: "verlichting",
        description: "TL-buis in de gang op de begane grond knippert en doet het af en toe niet.",
        reporterName: "Jan de Vries",
        reporterEmail: "jan@brouwerijdespil.nl",
        status: "open",
      }),
      spinnerijSchema.insert("report", {
        category: "sanitair",
        description: "Lekkage bij de wasbak op de 2e verdieping. Druppelt continu.",
        reporterName: "Lisa Bakker",
        reporterEmail: "lisa@studiodraadwerk.nl",
        status: "in_behandeling",
      }),
    ]);

    console.log(`✅ ${reports.length} reports created`);

    // Reservations (need room wrdIds)
    const reservations = await Promise.all([
      spinnerijSchema.insert("reservation", {
        room: rooms[1], // Vergaderzaal De Spoel
        date: new Date("2026-04-18T09:00:00"),
        requesterName: "Lisa Bakker",
        requesterEmail: "lisa@studiodraadwerk.nl",
        description: "Workshopdag textielkunst voor 15 deelnemers",
        status: "bevestigd",
      }),
      spinnerijSchema.insert("reservation", {
        room: rooms[0], // Atelier 1
        date: new Date("2026-04-25T10:00:00"),
        requesterName: "Jan de Vries",
        requesterEmail: "jan@brouwerijdespil.nl",
        description: "Open dag Spinnerij - rondleiding en proeverij",
        status: "aangevraagd",
      }),
    ]);

    console.log(`✅ ${reservations.length} reservations created`);

    await whdb.commitWork();
    console.log("\n✅ Seed complete!");
  },
});
