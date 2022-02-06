


function htmlifyText(line) {
    let result = undefined;
    if (line.startsWith("#")) {
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
        } else {
            console.error("unhandled", this.nodeName)
        }
    }).get().join("");

    return newHtml;
}


document.getElementById("hashdiary-content").addEventListener("input", function(event) {
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


    event.preventDefault();
}, false);




var div = document.getElementById('hashdiary-content');
setTimeout(function() {
    div.focus();
    //div.innerHTML = "\n";
}, 0);