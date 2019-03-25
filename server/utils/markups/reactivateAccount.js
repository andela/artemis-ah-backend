import host from './index';

/**
 * @description Markup for email verfication
 * @param {string} name - name of user to receive the mail
 * @param {string} email - email of user to receive the mail
 * @param {string} token - timed token
 * @returns {string} markup template
 */
const reactivateAccountMarkup = (name, email, token) => (
  `<head>
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
          font-size: 1.2em;
          color: white;
          padding: 0 20px;
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
        <h3 class="username">Hello ${name},</h3>
        <p class="message" style="color: rgb(255, 255, 255)">
          If your getting this mail, it means you want to reactivate your account. <br/>
          You're one click away from reactivating your account. <br/>
          After you have successfully activated your account you can login to Authors Haven. <br/>
          Kindly not that the activation link last for 15 minutes.
        </p>
        <p class="message" style="color: rgb(255, 255, 255)">Please click the button below to reactivate.</p>
      </div>
        <a class="verifyLink" href="${host}api/users/reactivate?email=${email}&token=${token}" target="_blank" style="color: rgb(255, 255, 255)">
          Activate Account
        </a>
      </div>  
    </body>
  </html>
`);

export default reactivateAccountMarkup;
