if ('serviceWorker' in navigator) {

    console.log('sw habilitado en este navegador');
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
  
        if(reg.installing) {
          console.log('Service worker installing');
        } else if(reg.waiting) {
          console.log('Service worker installed');
        } else if(reg.active) {
          console.log('Service worker active');
        }
    
      }).catch(function(error) {
        // registration failed
        console.log('Registration failed with error: ' + error);
      });
} else {
  console.log('El navegador no soporta SERVICE WORKER');
}