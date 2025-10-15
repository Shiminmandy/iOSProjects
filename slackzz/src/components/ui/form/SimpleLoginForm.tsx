"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 📋 步骤1: 定义表单的规则（验证规则）
const formSchema = z.object({
  email: z.string().email("请输入正确的邮箱格式"),
  password: z.string().min(6, "密码至少需要6个字符"),
});

export default function SimpleLoginForm() {
  // 🎯 步骤2: 创建表单（就像准备一张空白表格）
  // const form 是声明一个不可重新赋值的变量，但可修改属性
  // 调用函数useForm，接收配置对象作为参数，格式为{属性名：属性值，属性名：属性值}
  // 参数一resolver，是一个zodResolver函数，接收一个zod对象作为参数 
  // 参数二defaultValues，是一个对象，设置表单的初始值
  const form = useForm({
    resolver: zodResolver(formSchema), // 告诉表单按照上面的规则验证
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 📤 步骤3: 定义提交后做什么
  function onSubmit(data: any) {
    // 这里是表单验证通过后执行的代码
    console.log("登录信息:", data);
    alert(`登录成功！\n邮箱: ${data.email}`);
  }

  // 🎨 步骤4: 画出表单的样子
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">用户登录</h2>

      {/* Form 是最外层的包装，把所有表单内容包起来 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* ✉️ 邮箱输入框 */}
          <FormField
            control={form.control}          // 连接到表单控制器
            name="email"                    // 字段名称
            render={({ field }) => (        // field 包含了 value, onChange 等
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="请输入邮箱" 
                    {...field}              // 把 field 的所有属性传给 Input
                  />
                </FormControl>
                <FormMessage />             {/* 显示错误信息 */}
              </FormItem>
            )}
          />

          {/* 🔒 密码输入框 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="请输入密码" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 提交按钮 */}
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}

/* 
🎓 使用说明：

1. 复制这个组件到你的项目中
2. 在任何页面引入: import SimpleLoginForm from '@/components/SimpleLoginForm'
3. 使用: <SimpleLoginForm />

🧪 测试：
- 试试输入错误的邮箱格式（比如 "abc"）- 会看到错误提示
- 试试密码少于6个字符 - 也会看到错误提示
- 输入正确的邮箱和密码后点击登录 - 会弹出成功提示

📚 核心概念：
- FormField: 一个表单字段（输入框）
- FormItem: 字段的容器
- FormLabel: 字段的标签（"邮箱"、"密码"）
- FormControl: 包装实际的输入框
- FormMessage: 显示错误信息（自动的！）
*/

