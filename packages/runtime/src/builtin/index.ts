import {Character} from "../types";

export * from "./abs";
export * from "./boolc";
export * from "./ceil";
export * from "./concat_lines_of";
export * from "./condense";
export * from "./contains";
export * from "./cos";
export * from "./count_any_of";
export * from "./count";
export * from "./escape";
export * from "./find";
export * from "./floor";
export * from "./frac";
export * from "./insert";
export * from "./ipow";
export * from "./lines";
export * from "./match";
export * from "./matches";
export * from "./nmax";
export * from "./nmin";
export * from "./numofchar";
export * from "./repeat";
export * from "./replace";
export * from "./reverse";
export * from "./round";
export * from "./segment";
export * from "./shift_left";
export * from "./sign";
export * from "./sin";
export * from "./sqrt";
export * from "./strlen";
export * from "./substring_after";
export * from "./substring_before";
export * from "./substring";
export * from "./sy";
export * from "./tan";
export * from "./to_lower";
export * from "./to_mixed";
export * from "./to_upper";
export * from "./translate";
export * from "./trunc";
export * from "./xstrlen";
export const abap_true = new Character(1, {qualifiedName: "ABAP_BOOL", ddicName: "ABAP_BOOL"}).set("X").setConstant();
export const abap_false = new Character(1, {qualifiedName: "ABAP_BOOL", ddicName: "ABAP_BOOL"}).set("").setConstant();
export const abap_undefined = new Character(1, {qualifiedName: "ABAP_BOOL", ddicName: "ABAP_BOOL"}).set("-").setConstant();
export const space = new Character(1, {qualifiedName: "ABAP_BOOL", ddicName: "ABAP_BOOL"}).set(" ").setConstant();
