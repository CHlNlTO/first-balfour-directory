export async function authorize() {
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const login = {
    username: username,
    password: password,
  }

  const response = await fetch("/api/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });

  const data = await response.json();
  console.log(data);

  sessionStorage.setItem("username", username as string);
  sessionStorage.setItem("password", password as string);

  if (data.response !== true) {
    window.location.href = "/login"
    return false;
  }

  return true;
}