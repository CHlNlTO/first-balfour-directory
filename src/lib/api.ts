import { AddPerson, Persons } from "./types";

export async function addPerson(person: AddPerson) {
  
  const drive = await addToDrive(person);
  const sheets = await addToSheets(drive);
  
  return sheets;

}

async function addToDrive(person: AddPerson) {
  if (!person.profile) {
    const sheetData: AddPerson = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      position: person.position,
      department: person.department,
      email: person.email,
      phone: person.phone,
      profile: person.profile,
    };
    return sheetData;
  }

  const formData = new FormData();
    
  Object.entries(person).forEach(([key, value]) => {
    formData.append(key, key === 'profile' ? (value as File) : JSON.stringify(value));
  });

  const drive = await fetch("/api/google-drive/", {
    method: "POST",
    body: formData,
    
  })
  if (!drive.ok) {
    throw new Error("Failed to save to Google Drive");
  }
  return drive.json();
}

async function addToSheets(person: Persons) {
  const sheets = await fetch("/api/google-sheets/", {
    method: "POST",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }) 
  if (!sheets.ok) {
    throw new Error("Failed to save to Google Sheets");
  }
  return sheets.json();
}