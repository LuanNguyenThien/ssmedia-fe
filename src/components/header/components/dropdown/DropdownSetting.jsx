import '@components/header/components/dropdown/DropdownSetting.scss';
import PropTypes from 'prop-types';
import { icons } from '@assets/assets';

const DropdownSetting = ({ avatarSrc, name, onLogout, onNavigate }) => {
  console.log(avatarSrc);
  return (
    <div className="header-dropdown">
      <h2>Settings</h2>
      <div className="header-dropdown-content">
        <div className="header-dropdown-content-item" onClick={onNavigate}>
          <div>
            <img
              src={avatarSrc}
              className="header-dropdown-content-item-avatar"
              alt="header-dropdown-content-item-avatar"
            />
          </div>
          <span className="header-dropdown-content-item-name">{name}</span>
        </div>
        
        <div onClick={onLogout} className="header-dropdown-content-item">
          <div>
            <img
              src={icons.logout}
              className="header-dropdown-content-item-avatar"
              alt="header-dropdown-content-item-avatar"
            />
          </div>
          <span className="header-dropdown-content-item-name">Log out</span>
        </div>
      </div>
    </div>
  );
};
DropdownSetting.propTypes = {
  avatarSrc: PropTypes.string.isRequired, // Expect a string for avatarSrc
  name: PropTypes.string.isRequired, // Expect a string for name
  onLogout: PropTypes.func.isRequired, // Expect a function for onLogout
  onNavigate: PropTypes.func.isRequired // Expect a function for onNavigate
};
export default DropdownSetting;
