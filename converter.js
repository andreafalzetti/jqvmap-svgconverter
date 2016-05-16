var xmldoc = require('xmldoc');
var svgflatten = require('svg-flatten');

module.exports = {
    convertString: function (_svg) {
        // parse and flatten source svg
        var _dom = new xmldoc.XmlDocument(_svg);

        var dom = svgflatten(_dom)
          .pathify()
          .flatten()
          .transform()
          .value();

        // build vmap options
        var vmapWidth, vmapHeight;

        if (dom.attr.width && dom.attr.height) {
            vmapWidth = dom.attr.width;
            vmapHeight = dom.attr.height;
        } else {
            vmapWidth = Math.ceil(dom.attr.viewBox.split(" ")[2]);
            vmapHeight = Math.ceil(dom.attr.viewBox.split(" ")[3]);
        }

        var vmapPaths = {};
        dom.children.forEach(function (path, i) {
            if (path.name !== "path" || !path.attr.d) {
                return;
            }
            vmapPaths["path-" + i] = {
                path: path.attr.d,
                name: path.attr.title || null,
                class: path.attr.class || null
            };
        });

        // return vmap options
        return {
            width: vmapWidth,
            height: vmapHeight,
            paths: vmapPaths
        };
    }
};