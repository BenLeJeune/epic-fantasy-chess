const randomFromList = <T>( list : T[] ) => list[Math.floor((Math.random()*list.length))]

const arraysAreEqual = <T>( a : T[], b : T[] ) => {
    return a.map(( el, index ) => el === b[index]).reduce(( acc, next ) => acc && next, true);
}


export {
    randomFromList,
    arraysAreEqual
}