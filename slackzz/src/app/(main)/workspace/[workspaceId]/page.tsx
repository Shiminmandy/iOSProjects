import { getUserData } from '@/actions/get-user-data';
import { redirect } from 'next/navigation';
import { getUserWorkspaceData, getCurrentWorkspaceData } from '@/actions/workspaces';
import Sidebar from '@/components/sidebar';
import { Channel, Workspace as UserWorkspace } from '@/types/app';
import InfoSection from '@/components/info-section';
import Typography from '@/components/ui/typography';
import { getUserWorkspaceChannels } from '@/actions/get-user-workspace-channels';


//从传进来的对象中解构出params，再从params中解构出id变量
// 右边{ params: { id: string } }是typescript的类型注解，声明params是个对象，里面有一个id字段，类型是string
// [id] 来自于（main）的page.tsx中的路由参数，里面定义了users table中workspaces的第一条id

const Workspace = async ({ params }: { params: Promise<{ workspaceId: string }> }) => {

  const { workspaceId } = await params;
  const userData = await getUserData();

  if (!userData) {
    return redirect('/auth');
  }

  /**
   * 通过getuserdata获取用户的user table数据，再通过user table数据中的workspaces字段（包含所有创建的工作区id）获取用户的所有工作区数据
   */
  const [userWorkspaceData, userWorkspaceError] = await getUserWorkspaceData(userData.workspaces!);

  /**
   * 通过workspaceId（来自于当前页面路由参数）获取特定工作区数据
   */
  const [currentWorkspaceData, currentWorkspaceError] = await getCurrentWorkspaceData(workspaceId);

  /**
   * 根据传入的workspaceId和userId，查到用户在这个工作区能看到的频道列表
   */
  const userWorkspaceChannels = await getUserWorkspaceChannels(currentWorkspaceData.id, userData.id);

  // if (userWorkspaceChannels.length){
  //   redirect(`/workspace/${workspaceId}/channels/${userWorkspaceChannels[0].id}`);
  // }



  return (
    <>
      <div className='hidden md:block'>

        {/*pass a variable, function, object, array, or any expression, you must wrap it in {}*/}
        <Sidebar
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspacesData={userWorkspaceData as UserWorkspace[]}
        />

        <InfoSection userData={userData} currentWorkspaceData={currentWorkspaceData} userWorkspaceChannels={userWorkspaceChannels as Channel[]} currentChannelId='' />
        <Typography text={'Workspace'} variant='h1' className='text-2xl font-bold' />
        <Typography text={'Workspace'} variant='h1' className='text-2xl font-bold' />
        <Typography text={'Workspace'} variant='h1' className='text-2xl font-bold' />
      </div>
      <div className='md:hidden block min-h-screen'>Mobile</div>
    </>
  )
}

export default Workspace;