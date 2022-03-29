require('dotenv').config()

const nodeHtmlToImage = require('node-html-to-image');
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs');
const argv = yargs(hideBin(process.argv)).argv;

const WPAPI = require( 'wpapi' );
let wp = new WPAPI(
   {
     endpoint: process.env.API_URL,
     username: process.env.WP_USERNAME,
     password: process.env.WP_PASSWORD
   }
);

wp.posts().id( argv.post_id ).then( ( post ) => {
  title = post.title.rendered;

  nodeHtmlToImage({
    output: './images/image.png',
    html: `<html>
      <head>
        <style>
          body {
            background: #1a67fd;
            text-align:center;
            display: grid;
            justify-content: center;
            align-content: center;
            font-family: sans-serif;
            width:1200px;
            height:600px;
          }

          h1 {
            color: white;
            font-size: 80px;
          }

          p {
            color: white;
            font-size: 30px;
          }
        </style>
      </head>
      <body>
        <h1>{{ title }}</h1>
        <p>New post<p>
      </body>
    </html>
    `,
    content: {
      title: title,
    },
    puppeteerArgs: { args: ['--no-sandbox'] }
  })
    .then(
      () => {
        const responseUploadImage = wp.media()
        .file( './images/image.png' )
        .create({
            title: 'My awesome image',
            alt_text: 'an image of something awesome',
            caption: 'This is the caption text',
            description: 'More explanatory information'
        }).then( ( responseUploadImage ) => {
          wp.posts().id( argv.post_id ).update({
            featured_media: responseUploadImage.id
          });
        })
        .catch( function( responseUploadImage ) {
          console.log( responseUploadImage );
        } ) ;
      }
  )
}).catch( (error) => {
  console.log( error );
});



