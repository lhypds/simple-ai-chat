import { clearUserWebStorage } from "utils/userUtils";

export default async function logout(args) {
  const username = localStorage.getItem("user");
  if (!username) {
    return "Not logged in.";
  }

  // Logout from server
  try {
    const response = await fetch("/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    // Clear user data
    clearUserWebStorage();

    return "Logout successful.";
  } catch (error) {

    // Logout failed
    console.error(error);
    return error;
  }
}
