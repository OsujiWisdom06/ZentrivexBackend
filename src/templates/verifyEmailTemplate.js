const verifyEmailTemplate = (fullName, verificationLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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

        <!-- Header -->
        <tr>
          <td style="
            background:#0f172a;
            padding:35px 25px;
            text-align:center;
            color:#ffffff;
          ">

            <h1 style="
              margin:0;
              font-size:28px;
            ">
              Zentrivex Trade
            </h1>

            <p style="
              margin:10px 0 0;
              color:#cbd5e1;
              font-size:14px;
            ">
              Secure Trading Platform
            </p>

          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 35px;">

            <h2 style="
              margin-top:0;
              color:#111827;
            ">
              Welcome, ${fullName}!
            </h2>

            <p style="
              color:#4b5563;
              font-size:16px;
              line-height:1.7;
            ">
              Thank you for creating your Zentrivex Trade account.
              Please verify your email address to activate your account.
            </p>

            <div style="
              text-align:center;
              margin:35px 0;
            ">

              <a
                href="${verificationLink}"
                style="
                  display:inline-block;
                  background:#2563eb;
                  color:#ffffff;
                  padding:15px 32px;
                  border-radius:8px;
                  text-decoration:none;
                  font-weight:bold;
                  font-size:16px;
                "
              >
                Verify My Email
              </a>

            </div>

            <p style="
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              This verification link will expire in 24 hours.
            </p>

            <p style="
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              If you did not create this account, you can safely ignore
              this email.
            </p>

          </td>
        </tr>

        <!-- Footer -->
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

export default verifyEmailTemplate;