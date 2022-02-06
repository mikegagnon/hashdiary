const MARKER_KEY = "7604267184203909339143050075566922885063";

function insertMarkerAtCaret() {
    //const marker = $(`<span class='hd-marker'>${MARKER_KEY}</span>`)[0];
    const marker = document.createTextNode(MARKER_KEY);
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(marker);
    return;
}

function htmlifyText(line) {
    let result = undefined;


    if (line.startsWith(MARKER_KEY) && line.replace(MARKER_KEY, "").startsWith("#")) {
        const markerRemoved = line.replace(MARKER_KEY, "");
        result = `${MARKER_KEY}<span class='hd-header-1-hash hd-markup'>#</span><span class='hd-header-1 hd-markup'>${markerRemoved.slice(1)}</span>`
    } else if (line.startsWith("#")) {
        result = `<span class='hd-header-1-hash hd-markup'>#</span><span class='hd-header-1 hd-markup'>${line.slice(1)}</span>`
    } else {
        result = line;
    }
    
    return result;
}

function htmlify(contents) {
    console.log("contents", contents)
    const newHtml = contents.map(function(){
        if (this.nodeName == "#text") {
            //return htmlifyText(this.textContents)
            return htmlifyText(this.nodeValue)
            //console.log("'" + this.nodeValue + "'")
        } else if (this.nodeName == "BR") {
            return "<br>"
        } else if (this.nodeName == "DIV") {
            const h = htmlify($(this).contents());
            return `<div>${h}</div>`
        } else if ($(this).hasClass("hd-marker")) {
            return this.outerHTML;
        } else {
            console.error("unhandled", this.nodeName)
        }
    }).get().join("");

    return newHtml;
}


function removeMarker() {
    const range = document.createRange();

    /*$('#hashdiary-content').find(":not(iframe)").each(function() {
        //alert(1)
        console.log("v", this.outerHTML);
        //$(v).contents().filter(function() { return this.nodeType === 3; }).wrap('<span class="new"/>')
    })*/

    //http://jsfiddle.net/5vfBg/
    /*$('#hashdiary-content').find(':not(iframe)').addBack().contents().each(function(){
        //console.log("x", this);
        // console.log("xx", $(this).html());
        // var currentHTML = $(this).get()[0].outerHTML;
        // var newHTML = currentHTML.replace(MARKER_KEY, "sf");
        // $(this).html(newHTML);
        var text = $(this).text()
        text = text.replace(MARKER_KEY, "foo")
        $(this).html(text)
    });*/

    let html = $("#hashdiary-content").html();
    html = html.replace(MARKER_KEY, "<span class='hd-marker'>baz</span>")
    $("#hashdiary-content").html(html);
    console.log(html)

    const span = $(".hd-marker")[0];

    //let span = $(".hd-marker")[0];
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

}

document.getElementById("hashdiary-content").addEventListener("input", function(event) {

    insertMarkerAtCaret();

    const oldHtml = $("#hashdiary-content").html();
    console.log("old", oldHtml)

    // https://stackoverflow.com/questions/32499027/unwrap-all-paragraph-tags-inside-the-div-jquery
    $(".hd-markup").contents().unwrap().siblings(".hd-markup").remove();
    $("#hashdiary-content")[0].normalize();

    const unwrapped = $("#hashdiary-content").html();
    console.log("unwrapped", unwrapped)

    let newHtml = htmlify($("#hashdiary-content").contents());
    console.log("newHtml", newHtml)
    $("#hashdiary-content").html(newHtml);



    removeMarker();


    event.preventDefault();
}, false);




var div = document.getElementById('hashdiary-content');
setTimeout(function() {
    div.focus();
    //div.innerHTML = "\n";
}, 0);