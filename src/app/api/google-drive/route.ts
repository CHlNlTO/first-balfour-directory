import { AddPerson, Persons } from '@/lib/types';
import { google } from 'googleapis';
const { Readable } =  require('stream')

function removeQuotes(str: string | null): string {
  if (str === null) {
    return "";
  }
  return str.replace(/^"|"$/g, "");
}

export async function POST(request: Request): Promise<Response> {

  const formData = await request.formData();
  
  const person: AddPerson = {
    id: removeQuotes(formData.get('id') as string),
    firstName: removeQuotes(formData.get('firstName') as string),
    lastName: removeQuotes(formData.get('lastName') as string),
    position: removeQuotes(formData.get('position') as string),
    department: removeQuotes(formData.get('department') as string),
    email: removeQuotes(formData.get('email') as string),
    phone: removeQuotes(formData.get('phone') as string),
    profile: formData.get('profile') as File,
  };

  // console.log("FormData Request:", person)

  const formResponse = new FormData();
  
  Object.entries(person).forEach(([key, value]) => {
    formResponse.append(key, key === 'profile' ? (value as File) : JSON.stringify(value));
  });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ]
    })

    const drive = google.drive({
      auth,
      version: 'v3',
    });

    const fileMetadata = {
      name: person.id + "_" + person.firstName + "_" + person.lastName,
      parents:["1_m16wBAyjT63eP3GoyQhYCrr9QLjzJJS"],
    };

    const profileBuffer = await person.profile.arrayBuffer();
    const profileData = Buffer.from(profileBuffer);

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        body: Readable.from(profileData),
        mimeType: person.profile.type,
      },
      fields: 'id',
    });

    console.log("Drive Response: ", driveResponse.data.id);

    const fileId = driveResponse.data.id;

    const sheetData: Persons = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      position: person.position,
      department: person.department,
      email: person.email,
      phone: person.phone,
      profile: `https://drive.google.com/uc?id=${fileId}`,
      metadata: undefined
    };

    return new Response(JSON.stringify(sheetData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    return new Response(JSON.stringify({ error: "Failed to process form data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}


export async function DELETE(request: Request): Promise<Response> {
  const person = await request.json();
  console.log("Person to delete: ", person);
  console.log("Person ID to delete: ", person.profile);
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ]
    });

    const drive = google.drive({
      auth,
      version: 'v3',
    });

    await drive.files.delete({
      fileId: person.profile,
    });

    return new Response(JSON.stringify(person), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch(error) {
    return new Response("Failed to delete", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}