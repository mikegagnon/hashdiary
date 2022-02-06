

function insertSpanAtCaret(insertPara) {
    var sel, range;
        let prefix = "";
        if (insertPara) {
            //prefix = "\n";//<br>";
        }
        var marker = $(`<span class='hd-marker'>baz</span>`)[0];

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


function htmlifyLine(element) {
    if (element.nodeName == "BR") {
        return "<div><br></div>";
    } else if(element.nodeName === "#text" || element.nodeName == "SPAN") {
        //console.error("undef", element.textContent)
        let line = element.textContent

        //line = line.replace(MARKER_KEY, `<span class='hd-marker'>baz</span>`);

        let result = undefined;

        if (line.startsWith("#")) {
            result = `<span class='hd-header-1-hash'>#</span><span class='hd-header-1'>${line.slice(1)}</span>`
        } else if (line == "") {
            //alert("foo")
            result = "";//`<br>`
        } else {
            result = line;
        }

        return result; 
    } else if (element.nodeName == "DIV") {

        let line = element.textContent

        //line = line.replace(MARKER_KEY, `<span class='hd-marker'>baz</span>`);

        let result = undefined;

        if (line.startsWith("#")) {
            result = `<span class='hd-header-1-hash'>#</span><span class='hd-header-1'>${line.slice(1)}</span>`
        } else if (line == "") {
            result = "";//`<br>`
                        //alert("foo")

        } else {
            result = line;
        }

        //if (wrapDiv) {
            result = `<div>${result}</div>`;
        //}

        return result;        
    } else {
        console.log(element.nodeName)
        console.error("Unhandled")
    }



}


document.getElementById("hashdiary-content").addEventListener("input", function(event) {
    insertSpanAtCaret();


    console.log("oldHtml", $("#hashdiary-content").html());
    console.log("foo", $("#hashdiary-content").contents())
    const newHtml = $("#hashdiary-content").contents().map(function(){
        console.log("child", "'" + this.outerHTML + "'");
        console.log("child", "'" + this + "'");
        return htmlifyLine(this);   
        
    }).get().join("");
    console.log("newHtml", newHtml);
    $("#hashdiary-content").html(newHtml);

    //return;




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