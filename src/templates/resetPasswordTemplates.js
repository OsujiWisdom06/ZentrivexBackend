const resetPasswordTemplate = (fullName, resetLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
  <tr>
    <td align="center">

      <table
        width="600"
        cellpadding="0"
        cellspacing="0"
        style="
          max-width:600px;
          width:100%;
          background:#ffffff;
          border-radius:14px;
          overflow:hidden;
        "
      >

        <tr>
          <td style="
            background:#0f172a;
            padding:35px 25px;
            text-align:center;
            color:#ffffff;
          ">

            <h1 style="margin:0;">
              Zentrivex Trade
            </h1>

          </td>
        </tr>

        <tr>
          <td style="padding:40px 35px;">

            <h2 style="
              margin-top:0;
              color:#111827;
            ">
              Password Reset
            </h2>

            <p style="
              color:#4b5563;
              font-size:16px;
              line-height:1.7;
            ">
              Hello ${fullName},
            </p>

            <p style="
              color:#4b5563;
              font-size:16px;
              line-height:1.7;
            ">
              We received a request to reset your Zentrivex Trade password.
            </p>

            <div style="
              text-align:center;
              margin:35px 0;
            ">

              <a
                href="${resetLink}"
                style="
                  display:inline-block;
                  background:#2563eb;
                  color:#ffffff;
                  padding:15px 32px;
                  border-radius:8px;
                  text-decoration:none;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>

            </div>

            <p style="
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              This link will expire in 1 hour.
            </p>

            <p style="
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              If you did not request a password reset, you can safely
              ignore this email.
            </p>

          </td>
        </tr>

        <tr>
          <td style="
            background:#f8fafc;
            padding:25px;
            text-align:center;
          ">

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:13px;
            ">
              © ${new Date().getFullYear()} Zentrivex Trade
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
};

export default resetPasswordTemplate;