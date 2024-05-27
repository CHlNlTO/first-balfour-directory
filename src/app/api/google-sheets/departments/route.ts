import { Departments } from "@/lib/types";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET = "Departments";
const RANGE: string = `${SHEET}!A2:A`;
const SHEET_VERSION = "v4";

export async function GET(): Promise<Response> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({
      auth,
      version: SHEET_VERSION,
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const values = response.data.values;

    if (!values || !values.length) {
      throw new Error("No data found in the spreadsheet");
    }

    const metadataResponse = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [`${SHEET}!A2:H`],
      fields: "sheets.data.rowData.values.userEnteredValue",
    });

    const sheetsData = metadataResponse.data.sheets;

    if (!sheetsData || !sheetsData.length) {
      throw new Error("No sheets data found in the spreadsheet");
    }

    const rowData = sheetsData[0]?.data?.[0]?.rowData;

    if (!rowData || !rowData.length) {
      throw new Error("No row data found in the spreadsheet");
    }

    const departments: Departments[] = [];

    rowData.forEach((metadata, rowIndex) => {
      const row = values[rowIndex];
      if (row && row.length > 0) {
        departments.push({
          name: row[0] ?? "",
          metadata: {
            value: metadata.values?.[0]?.userEnteredValue?.stringValue ?? "",
            row: rowIndex + 2,
            column: 1,
            cell: `A${rowIndex + 2}`,
          },
        });
      }
    });

    console.log("Departments: ", departments);

    return new Response(JSON.stringify(departments), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error fetching sheets data: ", error.message);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
