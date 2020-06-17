// namespaces
var dwvjq = dwvjq || {};
dwvjq.gui = dwvjq.gui || {};

/**
 * Loadbox base gui.
 * @constructor
 */
dwvjq.gui.Loadbox = function (app)
{
    var loaderGuis = {};

    /**
     * Setup the loadbox HTML.
     */
    this.setup = function (list)
    {
        // loader select
        var loaderSelector = dwvjq.html.createHtmlSelect("loaderSelect", list, "io");
        loaderSelector.onchange = function (event) {
            // show tool gui
            for ( var gui in loaderGuis ) {
                loaderGuis[gui].display(false);
            }
            loaderGuis[event.currentTarget.value].display(true);
        };

        // get node
        var node = app.getElement("loaderlist");
        // clear it
        while(node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        }
        // append selector
        node.appendChild(loaderSelector);
        // refresh
        dwvjq.gui.refreshElement(node);

        // create tool guis and call setup
        loaderGuis = [];
        var first = true;
        for ( var key in list ) {
            var name = list[key];
            var guiClass = name + "Load";
            if (typeof dwvjq.gui[guiClass] === "undefined") {
                console.warn("Could not create unknown loader gui: "+guiClass);
                continue;
            }
            var gui = new dwvjq.gui[guiClass](app);
            gui.setup();
            // display
            gui.display(first);
            if (first) {
                first = false;
            }
            // store
            loaderGuis[name] = gui;
        }
    };

}; // class dwvjq.gui.Loadbox

/**
 * FileLoad base gui.
 * @constructor
 */
dwvjq.gui.FileLoad = function (app)
{
    // closure to self
    var self = this;

    /**
     * Internal file input change handler.
     * @param {Object} event The change event.
     */
    function onchangeinternal(event) {
        if (typeof self.onchange === "function") {
            self.onchange(event);
        }

        // arquivos carregados
        var files_img = (Array.from(event.target.files)).filter(value => value.name.split(".").pop().toLowerCase() !== "json")
        var files_json = (Array.from(event.target.files)).filter(value => value.name.split(".").pop().toLowerCase() === "json")

        if (files_img.length){
            app.xfiles = files_img
            app.xjson = files_json
            app.xcurrentSlice = 1
        }

        if (event.target.files.length > 1) {

            var file_img = files_img[0].name.split(".").shift()
            var file_json = (files_json).filter(value => value.name.includes(file_img))
            var file_pair = [files_img[0]]
            if (file_json.length) {
                file_pair.push(file_json[0])
            }
            app.loadFiles(file_pair);

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
                    file_pair = [app.xfiles[app.xcurrentSlice - 1]]
                    if (file_json.length) {
                        file_pair.push(file_json[0])
                    }
                    app.loadFiles(file_pair)
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
                    file_pair = [app.xfiles[app.xcurrentSlice - 1]]
                    if (file_json.length) {
                        file_pair.push(file_json[0])
                    }
                    app.loadFiles(file_pair)
                }
            }

            // keyboard shortcuts listener
            var keyShortcut = function (event) {
                if (event.keyCode === 39 ) { // key S enable scroll
                    fileNext.click()
                }
                else if (event.keyCode === 37 ) { // key W enable windowlevel
                    fileBefore.click()
                }
            }
            window.addEventListener("keydown", keyShortcut);
        }
        else {
            app.loadFiles(event.target.files)
        }
    }

    /**
     * Setup the file load HTML to the page.
     */
    this.setup = function()
    {
        // input
        var fileLoadInput = document.createElement("input");
        fileLoadInput.onchange = onchangeinternal;
        fileLoadInput.type = "file";
        fileLoadInput.multiple = true;
        fileLoadInput.className = "imagefiles";
        fileLoadInput.setAttribute("data-clear-btn","true");
        fileLoadInput.setAttribute("data-mini","true");

        // associated div
        var fileLoadDiv = document.createElement("div");
        fileLoadDiv.className = "imagefilesdiv";
        fileLoadDiv.style.display = "none";
        fileLoadDiv.appendChild(fileLoadInput);

        // node
        var node = app.getElement("loaderlist");
        // append
        node.appendChild(fileLoadDiv);
        // refresh
        dwvjq.gui.refreshElement(node);
    };

    /**
     * Display the file load HTML.
     * @param {Boolean} bool True to display, false to hide.
     */
    this.display = function (bool)
    {
        // file div element
        var node = app.getElement("loaderlist");
        var filediv = node.getElementsByClassName("imagefilesdiv")[0];
        filediv.style.display = bool ? "" : "none";
    };

}; // class dwvjq.gui.FileLoad

/**
 * FolderLoad base gui.
 * @constructor
 */
dwvjq.gui.FolderLoad = function (app)
{
    // closure to self
    var self = this;

    /**
     * Internal file input change handler.
     * @param {Object} event The change event.
     */
    function onchangeinternal(event) {
        if (typeof self.onchange === "function") {
            self.onchange(event);
        }
        if (event.target.files.length > 1) {
            // arquivos carregados
            var files_img = (Array.from(event.target.files)).filter(value => value.name.split(".").pop().toLowerCase() !== "json")
            var files_json = (Array.from(event.target.files)).filter(value => value.name.split(".").pop().toLowerCase() === "json")

            if (files_img.length){
                app.xfiles = files_img
                app.xjson = files_json
                app.xcurrentSlice = 1
            }

            var file_img = files_img[0].name.split(".").shift()
            var file_json = (files_json).filter(value => value.name.includes(file_img))
            var file_pair = [files_img[0]]
            if (file_json.length) {
                file_pair.push(file_json[0])
            }
            app.loadFiles([files_img[0], file_json[0]]);

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
                    file_pair = [app.xfiles[app.xcurrentSlice - 1]]
                    if (file_json.length) {
                        file_pair.push(file_json[0])
                    }
                    app.loadFiles(file_pair)
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
                    file_pair = [app.xfiles[app.xcurrentSlice - 1]]
                    if (file_json.length) {
                        file_pair.push(file_json[0])
                    }
                    app.loadFiles(file_pair)
                }
            }

            // keyboard shortcuts listener
            var keyShortcut = function (event) {
                if (event.keyCode === 39 ) { // key S enable scroll
                    fileNext.click()
                }
                else if (event.keyCode === 37 ) { // key W enable windowlevel
                    fileBefore.click()
                }
            }
            window.addEventListener("keydown", keyShortcut);
        }
        else {
            app.loadFiles(event.target.files)
        }
    }

    /**
     * Setup the file load HTML to the page.
     */
    this.setup = function()
    {
        // input
        var fileLoadInput = document.createElement("input");
        fileLoadInput.onchange = onchangeinternal;
        fileLoadInput.type = "file";
        fileLoadInput.multiple = true;
        fileLoadInput.webkitdirectory = true;
        fileLoadInput.className = "imagefolder";
        fileLoadInput.setAttribute("data-clear-btn","true");
        fileLoadInput.setAttribute("data-mini","true");

        // associated div
        var folderLoadDiv = document.createElement("div");
        folderLoadDiv.className = "imagefolderdiv";
        folderLoadDiv.style.display = "none";
        folderLoadDiv.appendChild(fileLoadInput);

        // node
        var node = app.getElement("loaderlist");
        // append
        node.appendChild(folderLoadDiv);
        // refresh
        dwvjq.gui.refreshElement(node);
    };

    /**
     * Display the folder load HTML.
     * @param {Boolean} bool True to display, false to hide.
     */
    this.display = function (bool)
    {
        // file div element
        var node = app.getElement("loaderlist");
        var folderdiv = node.getElementsByClassName("imagefolderdiv")[0];
        folderdiv.style.display = bool ? "" : "none";
    };

}; // class dwvjq.gui.FileLoad

/**
 * UrlLoad base gui.
 * @constructor
 */
dwvjq.gui.UrlLoad = function (app)
{
    // closure to self
    var self = this;

    /**
     * Internal url input change handler.
     * @param {Object} event The change event.
     */
    function onchangeinternal(event) {
        if (typeof self.onchange === "function") {
            self.onchange(event);
        }
        var list_urls = event.target.value.split(',')
        console.log(list_urls)
        app.loadURLs([list_urls[0]]);
        // app.loadURLs([event.target.value]);
    }

    /**
     * Setup the url load HTML to the page.
     */
    this.setup = function ()
    {
        // input
        var urlLoadInput = document.createElement("input");
        urlLoadInput.onchange = onchangeinternal;
        urlLoadInput.type = "url";
        urlLoadInput.className = "imageurl";
        urlLoadInput.setAttribute("data-clear-btn","true");
        urlLoadInput.setAttribute("data-mini","true");

        // associated div
        var urlLoadDiv = document.createElement("div");
        urlLoadDiv.className = "imageurldiv";
        urlLoadDiv.style.display = "none";
        urlLoadDiv.appendChild(urlLoadInput);

        // node
        var node = app.getElement("loaderlist");
        // append
        node.appendChild(urlLoadDiv);
        // refresh
        dwvjq.gui.refreshElement(node);
    };

    /**
     * Display the url load HTML.
     * @param {Boolean} bool True to display, false to hide.
     */
    this.display = function (bool)
    {
        // url div element
        var node = app.getElement("loaderlist");
        var urldiv = node.getElementsByClassName("imageurldiv")[0];
        urldiv.style.display = bool ? "" : "none";
    };

}; // class dwvjq.gui.UrlLoad
