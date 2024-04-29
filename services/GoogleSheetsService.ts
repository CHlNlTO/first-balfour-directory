import {google} from "googleapis";
//const { GoogleSpreadsheet } = require('google-spreadsheet');

export type SheetForm = {
    firstName: string,
    lastName: string,
    position: string,
    department: string,
    email: string,
    phone: string
}

export async function submitToGoogleSheets(values: SheetForm) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        },
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets'
        ]
    })

    const sheets = google.sheets({
        auth,
        version: 'v4'
    });

    return await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Directory!A1:G1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [
                [values.firstName, values.lastName, values.position, values.department, values.email, values.phone]
            ]
        }
    });
}