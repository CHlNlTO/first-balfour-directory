export const tableHeaders = [
  "First Name",
  "Last Name",
  "Position",
  "Department",
  "Email",
  "Phone",
  "Profile",
  "Actions",
] as const;

export const departments = [
  "IT",
  "Finance",
  "Engineering",
  "Marketing",
  "HR",
  "Sales",
  "Operations",
  "Design",
] as const;

export const positions = [
  "Accountant",
  "Analyst",
  "CEO",
  "CFO",
  "COO",
  "CTO",
  "Developer",
  "Designer",
  "Engineer",
  "HR Manager",
  "IT Manager",
  "Manager",
  "Marketing",
  "Sales Rep",
] as const;

export const admin = {
  page: {
    preview: "preview",
    directory: "directory",
  },
};

export const LOGIN = {
  username: process.env.ADMIN_USERNAME!,
  password: process.env.ADMIN_PASSWORD!,
};
