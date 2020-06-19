// namespaces
var dwvjq = dwvjq || {};
dwvjq.gui = dwvjq.gui || {};

/**
 * Dropbox loader.
 * Listens to drag events on the layer container and
 * uses a drop box element as first display.
 * @constructor
 * @param {Object} app The associated application.
 */
dwvjq.gui.DropboxLoader = function (app)
{
    // closure to self
    var self = this;

    // drop box class name
    var dropboxClassName = "dropBox";
    var borderClassName = "dropBoxBorder";
    var hoverClassName = "hover";

    // size of the drop box
    var dropBoxSize = 0;

    /**
     * Initialise the drop box.
     */
    this.init = function () {
        // start listening to drag events on the layerContainer
        var layerDiv = app.getElement("layerContainer");
        if (layerDiv) {
            layerDiv.addEventListener("dragover", onDragOver);
            layerDiv.addEventListener("dragleave", onDragLeave);
            layerDiv.addEventListener("drop", onDrop);
        }
        // set the initial drop box size
        var box = app.getElement(dropboxClassName);
        if (box) {
            var size = app.getLayerContainerSize();
            dropBoxSize = 2 * size.height / 3;
            box.setAttribute(
                "style",
                "width:" + dropBoxSize + "px;height:" + dropBoxSize + "px"
            );
        }
    };

    /**
     * Hide the drop box gui.
     */
    this.hideDropboxElement = function () {
        var box = app.getElement(dropboxClassName);
        if (box) {
            // remove size
            box.removeAttribute("style");
            // remove border
            box.className = box.className.replace(" " + borderClassName, "");
            box.className = box.className.replace(" " + hoverClassName, "");
        }
    };

    /**
     * Show the drop box gui.
     */
    this.showDropboxElement = function () {
        var box = app.getElement(dropboxClassName);
        if (box) {
            // set size
            box.setAttribute(
                "style",
                "width:" + dropBoxSize + "px;height:" + dropBoxSize + "px"
            );
            // add border
            box.className += " " + borderClassName;
        }
    };

    /**
     * Handle a drag over.
     * @private
     * @param {Object} event The event to handle.
     */
    function onDragOver(event) {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // update box border
        var box = app.getElement(borderClassName);
        if (box && box.className.indexOf(hoverClassName) === -1) {
            box.className += " " + hoverClassName;
        }
    }

    /**
     * Handle a drag leave.
     * @private
     * @param {Object} event The event to handle.
     */
    function onDragLeave(event) {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // update box border
        var box = app.getElement(borderClassName);
        if (box && box.className.indexOf(hoverClassName) !== -1) {
            box.className = box.className.replace(" " + hoverClassName, "");
        }
    }

    /**
     * Handle a drop event.
     * @private
     * @param {Object} event The event to handle.
     */
    function onDrop(event) {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // load files

        if (event.dataTransfer.files.length > 1) {

            app['xurlfiles'] = []

            // arquivos carregados
            var files_img = (Array.from(event.dataTransfer.files)).filter(value => value.name.split(".").pop().toLowerCase() !== "json")
            var files_json = (Array.from(event.dataTransfer.files)).filter(value => value.name.split(".").pop().toLowerCase() === "json")

            if (files_img.length){
                app.xfiles = files_img
                app.xjson = files_json
                app.xcurrentSlice = 1
            }

            var file_img = files_img[0].name.split(".").shift()
            var file_json = (files_json).filter(value => value.name.includes(file_img))
            app.loadFiles([app.xfiles[app.xcurrentSlice - 1]]);
            if (file_json.length) {
                setTimeout(function(){ console.log('teste')
                app.loadFiles([file_json[0]])}, 500);
            }

            // >>
            var fileNext = document.querySelector("#next_image");
            fileNext.onclick = function(){
                app.xcurrentSlice += 1
                if (app.xcurrentSlice > app.xfiles.length){
                    app.xcurrentSlice = app.xfiles.length
                }
                else{
                    file_img = app.xfiles[app.xcurrentSlice - 1].name.split(".").shift()
                    file_json = (files_json).filter(value => value.name.includes(file_img))
                    app.loadFiles([app.xfiles[app.xcurrentSlice - 1]]);
                    if (file_json.length) {
                        setTimeout(function(){ console.log('teste')
                        app.loadFiles([file_json[0]])}, 500);
                    }
                }
            }

            // <<
            var fileBefore = document.querySelector("#previous_image");
            fileBefore.onclick = function(){
                app.xcurrentSlice -= 1
                if (app.xcurrentSlice < 1){
                    app.xcurrentSlice = 1
                }
                else {
                    file_img = app.xfiles[app.xcurrentSlice - 1].name.split(".").shift()
                    file_json = (files_json).filter(value => value.name.includes(file_img))
                    app.loadFiles([app.xfiles[app.xcurrentSlice - 1]]);
                    if (file_json.length) {
                        setTimeout(function(){ console.log('teste')
                        app.loadFiles([file_json[0]])}, 500);
                    }
                }
            }

            // keyboard shortcuts listener
            var keyShortcut = function (event) {
                if (event.keyCode === 39 ) { // key -> next image
                    fileNext.click()
                }
                else if (event.keyCode === 37 ) { // key <- previous image
                    fileBefore.click()
                }
            }
            window.addEventListener("keydown", keyShortcut);
        }
        else {
            app.loadFiles(event.dataTransfer.files)
        }



        //app.loadFiles(event.dataTransfer.files);
        // hide drop box
        self.hideDropboxElement();
    }

}; // dwvjq.gui.dropboxLoader
