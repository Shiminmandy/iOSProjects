import { getUserData } from '@/actions/get-user-data';
import { redirect } from 'next/navigation';
import { getUserWorkspaceData, getCurrentWorkspaceData } from '@/actions/workspaces';
import Sidebar from '@/components/sidebar';
import { Workspace as UserWorkspace } from '@/types/app';


//从传进来的对象中解构出params，再从params中解构出id变量
// 右边{ params: { id: string } }是typescript的类型注解，声明params是个对象，里面有一个id字段，类型是string
// [id] 来自于（main）的page.tsx中的路由参数，里面定义了users table中workspaces的第一条id

const Workspace = async ( {params}: { params: Promise<{id:string}>}) => {
  const { id } = await params;
  const userData = await getUserData();

  if (!userData) {
    return redirect('/auth');
  }

  const [userWorkspaceData, userWorkspaceError] = await getUserWorkspaceData(userData.workspaces!);

  const [currentWorkspaceData, currentWorkspaceError] = await getCurrentWorkspaceData(id);

  return (
    <>
      <div className='hidden md:block'>

        {/*pass a variable, function, object, array, or any expression, you must wrap it in {}*/}
        <Sidebar
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspacesData={userWorkspaceData as UserWorkspace[]}
        />
      </div>

    </>
  )
}

export default Workspace;