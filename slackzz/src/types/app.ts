/**
 * 关注点分离 （separation of concerns）
 * supabse.ts文件是自动生成的数据库层类型，结构复杂嵌套深，包含数据库关系信息
 * app.ts文件是业务层类型，结构简单，代码中直接应用
 */
export type User = {
  avatar_url: string;
  channels: string[] | null;
  created_at: string | null;
  email: string;
  id: string;
  is_away: boolean;
  name: string | null;
  phone: string | null;
  type: string | null;
  workspaces: string[] | null;
};

export type Workspace = {
  channels: string[] | null;
  created_at: string;
  id: string;
  image_url: string | null;
  invite_code: string ;
  members: string[] | null;
  name: string;
  regulators: string[] | null;
  slug: string;
  super_admin: string;
};
