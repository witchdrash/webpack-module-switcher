const fs = require('fs');
const ThingyHelper = require('./ThingyHelper');
const path = require('path');

function SideBySideSwitcherTypeScript(options) {
    this.options = options;
    this.helper = new ThingyHelper(options);
}

SideBySideSwitcherTypeScript.prototype.apply = function (compiler) {

    const fileExists = (result, filename, filePath, context, found, notFound) => {

        let fileLocation = path.resolve(context + filePath + filename);

        if (fs.existsSync(fileLocation)) {
            let request = this.helper.normalisePath(filePath + filename.substring(0, filename.length - 3), context);
            console.log("Switching " + result.request + " to " + request);
            result.request = request;
            return found(result);
        }

        return notFound(result);
    };

    compiler.hooks.normalModuleFactory.tap("BadPlugin", compilation => {

        compilation.plugin("before-resolve", (result, callback) => {

            let generalCallBack = (callbackResult) => callback(null, callbackResult);

            if (result.request.indexOf("\\about-your-pet.module") !== -1)
                debugger;

            let fromLocation = result.context.endsWith("\\") ? result.context : result.context + "\\";

            if (!fs.existsSync(path.resolve(fromLocation + "\\" + result.request + ".ts")))
                return generalCallBack();

            let normalisedPath = this.helper.normalisePath(result.request, result.context);
            let fileName = this.helper.getFileName(normalisedPath, "\\");
            let filePath = this.helper.getFilePath(normalisedPath, "\\");

            let clientBrandFileName = this.helper.buildClientBrandFilename(fileName + ".ts");
            let clientFileName = this.helper.buildClientFilename(fileName + ".ts");

            let clientBrandFail = () => fileExists(result, clientFileName, filePath, fromLocation, generalCallBack, generalCallBack);

            return fileExists(result, clientBrandFileName, filePath, fromLocation, generalCallBack, clientBrandFail);

        });

    });
};

module.exports = SideBySideSwitcherTypeScript;