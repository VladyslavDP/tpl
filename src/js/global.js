const $                 = require('jquery'),
    lozad               = require('lozad');


const el = document.querySelectorAll('.lozad');
const observer = lozad(el); // passing a `NodeList` (e.g. `document.querySelectorAll()`) is also valid
observer.observe();

const mobile_menu = $( ".mobile_menu" ),
    top_header_menu = $('.top_header_menu');

// $( ".mobile_menu" )
$( ".mobile_menu" ).click(e => {
    e.preventDefault();
    top_header_menu.toggleClass( "hidetable", "easeInOutQuad" );
});


window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    console.log(condition);
}