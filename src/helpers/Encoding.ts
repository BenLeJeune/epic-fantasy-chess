const encodeOffer = ( offer : string, iceCandidates : string ) => {
    return btoa( encodeURIComponent( offer ) + '|' + encodeURIComponent(iceCandidates) );
}

const decodeOffer = ( encryptedOfferAndCandidates : string ) => {
    let uriComponents = atob(encryptedOfferAndCandidates).split('|')
    return uriComponents.map(uri => decodeURIComponent(uri));
}

export {
    encodeOffer,
    decodeOffer
}