"use client"
import { useColorPreferences } from "@/providers/color-preferences";
import { useTheme } from "next-themes";
import { FC } from "react"
import { cn } from "@/lib/utils";
const MainContent: FC<{ children: React.ReactNode }> = ({ children }) => {

    const { theme } = useTheme();
    const { color } = useColorPreferences();

    let backgroundColor = 'bg-primary-dark';
    if (color === 'green') {
        backgroundColor = 'bg-green-700';
    } else if (color === 'blue') {
        backgroundColor = 'bg-blue-700';
    }

    return (
        <div className={cn('md:px-2 md:pb-2 md:pt-14 md:h-screen')}>
            {/* 给一个滚动区域在不同屏幕下设置 margin、全高,并自定义滚动条样式 */}
            <main className={cn(
                'md:ml-[280px] lg:ml-[420px] md:h-full overflow-scroll [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track:bg-none [&::-webkit-scrollbar]:w-2',
                theme === 'dark' ? 'bg-[#232529]' : 'bg-light'
                )}>
                {children}
            </main>
        </div>
    );
}

export default MainContent;