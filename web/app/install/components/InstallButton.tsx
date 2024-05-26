import React, { useEffect, useState } from 'react';

function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      console.log('we are being triggered :D');
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('transitionend', handler);
  }, []);

  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    (promptInstall as any).prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <button
      type="button"
      className="link-button text-bold w-4/5 max-w-80 rounded-lg bg-primary p-4 text-xl text-white"
      id="setup_button"
      aria-label="Install app"
      title="Install app"
      onClick={onClick}
    >
      Install
    </button>
  );
}

export default InstallPWA;
