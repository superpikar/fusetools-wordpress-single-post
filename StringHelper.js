const HTML = require('./node_modules/html-parse-stringify/index.js');
const FONTSTYLE = {
  BOLD: 'Bold',
  ITALIC: 'Italic',
  NORMAL: 'Normal'
};
const TEXTALIGN = {
  LEFT: 'Left',
  CENTER: 'Center',
  RIGHT: 'Right'
};

function stripHTML(text) {
  // remove wordpress shortcode , credit: http://stackoverflow.com/questions/20281294/finding-and-removing-all-occurences-of-shortcode-with-javascript
  text = text.replace(/\[.*?\]/g, "");
  // remove html element
  return text.replace(/<.*?>/gm, '');
}

function stripImage(text) {
  // remove <img /> element from text. credit: var content = content.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
  return text.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "");
}

function renderToHtml(content) {
  return `
    <html>
      <head>
        <title>Lakon Hidup</title>
        <style>
          body { background: yellow }
          p, span{ font-size: 40px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

/**
 * parse paragraph using html-parse-stringify node_modules
 * @param {text} text to be parsed 
 * @param {paragraphNumber} paragraph number, only for indexing 
 * 
 * @return {
 *  alignment: alignment of a paragraphs
 *  wordsChunk: chunk of Word Object {type: 'type of object', content: 'content of a words'}
 * }
 */
function parseParagraph(text, paragraphNumber) {
  var results = [];
  var alignment = 'Left';

  // strip image first
  text = stripImage(text);

  // becomes this AST:
  var ast = HTML.parse(text);

  // console.log(text);
  if (ast.length > 0) {
    console.log('paragraphNumber : ' + paragraphNumber);
    if (ast[0].children.length > 0) {
      console.log(`type: ${ast[0].type} -- name: ${ast[0].name}`);
      ast[0].children.forEach(function(val, key) {
        let textObject = {
          content: '',
          fontStyle: ''
        }
        if (val.type == 'text') {
          textObject = {
              content: val.content,
              fontStyle: FONTSTYLE.NORMAL
            }
            // results.push({ type: FONTSTYLE.NORMAL, content: textInside });
        } else if (val.type == 'tag') {
          let textInside = '';
          val.children.forEach(function(val2, key2) {
            textInside += val2.content + ' ';
          })
          if (val.name == 'em') {
            // results.push({ type: FONTSTYLE.ITALIC, content: textInside });
            textObject = {
              content: textInside,
              fontStyle: FONTSTYLE.ITALIC
            }
          } else {
            // results.push({ type: FONTSTYLE.BOLD, content: textInside });
            textObject = {
              content: textInside,
              fontStyle: FONTSTYLE.BOLD
            }
          }
        }
        results.push(textObject);
        console.log(`---> type: ${textObject.fontStyle} -- name: ${val.name} -- content: ${textObject.content}`);
      });
    }
    if (ast[0].attrs.style) {
      console.log(JSON.stringify(ast[0].attrs.style));
      let style = ast[0].attrs.style.split('text-align:');
      if (style.length > 1) {
        if (style[1].indexOf('left') > -1) {
          alignment = TEXTALIGN.LEFT;
        } else if (style[1].indexOf('right') > -1) {
          alignment = TEXTALIGN.RIGHT;
        } else if (style[1].indexOf('center') > -1) {
          alignment = TEXTALIGN.CENTER;
        }
      }
    }
  }
  return {
    alignment: alignment,
    wordChunks: results
  };
}

module.exports = {
  stripHTML: stripHTML,
  stripImage: stripImage,
  renderToHtml: renderToHtml,
  parseParagraph: parseParagraph
}