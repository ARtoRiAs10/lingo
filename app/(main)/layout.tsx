import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";


type props = {
    children : React.ReactNode;
};

const MainLayout = ({
    children,
} : props) => {
    return (
            <>
                <MobileHeader />
                <Sidebar className = "hidden lg:flex" />
                <main className=" h-full pt-[50px] lg:pl-[256px] lg:pt-0" >
                    <div className="max-w-[1056px] mx-auto pt-6 h-full">
                        {children}
                    </div>
                </main>
            </>
    );
};
export default MainLayout;