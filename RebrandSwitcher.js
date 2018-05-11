const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const ThingyHelper = require('./ThingyHelper');

function RebrandSwitcher(options) {
    this.options = options;
    this.helper = new ThingyHelper();
    // Setup the plugin instance with options...
}

RebrandSwitcher.prototype.apply = function (compiler) {

    //const getFileName = (fileAndPath, seperator) => fileAndPath.split(seperator).reverse()[0];
    
    const buildClientFolderLocation = () => {
        return this.options.root + "/" + this.options.client + "/";
    };

    const buildClientBrandFolderLocation = () => {
        return buildClientFolderLocation() + this.options.brand + "/";
    };

    const clientBrandFolderExists = () => {
        return fs.existsSync(buildClientBrandFolderLocation());
    };

    const clientFolderExists = () => {
        return fs.existsSync(buildClientFolderLocation());
    };

    const clientBrandSpecific = (fileName) => {
        return fs.existsSync(buildClientBrandFolderLocation() + fileName);
    };

    const clientSpecific = (fileName) => {
        return fs.existsSync(buildClientFolderLocation() + fileName);
    };


    console.log("AQ Image Switcher : Client Folder\t: " + buildClientFolderLocation() + "\t\t" + (clientFolderExists() ? "Exists" : "Does not exist"));
    console.log("                    Client Brand Folder\t: " + buildClientBrandFolderLocation() + "\t" + (clientBrandFolderExists() ? "Exists" : "Does not exist"));

    //

    if (!clientFolderExists())
        return;

    compiler.hooks.normalModuleFactory.tap("RebrandSwitcher", compilation => {

        compilation.plugin("before-resolve", (result, callback) => {
            
            if (!this.options.matcher.test(result.request))
                return callback(null, result);


            let fileName = this.helper.getFileName(result.request, "/");

            if (clientBrandSpecific(fileName)) {
                let relative = path.relative(result.context, path.resolve(buildClientBrandFolderLocation()));
                result.request = relative + "\\" + fileName;

                console.log("Matched: " + fileName + " with " + result.request);

                return callback(null, result);
            }

            if (clientSpecific(fileName)) {
                console.log("Matched: " + fileName + " with " + buildClientFolderLocation() + fileName);
                result.request = buildClientFolderLocation() + fileName;
                return callback(null, result);
            }

            return callback(null, result);
        });

    });
};

module.exports = RebrandSwitcher;