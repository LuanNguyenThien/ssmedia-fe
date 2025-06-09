
import PropTypes from "prop-types";
import { FaGlobe, FaLock, FaShieldAlt } from "react-icons/fa";

const PrivacySettings = ({ privacy, onPrivacyChange }) => {
  const privacyOptions = [
    {
      value: "public",
      label: "Public",
      description: "Anyone can see the group and its members",
      icon: FaGlobe,
    },
    {
      value: "private",
      label: "Private",
      description: "Only members can see posts and member list",
      icon: FaLock,
    },
    
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaShieldAlt className="mr-2 text-blue-500" />
        Privacy Settings
      </h2>

      {/* Group Privacy */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">
          Group Privacy
        </h3>
        <div className="space-y-3">
          {privacyOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <label
                key={option.value}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  privacy === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value={option.value}
                  checked={privacy === option.value}
                  onChange={(e) => onPrivacyChange(e.target.value)}
                  className="sr-only"
                />
                <IconComponent
                  className={`w-5 h-5 mt-0.5 mr-3 ${
                    privacy === option.value
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

PrivacySettings.propTypes = {
  privacy: PropTypes.string.isRequired,
  onPrivacyChange: PropTypes.func.isRequired,
};

export default PrivacySettings;
