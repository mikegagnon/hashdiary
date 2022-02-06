
function htmlifyDivs(element) {
    const newHtml = $("#hashdiary-content").children().map(function(){
        return this.outerHTML;
    }).get().join("");

    return newHtml;

}

function htmlifyNoDivs(element) {
    return "1"
}

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
        //console.log("this", this)
        //return "x"
    }).get().join("");

    return newHtml;
}


document.getElementById("hashdiary-content").addEventListener("input", function(event) {
    const oldHtml = $("#hashdiary-content").html();
    console.log("old", oldHtml)


    //x = $.parseHTML(oldHtml).find(".hd-markup").contents().unwrap();
    //console.log("asf", x)
    //$("#hashdiary-content").find(".hd-markup").contents().unwrap();
    
    // https://stackoverflow.com/questions/32499027/unwrap-all-paragraph-tags-inside-the-div-jquery
    $(".hd-markup").contents().unwrap().siblings(".hd-markup").remove();;


    //$("#hashdiary-content").contents().unwrap(".hd-markup");

    const unwrapped = $("#hashdiary-content").html();
    console.log("unwrapped", unwrapped)

    let newHtml = htmlify($("#hashdiary-content").contents());
    console.log("newHtml", newHtml)
    $("#hashdiary-content").html(newHtml);

    /*if ($("#hashdiary-content").children().length > 0) {
        newHtml = htmlifyDivs($("#hashdiary-content"));    
    } else {
        newHtml = htmlifyNoDivs($("#hashdiary-content"));
    }*/

    //console.log("new", newHtml);

    event.preventDefault();
}, false);




var div = document.getElementById('hashdiary-content');
setTimeout(function() {
    div.focus();
    //div.innerHTML = "\n";
}, 0);