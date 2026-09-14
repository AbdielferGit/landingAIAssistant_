import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = new URL("../outputs/01a07e5c-aae9-7911-9fc1-3b0a85c9d262/", import.meta.url);
const websiteCrm = process.argv.includes("--websites");
const outputPath = new URL(websiteCrm ? "AiAssistant-CRM-Sitios-Web.xlsx" : "AiAssistant-CRM.xlsx", outputDir);
const previewDir = new URL(websiteCrm ? "previews-websites/" : "previews/", outputDir);
const leadSheetName = websiteCrm ? "Clientes" : "Prospectos";
const leadLabel = websiteCrm ? "clientes" : "prospectos";

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = Workbook.create();
const dashboard = workbook.worksheets.add("Panel");
const leads = workbook.worksheets.add(leadSheetName);
const activity = workbook.worksheets.add("Actividad");

const font = "Arial";
const ink = "#1F2937";
const muted = "#6B7280";
const headerFill = "#E5E7EB";
const rule = "#D1D5DB";
const brand = "#385BFF";
const paleBlue = "#EEF2FF";
const paleAmber = "#FEF3C7";
const paleGreen = "#DCFCE7";
const paleRed = "#FEE2E2";

for (const sheet of [dashboard, leads, activity]) {
  sheet.showGridLines = false;
}

dashboard.tabColor = brand;
dashboard.getRange("A2:L2").format.borders = {
  bottom: { style: "thin", color: rule },
};
dashboard.getRange("A2").values = [[websiteCrm ? "AiAssistant CRM — Sitios web" : "AiAssistant CRM"]];
dashboard.getRange("A2").format.font = { name: font, size: 16, bold: true, color: ink };
dashboard.getRange("A3").values = [[websiteCrm ? "Clientes y oportunidades para proyectos de sitios web" : "Seguimiento de prospectos y del pipeline comercial"]];
dashboard.getRange("A3").format.font = { name: font, size: 10, italic: true, color: muted };

const kpiLabels = [[`Total de ${leadLabel}`, "Nuevos", "Contactados", "Calificados", "Ganados", "Conversión"]];
dashboard.getRange("A5:L5").format.font = { name: font, size: 10, bold: true, color: muted };
dashboard.getRange("A5:B5").values = [[kpiLabels[0][0], ""]];
dashboard.getRange("C5:D5").values = [[kpiLabels[0][1], ""]];
dashboard.getRange("E5:F5").values = [[kpiLabels[0][2], ""]];
dashboard.getRange("G5:H5").values = [[kpiLabels[0][3], ""]];
dashboard.getRange("I5:J5").values = [[kpiLabels[0][4], ""]];
dashboard.getRange("K5:L5").values = [[kpiLabels[0][5], ""]];

const kpiBlocks = ["A5:B7", "C5:D7", "E5:F7", "G5:H7", "I5:J7", "K5:L7"];
for (const block of kpiBlocks) {
  dashboard.getRange(block).format = {
    fill: "#F9FAFB",
    font: { name: font, size: 10, color: ink },
    borders: { preset: "outside", style: "thin", color: rule },
    verticalAlignment: "center",
  };
}

dashboard.getRange("A6").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>")`]];
dashboard.getRange("C6").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,"Nuevo")`]];
dashboard.getRange("E6").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,"Contactado")`]];
dashboard.getRange("G6").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,"Calificado")`]];
dashboard.getRange("I6").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,"Ganado")`]];
dashboard.getRange("K6").formulas = [["=IF(A6=0,0,I6/A6)"]];
dashboard.getRange("A6:K6").format.font = { name: font, size: 16, bold: true, color: ink };
dashboard.getRange("K6").format.numberFormat = "0%";

dashboard.getRange("A10:B10").values = [["Estado", websiteCrm ? "Clientes" : "Prospectos"]];
dashboard.getRange("A11:A16").values = [["Nuevo"], ["Contactado"], ["Calificado"], ["Propuesta"], ["Ganado"], ["Perdido"]];
dashboard.getRange("B11").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,A11)`]];
dashboard.getRange("B11:B16").fillDown();
dashboard.getRange("A10:B10").format = {
  fill: headerFill,
  font: { name: font, size: 10, bold: true, color: ink },
  borders: { bottom: { style: "thin", color: rule } },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dashboard.getRange("A11:B16").format.font = { name: font, size: 10, color: ink };
dashboard.getRange("A11:B16").format.borders = {
  insideHorizontal: { style: "thin", color: "#E5E7EB" },
};
dashboard.getRange("B11:B16").format.numberFormat = "#,##0";

dashboard.getRange("D10:F10").values = [["Seguimiento", "Valor", "Definición"]];
dashboard.getRange("D11:F13").values = [
  ["Por contactar", null, `${websiteCrm ? "Clientes" : "Prospectos"} con estado Nuevo`],
  ["Seguimientos vencidos", null, "Fecha alcanzada, excepto Ganado/Perdido"],
  ["Con fuente publicitaria", null, `${websiteCrm ? "Clientes" : "Prospectos"} con una fuente UTM`],
];
dashboard.getRange("E11").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$J$2:$J$1001,"Nuevo")`]];
dashboard.getRange("E12").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$L$2:$L$1001,">0",${leadSheetName}!$L$2:$L$1001,"<="&TODAY(),${leadSheetName}!$J$2:$J$1001,"<>Ganado",${leadSheetName}!$J$2:$J$1001,"<>Perdido")`]];
dashboard.getRange("E13").formulas = [[`=COUNTIFS(${leadSheetName}!$A$2:$A$1001,"<>",${leadSheetName}!$M$2:$M$1001,"<>")`]];
dashboard.getRange("D10:F10").format = {
  fill: headerFill,
  font: { name: font, size: 10, bold: true, color: ink },
  borders: { bottom: { style: "thin", color: rule } },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dashboard.getRange("D11:F13").format.font = { name: font, size: 10, color: ink };
dashboard.getRange("D11:F13").format.borders = {
  insideHorizontal: { style: "thin", color: "#E5E7EB" },
};

const chart = dashboard.charts.add("bar", dashboard.getRange("A10:B16"));
chart.title = websiteCrm ? "Clientes por estado" : "Prospectos por estado";
chart.titleTextStyle.fontSize = 12;
chart.titleTextStyle.typeface = font;
chart.hasLegend = false;
chart.xAxis = { axisType: "textAxis", textStyle: { typeface: font, fontSize: 10 } };
chart.yAxis = { numberFormatCode: "0", numberFormatSourceLinked: false, textStyle: { typeface: font, fontSize: 10 } };
chart.setPosition("H10", "L23");
dashboard.getRange("A1:L24").format.font = { name: font, size: 10, color: ink };
dashboard.getRange("A:A").format.columnWidth = 20;
dashboard.getRange("B:B").format.columnWidth = 11;
dashboard.getRange("C:C").format.columnWidth = 15;
dashboard.getRange("D:D").format.columnWidth = 20;
dashboard.getRange("E:E").format.columnWidth = 11;
dashboard.getRange("F:F").format.columnWidth = 32;
dashboard.getRange("G:L").format.columnWidth = 12;
dashboard.getRange("2:2").format.rowHeight = 26;
dashboard.getRange("5:7").format.rowHeight = 24;

const leadHeaders = [
  websiteCrm ? "ID del cliente" : "ID del prospecto", "Creado", "Actualizado", "Nombre", "Empresa", "Email", "Tamaño del equipo", "Desafío",
  "Idioma", "Estado", "Responsable", "Próximo seguimiento", "Fuente", "Medio", "Campaña", "URL de landing",
  "Consentimiento", "Última nota",
];
leads.getRange("A1:R2").values = [
  leadHeaders,
  [null, null, null, null, null, null, null, null, null, "Nuevo", null, null, null, null, null, null, null, null],
];
const leadsTable = leads.tables.add("A1:R2", true, websiteCrm ? "ClientsTable" : "LeadsTable");
leadsTable.style = "TableStyleLight1";
leadsTable.showFilterButton = true;
leads.getRange("A1:R1").format = {
  fill: headerFill,
  font: { name: font, size: 10, bold: true, color: ink },
  borders: { bottom: { style: "thin", color: rule } },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
leads.getRange("A2:R2").format.font = { name: font, size: 10, color: ink };
leads.getRange("B2:C2").format.numberFormat = "yyyy-mm-dd hh:mm";
leads.getRange("L2:L2").format.numberFormat = "yyyy-mm-dd";
leads.getRange("G2:G2").dataValidation = { rule: { type: "list", values: ["1–10", "11–50", "51–200", "200+"] } };
leads.getRange("I2:I2").dataValidation = { rule: { type: "list", values: ["fr", "en", "es"] } };
leads.getRange("J2:J2").dataValidation = { rule: { type: "list", values: ["Nuevo", "Contactado", "Calificado", "Propuesta", "Ganado", "Perdido"] } };
leads.getRange("Q2:Q2").dataValidation = { rule: { type: "list", values: ["Sí", "No"] } };
leads.getRange("J2:J2").conditionalFormats.add("containsText", { text: "Nuevo", format: { fill: paleBlue, font: { color: brand, bold: true } } });
leads.getRange("J2:J2").conditionalFormats.add("containsText", { text: "Propuesta", format: { fill: paleAmber, font: { color: "#92400E", bold: true } } });
leads.getRange("J2:J2").conditionalFormats.add("containsText", { text: "Ganado", format: { fill: paleGreen, font: { color: "#166534", bold: true } } });
leads.getRange("J2:J2").conditionalFormats.add("containsText", { text: "Perdido", format: { fill: paleRed, font: { color: "#991B1B", bold: true } } });
leads.freezePanes.freezeRows(1);
leads.freezePanes.freezeColumns(3);
const leadWidths = [18, 20, 20, 20, 20, 28, 14, 44, 11, 15, 18, 18, 16, 16, 20, 34, 12, 40];
leadWidths.forEach((width, index) => { leads.getRangeByIndexes(0, index, 2, 1).format.columnWidth = width; });
leads.getRange("1:1").format.rowHeight = 34;
leads.getRange("2:2").format.rowHeight = 24;

const activityHeaders = ["ID de actividad", websiteCrm ? "ID del cliente" : "ID del prospecto", "Fecha y hora", "Tipo", "Detalles", "Autor"];
activity.getRange("A1:F2").values = [
  activityHeaders,
  [null, null, null, "Nota", null, null],
];
const activityTable = activity.tables.add("A1:F2", true, "ActivityTable");
activityTable.style = "TableStyleLight1";
activityTable.showFilterButton = true;
activity.getRange("A1:F1").format = {
  fill: headerFill,
  font: { name: font, size: 10, bold: true, color: ink },
  borders: { bottom: { style: "thin", color: rule } },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
activity.getRange("A2:F2").format.font = { name: font, size: 10, color: ink };
activity.getRange("C2:C2").format.numberFormat = "yyyy-mm-dd hh:mm";
activity.getRange("D2:D2").dataValidation = { rule: { type: "list", values: ["Nota", "Correo", "Llamada", "Reunión", "Cambio de estado"] } };
activity.freezePanes.freezeRows(1);
activity.freezePanes.freezeColumns(2);
const activityWidths = [20, 18, 20, 20, 60, 28];
activityWidths.forEach((width, index) => { activity.getRangeByIndexes(0, index, 2, 1).format.columnWidth = width; });
activity.getRange("1:1").format.rowHeight = 30;
activity.getRange("2:2").format.rowHeight = 24;

workbook.recalculate();

const dashboardCheck = await workbook.inspect({
  kind: "table",
  sheetId: "Panel",
  range: "A1:L16",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 12,
  maxChars: 8000,
});
const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
  maxChars: 4000,
});

console.log("DASHBOARD_CHECK");
console.log(dashboardCheck.ndjson);
console.log("FORMULA_ERRORS");
console.log(formulaErrors.ndjson);

for (const [sheetName, fileName] of [["Panel", "dashboard.png"], [leadSheetName, "leads.png"], ["Actividad", "activity.png"]]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(new URL(fileName, previewDir), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
const decodedOutputPath = decodeURIComponent(outputPath.pathname);
await output.save(decodedOutputPath);
console.log(`WROTE ${decodedOutputPath}`);
