const nodeHtmlToImage = require('node-html-to-image')

nodeHtmlToImage({
  output: './image.png',
  html: `<html>
    <head>
      <style>
        body {
          background: red;
          color: white;
          font-size: 80px;
        }
      </style>
    </head>
    <body>Hello {{ name }}</body>
  </html>
  `,
  content: { name: 'Maciek' },
  puppeteerArgs: { 'no-sandbox': true }
})
  .then(() => console.log('The image was created successfully!'))