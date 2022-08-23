// To parse this data:
//
//   import { Convert, SearchLocationResponse } from "./file";
//
//   const searchLocationResponse = Convert.toSearchLocationResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface SearchLocationResponse {
    Headline:       Headline;
    DailyForecasts: DailyForecast[];
}

export interface DailyForecast {
    Date:        Date;
    EpochDate:   number;
    Temperature: Temperature;
    Day:         Day;
    Night:       Day;
    Sources:     string[];
    MobileLink:  string;
    Link:        string;
}

export interface Day {
    Icon:             number;
    IconPhrase:       string;
    HasPrecipitation: boolean;
}

export interface Temperature {
    Minimum: Imum;
    Maximum: Imum;
}

export interface Imum {
    Value:    number;
    Unit:     Unit;
    UnitType: number;
}

export enum Unit {
    F = "F",
}

export interface Headline {
    EffectiveDate:      Date;
    EffectiveEpochDate: number;
    Severity:           number;
    Text:               string;
    Category:           string;
    EndDate:            Date;
    EndEpochDate:       number;
    MobileLink:         string;
    Link:               string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toSearchLocationResponse(json: string): SearchLocationResponse {
        return cast(JSON.parse(json), r("SearchLocationResponse"));
    }

    public static searchLocationResponseToJson(value: SearchLocationResponse): string {
        return JSON.stringify(uncast(value, r("SearchLocationResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "SearchLocationResponse": o([
        { json: "Headline", js: "Headline", typ: r("Headline") },
        { json: "DailyForecasts", js: "DailyForecasts", typ: a(r("DailyForecast")) },
    ], false),
    "DailyForecast": o([
        { json: "Date", js: "Date", typ: Date },
        { json: "EpochDate", js: "EpochDate", typ: 0 },
        { json: "Temperature", js: "Temperature", typ: r("Temperature") },
        { json: "Day", js: "Day", typ: r("Day") },
        { json: "Night", js: "Night", typ: r("Day") },
        { json: "Sources", js: "Sources", typ: a("") },
        { json: "MobileLink", js: "MobileLink", typ: "" },
        { json: "Link", js: "Link", typ: "" },
    ], false),
    "Day": o([
        { json: "Icon", js: "Icon", typ: 0 },
        { json: "IconPhrase", js: "IconPhrase", typ: "" },
        { json: "HasPrecipitation", js: "HasPrecipitation", typ: true },
    ], false),
    "Temperature": o([
        { json: "Minimum", js: "Minimum", typ: r("Imum") },
        { json: "Maximum", js: "Maximum", typ: r("Imum") },
    ], false),
    "Imum": o([
        { json: "Value", js: "Value", typ: 0 },
        { json: "Unit", js: "Unit", typ: r("Unit") },
        { json: "UnitType", js: "UnitType", typ: 0 },
    ], false),
    "Headline": o([
        { json: "EffectiveDate", js: "EffectiveDate", typ: Date },
        { json: "EffectiveEpochDate", js: "EffectiveEpochDate", typ: 0 },
        { json: "Severity", js: "Severity", typ: 0 },
        { json: "Text", js: "Text", typ: "" },
        { json: "Category", js: "Category", typ: "" },
        { json: "EndDate", js: "EndDate", typ: Date },
        { json: "EndEpochDate", js: "EndEpochDate", typ: 0 },
        { json: "MobileLink", js: "MobileLink", typ: "" },
        { json: "Link", js: "Link", typ: "" },
    ], false),
    "Unit": [
        "F",
    ],
};
