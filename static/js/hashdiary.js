const MARKER_KEY = "7604267184203909339143050075566922885063";
let MARKER_INDEX = 0;



const CONTENT = `# Header

Test

## Subheader

Foo
`;


function htmlifyLineOld(line) {
    console.log(1 +  line)
    line = line.replace(MARKER_KEY, `<span class='hd-marker' data-index='${MARKER_INDEX}'>baz</span>`);
    MARKER_INDEX += 1
    console.log(2 + line)

    if (line.startsWith("#")) {
        return `<span class='hd-header-1-hash'>#</span><span class='hd-header-1'>${line.slice(1)}</span>`
    } else {
        return line;
    }

}

function htmlifyOld(md) {
    const lines = md.split(/\r?\n/);
    const result = [];
    for (const line of lines) {
        //console.log(line)
        let x = htmlifyLine(line);
        const rmed = x.replace(/\s+/g, '')
        if (rmed.length > 0) {
            x = `<div>${x}</div>`;
        } else {
            x = "<div></div>";// "NEWLINE";//"<br>"
        }
        result.push(x);
    }

    //const joined = result.join("\n");// + "\n";
    const joined = result.join("");// + "\n";

    return joined.replace("NEWLINE", "\n")

}

// const app = new Vue({
//   el: '#hashdiary-app',
//   data: {
//     hashHtml: htmlify(CONTENT)
//   },
//   methods: {
//     hashChange: function(event) {
//         const content = document.getElementById("hd-hashHtml").textContent;
//         console.log(content);
//         this.hashHtml = htmlify(content);
//     }
//   }
// })


//https://javascript.plainenglish.io/how-to-find-the-caret-inside-a-contenteditable-element-955a5ad9bf81
function getCaretIndex(element) {
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
  }
  return position;
}

//https://www.semicolonworld.com/question/69919/how-to-keep-the-position-of-the-caret-in-contenteditable-element
/*function getCaretPos(element) {
    var ie = (typeof document.selection != "undefined" && document.selection.type != "Control") && true;
    var w3 = (typeof window.getSelection != "undefined") && true;
    var caretOffset = 0;
    if (w3) {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (ie) {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

//https://www.semicolonworld.com/question/69919/how-to-keep-the-position-of-the-caret-in-contenteditable-element
function setCaretPos(element, position) {
    var node = element;
    node.focus();
    var textNode = node.firstChild;
    var caret = position; // insert caret after the 10th character say
    var range = document.createRange();
    range.setStart(textNode, caret);
    range.setEnd(textNode, caret);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}*/

//https://stackoverflow.com/questions/5595956/replace-innerhtml-in-contenteditable-div
/*function saveSelection(containerEl) {
    var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
    var sel = rangy.getSelection(), range;

    function traverseTextNodes(node, range) {
        if (node.nodeType == 3) {
            if (!foundStart && node == range.startContainer) {
                start = charIndex + range.startOffset;
                foundStart = true;
            }
            if (foundStart && node == range.endContainer) {
                end = charIndex + range.endOffset;
                throw stop;
            }
            charIndex += node.length;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i], range);
            }
        }
    }

    if (sel.rangeCount) {
        try {
            traverseTextNodes(containerEl, sel.getRangeAt(0));
        } catch (ex) {
            if (ex != stop) {
                throw ex;
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

// https://stackoverflow.com/questions/5595956/replace-innerhtml-in-contenteditable-div
function restoreSelection(containerEl, savedSel) {
    var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
    range.collapseToPoint(containerEl, 0);

    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }

    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            rangy.getSelection().setSingleRange(range);
        } else {
            throw ex;
        }
    }
}
*/
/*
let CARET = undefined;

document.getElementById("hashdiary-content").addEventListener("beforeinput", function() {

    const el = document.getElementById('hashdiary-content');  
// const selection = window.getSelection();  
// const range = document.createRange(); 
// console.log(selection, range)

    CARET = getCaretPos(el);
//    console.log("before", CARET);
}, false);
*/


function insertSpanAtCaret(insertPara) {
    var sel, range;
         /*var marker = document.createElement('span');
            marker.innerHTML ="x";
            //marker.style.display = "none";
            marker.setAttribute('data-index', MARKER_INDEX);
            marker.classList.add("hd-marker")*/
        let prefix = "";
        if (insertPara) {
            //prefix = "\n";//<br>";
        }
        var marker = $(`<span class='hd-marker' data-index='${MARKER_INDEX}'>${MARKER_KEY}${prefix}</span>`)[0];
            MARKER_INDEX++;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

       
            //alert(1)
            range.insertNode( marker );
            console.log(marker)
            console.log(1);
            return
        } else {
            //range.insertNode( marker );
            alert(1);
        }
    } else if (document.selection && document.selection.createRange) {


        const range = document.selection.createRange();
        range.insertNode(marker)
        //console.log(2);
        alert(2)
        //document.selection.createRange().text = text;
    }
    alert(3)
}

function htmlifyLine(line) {
    line = line.replace(MARKER_KEY, `<span class='hd-marker'>baz</span>`);

    if (line.startsWith("#")) {
        return `<div><span class='hd-header-1-hash'>#</span><span class='hd-header-1'>${line.slice(1)}</span></div>`
    } else if (line == "") {
        return `<div><br></div>`
    } else {
        return `<div>${line}</div>`;
    }

}

function htmlify(md) {
    //return md;
    //console.log(md)
    md = md.replaceAll("\n\n", "\n");
    //console.log(md)
    const lines = md.split("\n");
    const result = [];

    for (const line of lines) {
        let x = htmlifyLine(line);
        result.push(x);
    }

    const joined = result.join("");
    console.log(joined)
    return joined;

}

document.getElementById("hashdiary-content").addEventListener("input", function(event) {


    insertSpanAtCaret();

    const element = document.getElementById('hashdiary-content');  
    const innerText = element.innerText;
    const html = htmlify(innerText);
    element.innerHTML = html;


    const range = document.createRange();

    let span = $(".hd-marker")[0];
    console.log(span)

    // document.createRange() creates new range object
    var rangeobj = document.createRange();

    // Here 'rangeobj' is created Range Object
    var selectobj = window.getSelection();

    // Here 'selectobj' is created object for window
    // get selected or caret current position.
    // Setting start position of a Range
    rangeobj.setStart(span, 0);

    // Setting End position of a Range
    rangeobj.setEnd(span, 0);

    // Collapses the Range to one of its
    // boundary points
    rangeobj.collapse(true);

    // Removes all ranges from the selection
    // except Anchor Node and Focus Node
    selectobj.removeAllRanges();

    // Adds a Range to a Selection
    selectobj.addRange(rangeobj);

    $(".hd-marker").remove();

 

    event.preventDefault();
}, false);



var div = document.getElementById('hashdiary-content');
setTimeout(function() {
    div.focus();
    //div.innerHTML = "\n";
}, 0);