type BuilderAux<T, AlreadyBuilt> = Exclude<keyof T, AlreadyBuilt> extends never ? { build(): T } : {
    [K in Exclude<keyof T, AlreadyBuilt> & string as `set${Capitalize<K>}`]: (arg: T[K]) => BuilderAux<T, AlreadyBuilt | K>
}

type shouldBeNever = Exclude<keyof { 'omg': string, 'hello': string }, 'hello' | 'omg'>;

export type Builder<T> = BuilderAux<T, never>;

// TODO: initialize with the values from the argument?
// TODO: what about optional props that might not be set on the original object?
export function createBuilder<T>(obj: T): Builder<T> {
    const result: Record<string, unknown> = {};
    const builder: Record<string, Function> = {};
    Object.getOwnPropertyNames(obj).forEach(prop => {
        builder["set" + prop.charAt(0).toUpperCase() + prop.slice(1)] = function (arg: any) { result[prop] = arg; return builder; }
    });
    builder["build"] = () => {
        const finishedObject: any = {};
        Object.getOwnPropertyNames(obj).forEach(prop => finishedObject[prop] = result[prop]);
        return finishedObject;
    }

    return builder as any;
}
