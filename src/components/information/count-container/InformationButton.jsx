const InformationButton = ({ title, icon, onClick, className }) => {
    return (
        <div
            onClick={onClick}
            className={`text-sm  w-max flex items-center gap-1 p-2 bg-background-blur text-primary-black/70 hover:text-primary/50 cursor-pointer rounded-md ${className} `}
        >
            <span className="text-xl">{icon}</span> {title}
        </div>
    );
};

export default InformationButton;
