const xhr = new XMLHttpRequest();
xhr.addEventListener('load', ()=> {
    console.log(xhr.response)
})
xhr.open("get", "https://supersimplebackend.dev/products/first");
xhr.send();