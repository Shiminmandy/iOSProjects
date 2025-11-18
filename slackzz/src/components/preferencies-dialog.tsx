import { useColorPreferences } from "@/providers/color-preferences";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Typography from "./ui/typography";
import { Separator } from "./ui/separator";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { MdLightMode } from "react-icons/md";
import { cn } from "@/lib/utils";
import { BsLaptop } from "react-icons/bs";

const PreferenciesDialog = () => {

    const { setTheme, theme } = useTheme();
    const { selectColor } = useColorPreferences();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Typography
                    className="hover:text-white hover:bg-blue-700 px-2 py-1 rounded cursor-pointer"
                    text="Preferences"
                    variant="p"
                />
            </DialogTrigger>

            <DialogContent className='max-w-xs md:w-fit'> {/* 当屏幕宽度大于768px，也就是中等宽度的屏幕，不受前面的限制，元素宽度为fit，也就是自适应宽度 */}
                <DialogTitle>
                    <Typography
                        text='Preferences'
                        variant='h3'
                        className='py-5'
                    />
                    <Separator className='border-gray-200' />
                </DialogTitle>
                <Tabs orientation='horizontal' defaultValue='themes'>
                    <TabsList>
                        <TabsTrigger value='themes'>
                            <HiOutlinePaintBrush />
                            <Typography text='Themes' variant='p' />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent className='max-w-xs md: w-fit' value='themes'>
                        <Typography text='Color Mode' variant='p' className='font-bold' />

                        <Typography
                            text='Choose if slackzz appearance should be light or dark, or follow the computer settings'
                            variant='p'
                            className='pb-4'
                        />

                        <div className='flex flex-wrap gap-3'>
                            <Button
                                variant='outline'
                                onClick={() => setTheme('light')}
                                className={`w-full ${cn(
                                    theme === 'light' && 'border-blue-600'
                                )}`}
                            >
                                <MdLightMode className='mr-2' size={20} />
                                <Typography text='Light' variant='p' />
                            </Button>

                            <Button
                                variant='outline'
                                onClick={() => setTheme('dark')}
                                className={`w-full ${cn(
                                    theme === 'dark' && 'border-blue-600'
                                )}`}
                            >
                                <BsLaptop className='mr-2' size={20} />
                                <Typography text='dark' variant='p' />
                            </Button>

                            <Button
                                variant='outline'
                                onClick={() => setTheme('system')}
                                className={`w-full ${cn(
                                    theme === 'system' && 'border-blue-600'
                                )}`}
                            >
                                <BsLaptop className='mr-2' size={20} />
                                <Typography text='System' variant='p' />
                            </Button>
                        </div>

                        <Separator className='border-gray-200 my-5' />
                        <Typography text='Single Color' variant='p' className='py-2 font-bold' />

                        <div className='flex flex-wrap gap-3'>
                            <Button
                            variant='outline'
                            onClick={() => selectColor('green')}
                            className='w-full hover:border-green-800 border-2'
                            >
                                Green
                            </Button>
                            <Button
                            variant='outline'
                            onClick={() => selectColor('blue')}
                            className='w-full hover:border-blue-800 border-2'
                            >
                                Blue
                            </Button>
                            <Button
                            variant='outline'
                            onClick={() => selectColor('')}
                            className='w-full hover:border-red-800 border-2'
                            >
                                Reset
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default PreferenciesDialog;