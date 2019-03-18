export default body => (`<html>
  <head>
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
    .link-btn {
      display: inline-block;
      background: #5863f8;
      padding: 10px;
      text-decoration: none;
      font-size: 1em;
      border-radius: 5px;
      color: #ffffff;
    }
    .link-btn:hover{
      background: #7c85fa;
      cursor: pointer;
    }
    body {
      text-align: center;
      padding: 100px;
      background: #f0f0f0;
    }
    .borderWrapper {
      border: #5863f8 1px solid;
      padding-bottom: 30px;
      background: #ffffff;
      border-radius:  0 0 20px 20px;
      text-align: center;
    }
    .content{
      padding: 20px;
      text-align: left;
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
    <div class="content">${body}</div>
    </div>
</body>
</html>`);
