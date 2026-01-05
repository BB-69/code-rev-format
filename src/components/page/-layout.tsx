import { ThemeSwitcher } from "../common/theme";
import ViteIcon from "/assets/vite.svg";

const Layout = () => {
  return (
    <div
      className="flex flex-col w-full h-full
      bg-gradient-to-b from-[var(--bg-a2)] to-white
      [.dark_&]:from-[var(--bg-a2-dark)] [.dark_&]:to-black"
    >
      <div className="relative w-full h-screen flex justify-center items-center">
        <div
          className="absolute animate-spin p-32
          rounded-full border-8 border-t-transparent"
        ></div>
        <div
          className="absolute animate-spin p-24
          rounded-full border-6 border-b-transparent"
        ></div>

        <img src={ViteIcon} className="absolute max-w-[50vw] max-h-[50vh]" />
      </div>

      <div className="absolute top-5 end-5">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Layout;
