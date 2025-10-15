"use client";

/*
═══════════════════════════════════════════════════════════════════
📚 语法详解示例：useForm 配置
═══════════════════════════════════════════════════════════════════
*/

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// 示例 1：基础语法拆解
// ═══════════════════════════════════════════════════════════════

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function Example1_Basic() {
  // 🔸 方式1：一次性写完（推荐）
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return <div>示例 1: 基础写法</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 2：分步骤写法（帮助理解）
// ═══════════════════════════════════════════════════════════════

export function Example2_StepByStep() {
  // 步骤1：准备验证函数
  const validationResolver = zodResolver(formSchema);
  
  // 步骤2：准备默认值
  const initialValues = {
    email: "",
    password: "",
  };
  
  // 步骤3：准备配置对象
  const formConfig = {
    resolver: validationResolver,
    defaultValues: initialValues,
  };
  
  // 步骤4：调用 useForm
  const form = useForm(formConfig);

  return <div>示例 2: 分步骤写法</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 3：语法概念对照
// ═══════════════════════════════════════════════════════════════

export function Example3_Concepts() {
  // 【概念1】const - 常量声明
  const name = "张三";  // 声明常量
  // name = "李四";     // ❌ 错误！不能重新赋值
  
  // 【概念2】对象字面量
  const person = {
    name: "张三",      // 属性: 值
    age: 25,
  };
  
  // 【概念3】函数调用
  const result = Math.max(1, 2, 3);  // 调用函数，传入参数
  
  // 【概念4】嵌套对象
  const config = {
    outer: {           // 外层对象的属性
      inner: "value",  // 内层对象的属性
    },
  };
  
  // 【概念5】组合使用 - useForm
  const form = useForm({
    //      ↑ 函数调用
    resolver: zodResolver(formSchema),
    //        ↑ 嵌套的函数调用
    defaultValues: {
      //           ↑ 嵌套对象
      email: "",
    },
  });

  return <div>示例 3: 语法概念</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 4：不同数据类型的 defaultValues
// ═══════════════════════════════════════════════════════════════

const multiTypeSchema = z.object({
  username: z.string(),           // 字符串
  age: z.number(),                // 数字
  agree: z.boolean(),             // 布尔值
  hobbies: z.array(z.string()),   // 数组
  settings: z.object({            // 嵌套对象
    theme: z.string(),
  }),
});

export function Example4_DataTypes() {
  const form = useForm({
    resolver: zodResolver(multiTypeSchema),
    defaultValues: {
      username: "",              // 字符串初始值
      age: 18,                   // 数字初始值
      agree: false,              // 布尔值初始值
      hobbies: [],               // 数组初始值
      settings: {                // 嵌套对象初始值
        theme: "light",
      },
    },
  });

  return <div>示例 4: 不同数据类型</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 5：resolver 参数详解
// ═══════════════════════════════════════════════════════════════

export function Example5_Resolver() {
  // 情况1：使用 zodResolver（推荐）
  const form1 = useForm({
    resolver: zodResolver(formSchema),  // zod 验证
  });

  // 情况2：不使用 resolver（无验证）
  const form2 = useForm({
    // 没有 resolver，不进行验证
    defaultValues: { email: "" },
  });

  // 情况3：自定义验证函数（高级）
  const form3 = useForm({
    resolver: async (data) => {
      // 自定义验证逻辑
      const errors: any = {};
      if (!data.email) {
        errors.email = { message: "邮箱不能为空" };
      }
      return { values: data, errors };
    },
  });

  return <div>示例 5: Resolver 用法</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 6：对象属性简写（ES6）
// ═══════════════════════════════════════════════════════════════

export function Example6_ObjectShorthand() {
  const email = "";
  const password = "";

  // 写法1：普通写法
  const values1 = {
    email: email,
    password: password,
  };

  // 写法2：属性简写（当变量名和属性名相同）
  const values2 = {
    email,      // 等同于 email: email
    password,   // 等同于 password: password
  };

  // 在 useForm 中也可以用
  const form = useForm({
    defaultValues: { email, password },  // 使用变量
  });

  return <div>示例 6: 对象属性简写</div>;
}

// ═══════════════════════════════════════════════════════════════
// 示例 7：完整注释版（学习用）
// ═══════════════════════════════════════════════════════════════

export function Example7_FullyAnnotated() {
  const form = useForm({
    // ↓ 这是对象的第一个属性
    // ↓ 属性名是 resolver
    // ↓ 属性值是 zodResolver(formSchema) 的返回值
    resolver: zodResolver(formSchema),
    //        ↑           ↑
    //        |           └─ 参数：验证规则对象
    //        └─ 函数名：把 zod 规则转换成验证函数
    
    // ↓ 这是对象的第二个属性
    // ↓ 属性名是 defaultValues
    // ↓ 属性值是一个对象（嵌套对象）
    defaultValues: {
      // ↓ 嵌套对象的第一个属性
      email: "",      // 属性名: email, 值: 空字符串
      //     ↑
      //     └─ 空字符串 ""（不是 null 或 undefined）
      
      // ↓ 嵌套对象的第二个属性
      password: "",   // 属性名: password, 值: 空字符串
    },
    // ↑ 嵌套对象结束
  });
  // ↑ useForm 配置对象结束

  return <div>示例 7: 完整注释</div>;
}

// ═══════════════════════════════════════════════════════════════
// 🎓 总结：语法清单
// ═══════════════════════════════════════════════════════════════

/*
✅ 涉及的语法和概念：

1. const - ES6 常量声明
   const variable = value;

2. 函数调用
   functionName(argument1, argument2)

3. 对象字面量
   { key: value, key: value }

4. 嵌套对象
   { outer: { inner: value } }

5. React Hooks
   const result = useHook({ config });

6. 参数传递
   useForm({ option1: value1, option2: value2 })

7. 变量引用
   const schema = z.object({ ... });
   useForm({ resolver: zodResolver(schema) })
                                    ↑ 引用变量

8. 方法链式调用（在 schema 定义中）
   z.string().email().min(6)
   ↑        ↑       ↑
   对象     方法1    方法2

记住这些语法，你就能看懂大部分 React 代码了！
*/

export default Example7_FullyAnnotated;

