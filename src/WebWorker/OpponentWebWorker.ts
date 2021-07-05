onmessage = function(e) {

    let targetOrigin = window.opener;

    let result = e.data;

    postMessage(result, targetOrigin);

}
