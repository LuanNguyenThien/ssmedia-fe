import { DynamicSVG } from "@components/sidebar/components/SidebarItems";

export const InfoItem = ({ icon, value, title }) => {
    const infoStyle = "text-gray-600 font-normal mr-2 flex items-center gap-2";
    if (!value) return null;
    return (
        <div className="flex justify-start items-center">
            <div className={infoStyle}>
                <DynamicSVG svgData={icon} className={"size-4"} />
                {title}
            </div>
            {value}
        </div>
    );
};