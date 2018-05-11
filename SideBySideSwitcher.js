const fs = require('fs');
const ThingyHelper = require('./ThingyHelper');
const path = require('path');

function SideBySideSwitcher(options) {
    this.options = options;
    this.helper = new ThingyHelper();
    //fs.unlink("c:\\temp\\webpackoutput.txt", () => {});
    // Setup the plugin instance with options...
}

SideBySideSwitcher.prototype.apply = function (compiler) {

    const getFileAndExtension = (filename) => {
        let splitElement = filename.split(".");
        
        return {
            "file" : splitElement.slice(0, splitElement.length -1).join("."),
            "extension" : splitElement.reverse()[0]
        }
    };
    
    const getFilePath = (filename, seperator) => {
        return filename.split(seperator).slice(0, filename.split(seperator).length - 1).join(seperator) + "/";
    };

    const buildClientFilename = (filename) => {
        let fileAndExtension = getFileAndExtension(filename);
        return fileAndExtension.file + "." + this.options.client + "." + fileAndExtension.extension;
    };

    const buildClientBrandFilename = (filename) => {
        let fileAndExtension = getFileAndExtension(filename);
        return fileAndExtension.file + "." + this.options.client + "." + this.options.brand + "." + fileAndExtension.extension;
    };

    const fileExists = (result, filename, filePath, context, found, notFound) => {
        
        let fileLocation = path.resolve(context + filePath + filename);
        
        if (fs.existsSync(fileLocation)) {
            console.log("Switching " + result.request + " to " + filePath + filename);
            result.request = filePath + filename;
            return found(result);
        }

        return notFound(result);
    };

    compiler.hooks.normalModuleFactory.tap("BadPlugin", compilation => {

        compilation.plugin("before-resolve", (result, callback) => {

            let generalCallBack = (callbackResult) => callback(null, callbackResult);
            
            // if (result.request.indexOf("pet-details.component") !== -1)
            //     debugger;
            
            if (!this.options.matcher.test(result.request))
                return generalCallBack();

            let fromLocation = result.context.endsWith("\\") ? result.context : result.context + "\\";
            let fileName = this.helper.getFileName(result.request, "/");
            let filePath = getFilePath(result.request, "/");

            let clientBrandFileName = buildClientBrandFilename(fileName);
            let clientFileName = buildClientFilename(fileName);

            let clientBrandFail = () => fileExists(result, clientFileName, filePath, fromLocation, generalCallBack, generalCallBack);

            return fileExists(result, clientBrandFileName, filePath, fromLocation, generalCallBack, clientBrandFail);
        });

    });
};

module.exports = SideBySideSwitcher;