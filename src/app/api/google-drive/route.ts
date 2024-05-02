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
  // console.log("Form Data:", formData)
  
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

  // try {
  //   const auth = new google.auth.GoogleAuth({
  //     credentials: {
  //       client_email: process.env.GOOGLE_CLIENT_EMAIL,
  //       private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  //     },
  //     scopes: [
  //       'https://www.googleapis.com/auth/drive',
  //       'https://www.googleapis.com/auth/drive.file',
  //     ]
  //   })

  //   const drive = google.drive({
  //     auth,
  //     version: 'v3',
  //   });

  //   const imageFilePath = "src/app/acadarena.jpg";
  //   const imageStream = fs.createReadStream(imageFilePath);
  //   const imageMimeType = "image/jpeg";

  //   const fileMetadata = {
  //     name: "test",
  //     parents:["1_m16wBAyjT63eP3GoyQhYCrr9QLjzJJS"],
  //   };


  //   const driveResponse = await drive.files.create({
  //     requestBody: fileMetadata,
  //     media: {
  //       body: imageStream,
  //       mimeType: imageMimeType,
  //     },
  //     fields: 'id',
  //   });

  //   console.log("Drive Response: ", driveResponse.data.id);

  
  //   return new Response("Success", {
  //     status: 200,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  // } catch (error: any) {
  //   console.error("Error fetching drive data: ", error.message)
  //   return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
  //     status: 500,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  // }
}


// export async function POST(request: Request): Promise<Response>  {
//   console.log("Request:", request)
//   console.log("Request JSON:", request.json())
//   const values: AddPerson = await request.json()

//   const file = values.profile as File;
//   const bufferStream = new stream.PassThrough();
//   bufferStream.end(file.arrayBuffer())

//   console.log("Routes", values)
//   console.log("Profiles", values.profile);
//   console.log("Profile Type", typeof values.profile === 'string' ? undefined : values.profile?.type);
//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
//       },
//       scopes: [
//         'https://www.googleapis.com/auth/drive',
//         'https://www.googleapis.com/auth/drive.file',
//       ]
//     })

//     const drive = google.drive({
//       auth,
//       version: 'v3',
//     });

//     const fileMetadata = {
//       name: values.id + "_" + values.firstName + "_" + values.lastName,
//       parents:["1Yrm5V_5KoJx3K20jAFR_PhNZEJJhEGdV"],
//     };

//     // let profileData: string | ArrayBuffer | null = null; // Initialize profileData as null

//     // if (values.profile) { // Check if values.profile is not undefined or null
//     //   profileData = await readFileAsBinaryString(values.profile); // Read file data
//     // }
    
//     const media = {
//       body: profileData,
//       mimeType: values.profile?.type ?? 'application/octet-stream',
//     };
    
//     // Log values.profile to verify its contents
//     console.log("File Data:", values.profile);
    
//     // Log the media object to ensure it's properly configured
//     console.log("Media:", media)

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: 'id',
//     });

//     const fileId = driveResponse.data.id;

//     const sheetData: Persons = {
//       id: values.id,
//       firstName: values.firstName,
//       lastName: values.lastName,
//       position: values.position,
//       department: values.department,
//       email: values.email,
//       phone: values.phone,
//       profile: `https://drive.google.com/uc?id=${fileId}`,
//     };

//     return new Response(JSON.stringify(sheetData), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error: any) {
//     console.error("Error fetching drive data: ", error.message)
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//   }
// }

// async function readFileAsBinaryString(file: File): Promise<string> {
//   return new Promise<string>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const result = reader.result as string;
//       resolve(result);
//     };
//     reader.onerror = reject;
//     reader.readAsBinaryString(file);
//   });
// }


// const fileMetadata = {
    //   name: "test.txt",
    //   parents:["1_m16wBAyjT63eP3GoyQhYCrr9QLjzJJS"],
    // };
    
    // const media = {
    //   mimeType: typeof values.profile === 'string' ? 'application/octet-stream' : values.profile?.type ?? 'application/octet-stream',
    //   body: values.profile,
    // };

    // const driveResponse = await drive.files.create({
    //   requestBody: fileMetadata,
    //   media: {
    //     body: fs.createReadStream("src/app/test.txt"),
    //     mimeType: "text/plain"
    //   },
    //   fields: 'id',
    // });