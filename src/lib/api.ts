import { formType } from '@/app/admin/components/AddPersonCard'

type addPersonFormType = (data: formType) => Promise<Response>;

export const addPersonForm: addPersonFormType = async (data: formType) => 
  fetch("/api/", {
    method: "POST",
    body: JSON.stringify({
      firstName: "Clark",
      lastName: "Abutal",
      position: "CEO",
      department: "IT",
      email: "clark@gmail.com",
      phone: "09123456789",
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to send message");
    }
    return res.json();
  });