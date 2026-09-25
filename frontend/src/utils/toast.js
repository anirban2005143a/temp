import { toast } from 'react-toastify';

export const showErrorToast = (message) => {
  if (!message) {
    return;
  }

  toast.error(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
