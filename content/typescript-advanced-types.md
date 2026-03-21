---
title: TypeScript 的高级类型体操
date: 2024-10-10
tags: [TypeScript]
---
## 为什么需要类型系统

JavaScript 的动态类型带来了灵活性，但也埋下了许多隐患。在大型项目中，类型错误是运行时错误的主要来源之一。

TypeScript 通过静态类型检查，在编译阶段就能发现大部分问题。但这只是基础，真正强大的地方在于它的**类型系统本身是一门语言**。

## 泛型：类型的函数

泛型让类型具有了参数化的能力，就像函数可以接收参数一样：

```typescript
// 基础泛型
function identity<T>(arg: T): T {
  return arg;
}

// 泛型约束
function loggingIdentity<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

## 条件类型：类型的 if/else

条件类型让我们可以根据类型之间的关系做出选择：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

## 映射类型：批量转换

使用映射类型可以基于已有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使用
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }
```

## infer：类型推导

`infer` 关键字允许我们在条件类型中推导类型：

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function foo() {
  return { x: 1, y: 2 };
}

type FooReturn = ReturnType<typeof foo>;
// { x: number; y: number; }
```

## 实用工具类型

TypeScript 内置了许多实用的工具类型：

| 工具类型         | 作用                   |
| ---------------- | ---------------------- |
| `Partial<T>`     | 所有属性变为可选       |
| `Required<T>`    | 所有属性变为必选       |
| `Readonly<T>`    | 所有属性变为只读       |
| `Pick<T, K>`     | 选择部分属性           |
| `Omit<T, K>`     | 排除部分属性           |
| `Exclude<T, U>`  | 从联合类型中排除       |
| `Extract<T, U>`  | 从联合类型中提取       |
| `NonNullable<T>` | 排除 null 和 undefined |

## 递归类型

处理嵌套结构时，递归类型非常有用：

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

interface Nested {
  a: { b: { c: string } };
}

type ReadonlyNested = DeepReadonly<Nested>;
// 所有层级都变为只读
```

## 结语

TypeScript 的类型系统是一个强大的工具，它不仅能帮助我们捕获错误，还能作为文档、提高 IDE 体验、重构时提供安全保障。

但记住，类型的目的是让代码更清晰，而不是更复杂。在实用和炫技之间找到平衡，才是使用 TypeScript 的正确姿势。
