import { IWidgetsConfig, WidgetTypesEnum, IWidgetsCollection } from '../../smart-core-types';
import * as _ from 'lodash';

export function mergeConfigs(baseConfig: IWidgetsConfig, clientConfig: IWidgetsConfig): IWidgetsConfig {
    if (!baseConfig) {
        return null;
    }
    if (!clientConfig) {
        return baseConfig;
    }

    let mergedConfig: any = {};
    // By default, baseConfig.widget is not null
    mergedConfig = _.merge({}, baseConfig, clientConfig);
    mergedConfig.widgets = clientConfig.widgets ? mergeWidgets(baseConfig.widgets, clientConfig.widgets) : baseConfig.widgets;

    return mergedConfig;
}

function mergeWidgets(baseWs: IWidgetsCollection, clientWs: IWidgetsCollection) {
    const mergedWidgets = _.cloneDeep(baseWs);
    for (let i = 0; i < clientWs.length; i++) {
        const cw = clientWs[i];
        const bw = baseWs.find(x => x.widgetId === cw.widgetId);

        if (cw.isClientEnabled !== undefined && cw.isClientEnabled === false) {
            if (bw) {
                mergedWidgets.splice(mergedWidgets.findIndex(w => w.widgetId === bw.widgetId), 1);
                continue;
            } else {
                try {
                    throw new Error(`Client Widget is disabled and no corresponding Base Widget found. Client Widget: ${cw}`)
                }
                catch (e) {
                    console.log(e.name, e.message);
                }
            }
            continue;
        }

        if (bw) {
            let mergedWidget: any = {};
            // By default, baseChildren is not null
            mergedWidget = _.merge({}, bw, cw);
            mergedWidget.children = cw.children ? mergeChildren(bw.children, cw.children, cw.type) : bw.children;
            if (mergedWidget.isClientEnabled === undefined) {
                mergedWidget.isClientEnabled = true;
            }
            mergedWidgets.splice(mergedWidgets.findIndex(w => w.widgetId === mergedWidget.widgetId), 1, mergedWidget);
        } else {
            if (cw.isClientEnabled === undefined) {
                cw.isClientEnabled = true;
            }
            mergedWidgets.push(cw);
        }
    }
    return mergedWidgets;
}

function mergeChildren(bChildren: any[], cChildren: any[], clientWidgetType: string): any[] {
    if (cChildren && cChildren.length === 0) {
        return [];
    }
    const mergedChildren = _.cloneDeep(bChildren);
    for (let i = 0; i < cChildren.length; i++) {
        const cChild = cChildren[i];
        const bChild = bChildren.find(x => x.fieldId === cChild.fieldId);
        if (cChild.isClientEnabled !== undefined && cChild.isClientEnabled === false) {
            if (bChild) {
                mergedChildren.splice(mergedChildren.findIndex(c => c.fieldId === bChild.fieldId), 1);
                continue;
            } else {
                try {
                    throw new Error(`Client Child is disabled and no corresponding Base Widget found. Client Child: ${cChild}`)
                }
                catch (e) {
                    console.log(e.name, e.message);
                }
            }
            continue;
        }
        if (bChild) {
            let mergedChild: any = {};
            switch (clientWidgetType) {
                case WidgetTypesEnum.Custom:
                    mergedChild = cChild;
                    break;
                case WidgetTypesEnum.Standard:
                    mergedChild = mergeChild(bChild, cChild)
                    break;
                default:
                    mergedChild = cChild;
                    break;
            }
            // mandatory add isClientEnabled
            if (mergedChild.isClientEnabled === undefined) {
                mergedChild.isClientEnabled = true;
            }
            mergedChildren.splice(mergedChildren.findIndex(c => c.fieldId === mergedChild.fieldId), 1, mergedChild);
        } else {
            // corresponding bChild does not exist, then push cChild into array.
            if (cChild.isClientEnabled === undefined) {
                cChild.isClientEnabled = true;
            }
            mergedChildren.push(cChild);
        }
    }
    return mergedChildren;
}

function mergeChild(bChild: any, cChild: any) {
    // handle field(child) -> [some property] -> isClientEnabled, define an array for this level isClientEnabled
    const isClientEnabledArr = ['IButtonConfig', 'showLookup'];
    const removeArr = [];
    isClientEnabledArr.forEach(prop => {
        if (cChild[prop] && cChild[prop].isClientEnabled === false) {
            removeArr.push(prop);
        };
    });
    removeArr.forEach(prop => {
        // sometimes showLookup in bChild could be undefined. so just remove the prop whatsoever
        delete bChild[prop];
        delete cChild[prop];
    });

    // for all array props in child, change function from merging to replacing: replace with client child
    return _.mergeWith({}, bChild, cChild, (objValue, srcValue) => {
        if (_.isArray(srcValue)) {
            return srcValue;
        }
    });
}

export function stringify(obj, prop) {
    var placeholder = '____PLACEHOLDER____';
    var fns = [];
    var json = JSON.stringify(obj, function(key, value) {
      if (typeof value === 'function') {
        fns.push(value);
        return placeholder;
      }
      return value;
    }, 1);
    json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
      return fns.shift();
    });
    return `var ${prop} =` + json;
};
