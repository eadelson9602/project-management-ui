import { Dialog, Loading, LocalStorage } from 'quasar';

export const errorHandler = (error: unknown) => {
  if (error instanceof Error) {
    console.error('An error occurred:', error.message);

    if (error.message == 'Unauthorized') {
      // validación aplica para cuando el token ha expirado
      Dialog.create({
        title: 'Sesión expirada',
        message: 'Su sesión ha expirado, por favor inicie sesión nuevamente',
        persistent: true,
      }).onOk(() => {
        Loading.show({
          message: 'Cerrando sesión...',
        });
        setTimeout(() => {
          LocalStorage.remove('userAuth');
          LocalStorage.remove('authStore');
          LocalStorage.remove('token');
          Loading.hide();
          location.reload();
        }, 1000);
      });
    }
  } else {
    console.error('An unknown error occurred:', error);
  }
  throw error;
};
