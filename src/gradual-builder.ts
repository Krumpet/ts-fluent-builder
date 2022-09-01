import { getType } from "tst-reflect";
import { METHOD_NAMES } from "./consts/consts";
import { Builder } from "./types/types";

export function createBuilder<T>(): Builder<T> {
    const result: Record<string, unknown> = {};
    const builder: Record<string, Function> = {};
    const type = getType<T>();
    
    type.getProperties().forEach(prop => {
        builder["set" + prop.name.charAt(0).toUpperCase() + prop.name.slice(1)] = (arg: any) => { result[prop.name] = arg; return builder; }
    });

    builder[METHOD_NAMES.BUILD] = () => {
        return copyObject(result);
    }

    function copyObject(source: Record<string, unknown>) {
        const finishedObject: any = {};
        Object.getOwnPropertyNames(source).forEach(prop => finishedObject[prop] = source[prop]);
        return finishedObject;
    }

    builder[METHOD_NAMES.BUILD_PARTIAL] = () => {
        return copyObject(result);
    }
    
    builder[METHOD_NAMES.BUILD_PARTIAL_TYPED] = () => {
        return copyObject(result);
    }

    return builder as any;
}
