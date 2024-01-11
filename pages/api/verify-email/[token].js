import { decode } from "utils/authUtils"
import { getUser, updateUserEmailVerifiedAt, updateUserStatus, updateUserIPAndLastLogin } from "utils/sqliteUtils"
import { createToken } from "utils/authUtils"
import { getUserByEmail } from "utils/sqliteUtils"

export default async function (req, res) {
  // Check if the method is GET
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // The verification token
  const { token } = req.query;

  try {
    const data = decode(token);
    if (!data) {
      return res.status(400).send("Verification failed.");
    }

    // Get user
    const user = await getUser(data.username);
    if (!user) {
      return res.status(400).send("User not exists.");
    }

    if (user.email !== data.email) {
      return res.status(400).send("User has a different email.");
    }

    const sameEmailUser = await getUserByEmail(data.email);
    if (sameEmailUser && sameEmailUser.username !== data.username) {
      return res.status(400).send("Email already used by another user.");
    }

    // Update email verified at
    await updateUserEmailVerifiedAt(data.username);

    // Redirect and login
    // Refresh user auth token
    // Create JWT token
    const payload = { 
      id: user.id, 
      username: user.username,
      role: user.role,
      email: user.email,
    };

    // A login token
    const loginToken = createToken(payload);
    if (!loginToken) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create token.'
      });
    }

    // Update user status
    await updateUserStatus(user.username, 'active');

    // Update user last login
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const browser = req.headers['user-agent'];

    // for blocking one user registering multiple accounts
    await updateUserIPAndLastLogin(user.username, ip, "T=" + (new Date()) + " IP=" + ip + " BSR=" + browser);

    // Set the token as a cookie
    const sameSiteCookie = process.env.SAME_SITE_COOKIE;
    res.setHeader('Set-Cookie', `auth=${loginToken}; HttpOnly; Path=/; Max-Age=86400; ${sameSiteCookie}`);

    // Redirect to the home page
    res.redirect(301, "/");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred during your request.",
    });
  }
}
