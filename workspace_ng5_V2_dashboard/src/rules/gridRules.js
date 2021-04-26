function LineRules(value) {
    var getRuleErrorObject = function (state, m, errorString, skipColumn, message) {
        var error = translateLocalization.instant('P2P_SC_Line') + ' ' + m.dataModel.LineNumber + " : " + (skipColumn ? '' : (m.ui.errorFieldDisplayName + " ")) + errorString;
        if (!m.dataModel.LineNumber) {
            error = translateLocalization.instant('P2P_SC_Line') + ' ' + m.dataModel.LineNumber + " : " + "TAG " + (m.dataModel._indexId + 1) + ' : ' + m.ui.errorFieldDisplayName + " " + errorString;
        }
        return {
            state: state,
            error: error,
            row: m.dataModel,
            col: m.ui,
            rowColIndex: m.dataModel.LineNumber + '_' + m.ui.field,
            index: m.index,
            message: message
        };
    };
    var getPrevDate = function (value) {
        var dateOffset = (24 * 60 * 60 * 1000) * value; //5 days
        var myDate = new Date();
        var pastDate = new Date(myDate.setTime(myDate.getTime() - dateOffset));
        //---Convert Date into DD/MM/YYYY
        var pastFormattedDate = (pastDate.getMonth() + 1) + "/" + (pastDate.getDate()) + "/" + pastDate.getFullYear();
        return new Date(pastFormattedDate);
    };


    var selectedDate = function (m, dateVar, isvalid) {
        if (isvalid == true) {
            var newdate = new Date(dateVar);
            var dd = new Date((newdate.getMonth() + 1) + "/" + (newdate.getDate()) + "/" + newdate.getFullYear());
            return dd;
        } else {

            if (typeof dateVar != 'undefined' && dateVar != null && isNaN(dateVar) && dateVar.indexOf('/Date(') > -1) {
                var res = dateVar.replace("/Date(", "");
                var datestring = res.replace(")/", "");
                var newdate = new Date(parseInt(datestring));
                //return new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate());
                var selectedFormattedDate = (newdate.getMonth() + 1) + "/" + (newdate.getDate()) + "/" + newdate.getFullYear();
                return new Date(selectedFormattedDate);
            }
            else if (typeof dateVar != 'undefined' && dateVar != null && !isNaN(dateVar) && angular.isFunction(dateVar.getFullYear)) {

                var newdate = new Date(dateVar);
                //return new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate());
                var selectedFormattedDate = (newdate.getMonth() + 1) + "/" + (newdate.getDate()) + "/" + newdate.getFullYear();
                return new Date(selectedFormattedDate);
            }
            else {
                if (m.dataModel.IsFinalizedClick == true) {
                    var newdate = new Date(dateVar);
                    var selectedFormattedDate = (newdate.getMonth() + 1) + "/" + (newdate.getDate()) + "/" + newdate.getFullYear();
                    var selecteddate = new Date(selectedFormattedDate);
                    var actualDate = selecteddate.setDate(selecteddate.getDate() - 1);
                    var formattedDate = new Date(actualDate);
                    return formattedDate;

                } else {
                    var newdate = dateVar.toString();
                    var dateparse = newdate.substr(0, 10);
                    var formatdd = dateparse.split('-').join('/');
                    return new Date(formatdd);
                }
            }
        }
    };
    var translateLocalization = value.translateService;
    var isObject = function (value) {
        return typeof value == 'object' && value instanceof Object;
    }
    var isUndefinedOrEmptyOrNull = function (value) {
        if (value) {
            return false;
        }
        else {
            return true;
        }
    }
    var isDefined = function (value) {
        return typeof value == 'object' && value instanceof Object;
    }

    var isNumber = function (value) {
        return typeof value == 'number';
    }
    var isString = function (value) {
        return typeof value == 'string';
    }
    //var commonSetting = setting.CommonSettings;
    return {
        get: function (m) {
            var m = JSON.parse(JSON.stringify(m))
            m.source = { "hosted": 2, "punchout": 3, "internal": 5, "hostedandItemmaster": 8 };
            m.itemType = { "material": 1, "fixed": 2, "variable": 3 };
            m.currentDate = new Date();
            var states = ['invalid', 'disable', 'empty'];
            function _isEmptyOrNull() {
                var field = m.ui.field.split('.');
                if (field.length > 1) {
                    var firstRes = eval('m.dataModel.' + field[0]);
                    if (firstRes !== undefined && firstRes !== null) {
                        var result = eval('m.dataModel.' + m.ui.field);
                        return (result == '' ? null : result);
                    }
                }
                else {
                    var result = eval('m.dataModel.' + m.ui.field);

                    if (result !== undefined && result !== null && result != '') {
                        if (m.ui.uiType == "textfield") {
                            result = result.trim();
                        }

                        return (result == '' ? null : result);
                    }
                    else {
                        return null;
                    }
                }
            }
            return {
                emptyCheck: {
                    condition: function () {
                        if (m.dataModel.ItemExtendedType == 1 && m.ui.field == "ConsumedDate") {
                            return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m.dataModel.ConsumedDate));
                        }
                        else if (m.dataModel.ItemExtendedType != 1 && m.ui.field == "StartDate" && m.dataModel.ChildLines && m.dataModel.ChildLines.length == 0) {
                            return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m.dataModel.StartDate));
                        }
                        else if (m.dataModel.ItemExtendedType != 1 && m.ui.field == "EndDate" && m.dataModel.ChildLines && m.dataModel.ChildLines.length == 0) {
                            return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m.dataModel.EndDate));
                        }
                        else {
                            if (m.ui.field != "ConsumedDate" && m.ui.field != "StartDate" && m.ui.field != "EndDate")
                                return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m));        //&& m.dataModel.ItemLevel == undefined            
                        }
                    },
                    result: function () {

                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_FieldShouldNotBeBlank"));
                    }
                },
                invalidDate: {
                    condition: function () {
                        if (m.dataModel.EndDate < m.dataModel.StartDate) {
                            return true;
                        }
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_InvalidDate"), undefined, "invalidDate");
                    }
                },
                startCurrentDate: {
                    condition: function () {
                        if (m.dataModel.ItemExtendedType == 1 && m.ui.field == "ConsumedDate") {
                            if (m.dataModel.ConsumedDate && new Date(m.dataModel.ConsumedDate) > new Date()) {
                                return true;
                            }
                        }
                        else if (m.dataModel.ItemExtendedType != 1 && m.ui.field == "StartDate") {
                            if (new Date(m.dataModel.StartDate) > new Date()) {
                                return true;
                            }
                        }
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_startCurrentDate"), undefined, "startCurrentDate");
                    }
                },
                endCurrentDate: {
                    condition: function () {
                        if (new Date(m.dataModel.EndDate) > new Date()) {
                            return true;
                        }
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_endCurrentDate"), undefined, "endCurrentDate");
                    }
                },
                afterContractExpiry: {
                    condition: function () {
                        if (m.dataModel.IsContracted) {
                            if (m.dataModel.ItemExtendedType == 1 && m.ui.field == "ConsumedDate") {
                                if (m.dataModel.ConsumedDate && new Date(m.dataModel.ConsumedDate) > new Date(m.dataModel.ContractEndDate)) {
                                    return true;
                                }
                            }
                            else if (m.dataModel.ItemExtendedType != 1 && (m.ui.field == "StartDate" || m.ui.field == "EndDate")) {
                                if ((new Date(m.dataModel.StartDate) > new Date(m.dataModel.ContractEndDate)) || (new Date(m.dataModel.EndDate) > new Date(m.dataModel.ContractEndDate))) {
                                    return true;
                                }
                            }
                        }
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_contractExpiry"), undefined, "afterContractExpiry");
                    }
                },
                beforeContractExpiry: {
                    condition: function () {
                        if (m.dataModel.IsContracted) {
                            if (m.dataModel.ItemExtendedType == 1 && m.ui.field == "ConsumedDate") {
                                if (m.dataModel.ConsumedDate && new Date(m.dataModel.ConsumedDate) < new Date(m.dataModel.ContractStartDate)) {
                                    return true;
                                }
                            }
                            else if (m.dataModel.ItemExtendedType != 1 && (m.ui.field == "StartDate" || m.ui.field == "EndDate")) {
                                if ((new Date(m.dataModel.StartDate) < new Date(m.dataModel.ContractStartDate)) || (new Date(m.dataModel.EndDate) < new Date(m.dataModel.ContractStartDate))) {
                                    return true;
                                }
                            }
                        }
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_beforeContractExpiry"), undefined, "beforeContractExpiry");
                    }
                },
                splitEntityEmptyCheck: {
                    condition: function () {
                        return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m)) && m.dataModel.ItemLevel == undefined;
                    },
                    result: function () {
                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_FieldShouldNotBeBlank"));
                    }
                },
                materialCheckDisable: {
                    condition: function () {
                        return isObject(m.dataModel) && m.dataModel.ItemExtendedType == m.itemType.material   //  material disabled check
                    },
                    result: function () {
                        return getRuleErrorObject(states[1], m, "");
                    }
                },
                uomemptyCheck: {
                    condition: function () {
                        return isObject(m.dataModel) && m.ui.field.split('.')[0] == 'UOM' && eval('m.dataModel.' + m.ui.field).Value == ''
                    },
                    result: function () {

                        return getRuleErrorObject(states[0], m, translateLocalization.instant("P2P_SC_FieldShouldNotBeBlank"));
                    }
                },
            };
        }
    };
};