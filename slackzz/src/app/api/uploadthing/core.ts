import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getUserData } from "@/actions/get-user-data";

const f = createUploadthing();

const currUser = async () => {
    const user = await getUserData();
    return {userId: user?.id};
}

export const ourFileRouter = {
  workspaceImage: f({
    image: {maxFileSize: '4MB', maxFileCount: 1}
  })
  .middleware(() => currUser()) //中间件，检查用户是否登录
  .onUploadComplete(() => {}), //上传完成后的回调函数,可以添加如数据库操作等
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
