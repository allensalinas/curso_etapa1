if ('serviceWorker' in navigator) {
    console.log('sw habilitado en este navegador');
    navigator.serviceWorker.register('js/sw/sw.js')
}