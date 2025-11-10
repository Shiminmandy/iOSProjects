import { ThemeProvider } from '@/providers/theme-provider';
import { FC, ReactNode } from 'react'
import { ColorPreferencesProvider } from '@/providers/color-preferences';
import MainContent from '@/components/main-content';

// children 功能： ({children}) 结构的是嵌套在该layout下的页面组件的jsx内容。
// 当访问/(main) 下的任意页面时，nextjs会调用MainLayout，并把对应页面的渲染结果作为children传给它。
// 这样就能在布局里用{children}把页面内容插在想要的位置
const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ColorPreferencesProvider>
            <MainContent>{children}</MainContent>
            </ColorPreferencesProvider>
        </ThemeProvider>
    )
}

export default MainLayout;

// 本layout文件定义某一段路由树共享的“外壳”。（main）目录下所有page.tsx的渲染结果都会先被包裹在这个外壳里。
// 本文件一般放导航、主题、provider、全局样式等只需要渲染一次的内容
// 本文件会在用户切换同一层级的页面时保持状态，不会被卸载。