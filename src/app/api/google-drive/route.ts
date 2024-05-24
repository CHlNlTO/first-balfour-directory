import { Persons, CellData } from "@/lib/types";
import { google } from "googleapis";
const { Readable } = require("stream");

const PARENT_FOLDER_ID = "1_m16wBAyjT63eP3GoyQhYCrr9QLjzJJS";
const URL_PREFIX = "https://drive.google.com/uc?id=";
const DRIVE_VERSION = "v3";

function removeQuotes(str: string | null): string {
  if (str === null) {
    return "";
  }
  return str.replace(/^"|"$/g, "");
}

function extractFileIdFromUrl(url: string): string | undefined {
  const match = url.match(/[?&]id=([^&]+)/);
  if (match) {
    return match[1];
  }
  return undefined;
}

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const person: Persons = {
    id: removeQuotes(formData.get("id") as string),
    firstName: removeQuotes(formData.get("firstName") as string),
    lastName: removeQuotes(formData.get("lastName") as string),
    nickName: removeQuotes(formData.get("nickName") as string),
    position: removeQuotes(formData.get("position") as string),
    department: removeQuotes(formData.get("department") as string),
    email: removeQuotes(formData.get("email") as string),
    phone: removeQuotes(formData.get("phone") as string),
    profile: formData.get("profile") as File,
    url: removeQuotes(formData.get("url") as string),
    metadata: JSON.parse(formData.get("metadata") as string),
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const drive = google.drive({
      auth,
      version: DRIVE_VERSION,
    });

    const fileMetadata = {
      name: person.firstName + "_" + person.lastName,
      parents: [PARENT_FOLDER_ID],
    };

    const profileBuffer = await person.profile.arrayBuffer();
    const profileData = Buffer.from(profileBuffer);

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        body: Readable.from(profileData),
        mimeType: person.profile.type,
      },
      fields: "id",
    });

    const fileId = driveResponse.data.id;
    const sheetData: Persons = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      nickName: person.nickName,
      position: person.position,
      department: person.department,
      email: person.email,
      phone: person.phone,
      profile: person.profile,
      url: `${URL_PREFIX}${fileId}`,
      metadata: person.metadata,
    };

    return new Response(JSON.stringify(sheetData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process form data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const person: Persons = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const drive = google.drive({
      auth,
      version: DRIVE_VERSION,
    });

    await drive.files.update({
      fileId: person.url,
      requestBody: {
        name: `archived_${person.firstName}_${person.lastName}`,
      },
    });

    return new Response(JSON.stringify(person), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Failed to delete", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const formData = await request.formData();

  const metadataString = removeQuotes(formData.get("metadata") as string);
  const metadata: CellData = JSON.parse(metadataString);

  const person: Persons = {
    id: removeQuotes(formData.get("id") as string),
    firstName: removeQuotes(formData.get("firstName") as string),
    lastName: removeQuotes(formData.get("lastName") as string),
    nickName: removeQuotes(formData.get("nickName") as string),
    position: removeQuotes(formData.get("position") as string),
    department: removeQuotes(formData.get("department") as string),
    email: removeQuotes(formData.get("email") as string),
    phone: removeQuotes(formData.get("phone") as string),
    profile: formData.get("profile") as File,
    url: removeQuotes(formData.get("url") as string),
    metadata: metadata,
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const drive = google.drive({
      auth,
      version: DRIVE_VERSION,
    });

    const fileMetadata = {
      name: person.firstName + "_" + person.lastName,
    };

    const profileBuffer = await person.profile.arrayBuffer();
    const profileData = Buffer.from(profileBuffer);
    const linkId = extractFileIdFromUrl(person.url);

    const driveResponse = await drive.files.update({
      fileId: linkId,
      requestBody: fileMetadata,
      addParents: PARENT_FOLDER_ID,
      media: {
        body: Readable.from(profileData),
        mimeType: person.profile.type,
      },
    });

    const fileId = driveResponse.data.id;
    const sheetData: Persons = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      nickName: person.nickName,
      position: person.position,
      department: person.department,
      email: person.email,
      phone: person.phone,
      profile: person.profile,
      url: `https://drive.google.com/uc?id=${fileId}`,
      metadata: person.metadata,
    };

    return new Response(JSON.stringify(sheetData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process form data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
