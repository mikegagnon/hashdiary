const MARKER_KEY = "7604267184203909339143050075566922885063";

function insertMarkerAtCaret(insertPara) {
    console.log(insertPara)
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

function htmlifyText(line) {
    let result = undefined;


    if (line.startsWith(MARKER_KEY) && line.replace(MARKER_KEY, "").startsWith("#")) {
        const markerRemoved = line.replace(MARKER_KEY, "");
        result = `${MARKER_KEY}<span class='hd-header-1-hash hd-markup'>#</span><span class='hd-header-1 hd-markup'>${markerRemoved.slice(1)}</span>`
    //} else if (line.startsWith(MARKER_KEY)) {
    //    result = 
    } else if (line.startsWith("#")) {
        result = `<span class='hd-header-1-hash hd-markup'>#</span><span class='hd-header-1 hd-markup'>${line.slice(1)}</span>`
    } else {
        result = line;
    }
    
    return result;
}

const BR_KEY = "875320567353920586756"
const END_DIV_KEY = "9090473623729304874"

/*function htmlFromMarkdown(markdown) {

}*/

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

document.getElementById("hashdiary-content").addEventListener("input", function(event) {
    
    // setTimeout(function(){
    //     insertMarkerAtCaret(event.inputType == "insertParagraph");

    //     const oldHtml = $("#hashdiary-content").html();
    //     //console.log("old", oldHtml)

    //     // https://stackoverflow.com/questions/32499027/unwrap-all-paragraph-tags-inside-the-div-jquery
    //     $(".hd-markup").contents().unwrap().siblings(".hd-markup").remove();
    //     $("#hashdiary-content span:empty").remove();
    //     $("#hashdiary-content")[0].normalize();

    //     const unwrapped = $("#hashdiary-content").html();
    //     //console.log("unwrapped", unwrapped)

    //     const newHtml = htmlify($("#hashdiary-content").contents());
    //     console.log("newHtml", "'" + newHtml + "'");

    //     const textmd = toTextMd($("#hashdiary-content").contents());
    //     console.log("textmd", "'" + textmd + "'");

    //     const htmlmd = htmlFromTextMd(textmd);
    //     console.log("htmlmd", "'" + htmlmd + "'");


    //     //$("#hashdiary-content").html(htmlmd);
    //     $("#hashdiary-content").html(newHtml);



    //     removeMarker();


    // }, 1000);

    insertMarkerAtCaret(event.inputType == "insertParagraph");

    const oldHtml = $("#hashdiary-content").html();
    //console.log("old", oldHtml)

    // https://stackoverflow.com/questions/32499027/unwrap-all-paragraph-tags-inside-the-div-jquery
    $(".hd-markup").contents().unwrap().siblings(".hd-markup").remove();
    $("#hashdiary-content span:empty").remove();
    $("#hashdiary-content")[0].normalize();

    const unwrapped = $("#hashdiary-content").html();
    //console.log("unwrapped", unwrapped)

    const [newHtml, markdown] = htmlify($("#hashdiary-content").contents());
    console.log("newHtml", "'" + newHtml + "'");
    console.log("markdown", "'" + markdown + "'");

    //const textmd = toTextMd($("#hashdiary-content").contents());
    //console.log("textmd", "'" + textmd + "'");

    //const htmlmd = htmlFromTextMd(textmd);
    //console.log("htmlmd", "'" + htmlmd + "'");


    //$("#hashdiary-content").html(htmlmd);
    $("#hashdiary-content").html(newHtml);



    removeMarker();


    event.preventDefault();
}, false);




var div = document.getElementById('hashdiary-content');
setTimeout(function() {
    div.focus();
    //div.innerHTML = "\n";
}, 0);