'use client';
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import Typography from './ui/typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

const CreateChannelDialog: FC<{
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
    workspaceId: string;
    userId: string;
}> = ({ setDialogOpen, dialogOpen, workspaceId, userId }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, { message: 'Channel name should be at least 2 characters long' }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);


            setIsSubmitting(false);
            setDialogOpen(false);
            form.reset();
            toast.success('Channel created successfully!');
        } catch (error) {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={() => setDialogOpen(prevState => !prevState)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='my-4'>
                        <Typography
                            variant='h3'
                            text='Create Channel'
                        />

                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={(field) => (
                                <FormItem>
                                    <FormLabel>
                                        <Typography variant='p' text='Channel Name' />
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Channel name' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        <Typography variant='p' text='This is your channel name' className='mb-4' />
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={isSubmitting} className='mt-3'>
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateChannelDialog;