import Typography from "./ui/typography"
import { Button } from "./ui/button"
import { FaPlus } from "react-icons/fa"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "./ui/dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import ImageUpload from "./ui/image-upload"
import { useRouter } from "next/navigation"
import { createWorkspace } from "@/actions/create-workspace"
import slugify from "slugify"
import { toast } from "sonner"
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values"
import { useState } from "react"


const CreateWorkpsace = () => {

    const router = useRouter();
    const {imageUrl, updateImageUrl} =  useCreateWorkspaceValues();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit({ name }: z.infer<typeof formSchema>) {

        const slug = slugify(name, { lower: true, strict: true });
        const invite_code = uuidv4(); // 已经是字符串了
        setIsSubmitting(true);

        const result = await createWorkspace({ name, slug, invite_code, imageUrl })


        setIsSubmitting(false);
        
        if (result?.error) {
            console.log(result.error);
        }

        updateImageUrl('');
        setIsOpen(false);
        form.reset();
        router.refresh();
        toast.success('Workspace created successfully!');
    }

        const formSchema = z.object({
            name: z.string().min(2, {
                message: 'Workspace name should be at least 2 character long',
            })
        })

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: '',
            }
        })



        return (
            <Dialog
            open={isOpen}
            onOpenChange={() => setIsOpen(prevValue => !prevValue)}
            >
                <DialogTrigger asChild>
                    <div className='flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-md'>
                        <div className='bg-secondary p-2 rounded-md'>
                            <FaPlus />
                        </div>
                        <Typography
                            variant='p'
                            text='Add Workspace'
                        />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='my-4'>
                            <Typography
                                variant='h4'
                                text='Create Workspace'
                            />
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

                            {/* 表单字段，每一个input都需要用户填写 */}
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Typography
                                                variant='p'
                                                text='Name'
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Your company or team name'
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <Typography
                                                variant='p'
                                                text='The is your name of your workspace'
                                            />
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 图片上传区域 - 通过外层 div 控制大小 */}
                            <div className='flex flex-col items-center  gap-4'>
                                <ImageUpload />
                            </div>

                            <Button type='submit' disabled={isSubmitting}>
                                <Typography
                                    variant='p'
                                    text='Submit'
                                />
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
    }

    export default CreateWorkpsace