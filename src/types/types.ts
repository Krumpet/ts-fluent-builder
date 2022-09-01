import { METHOD_NAMES } from "../consts/consts";

type BuilderWhenAllRequiredFieldsExist<T, AlreadyBuilt extends keyof T> = Exclude<RequiredLiteralKeys<T>, AlreadyBuilt> extends never ? { [METHOD_NAMES.BUILD](): T } : {}

type PartialBuilder<T, AlreadyBuilt extends keyof T> = {[METHOD_NAMES.BUILD_PARTIAL](): Partial<T>; [METHOD_NAMES.BUILD_PARTIAL_TYPED](): Pick<T, AlreadyBuilt>}

type SettersForEachProperty<T, AlreadyBuilt extends keyof T> = {
    [K in Exclude<keyof T, AlreadyBuilt> & string as `set${Capitalize<K>}`]: (arg: T[K]) => BuilderAux<T, AlreadyBuilt | K>
}

type BuilderAux<T, AlreadyBuilt extends keyof T> = SettersForEachProperty<T, AlreadyBuilt> & BuilderWhenAllRequiredFieldsExist<T, AlreadyBuilt> & PartialBuilder<T, AlreadyBuilt>;

// Taken from https://stackoverflow.com/a/52991061/6338059
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

type RequiredLiteralKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never :
    {} extends Pick<T, K> ? never : K]: 0 }

type OptionalLiteralKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never :
    {} extends Pick<T, K> ? K : never]: 0 }

type IndexKeys<T> = string extends keyof T ? string : number extends keyof T ? number : never;

export type Builder<T> = BuilderAux<T, never>;