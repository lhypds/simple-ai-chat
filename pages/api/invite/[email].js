import AWS from "aws-sdk";
import { getUser, getUserByEmail } from 'utils/sqliteUtils';
import { authenticate } from 'utils/authUtils';
import { generateInviteCode } from 'utils/invitesUtils';

export default async function (req, res) {
  const { email } = req.query;

  try {
    const authResult = authenticate(req);
    if (!authResult.success) {
      res.status(401).json({
        success: false,
        error: authResult.error,
      });
      return;
    }

    // Check if userd invitation already
    const authUser = authResult.user;
    const invitor = await getUser(authUser.username);
    const code = generateInviteCode(invitor);

    // Try find user
    const user = await getUserByEmail(email);
    if (user) {
      res.status(404).json({
        success: false,
        error: "User already joined.",
      });
      return;
    }

    // Send invitation email
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const ses = new AWS.SES();
    const from = "support@simple-ai.io";
    const to = email;
    const subject = "Simple AI: Invitation";
    const emailParams = {
      Source: "Simple AI <" + from + ">",
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: `Hi, this is Simple AI.<br><br>`
                + `You have been invited by user \`${invitor.username}\` to join our AI platform.<br><br>`
                + `You can access it by clicking this link: <a href="https://simple-ai.io">https://simple-ai.io</a>.<br><br>`
                + `Register as a user and use the following link to complete your invitation. You can get an additional $1 of usage for free.<br><br>`
                + `Invitation link: ${process.env.NEXT_PUBLIC_BASE_URL}/api/invite/complete/${code}`,
          },
        },
      },
    };

    ses
      .sendEmail(emailParams)
      .promise()
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Invitation email sent.",
          data,
        });
      })
      .catch((error) => {
        console.error(error, error.stack);
        res.status(500).json({
          success: false,
          error: "Failed to send email",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred during your request.",
    });
  }
}
