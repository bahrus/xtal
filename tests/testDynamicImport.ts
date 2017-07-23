async function test(){
    // import('./testLib').then(lib =>{
    //     console.log(lib.diag(5, 7));
    // })
    const lib = await import('./testLib');
    console.log(lib.diag(5, 7));
}

test();