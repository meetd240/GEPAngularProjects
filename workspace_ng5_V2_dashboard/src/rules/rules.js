
function HeaderLevelRules(value) {
    var getSCHeaderLevelRuleErrorObject = function (m, rule, errorString) {
        return {
            error: errorString,
            section: m.ui.section,
            uiConfig: m.ui.property,
            rule: rule,
            type: "nool"
        };
    };

    function dateConvertor(value) {
        if (value != "") {
            if (value.indexOf("Date(") > -1) {
                var re = /-?\d+/;
                var rex = re.exec(value);
                return new Date(1 * rex[0])
            }
            else if (value.indexOf("T")) {
                return new Date(value)
            }
        }
        return new Date()
    }

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

    return {
        get: function (m) {
            var m = JSON.parse(JSON.stringify(m))
            m.itemType = { "material": 1, "fixed": 2, "variable": 3 };
            var states = ['invalid', 'disable', 'empty'];
            function _isEmptyOrNull() {
                var field = m.ui.property.data;
                if (field.length > 1) {
                    var firstRes = eval('m.dataModel.' + field);
                    if (firstRes !== undefined && firstRes !== null && firstRes != '') {
                        var result = eval('m.dataModel.' + field);
                        return (result.trim() == '' ? null : result);
                    } else if (firstRes == '') {
                        return true;
                    }
                }
                else {
                    var result = eval('m.dataModel.' + m.ui.field);
                    return (result == '' ? null : result);
                }
            }
            return {
                emptyCheck: {
                    condition: function () {
                        return isObject(m.dataModel) && isUndefinedOrEmptyOrNull(_isEmptyOrNull(m));        //&& m.dataModel.ItemLevel == undefined            
                    },
                    result: function () {

                        return getSCHeaderLevelRuleErrorObject(m, states[0], translateLocalization.instant("P2P_SC_FieldShouldNotBeBlank"));
                    }
                },

                receivedDateAndCreatedDateValidation: {
                    condition: function () {
                        if (m.dataModel && m.dataModel._documentSetting && m.dataModel.InvoiceData.isSupplier == false && m.dataModel._documentSetting.IsReceivedOnDateIndependent == false && typeof m.dataModel.InvoiceData && m.dataModel.InvoiceData.createdOn && m.dataModel.InvoiceData.receivedDate) {

                            var createdDate = dateConvertor(m.dataModel.InvoiceData.createdOn);
                            var receiveDate = dateConvertor(m.dataModel.InvoiceData.receivedDate);

                            if (createdDate.getFullYear() < receiveDate.getFullYear())
                                return true;
                            else {
                                if (createdDate.getFullYear() == receiveDate.getFullYear() && createdDate.getMonth() < receiveDate.getMonth())
                                    return true;
                                else {
                                    if (createdDate.getFullYear() == receiveDate.getFullYear() && createdDate.getMonth() == receiveDate.getMonth() && createdDate.getDate() < receiveDate.getDate())
                                        return true;
                                }
                            }
                        }
                    },
                    result: function () {
                        return getSCHeaderLevelRuleErrorObject(m, "receivedDateAndCreatedDateValidation", "P2P_INV_ERR_CreationDateAndReceivedDate");
                    }
                }
            };
        }
    };
};

