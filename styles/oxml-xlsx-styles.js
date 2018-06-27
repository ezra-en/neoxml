define(['oxml_xlsx_font', 'oxml_xlsx_num_format', 'oxml_xlsx_border'], function (oxmlXlsxFont, oxmlXlsxNumFormat, oxmlXlsxBorder) {
    var generateContent = function (_styles) {
        // Create Styles
        var stylesString = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        var index = 0, fillKey;
        stylesString += oxmlXlsxNumFormat.generateContent(_styles);
        stylesString += oxmlXlsxFont.generateContent(_styles);
        stylesString += '<fills count="' + _styles._fillsCount + '">';
        for (fillKey in _styles._fills) {
            var fill = JSON.parse(fillKey);
            if (fill) {
                stylesString += getFillString(fill);
            } else {
                stylesString += '<fill/>';
            }
        }
        stylesString += '</fills>';
        stylesString += oxmlXlsxBorder.generateContent(_styles);
        stylesString += '<cellStyleXfs count="1"><xf /></cellStyleXfs>';

        stylesString += '<cellXfs count="' + (parseInt(_styles.styles.length, 10) + 1) + '"><xf />';
        for (index = 0; index < _styles.styles.length; index++) {
            var numFormatString = _styles.styles[index]._numFormat ? ' numFmtId="' + _styles.styles[index]._numFormat + '" ' : '';
            var borderString = _styles.styles[index]._border ? ' borderId="' + _styles.styles[index]._border + '" ' : '';
            var fillString = _styles.styles[index]._fill ? ' fillId="' + _styles.styles[index]._fill + '" ' : '';
            stylesString += '<xf fontId="' + _styles.styles[index]._font + '" ' + numFormatString + borderString + fillString + ' />';
        }
        stylesString += '</cellXfs></styleSheet>';
        return stylesString;
    };

    var getFillString = function (fill) {
        var fillString = '<fill>';
        if (fill.pattern) {
            var patternType = fill.pattern || 'none';
            var colorString = fill.fgColor ? '<fgColor rgb="' + fill.fgColor + '"/>' : '';
            colorString += fill.bgColor ? '<bgColor rgb="' + fill.bgColor + '"/>' : '';
            fillString += '<patternFill patternType="' + patternType + '">' + colorString + '</patternFill>';
        }
        else if (fill.gradient) {
            var typeString = fill.gradient.type ? ' type="' + fill.gradient.type + '" ' : '';
            var leftString = fill.gradient.left ? ' left="' + fill.gradient.left + '" ' : '';
            var rightString = fill.gradient.right ? ' right="' + fill.gradient.right + '"' : '';
            var topString = fill.gradient.top ? ' top="' + fill.gradient.top + '" ' : '';
            var bottomString = fill.gradient.bottom ? ' bottom="' + fill.gradient.bottom + '" ' : '';
            var degreeString = fill.gradient.degree ? ' degree="' + fill.gradient.degree + '" ' : '';
            fillString += '<gradientFill ' + typeString + leftString + rightString + topString + bottomString + degreeString + ' >';
            for (var stopIndex = 0; stopIndex < fill.gradient.stops.length; stopIndex++) {
                fillString += '<stop position="' + fill.gradient.stops[stopIndex].position + '">';
                fillString += '<color rgb="' + fill.gradient.stops[stopIndex].color + '" /></stop>';
            }
            fillString += '</gradientFill>';
        } else {
            return '<fill/>';
        }
        return fillString + '</fill>';
    };

    var attach = function (file, _styles) {
        // Add REL
        var styles = generateContent(_styles);
        file.addFile(styles, _styles.fileName, "workbook");
    };

    var createStyleParts = function (_workBook, _rel, _contentType) {
        var lastSheetRel = _workBook.getLastSheet();
        var nextSheetRelId = parseInt((lastSheetRel.Id || "rId0").replace("rId", ""), 10) + 1;
        _contentType.addContentType("Override", "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml", {
            PartName: "/workbook/style" + nextSheetRelId + ".xml"
        });

        _rel.addRelation(
            "rId" + nextSheetRelId,
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
            "style" + nextSheetRelId + ".xml"
        );

        return nextSheetRelId;
    };

    var createFill = function (options) {
        if (options.fill && options.fill.pattern) {
            var fill = {};
            fill.pattern = options.fill.pattern;
            fill.fgColor = options.fill.foreColor || false;
            fill.bgColor = options.fill.backColor || options.fill.color || false;
            return fill;
        } else if (options.fill && options.fill.gradient && options.fill.gradient.stop) {
            var fill = {};
            fill.gradient = {};
            fill.gradient.degree = options.fill.gradient.degree || false;
            fill.gradient.bottom = options.fill.gradient.bottom || false;
            fill.gradient.left = options.fill.gradient.left || false;
            fill.gradient.right = options.fill.gradient.right || false;
            fill.gradient.top = options.fill.gradient.top || false;
            fill.gradient.type = options.fill.gradient.type || false;
            fill.gradient.stops = [];
            for (var stopIndex = 0; stopIndex < options.fill.gradient.stop.length; stopIndex++) {
                var stop = {};
                stop.position = options.fill.gradient.stop[stopIndex].position || 0;
                stop.color = options.fill.gradient.stop[stopIndex].color || false;
                fill.gradient.stops.push(stop);
            }
            return fill;
        }
        return false;
    };

    var searchFill = function (fill, _styles) {
        return _styles._fills[JSON.stringify(fill, Object.keys(fill).sort())];
    };

    var addFill = function (fill, _styles) {
        if (!_styles._fills) {
            _styles._fills = {};
            _styles._fillsCount = 0;
        }
        var index = _styles._fillsCount++;
        _styles._fills[JSON.stringify(fill)] = "" + index;
        return _styles._fills[JSON.stringify(fill)];
    };

    var searchStyleForCell = function (_styles, cellIndex) {
        var index = 0;
        for (; index < _styles.styles.length; index++) {
            if (_styles.styles[index].cellIndices[cellIndex] !== undefined && _styles.styles[index].cellIndices[cellIndex] !== null) {
                return _styles.styles[index];
            }
        }
        return null;
    };

    var searchSimilarStyle = function (_styles, style) {
        var index = 0;
        for (; index < _styles.styles.length; index++) {
            if (_styles.styles[index]._font === style._font && _styles.styles[index]._numFormat === style._numFormat) {
                return _styles.styles[index];
            }
        }
        return null;
    };

    var addStyles = function (options, _styles) {
        if (options.cellIndex || options.cellIndices) {
            var newStyleCreated = false;

            var fill = createFill(options);

            var savedFill = fill && _styles._fills ? searchFill(fill, _styles) : null;

            if (savedFill) {
                fill = savedFill;
            } else if (fill) {
                newStyleCreated = true;
                fill = addFill(fill, _styles);
            }

            if (options.cellIndex) {
                var cellStyle = searchStyleForCell(_styles, options.cellIndex);
                var saveFont = oxmlXlsxFont.getFontForCell(_styles, options, cellStyle);
                var saveNumFormat = oxmlXlsxNumFormat.getNumFormatForCell(_styles, options, cellStyle);
                var saveBorder = oxmlXlsxBorder.getBorderForCell(_styles, options, cellStyle);
                newStyleCreated = newStyleCreated || saveFont.newStyleCreated || saveBorder.newStyleCreated;
                if (cellStyle) {
                    if (cellStyle._font === saveFont.fontIndex && cellStyle._numFormat === saveNumFormat.numFormatIndex && cellStyle._border === saveBorder.borderIndex && cellStyle._fill === fill) {
                        return cellStyle;
                    }
                    var totalCellApplied = Object.keys(cellStyle.cellIndices).length;
                    if (totalCellApplied === 1) {
                        cellStyle._font = saveFont.fontIndex;
                        cellStyle._numFormat = saveNumFormat.numFormatIndex;
                        cellStyle._border = saveBorder.borderIndex;
                        cellStyle._fill = fill;
                        return cellStyle;
                    }
                    delete cellStyle.cellIndices[options.cellIndex];
                }

                if (!newStyleCreated) {
                    cellStyle = searchSimilarStyle(_styles, {
                        _font: saveFont.fontIndex,
                        _numFormat: saveNumFormat.numFormatIndex,
                        _border: saveBorder.borderIndex,
                        _fill: fill
                    });
                    if (cellStyle) {
                        cellStyle.cellIndices[options.cellIndex] = Object.keys(cellStyle.cellIndices).length;
                        return cellStyle;
                    }
                }

                cellStyle = {
                    _font: saveFont.fontIndex,
                    _numFormat: saveNumFormat.numFormatIndex || false,
                    _border: saveBorder.borderIndex,
                    _fill: fill,
                    cellIndices: {}
                };

                cellStyle.cellIndices[options.cellIndex] = 0;
                cellStyle.index = "" + (parseInt(_styles.styles.length, 10) + 1);
                _styles.styles.push(cellStyle);
                return cellStyle;
            }

            if (options.cellIndices) {
                var cellStyle, index;
                var saveFont = oxmlXlsxFont.getFontForCells(_styles, options);
                var saveNumFormat = oxmlXlsxNumFormat.getNumFormatForCells(_styles, options);
                var saveBorder = oxmlXlsxBorder.getBorderForCells(_styles, options);
                newStyleCreated = newStyleCreated || saveFont.newStyleCreated || saveNumFormat.newStyleCreated || saveBorder.newStyleCreated;
                if (!newStyleCreated) {
                    cellStyle = searchSimilarStyle(_styles, {
                        _font: saveFont.fontIndex,
                        _numFormat: saveNumFormat.numFormatIndex,
                        _border: saveBorder.borderIndex,
                        _fill: fill
                    });

                    if (cellStyle) {
                        for (index = 0; index < options.cellIndices.length; index++) {
                            var cellIndex = options.cellIndices[index];
                            var savedCellStyle = searchStyleForCell(_styles, cellIndex);
                            delete savedCellStyle.cellIndices[cellIndex];
                            cellStyle.cellIndices[cellIndex] = Object.keys(cellStyle.cellIndices).length;
                        }
                        return cellStyle;
                    }
                }
                // Maintain old styling
                
                cellStyle = {
                    _font: saveFont.fontIndex,
                    _numFormat: saveNumFormat.numFormatIndex,
                    _border: saveBorder.borderIndex,
                    _fill: fill,
                    cellIndices: {}
                };
                
                for (index = 0; index < options.cellIndices.length; index++) {
                    var cellIndex = options.cellIndices[index];
                    var savedCellStyle = searchStyleForCell(_styles, cellIndex);
                    if (savedCellStyle) {
                        delete savedCellStyle.cellIndices[cellIndex];
                    }
                    cellStyle.cellIndices[cellIndex] = Object.keys(cellStyle.cellIndices).length;
                    if(savedCellStyle && !Object.keys(savedCellStyle.cellIndices).length){
                        for(key in cellStyle){
                            savedCellStyle[key] = cellStyle[key];
                        }
                        return savedCellStyle;
                    }
                }
                cellStyle.index = "" + (parseInt(_styles.styles.length, 10) + 1);
                _styles.styles.push(cellStyle);
                return cellStyle;
            }
        }
    };

    return {
        createStyle: function (_workbook, _rel, _contentType) {
            var sheetId = createStyleParts(_workbook, _rel, _contentType);
            var _styles = {
                sheetId: sheetId,
                fileName: "style" + sheetId + ".xml",
                styles: [],
                _fonts: {},
                _borders: {},
                _fills: {},
                _fontsCount: 1,
                _bordersCount: 1,
                _fillsCount: 1
            };
            var font = {
                bold: false,
                italic: false,
                underline: false,
                size: false,
                color: false,
                strike: false,
                family: false,
                name: false,
                scheme: false
            };
            _styles._fonts[JSON.stringify(font, Object.keys(font).sort())] = 0;
            _styles._borders[false] = 0;
            _styles._fills[false] = 0;
            return {
                _styles: _styles,
                generateContent: function () {
                    return generateContent(_styles);
                },
                attach: function (file) {
                    attach(file, _styles);
                },
                addStyles: function (options) {
                    return addStyles(options, _styles);
                }
            };
        }
    };
});