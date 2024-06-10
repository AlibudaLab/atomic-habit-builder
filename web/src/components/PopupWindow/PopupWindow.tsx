import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PopupWindow.css'; // Import appropriate styles
import PopupCloseButton from './PopupCloseButton';
import { Button } from '@nextui-org/button';

type ButtonProps = {
  id: string; // Add an ID to use as a key
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

type PopupWindowProps = {
  title: string;
  onClose: () => void;
  content?: React.ReactNode;
  buttons?: ButtonProps[];
};

function PopupWindow({ title, onClose, content = null, buttons = [] }: PopupWindowProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleButtonClick = (buttonOnClick: () => void) => () => {
    buttonOnClick();
  };

  console.log(buttons);

  return (
    <div className="popup-overlay">
      <div className="popup-window" ref={popupRef}>
        <div>
          <div className="popup-header">
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
              <PopupCloseButton />
            </button>
          </div>
          <div className="popup-body">
            <div className="popup-title">
              {title.split('\n').map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            <div className="popup-content">{content}</div>
            <div>
              {buttons.map((btn) => (
                <Button
                  key={btn.id}
                  type="button"
                  onClick={handleButtonClick(btn.onClick)}
                  className={btn.className}
                  disabled={btn.disabled}
                  color='primary'
                  variant='bordered'
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PopupWindow.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.node,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
    }),
  ),
};

export default PopupWindow;
