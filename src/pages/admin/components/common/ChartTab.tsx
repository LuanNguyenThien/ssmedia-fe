import { useState } from "react";

interface ChartTabProps {
  onSelect: (value: "optionOne" | "optionTwo" | "optionThree") => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const handleClick = (option: "optionOne" | "optionTwo" | "optionThree") => {
    setSelected(option);
    onSelect(option);
  };

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 "
      : "text-gray-500 ";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 ">
      <button
        onClick={() => handleClick("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900  ${getButtonClass(
          "optionOne"
        )}`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleClick("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900  ${getButtonClass(
          "optionTwo"
        )}`}
      >
        Annually
      </button>
      {/* <button
        onClick={() => handleClick("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionThree"
        )}`}
      >
        Annually
      </button> */}
    </div>
  );
};

export default ChartTab;
