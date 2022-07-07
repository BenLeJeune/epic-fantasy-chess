const encodeOffer = ( offer : string ) => {
    return btoa( encodeURIComponent( offer ) );
}

const decodeOffer = ( offer : string ) => {
    return decodeURIComponent( atob( offer ) );
}

export {
    encodeOffer,
    decodeOffer
}