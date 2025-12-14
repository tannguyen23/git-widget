import ControlPanel from "@core/components/ControlPanel";
import Dashboard from "@core/components/dashboard";
import TitleBar from "@core/components/TitleBar";

export default function MainPage() {

    return <div className="flex h-full w-full flex-col">
        <TitleBar />
        <Dashboard />
        <ControlPanel />
    </div>
}