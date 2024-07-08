window.onpopstate = () => {
    window.history.pushState(null, '', window.location.href);
}
