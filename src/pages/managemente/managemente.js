window.onpopstate = () => {
    window.history.pushState(null, null, window.location.href);
}
