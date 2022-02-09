const MARKER_KEY = "7604267184203909339143050075566922885063";
// const HASH_PAGES = new Set([
//         "foo",
//         "foo-bar",
//         "foo-baz"
//     ]);

function insertMarkerAtCaret(insertPara) {
    //console.log(insertPara)
    //const marker = $(`<span class='hd-marker'>${MARKER_KEY}</span>`)[0];
    const marker = document.createTextNode(MARKER_KEY);
    const sel = window.getSelection();
    /*let i = undefined;
    if (insertPara) {
        i = 1;
    } else {
        i = 0;
    }*/
    const range = sel.getRangeAt(0);


    //range.deleteContents();
    range.insertNode(marker);
    return;
}

const BOLD_RE_STR = `\\*((?:(?:${MARKER_KEY})?))\\*([^*]+?)\\*((?:(?:${MARKER_KEY})?))\\*`
const BOLD_RE = new RegExp(BOLD_RE_STR, "g")
const BOLD_REPLACEMENT = "<span class='hd-bold-star hd-markup'>&ast;$1&ast;</span><span class='hd-bold hd-markup'>$2</span><span class='hd-bold-star hd-markup'>&ast;$3&ast;</span>";

const ITALICS_RE_STR = `\\*([^*]+?)\\*`
const ITALICS_RE = new RegExp(ITALICS_RE_STR, "g")
const ITALICS_REPLACEMENT = "<span class='hd-italics-star hd-markup'>&ast;</span><span class='hd-italics hd-markup'>$1</span><span class='hd-italics-star hd-markup'>&ast;</span>";

function stylizeText(line) {
    line = line.replace(BOLD_RE, BOLD_REPLACEMENT)
    line = line.replace(ITALICS_RE, ITALICS_REPLACEMENT)
    return line;
}

//function findAllMat

function linkSub(line, match) {
    const markerIndex = match.indexOf(MARKER_KEY);
    if (markerIndex >= 0) {
        const matchWithoutMarker = match.replace(MARKER_KEY, "");
        const url = matchWithoutMarker.slice(1, -1) // drop the brackets
        const urlWithMarker = match.slice(1,-1)
        const replacement = `<span class='hd-link-bracket hd-markup'>[</span><a href='${url}' class='hd-link hd-markup'>${urlWithMarker}</a><span class='hd-link-bracket hd-markup'>]</span>`;
        line = line.replace(match, replacement);
    } else {
        const url = match.slice(1, -1) // drop the brackets
        const replacement = `<span class='hd-link-bracket hd-markup'>[</span><a href='${url}' class='hd-link hd-markup'>${url}</a><span class='hd-link-bracket hd-markup'>]</span>`;
        line = line.replace(match, replacement);
    }

    return line;
}

const LINK_RE_STR = `(\\[([^*]+?)\\])`
const LINK_RE = new RegExp(LINK_RE_STR, "g")
//const LINK_REPLACEMENT = "<span class='hd-link-bracket hd-markup'>[</span><a href='$1' class='hd-link hd-markup'>$1</a><span class='hd-link-bracket hd-markup'>]</span>";

// Couldn't figure out how to do this purely with regex replace
function linkify(line) {
    const matches = line.match(LINK_RE);
    if (matches !== null) {
        for (match of matches) {
            line = linkSub(line, match)
        }
    }

    return line;
}

function hashtagToUrl(hashtag) {
    return "/page/" + hashtag
}

function doesPageExist(hashtag) {
    return HASH_PAGES.has(hashtag);
}

function hashtagSub(line, match) {
    const markerIndex = match.indexOf(MARKER_KEY);
    if (markerIndex >= 0) {
        const matchWithoutMarker = match.replace(MARKER_KEY, "");
        const tag = matchWithoutMarker.slice(1)
        const url = hashtagToUrl(tag);

        let existClassTail = "";
        if (doesPageExist(tag)) {
            existClassTail = "-exists";
        }

        const hashtagWithMarker = match.slice(1)
        const replacement = `<a href='${url}' class='hd-hashlink-tag${existClassTail} hd-markup'>#${hashtagWithMarker}</a>`;
        line = line.replace(match, replacement)
    } else {
        const url = hashtagToUrl(match.slice(1));
        const tag = match.slice(1);

        let existClassTail = "";
        if (doesPageExist(tag)) {
            existClassTail = "-exists";
        }

        const replacement = `<a href='${url}' class='hd-hashlink-tag${existClassTail} hd-markup'>#${tag}</a>`;
        line = line.replace(match, replacement)
    }
    return line;
}

const HASHTAG_RE_STR = `(#[A-Za-z0-9\-_]+)`
const HASHTAG_RE = new RegExp(HASHTAG_RE_STR, "g")

function hashify(line) {
    const matches = line.match(HASHTAG_RE);
    if (matches !== null) {
        for (match of matches) {
            const matchWithoutMarker = match.replace(MARKER_KEY, "");
            if (matchWithoutMarker.length > 1) {
                line = hashtagSub(line, match);
            }
        }
    }

    return line;
}

const HASH_THREE_RE_STR = `^((?:(?:${MARKER_KEY})?))#((?:(?:${MARKER_KEY})?))#((?:(?:${MARKER_KEY})?))# (.*)`;
const HASH_THREE_RE = new RegExp(HASH_THREE_RE_STR,"g");
const HASH_THREE_REPLACEMENT = "$1<span class='hd-header-3-hash hd-markup'>#$2#$3# </span><span class='hd-header-3 hd-markup'>$4</span>"

const HASH_TWO_RE_STR = `^((?:(?:${MARKER_KEY})?))#((?:(?:${MARKER_KEY})?))# (.*)`;
const HASH_TWO_RE = new RegExp(HASH_TWO_RE_STR,"g");
const HASH_TWO_REPLACEMENT = "$1<span class='hd-header-2-hash hd-markup'>#$2# </span><span class='hd-header-2 hd-markup'>$3</span>"

const HASH_ONE_RE_STR = `^((?:(?:${MARKER_KEY})?))# (.*)`;
const HASH_ONE_RE = new RegExp(HASH_ONE_RE_STR,"g");
const HASH_ONE_REPLACEMENT = "$1<span class='hd-header-1-hash hd-markup'># </span><span class='hd-header-1 hd-markup'>$2</span>"

function htmlifyText(line) {
    let result = undefined;

    line = escapeHtml(line);

    if (line.match(HASH_THREE_RE)) {
        result = line.replace(HASH_THREE_RE, HASH_THREE_REPLACEMENT);
    } else if (line.match(HASH_TWO_RE)) {
        result = line.replace(HASH_TWO_RE, HASH_TWO_REPLACEMENT);
    } else if (line.match(HASH_ONE_RE)) {
        result = line.replace(HASH_ONE_RE, HASH_ONE_REPLACEMENT);
    } else {
        result = stylizeText(line);
        result = linkify(result);
        result = hashify(result);
    }

    //result = line.replace(hashTwo, `<span class='hd-header-2-hash hd-markup'>##</span><span class='hd-header-1 hd-markup'>${line.slice(1)}</span>`)
    
    return result;
}

const BR_KEY = "875320567353920586756"
const END_DIV_KEY = "9090473623729304874"

function htmlFromMarkdown(markdown) {
    const lines = markdown.split("\n")
    let html = "";

    for (line of lines) {
        /*if (line.startsWith("#")) {
            html += ""
        }*/
        htmlLine = htmlifyText(line);
        div = `<div>${htmlLine}<br></div>`;
        html += div;
    }

    return html;
}

// https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery/1395954#1395954
function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

// https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}


function htmlify(contents, recur = false, markdown = null) {
    if (markdown == null) {
        markdown = [""]
    }

    //console.log("contents", contents)
    const newHtml = contents.map(function(){
        if (this.nodeName == "#text") {
            //return htmlifyText(this.textContents)
            const x = htmlifyText(this.nodeValue)
            markdown[0] += this.nodeValue;

            if (recur) {
                return x;
            } else {
                return `<div>${x}</div>`;
            }
            //console.log("'" + this.nodeValue + "'")
        } else if (this.nodeName == "BR") {
            //console.error("asdf");
            markdown[0] += BR_KEY
            return "<br>"
        } else if (this.nodeName == "DIV") {
            const h = htmlify($(this).contents(), true, markdown);
            markdown[0] += END_DIV_KEY
            return `<div>${h}</div>`
        } else if ($(this).hasClass("hd-marker")) {
            return this.outerHTML;
        } else {
            console.error("unhandled", this.nodeName, this)
        }
    }).get().join("");

    if (!recur){
        // console.log("markdown")
        let md = markdown[0].replace(MARKER_KEY, "")
        md = md.replaceAll(BR_KEY + END_DIV_KEY, "\n");
        md = md.replaceAll(BR_KEY, "\n");
        md = md.replaceAll(END_DIV_KEY, "\n");
        if (md[md.length - 1] == "\n") {
            md = md.slice(0, -1);
        }

        // console.log(md);
        // console.log("end markdown")
        return [newHtml, md]
    } else {
        return newHtml;
    }


}

function toTextMd(contents) {
    const textmd = contents.map(function(){
        if (this.nodeName == "#text") {
            //return htmlifyText(this.textContents)
            return this.nodeValue
            //console.log("'" + this.nodeValue + "'")
        } else if (this.nodeName == "BR") {
            return ""
        } else if (this.nodeName == "DIV") {
            const h = toTextMd($(this).contents());
            return `${h}\n`
        } else if ($(this).hasClass("hd-marker")) {
            return ""
        } else {
            console.error("unhandled", this.nodeName)
        }
    }).get().join("");

    return textmd.replace(MARKER_KEY, "");
}

function htmlFromTextMd(textmd) {
    lines = textmd.split("\n");
    const html = [];

    const trimmed = lines.filter
    for (line of lines) {
        // if (line == "") {
        //     continue;
        // }
        const hline = `<div>${line}<br></div>`
        html.push(hline);
    }
    return html.join("");
}

function removeMarker() {
    const range = document.createRange();


    let html = $("#hashdiary-content").html();
    html = html.replace(MARKER_KEY, "<span class='hd-marker'>baz</span>")
    $("#hashdiary-content").html(html);
    //console.log(html)

    const span = $(".hd-marker")[0];

    //let span = $(".hd-marker")[0];
    //console.log(span)

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

}

function renderHtml(divId) {
    // https://stackoverflow.com/questions/32499027/unwrap-all-paragraph-tags-inside-the-div-jquery
    $(`${divId} .hd-markup`).contents().unwrap().siblings(".hd-markup").remove();
    $(`${divId} span:empty`).remove();
    $(divId)[0].normalize();

 
    const [newHtml, markdown] = htmlify($(divId).contents());


    console.log("newHtml", "'" + newHtml + "'");
    console.log("markdown", "'" + markdown + "'");
    //console.log("htmlFromMarkdown", "'" + htmlFromMarkdown(markdown) + "'");
 
    $(`${divId}`).html(newHtml);
    return markdown;
}

document.getElementById("hashdiary-content").addEventListener("input", function(event) {
    
    // Do the real render
    insertMarkerAtCaret(event.inputType == "insertParagraph");
    const markdown = renderHtml("#hashdiary-content");
    removeMarker();

    // Do an invisible render, just so we can check the invisible markdown matches
    // the visible markdown
    const htmlFromMd = htmlFromMarkdown(markdown)
    $("#hashdiary-scratchpad").html(htmlFromMd)
    const markdownScratch = renderHtml("#hashdiary-scratchpad");
    if (markdown != markdownScratch) {
        console.error("Markdown does not match")
    }

    event.preventDefault();
}, false);



function clickSave() {
     $("#hashdiary-content").removeAttr("contenteditable");
    $("main").removeClass("edit-bg");
    $("#save-button").attr("disabled", true);
    $("#save-button").removeClass("btn-danger");
    $("#save-button").addClass("btn-secondary");

    $("#edit-button").removeAttr("disabled");
    $("#edit-button").removeClass("btn-secondary");
    $("#edit-button").addClass("btn-primary");
}

function clickEdit() {
    $("#hashdiary-content").attr("contenteditable", true);
    $("main").addClass("edit-bg");
    $("#save-button").removeAttr("disabled");
    $("#save-button").addClass("btn-danger");
    $("#save-button").removeClass("btn-secondary");

    $("#edit-button").attr("disabled", true);
    $("#edit-button").addClass("btn-secondary");
    $("#edit-button").removeClass("btn-primary");
}

$("#save-button").click(function(){
    //alert(1);
    clickSave();
});

$("#edit-button").click(function(){
    //alert(1);
    clickEdit();
});


function main() {
    const html = htmlFromMarkdown(CONTENTS);
    $("#hashdiary-content").html(html);

    clickSave();

    var div = document.getElementById('hashdiary-content');
    setTimeout(function() {
        div.focus();
        //div.innerHTML = "\n";
    }, 0);
}
main();