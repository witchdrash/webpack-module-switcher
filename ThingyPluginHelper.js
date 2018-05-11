const path = require('path');

function ThingyHelper(options) {
    this.options = options;
}

ThingyHelper.prototype.getFileAndExtension = function (filename) {
    let splitElement = filename.split(".");

    return {
        "file": splitElement.slice(0, splitElement.length - 1).join("."),
        "extension": splitElement.reverse()[0]
    }
};

ThingyHelper.prototype.normalisePath = function (fileAndPath, context) {
    let absolute = path.resolve(context.replace(/(\\|\/)/g, "\\") + "\\" + fileAndPath.replace(/(\\|\/)/g, "\\"));
    let contextAbsolute = path.resolve(context.replace(/(\\|\/)/g, "\\"));
    return ".\\" + path.relative(contextAbsolute, absolute);
};

ThingyHelper.prototype.getFileName = function (fileAndPath, seperator) {
    return fileAndPath.split(seperator).reverse()[0];
};

ThingyHelper.prototype.getFilePath = function (filename, seperator) {
    return filename.split(seperator).slice(0, filename.split(seperator).length - 1).join(seperator) + "/";
};

ThingyHelper.prototype.buildClientFilename = function (filename) {
    let fileAndExtension = this.getFileAndExtension(filename);
    return fileAndExtension.file + "." + this.options.client + "." + fileAndExtension.extension;
};

ThingyHelper.prototype.buildClientBrandFilename = function (filename) {
    let fileAndExtension = this.getFileAndExtension(filename);
    return fileAndExtension.file + "." + this.options.client + "." + this.options.brand + "." + fileAndExtension.extension;
};

module.exports = ThingyHelper;