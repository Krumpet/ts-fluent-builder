import { createBuilder } from "../src/gradual-builder";
import { Builder } from "../src/types/types";

interface ExampleType {
    typeName: string;
    id: number;
    isBest: boolean;
}

test('create a builder and object from it', () => {
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    const builderAfterNameSet = exampleBuilder.setTypeName("goodbye");
    const finishedSetting = builderAfterNameSet.setId(2).setIsBest(true);

    const isExampleType: ExampleType = finishedSetting.build();

    expect(isExampleType.id).toEqual(2);
});

test('create a builder and build a partial object', () => {
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    const partial: Partial<ExampleType> = exampleBuilder.buildPartial();

    expect(partial.id).toBeUndefined();
    expect(partial.isBest).toBeUndefined();
    expect(partial.typeName).toBeUndefined();
});

test('create a builder and build a partial object (typed)', () => {
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    const builderAfterNameSet = exampleBuilder.setTypeName("hello");
    const partialTyped = builderAfterNameSet.buildPartialTyped();


    expect(partialTyped.typeName).toBe("hello");

    // @ts-expect-error
    expect(partialTyped.id).toBeUndefined();

    // @ts-expect-error
    expect(partialTyped.isBest).toBeUndefined();
});

test('the builder creates a new object on each build invocation', () => {
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    const fullySetBuilder = exampleBuilder.setTypeName("goodbye").setId(2).setIsBest(true);
    const exampleInstance = fullySetBuilder.build();

    expect(exampleInstance.typeName).toBe("goodbye");
    expect(exampleInstance.id).toBe(2);
    expect(exampleInstance.isBest).toBe(true);

    exampleInstance.isBest = false;

    const exampleInstanceAgain = fullySetBuilder.build();

    expect(exampleInstance.isBest).toBe(false);
    expect(exampleInstanceAgain.isBest).toBe(true);
});