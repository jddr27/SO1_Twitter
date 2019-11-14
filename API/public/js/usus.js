const IP = process.env.API || "localhost";
var ioUsus = io.connect(`http://${IP}:3001/ioUsus`, { 'forceNew': true });

ioUsus.on('tweets3', function(data) {
  console.log(data);
  renderTweets(data);
})

function renderTweets (data) {
  var html = data.map(function(elem, index) {
    return(`<li class="list-group-item py-3">
                <a class="media-img" href="javascript:;">
                    <img class="img-circle" src="img/users/u10.jpg" alt="image" width="54">
                    ${elem.nombre}
                </a>
                
                <p class="text-light">${elem.txt}</p>
                <div class="text-muted font-13">
                    <span class="badge badge-primary">${elem.categoria}</span>
                    <span class="mx-2">•</span>
                    <span>${elem.alias_usuario}</span>
                </div>
            </li>`);
  }).join(" ");

  document.getElementById('cosoTweets').innerHTML = html;
}

ioUsus.on('infoUsu', function(data) {
  console.log(data);
  renderUsu(data);
})

function renderUsu (data) {
  var html = `<h5 class="font-strong">${data.alias_usuario}</h5>
              <div class="text-light">${data.nombre}</div>
              <div class="text-light">${data.cantiUsu}</div>`;

  document.getElementById('cosoInfo').innerHTML = html;
}