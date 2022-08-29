import { getType } from "tst-reflect";

type BuilderAux<T, AlreadyBuilt> = Exclude<keyof T, AlreadyBuilt> extends never ? { build(): T } : {
    [K in Exclude<keyof T, AlreadyBuilt> & string as `set${Capitalize<K>}`]: (arg: T[K]) => BuilderAux<T, AlreadyBuilt | K>
}

// Taken from https://stackoverflow.com/a/52991061/6338059
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

type RequiredLiteralKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never :
    {} extends Pick<T, K> ? never : K]: 0 }

type OptionalLiteralKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never :
    {} extends Pick<T, K> ? K : never]: 0 }

type IndexKeys<T> = string extends keyof T ? string : number extends keyof T ? number : never;

export type Builder<T> = BuilderAux<T, never>;

// TODO: initialize with the values from the argument?
// TODO: what about optional props that might not be set on the original object?
export function createBuilder<T>(): Builder<T> {
    const result: Record<string, unknown> = {};
    const builder: Record<string, Function> = {};
    const type = getType<T>();
    
    type.getProperties().forEach(prop => {
        builder["set" + prop.name.charAt(0).toUpperCase() + prop.name.slice(1)] = function (arg: any) { result[prop.name] = arg; return builder; }
    });
    builder["build"] = () => {
        // TODO: create new copy?
        return result;
        // const finishedObject: any = {};
        // type.getProperties().forEach(prop => finishedObject[prop.name] = result[prop.name]);
        // return finishedObject;
    }

    return builder as any;
}
