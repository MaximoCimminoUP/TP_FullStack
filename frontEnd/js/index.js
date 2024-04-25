console.log("Hola ke ase");
//alert("hello, its dmitri");

document.addEventListener("DOMContentLoaded", function(){
    let btn = document.getElementById("follow");
    console.log(btn);
    btn.addEventListener("click",function(){
        alert("hello, its dmitri");
    });


    let add = document.getElementById("add")
    add.addEventListener("click", function(){
        let repolist = document.getElementById("repoList");
    });
})

