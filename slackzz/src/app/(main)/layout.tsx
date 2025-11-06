import { ThemeProvider } from '@/providers/theme-provider';
import { FC, ReactNode } from 'react'
import { ColorPreferencesProvider } from '@/providers/color-preferences';

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ColorPreferencesProvider>Main Layout:{children}</ColorPreferencesProvider>
        </ThemeProvider>
    )
}

export default MainLayout;