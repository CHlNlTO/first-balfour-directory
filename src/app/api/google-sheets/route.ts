import { Persons } from "@/lib/types";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET = "Directory";
const RANGE: string = `${SHEET}!A2:I`;
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
      ranges: [RANGE],
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

    const persons: Persons[] = [];

    rowData.forEach((metadata, rowIndex) => {
      const row = values[rowIndex];
      if (row && row.length > 0) {
        persons.push({
          id: row[0] ?? "",
          firstName: row[1] ?? "",
          lastName: row[2] ?? "",
          nickName: row[3] ?? "",
          position: row[4] ?? "",
          department: row[5] ?? "",
          email: row[6] ?? "",
          phone: row[7] ?? "",
          profile: undefined as unknown as File,
          url: row[8] ?? "",
          metadata: {
            value: metadata.values?.[0]?.userEnteredValue?.stringValue ?? "",
            row: rowIndex + 2,
            column: 1,
            cell: `A${rowIndex + 2}`,
          },
        });
      }
    });

    return new Response(JSON.stringify(persons), {
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

export async function POST(request: Request): Promise<Response> {
  const values: Persons = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: SHEET_VERSION,
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A1:I1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            values.id,
            values.firstName,
            values.lastName,
            values.nickName,
            values.position,
            values.department,
            values.email,
            values.phone,
            values.url,
          ],
        ],
      },
    });

    return new Response(JSON.stringify(values), {
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

export async function DELETE(request: Request): Promise<Response> {
  const person = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      auth,
      version: SHEET_VERSION,
    });

    const deleteRow = person.metadata.row;
    const deleteRange = `${SHEET}!A${deleteRow}:I${deleteRow}`;

    const clearRequest = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: deleteRange,
    };

    await sheets.spreadsheets.values.clear(clearRequest);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error deleting data from Google Sheets: ", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(request: Request): Promise<Response> {
  const values = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: SHEET_VERSION,
    });

    const dataRows = values.map(({ profile, metadata, ...rest }: Persons) => {
      return [
        rest.id,
        rest.firstName,
        rest.lastName,
        rest.nickName,
        rest.position,
        rest.department,
        rest.email,
        rest.phone,
        rest.url,
      ];
    });

    const responseClear = await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET}!A$2:I`,
    });

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET}!A$2:I`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: dataRows,
      },
    });

    return new Response(JSON.stringify(dataRows), {
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

export async function PATCH(request: Request): Promise<Response> {
  const values: Persons = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: SHEET_VERSION,
    });

    const row = values.metadata?.row;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET}!A${row}:I${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            values.id,
            values.firstName,
            values.lastName,
            values.nickName,
            values.position,
            values.department,
            values.email,
            values.phone,
            values.url,
          ],
        ],
      },
    });

    return new Response(JSON.stringify(values), {
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
