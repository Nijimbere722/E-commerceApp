import { Toaster } from 'react-hot-toast';

const ToastNotifications = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
};

export default ToastNotifications;