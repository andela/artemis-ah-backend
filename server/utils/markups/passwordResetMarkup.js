const passwordResetMarkup = (username, email, hash) => (
  `<!DOCTYPE html>
    <html lang="en"> 
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Authors Haven</title>
      <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
      <style>
        * {
          font-family: 'Open Sans', sans-serif;
          }
        .logoWrapper {
          margin: 0 auto;
          background: #5863f8;
          padding-top: 20px;
          text-align: center;
          }
        .logoWrapper img {
          width: 70px;
        }
        .username {
          font-size: 1em;
          color: white;
          }
        .message{
          font-size: 1em;
          color: white;
          }
        .verifyLink {
          display: inline-block;
          background: #5863f8;
          padding: 10px; 
          color: rgb(255, 255, 255);
          text-decoration: none;
          font-size: 1em;
          border-radius: 5px;
          }
        .verifyLink:hover{
          background: #7c85fa;
          cursor: pointer;
        }
        body {
          text-align: center;
          padding: 100px;
        }
        .borderWrapper {
          border: #5863f8 1px solid;
          padding-bottom: 30px;
          background: #363636;
          border-radius:  0 0 20px 20px;
          text-align: center;
        }
        .title{
          color:white;
          font-size: 1em;
          padding-bottom: 10px;
        }
        .content{
          padding: 50px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="borderWrapper">
      <div class="logoWrapper">
        <img src="https://res.cloudinary.com/shaolinmkz/image/upload/v1551370652/authors-haven/AH_logo.gif"
          alt="AH_logo" />
          <p class="title">Authors Haven</p>
      </div>
      <div class="content">
        <h3 class="username">Hello ${username},</h3>
        <p class="message">
          You recently requested to reset your password for your Authors Haven account.
        </p><br>
        <p class="message">Please, click the button below to proceed.</p>
      </div>
        <a class="verifyLink" href="http://localhost:3000/api/users/reset-password?email=${email}&hash=${hash}" target="_blank">
          Reset Password
        </a>
      </div>      
    </body>
  </html>
`
);

export default passwordResetMarkup;
