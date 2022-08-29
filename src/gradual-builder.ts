import { getType } from "tst-reflect";

type BuilderAux<T, AlreadyBuilt> = Exclude<keyof T, AlreadyBuilt> extends never ? { build(): T } : {
    [K in Exclude<keyof T, AlreadyBuilt> & string as `set${Capitalize<K>}`]: (arg: T[K]) => BuilderAux<T, AlreadyBuilt | K>
}

type shouldBeNever = Exclude<keyof { 'omg': string, 'hello': string }, 'hello' | 'omg'>;

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
        const finishedObject: any = {};
        type.getProperties().forEach(prop => finishedObject[prop.name] = result[prop.name]);
        return finishedObject;
    }

    return builder as any;
}
