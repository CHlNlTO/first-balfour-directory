export async function authorize() {
  // Check if we're running in the browser
  if (typeof window === "undefined") {
    // During SSR, we can't access sessionStorage, so return false
    return false;
  }

  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  // If no credentials in sessionStorage, redirect to login
  if (!username || !password) {
    window.location.href = "/login";
    return false;
  }

  const login = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    const data = await response.json();
    console.log(data);

    if (data.response !== true) {
      // Clear invalid credentials
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      window.location.href = "/login";
      return false;
    }

    return true;
  } catch (error) {
    console.error("Authorization error:", error);
    // Clear credentials on error
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    window.location.href = "/login";
    return false;
  }
}
