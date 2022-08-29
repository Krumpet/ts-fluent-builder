import { Builder, createBuilder } from "../src/gradual-builder";

test('create a builder and object from it', () => {
    interface ExampleType {
        typeName: string;
        id: number;
        isBest: boolean;
    }
    
    const exampleBuilder: Builder<ExampleType> = createBuilder<ExampleType>();
    
    const builderAfterNameSet = exampleBuilder.setTypeName("goodbye");
    
    const finishedSetting = builderAfterNameSet.setId(2).setIsBest(true);
    
    const isExampleType: ExampleType = finishedSetting.build();
    
    expect(isExampleType.id).toEqual(2);
})