// src/lib/api.ts - Updated to support pagination
import { Persons, Positions, Departments } from "./types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  position?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

function extractFileIdFromUrl(url: string): string | null {
  const match = url.match(/[?&]id=([^&]+)/);
  if (match) {
    return match[1];
  }
  return null;
}

// NEW: Paginated fetch function
export async function fetchPersonsPaginated(
  params: PaginationParams = {}
): Promise<PaginatedResponse<Persons>> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.department) searchParams.append("department", params.department);
  if (params.position) searchParams.append("position", params.position);
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

  const response = await fetch(
    `/api/google-sheets/?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data from Google Sheets");
  }

  return response.json();
}

// Keep original function for backward compatibility
export async function fetchPersons(): Promise<Persons[]> {
  const result = await fetchPersonsPaginated({ pageSize: 100000 }); // Get all data
  return result.data;
}

// NEW: Get total count without fetching all data
export async function getPersonsCount(
  filters: Omit<PaginationParams, "page" | "pageSize"> = {}
): Promise<number> {
  const result = await fetchPersonsPaginated({ ...filters, pageSize: 1 });
  return result.pagination.total;
}

export async function fetchPositions() {
  const positions = await fetch("/api/google-sheets/positions/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!positions.ok) {
    throw new Error("Failed to fetch data from Google Sheets");
  }
  const response = await positions.json();
  return response as Positions[];
}

export async function fetchDepartments() {
  const departments = await fetch("/api/google-sheets/departments/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!departments.ok) {
    throw new Error("Failed to fetch data from Google Sheets");
  }
  const response = await departments.json();
  return response as Departments[];
}

export async function addPerson(person: Persons) {
  const drive = await addToDrive(person);
  const sheets = await addToSheets(drive);
  return sheets;
}

export async function addToDrive(person: Persons) {
  if (!person.profile) {
    return person;
  }

  const formData = new FormData();

  Object.entries(person).forEach(([key, value]) => {
    formData.append(
      key,
      key === "profile" ? (value as File) : JSON.stringify(value)
    );
  });

  const drive = await fetch("/api/google-drive/", {
    method: "POST",
    body: formData,
  });
  if (!drive.ok) {
    throw new Error("Failed to save to Google Drive");
  }

  const response = await drive.json();
  return response;
}

export async function addToSheets(person: Persons) {
  const sheets = await fetch("/api/google-sheets/", {
    method: "POST",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!sheets.ok) {
    throw new Error("Failed to save to Google Sheets");
  }
  return sheets.json();
}

export async function deletePerson(person: Persons) {
  const url = person.url;
  const fileId = extractFileIdFromUrl(url);
  console.log("File ID:", fileId);

  const newPerson: Persons = {
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    nickName: person.nickName,
    position: person.position,
    department: person.department,
    email: person.email,
    phone: person.phone,
    profile: person.profile,
    url: fileId ? fileId : person.url,
    metadata: person.metadata,
  };

  const drive = await deleteFromDrive(newPerson);
  const sheets = await deleteFromSheets(drive);

  return sheets;
}

export async function deleteFromDrive(person: Persons) {
  if (!person.url) {
    return person;
  }
  const drive = await fetch("/api/google-drive/", {
    method: "DELETE",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!drive.ok) {
    throw new Error("Failed to delete from Google Drive");
  }
  return drive.json();
}

export async function deleteFromSheets(person: Persons) {
  const sheets = await fetch("/api/google-sheets/", {
    method: "DELETE",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!sheets.ok) {
    throw new Error("Failed to delete from Google Sheets");
  }
  const response = await sheets.json();
  return response;
}

export async function updatePerson(person: Persons) {
  const drive = await updateToDrive(person);
  const sheets = await updateToSheets(drive);

  return sheets;
}

export async function updateToDrive(person: Persons) {
  if (!person.profile) {
    return person;
  }

  if (!person.url) {
    const addImage = await addToDrive(person);
    return addImage;
  }

  const formData = new FormData();

  Object.entries(person).forEach(([key, value]) => {
    formData.append(
      key,
      key === "profile" ? (value as File) : JSON.stringify(value)
    );
  });

  const drive = await fetch("/api/google-drive/", {
    method: "PATCH",
    body: formData,
  });

  if (!drive.ok) {
    throw new Error("Failed to save to Google Drive");
  }

  const response = drive.json();

  console.log("Response: ", response);

  return response;
}

export async function updateToSheets(person: Persons) {
  console.log("Update Sheets Person: ", person);
  const sheets = await fetch("/api/google-sheets/", {
    method: "PATCH",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!sheets.ok) {
    throw new Error("Failed to update from Google Sheets");
  }
  const response = await sheets.json();
  return response;
}

export async function updateAllPersons(persons: Persons[]) {
  const sheets = await fetch("/api/google-sheets/", {
    method: "PUT",
    body: JSON.stringify(persons),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!sheets.ok) {
    throw new Error("Failed to delete from Google Sheets");
  }
  const response = await sheets.json();
  return response;
}
