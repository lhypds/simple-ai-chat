import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function Usage() {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    // Get user info
    const getUserInfo = async () => {
      const response = await fetch(`/api/user/info`, {
        method: "GET",
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const user = data.user;
      setUser(user);
      setUsage(JSON.parse(user.usage));
    }
    if (!user) getUserInfo();
  });

  const content = (
    <>
      {!user && <div>Please login. To register a user, use the command `:user add [username] [email?]`</div>}
      {user && <div>
        <div>
          <div>User: {localStorage.getItem("user")}</div>
          <div>Email: {localStorage.getItem("userEmail")}</div>
          <div>Subscription: `{localStorage.getItem("userRole")}`</div>
          {usage.daily_limit < Number.MAX_VALUE - 1 && <ProgressBar label={"Daily usage"} progress={usage.daily} progressMax={usage.daily_limit} />}
          {usage.weekly_limit < Number.MAX_VALUE - 1 && <ProgressBar label={"Weekly usage"} progress={usage.weekly} progressMax={usage.weekly_limit} />}
          {usage.monthly_limit < Number.MAX_VALUE - 1 && <ProgressBar label={"Monthly usage"} progress={usage.monthly} progressMax={usage.monthly_limit} />}
          {usage.exceeded === true && <div className="mt-2">The usage limitation has been reached.</div>}
        </div>
      </div>}
    </>
  )

  return (
    <div className="Subcription">
      <div className="text-center mb-4">
        <div>Usage</div>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default Usage;
