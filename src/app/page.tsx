
import HeroSection from "@/app/components/HeroSection";
import About from "./components/About";
import Trending from "./components/Trending";
import LastGridSection from "./components/LastGridSection";

export default function Home() {

    return (
        <>
            <div className=" bg-white ">
            
                <HeroSection />
                <About />
                <Trending />
                {/* <BlogPage /> */}
                <LastGridSection/>
            </div>

        </>
    );
}
