import { cache } from "decorator-cache-getter";
import { raise } from "../../utils/console";
import { NonNullNativeStruct } from "../../utils/native-struct";
import { cacheInstances, getOrNull, makeArrayFromNativeIterator, memoize } from "../../utils/utils";
import { levenshtein } from "../decorators";
import { readGString } from "../utils";

/** Represents a `Il2CppClass`. */
@cacheInstances
class Il2CppClass extends NonNullNativeStruct {
    /** Gets the actual size of the instance of the current class. */
    @cache
    get actualInstanceSize(): number {
        return Il2Cpp.Api._classGetActualInstanceSize(this);
    }

    /** Gets the array class which encompass the current class. */
    @cache
    get arrayClass(): Il2Cpp.Class {
        return new Il2Cpp.Class(Il2Cpp.Api._classGetArrayClass(this, 1));
    }

    /** Gets the size of the object encompassed by the current array class. */
    @cache
    get arrayElementSize(): number {
        return Il2Cpp.Api._classGetArrayElementSize(this);
    }

    /** Gets the name of the assembly in which the current class is defined. */
    @cache
    get assemblyName(): string {
        return Il2Cpp.Api._classGetAssemblyName(this).readUtf8String()!;
    }

    /** Gets the class that declares the current nested class. */
    @cache
    get declaringClass(): Il2Cpp.Class | null {
        return getOrNull(Il2Cpp.Api._classGetDeclaringType(this), Il2Cpp.Class);
    }

    /** Gets the encompassed type of this array, reference, pointer or enum type. */
    @cache
    get baseType(): Il2Cpp.Type | null {
        return getOrNull(Il2Cpp.Api._classGetBaseType(this), Il2Cpp.Type);
    }

    /** Gets the class of the object encompassed or referred to by the current array, pointer or reference class. */
    @cache
    get elementClass(): Il2Cpp.Class | null {
        return getOrNull(Il2Cpp.Api._classGetElementClass(this), Il2Cpp.Class);
    }

    /** Gets the amount of the fields of the current class. */
    @cache
    get fieldCount(): UInt64 {
        return Il2Cpp.Api._classGetFieldCount(this);
    }

    /** Gets the fields of the current class. */
    @cache
    get fields(): Il2Cpp.Field[] {
        return makeArrayFromNativeIterator(this, Il2Cpp.Api._classGetFields, Il2Cpp.Field);
    }

    /** Gets the flags of the current class. */
    @cache
    get flags(): number {
        return Il2Cpp.Api._classGetFlags(this);
    }

    /** Gets the amount of generic parameters of this generic class. */
    @cache
    get genericParameterCount(): number {
        if (!this.isGeneric) {
            return 0;
        }

        return this.type.object.method<Il2Cpp.Array, []>("GetGenericArguments").invoke().length;
    }

    /** Determines whether the GC has tracking references to the current class instances. */
    @cache
    get hasReferences(): boolean {
        return !!Il2Cpp.Api._classHasReferences(this);
    }

    /** Determines whether ther current class has a valid static constructor. */
    @cache
    get hasStaticConstructor(): boolean {
        const staticConstructor = this.tryMethod(".cctor");
        return staticConstructor != null && !staticConstructor.virtualAddress.isNull();
    }

    /** Gets the image in which the current class is defined. */
    @cache
    get image(): Il2Cpp.Image {
        return new Il2Cpp.Image(Il2Cpp.Api._classGetImage(this));
    }

    /** Gets the size of the instance of the current class. */
    @cache
    get instanceSize(): number {
        return Il2Cpp.Api._classGetInstanceSize(this);
    }

    /** Determines whether the current class is abstract. */
    @cache
    get isAbstract(): boolean {
        return !!Il2Cpp.Api._classIsAbstract(this);
    }

    /** Determines whether the current class is blittable. */
    @cache
    get isBlittable(): boolean {
        return !!Il2Cpp.Api._classIsBlittable(this);
    }

    /** Determines whether the current class is an enumeration. */
    @cache
    get isEnum(): boolean {
        return !!Il2Cpp.Api._classIsEnum(this);
    }

    /** Determines whether the current class is a generic one. */
    @cache
    get isGeneric(): boolean {
        return !!Il2Cpp.Api._classIsGeneric(this);
    }

    /** Determines whether the current class is inflated. */
    @cache
    get isInflated(): boolean {
        return !!Il2Cpp.Api._classIsInflated(this);
    }

    /** Determines whether the current class is an interface. */
    @cache
    get isInterface(): boolean {
        return !!Il2Cpp.Api._classIsInterface(this);
    }

    /** Determines whether the current class is a value type. */
    @cache
    get isValueType(): boolean {
        return !!Il2Cpp.Api._classIsValueType(this);
    }

    /** Gets the amount of the implemented or inherited interfaces by the current class. */
    @cache
    get interfaceCount(): number {
        return Il2Cpp.Api._classGetInterfaceCount(this);
    }

    /** Gets the interfaces implemented or inherited by the current class. */
    @cache
    get interfaces(): Il2Cpp.Class[] {
        return makeArrayFromNativeIterator(this, Il2Cpp.Api._classGetInterfaces, Il2Cpp.Class);
    }

    /** Gets the amount of the implemented methods by the current class. */
    @cache
    get methodCount(): number {
        return Il2Cpp.Api._classGetMethodCount(this);
    }

    /** Gets the methods implemented by the current class. */
    @cache
    get methods(): Il2Cpp.Method[] {
        return makeArrayFromNativeIterator(this, Il2Cpp.Api._classGetMethods, Il2Cpp.Method);
    }

    /** Gets the name of the current class. */
    @cache
    get name(): string {
        return Il2Cpp.Api._classGetName(this).readUtf8String()!;
    }

    /** Gets the namespace of the current class. */
    @cache
    get namespace(): string {
        return Il2Cpp.Api._classGetNamespace(this).readUtf8String()!;
    }

    /** Gets the classes nested inside the current class. */
    @cache
    get nestedClasses(): Il2Cpp.Class[] {
        return makeArrayFromNativeIterator(this, Il2Cpp.Api._classGetNestedClasses, Il2Cpp.Class);
    }

    /** Gets the class from which the current class directly inherits. */
    @cache
    get parent(): Il2Cpp.Class | null {
        return getOrNull(Il2Cpp.Api._classGetParent(this), Il2Cpp.Class);
    }

    /** Gets the rank (number of dimensions) of the current array class. */
    @cache
    get rank(): number {
        return Il2Cpp.Api._classGetRank(this);
    }

    /** Gets a pointer to the static fields of the current class. */
    @cache
    get staticFieldsData(): NativePointer {
        return Il2Cpp.Api._classGetStaticFieldData(this);
    }

    /** Gets the size of the instance - as a value type - of the current class. */
    @cache
    get valueSize(): number {
        return Il2Cpp.Api._classGetValueSize(this, NULL);
    }

    /** Gets the type of the current class. */
    @cache
    get type(): Il2Cpp.Type {
        return new Il2Cpp.Type(Il2Cpp.Api._classGetType(this));
    }

    /** Allocates a new object of the current class. */
    alloc(): Il2Cpp.Object {
        return new Il2Cpp.Object(Il2Cpp.Api._objectNew(this));
    }

    /** Gets the field identified by the given name. */
    @levenshtein("fields")
    field<T extends Il2Cpp.Field.Type>(name: string): Il2Cpp.Field<T> {
        return this.tryField<T>(name)!;
    }

    /** Builds a generic instance of the current generic class. */
    inflate(...classes: Il2Cpp.Class[]): Il2Cpp.Class {
        if (!this.isGeneric) {
            raise(`Cannot inflate ${this.type.name} because it's not generic.`);
        }

        const types = classes.map(klass => klass.type.object);
        const typeArray = Il2Cpp.Array.from(Il2Cpp.Image.corlib.class("System.Type"), types);

        // TODO: typeArray leaks
        return this.inflateRaw(typeArray);
    }

    /** @internal */
    inflateRaw(typeArray: Il2Cpp.Array<Il2Cpp.Object>): Il2Cpp.Class {
        const MakeGenericType = this.type.object.class.method<Il2Cpp.Object, [Il2Cpp.Array<Il2Cpp.Object>]>("MakeGenericType", 1)!;

        // TODO: check if this can be removed
        let object = this.type.object;
        while (!object.class.equals(MakeGenericType.class)) object = object.base;

        const inflatedType = MakeGenericType.invokeRaw(object, typeArray);

        return new Il2Cpp.Class(Il2Cpp.Api._classFromSystemType(inflatedType));
    }

    /** Calls the static constructor of the current class. */
    initialize(): void {
        Il2Cpp.try(() => Il2Cpp.Api._classInit(this));
    }

    /** Determines whether an instance of `other` class can be assigned to a variable of the current type. */
    isAssignableFrom(other: Il2Cpp.Class): boolean {
        return !!Il2Cpp.Api._classIsAssignableFrom(this, other);
    }

    /** Determines whether the current class derives from `other` class. */
    isSubclassOf(other: Il2Cpp.Class, checkInterfaces: boolean): boolean {
        return !!Il2Cpp.Api._classIsSubclassOf(this, other, +checkInterfaces);
    }

    /** Gets the method identified by the given name and parameter count. */
    @levenshtein("methods")
    method<R extends Il2Cpp.Method.ReturnType, A extends Il2Cpp.Parameter.Type[] | [] = any[]>(
        name: string,
        parameterCount: number = -1
    ): Il2Cpp.Method<R, A> {
        return this.tryMethod<R, A>(name, parameterCount)!;
    }

    /** Gets the nested class with the given name. */
    @levenshtein("nestedClasses")
    nested(name: string): Il2Cpp.Class {
        return this.tryNested(name)!;
    }

    /** Allocates a new object of the current class and calls its default constructor. */
    new(): Il2Cpp.Object {
        const object = this.alloc();

        const exceptionArray = Memory.alloc(Process.pointerSize);

        Il2Cpp.Api._objectInit(object, exceptionArray);

        const exception = exceptionArray.readPointer();

        if (!exception.isNull()) {
            raise(new Il2Cpp.Object(exception).toString()!);
        }

        return object;
    }

    /** Gets the field with the given name. */
    @memoize
    tryField<T extends Il2Cpp.Field.Type>(name: string): Il2Cpp.Field<T> | null {
        const handle = Il2Cpp.Api._classGetFieldFromName(this, Memory.allocUtf8String(name));
        return handle.isNull() ? null : new Il2Cpp.Field(handle);
    }

    /** Gets the method with the given name and parameter count. */
    @memoize
    tryMethod<R extends Il2Cpp.Method.ReturnType, A extends Il2Cpp.Parameter.Type[] | [] = any[]>(
        name: string,
        parameterCount: number = -1
    ): Il2Cpp.Method<R, A> | null {
        const handle = Il2Cpp.Api._classGetMethodFromName(this, Memory.allocUtf8String(name), parameterCount);
        return handle.isNull() ? null : new Il2Cpp.Method(handle);
    }

    /** Gets the nested class with the given name. */
    @memoize
    tryNested(name: string): Il2Cpp.Class | undefined {
        return this.nestedClasses.find(e => e.name == name);
    }

    override toString(): string {
        return readGString(Il2Cpp.Api._toString(this, Il2Cpp.Api._classToString))!;
    }

    /** Executes a callback for every defined class. */
    static enumerate(block: (klass: Il2Cpp.Class) => void): void {
        const callback = new NativeCallback(
            function (klass: NativePointer, _: NativePointer): void {
                block(new Il2Cpp.Class(klass));
            },
            "void",
            ["pointer", "pointer"]
        );

        return Il2Cpp.Api._classForEach(callback, NULL);
    }
}

Il2Cpp.Class = Il2CppClass;

declare global {
    namespace Il2Cpp {
        class Class extends Il2CppClass {}
    }
}
