import Typography from "@/components/ui/typography"

const CreateWorkspace = () => {
    return (
        <div className='w-screen h-screen grid place-content-center bg-neutral-800 text-white'>
            <div className='p-3 max-w-[550px]'>
                <Typography text = {`step ${'1'} of 2`} variant='p' className='mb-4'/>
            </div>
        </div>
    )
}