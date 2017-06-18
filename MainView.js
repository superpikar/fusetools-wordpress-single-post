const Observable = require('FuseJS/Observable');

const API = {
  URL: 'https://public-api.wordpress.com/rest/v1.1/sites/lakonhidup.wordpress.com/',
  fields: 'ID,title,categories,content'
}

let post = Observable({
  ID: '',
  title: '',
  content: '',
  categories: '',
  contentPlain: '',
  contentHTML: '',
  contentParagraphs: []
});

const pages = [
  { title: 'Plain Post' },
  { title: 'HTML Post' }
];

function stripHTML(text) {
  text = text.replace(/\[.*?\]/g, ""); // remove wordpress shortcode , credit : http://stackoverflow.com/questions/20281294/finding-and-removing-all-occurences-of-shortcode-with-javascript
  return text.replace(/<.*?>/gm, ''); // remove html element
}

function renderToHtml(content) {
  return `
    <html>
      <head>
        <title>Lakon Hidup</title>
        <style>
          p, span{ font-size: 30px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

function loadPost() {
  fetch(`${API.URL}posts/slug:a-whole-new-world/?fields=${API.fields}`)
    .then(function(response) { return response.json(); })
    .then(function(responseObject) {
      responseObject.contentPlain = stripHTML(responseObject.content);
      responseObject.contentHTML = renderToHtml(responseObject.content);
      responseObject.contentParagraphs = [];

      const paragraphs = responseObject.contentPlain.split('\n');
      paragraphs.forEach(function(val, key) {
        responseObject.contentParagraphs.push({
          content: val
        });
      });
      console.log(responseObject.contentParagraphs.length);

      post.value = responseObject
    });
}

loadPost();

module.exports = {
  post: post,
  pages: pages
};