const Observable = require('FuseJS/Observable');

const StringHelper = require('./StringHelper');

const API = {
  URL: 'https://public-api.wordpress.com/rest/v1.1/sites/superpikar.wordpress.com/',
  fields: 'ID,title,author,date,url,excerpt,categories,attachments,tags,content'
}
const APIURL = `${API.URL}posts/slug:percobaan-format-text/?fields=${API.fields}`;

let post = Observable({
  ID: '',
  title: '',
  content: '',
  categories: '',
  contentPlain: '',
  contentHTML: '',
  contentParagraphs: [],
  contentParagraphsFormatted: [],
});

function loadPost() {
  console.log('loadPost', APIURL);
  fetch(APIURL)
    .then(function(response) { return response.json(); })
    .then(function(responseObject) {
      responseObject.contentPlain = StringHelper.stripHTML(responseObject.content);
      responseObject.contentHTML = StringHelper.renderToHtml(StringHelper.stripImage(responseObject.content));
      responseObject.contentParagraphs = [];
      responseObject.contentParagraphsFormatted = [];

      const paragraphs = responseObject.contentPlain.split('\n');
      paragraphs.forEach(function(val, key) {
        responseObject.contentParagraphs.push({
          content: val
        });
      });
      console.log('------- paragraphs plain length', responseObject.contentParagraphs.length);

      const paragraphs2 = responseObject.content.split('\n');
      paragraphs2.forEach(function(val, key) {
        var subParagraph = StringHelper.parseParagraph(val, key);
        responseObject.contentParagraphsFormatted.push({
          paragraphNumber: key,
          paragraphContents: subParagraph.wordChunks,
          paragraphAlignment: subParagraph.alignment
        });
      });
      console.log('------- paragraphs auto length', responseObject.contentParagraphsFormatted.length);

      post.value = responseObject
    })
    .catch(error => {
      console.log(JSON.stringify(error));
    })
}

loadPost();

module.exports = {
  post: post,
};