import { google } from 'googleapis';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const values = await request.json()

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    })

    const sheets = google.sheets({ 
      auth,
      version: 'v4'
     })

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A1:F1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            values.firstName,
            values.lastName,
            values.position,
            values.department,
            values.email,
            values.phone,
          ],
        ],
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error fetching sheets data: ", error.message)
    return []
    
  }
}