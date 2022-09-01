import { createBuilder } from "../src/gradual-builder";
import { Builder } from "../src/types/types";

test('create a builder and object from it', () => {
    interface ExampleType {
        typeName: string;
        id: number;
        isBest: boolean;
    }
    
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    
    const builderAfterNameSet = exampleBuilder.setTypeName("goodbye");

    // TODO: move to new test
    const partial = exampleBuilder.buildPartial();

    const partialTyped = builderAfterNameSet.buildPartialTyped();
    partialTyped.typeName;
    
    const finishedSetting = builderAfterNameSet.setId(2).setIsBest(true);
    
    const isExampleType: ExampleType = finishedSetting.build();
    
    expect(isExampleType.id).toEqual(2);
})