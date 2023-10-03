import { setTheme } from "utils/themeUtils.js";

export default async function entry(args) {
  const command = args[0];

  if (command === "login") {
    if (args.length != 2) {
      return "Usage: :user login [username]";
    }

    const username = args[1];
    let user = null;
    try {
      const response = await fetch(`/api/user/${username}`);

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      user = data;
    } catch (error) {
      console.error(error);
    }
    
    if (user) {
      localStorage.setItem("user", user.name);
      console.log("User set to ", localStorage.getItem("user"));

      // Settings
      if (user.settings) {
        const settings = JSON.parse(user.settings);

        if (settings.theme) {
          localStorage.setItem("theme", settings.theme);
          setTheme(localStorage.getItem("theme"));
          console.log("Theme applied: ", localStorage.getItem("theme"));
        }

        if (settings.role) {
          localStorage.setItem("role", settings.role);
          console.log("Role applied: ", localStorage.getItem("role"));
        }
      }

      return "Login successful."
    } else {
      return "User not found."
    }
  }

  if (command === "add") {
    if (args.length != 2) {
      return "Usage: :user add [username]";
    }

    try {
      const response = await fetch('/api/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: args[1],
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      return "Added."
    } catch (error) {
      console.error(error);
    }
  }

  if (command === "set" && args[1] === "pass") {
    if (args.length != 3) {
      return "Usage: :user set pass [password]";
    }

    try {
      const response = await fetch('/api/user/update/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: localStorage.getItem("user"),
          password: args[2],
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      return "Password updated."
    } catch (error) {
      console.error(error);
    }
  }

  if (command === "set" && args[1] !== "pass") {
    if (args.length != 3) {
      return "Usage: :user set [key] [value]";
    }

    try {
      const response = await fetch('/api/user/update/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: localStorage.getItem("user"),
          key: args[1],
          value: args[2],
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      return "Setting updated."
    } catch (error) {
      console.error(error);
    }
  }

  return "Usage: :user add [username]" + "\n" +
         "       :user set pass [password]" + "\n" +
         "       :user set theme [light/dark]" + "\n" +
         "       :user set role [role]" + "\n" +
         "       :user login [username]";
}