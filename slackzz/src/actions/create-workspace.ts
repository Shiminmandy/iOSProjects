"use server";
/**
 * 如果函数被标记为‘use client’的客户端组建调用，必须使用‘use server’
 * 大部分情况下会有数据库操作，身份验证，使用api密钥，文件系统操作等敏感操作
 */

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { getUserData } from "@/actions/get-user-data";
import { updateUserWorkspace } from "@/actions/update-user-workspace";
import { addMemberToWorkspace } from "./add-member-to-workspace";

export const createWorkspace = async ({
  imageUrl,
  name,
  slug,
  invite_code,
}: {
  imageUrl?: string;
  name: string;
  slug: string;
  invite_code: string;
}) => {
  const supabase = await supabaseServerClient();
  const userData = await getUserData();

  if (!userData) {
    return { error: "No user data" };
  }

  // workspaceRecord 是data的别名，可以改成任何其他名字。通过结构data赋值重命名
  const { error, data: workspaceRecord } = await supabase
    .from("workspaces")
    /**这里的name完整版是name: name,因为insert中的参数来自于supabase*/
    .insert({
      image_url: imageUrl,
      name,
      slug,
      invite_code,
      super_admin: userData.id,
    })
    .select("*");

  if (error) {
    return {  error };
  }


  const [updateWorkspaceData, updateWorkspaceError] = await updateUserWorkspace(
    userData.id,
    workspaceRecord[0].id
  ); // workspaceRecord[0].id是主键id，数据库系统生成

  if (updateWorkspaceError) {
    return { error: updateWorkspaceError };
  }

  // Add user to workspace members
  const [addMemberToWorkspaceData, addMemberToWorkspaceError] = await addMemberToWorkspace(userData.id, workspaceRecord[0].id);

  if (addMemberToWorkspaceError) {
    return {error: addMemberToWorkspaceError};
  }
};

// 如果反悔的是对象，通过属性名访问，或者说解构对象，那么使用{}
// 如果返回的是数组，通过位置/索引访问，那么使用[]

/** 内容描述：
    This code uses Supabase's Query Builder to perform a database insert operation.
    Through method chaining with .from().insert().select(), 
    it constructs and executes a RESTful API request to 
    insert data into the workspaces table and returns the inserted record. 
    Under the hood, it translates to an HTTP POST request via PostgREST API. */

/** 解释orm （对象关系映射，type safe， simplify database interactions）
     * 本例中，不需要在supabse使用sql语言创建add_workspace_to_user函数，而是使用orm创建一个函数
     ORM (Object-Relational Mapping) is an abstraction 
     layer that maps database tables to application objects, 
     allowing developers to interact with databases 
     using object-oriented syntax instead of writing raw SQL queries.
     */
