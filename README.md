# ts-fluent-builder
## a strictly-typed builder generator for typescript types

A fluent builder allows chaining calls to the methods that set properties:

```typescript
interface ExampleType {
    typeName: string;
    id: number;
    isBest: boolean;
}

const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
const finishedObject = exampleBuilder.setTypeName("goodbye").setId(2).setIsBest(true).build();
```

The builder API usually allows for multiple calls to the same setter method, as well as calling the `build()` method before all required properties have been set, resulting in a runtime error.

We can leverage typescript's type system to produce a builder type that:
* Only allows setting each property once
* Only allows calling `build()` once every required property has been set

```typescript
const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
exampleBuilder.build();
              ~~~~~~~~
// Property 'build' does not exist on type 'Builder<ExampleType>'.

exampleBuilder.setId(2).setId(1);
                       ~~~~~~~~~
// Property 'setId' does not exist on type 'BuilderAux<ExampleType, "id">'
```

We can also create partial objects, either with a loose `Partial<T>` type or with a stricter type that tracks which properties have already been set.

**Partial object:**
```typescript
const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
const partial: Partial<ExampleType> = exampleBuilder.buildPartial();
```

**Partial object with stricter typing:**
```typescript
const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
const builderAfterNameSet = exampleBuilder.setTypeName("hello");
const partialTyped: Pick<ExampleType, "typeName"> = builderAfterNameSet.buildPartialTyped();
```