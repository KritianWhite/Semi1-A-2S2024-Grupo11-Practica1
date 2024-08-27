import Swal from 'sweetalert2';

const Alertas = {
  showAlert: (message, type = 'info', options = {}) => {
    Swal.fire({
      title: message,
      icon: type,
      ...options
    });
  },

  showToast: (message, type = 'info', options = {}) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 10000,
      timerProgressBar: true,
      ...options
    });

    Toast.fire({
      icon: type,
      title: message
    });
  }
};

export default Alertas;
