import Sidebar from "./Sidebar";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
  };
};

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <div className="flex bg-slate-100">
      <Sidebar role={user.role} />

      <div className="flex-1 min-h-screen">
        <Header user={user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;