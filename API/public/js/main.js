/*var socket = io.connect('http://130.211.112.112:3001', { 'forceNew': true });

socket.on('messages', function(data) {
  console.log(data);
  render(data);
})

function render (data) {
  var html = data.map(function(elem, index) {
    return(`<div>
              <strong>${elem.author}</strong>:
              <em>${elem.text}</em>
            </div>`);
  }).join(" ");

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
  var message = {
    author: document.getElementById('username').value,
    text: document.getElementById('texto').value
  };

  socket.emit('new-message', message);
  return false;
}
*/
var ioIndex = io.connect('http://130.211.112.112:3001/ioIndex', { 'forceNew': true });

ioIndex.on('tweets10', function(data) {
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

ioIndex.on('infoTotal', function(data) {
  console.log(data);
  renderInfo(data);
})

function renderInfo (data) {
  var html = `<div class="col-lg-3 col-md-6">
                <div class="card mb-4">
                    <div class="card-body flexbox-b">
                        <div class="easypie mr-4" data-percent="100" data-bar-color="#5c6bc0" data-size="80" data-line-width="8">
                            <span class="easypie-data text-primary" style="font-size:32px;"><i class="la la-twitter-square"></i></span>
                        </div>
                        <div>
                            <h3 class="font-strong text-primary">${data.totalTweets}</h3>
                            <div class="text-muted">Total de Tweets</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card mb-4">
                    <div class="card-body flexbox-b">
                        <div class="easypie mr-4" data-percent="100" data-bar-color="#ff4081" data-size="80" data-line-width="8">
                            <span class="easypie-data font-26 text-pink"><i class="la la-users"></i></span>
                        </div>
                        <div>
                            <h3 class="font-strong text-pink">${data.totalUsus}</h3>
                            <div class="text-muted">Total de Usuarios</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card mb-4">
                    <div class="card-body flexbox-b">
                        <div class="easypie mr-4" data-percent="100" data-bar-color="#5c6bc0" data-size="80" data-line-width="8">
                            <span class="easypie-data text-primary" style="font-size:32px;"><i class="la la-tags"></i></span>
                        </div>
                        <div>
                            <h3 class="font-strong text-primary">${data.totalCates}</h3>
                            <div class="text-muted">Total de Categorías</div>
                        </div>
                    </div>
                </div>
            </div>`;

  document.getElementById('cosoInfo').innerHTML = html;
}