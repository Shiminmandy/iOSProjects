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
            <main className={cn('md:ml-[280px] lg:ml-[420px] md:h-full overflow-scroll [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foregrond/60 [&::-webkit-scrollbar-track:bg-none [&::-webkit-scrollbar]:w-2')}>
                {children}
            </main>
        </div>
    );
}

export default MainContent;