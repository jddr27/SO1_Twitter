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

ioIndex.on('infoPopu', function(data) {
  console.log(data);
  renderPopu(data);
})

function renderPopu (data) {
  var html = `<div class="card-body">
                <h4>Usuario con más tweets</h4>
                <h4 class="card-title mb-1">${data.popuUsu}</h4>
                &nbsp;
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <div class="text-center">
                        <h2 class="text-pink m-0">${data.cantiUsu}</h2>
                        <div class="text-muted">TWEETS</div>
                    </div>
                </div>
              </div>
              <div class="card-body">
                <h4>Categoria con más tweets</h4>
                <h4 class="card-title mb-1">${data.popuCate}</h4>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <div class="text-center">
                        <h2 class="text-pink m-0">${data.cantiCate}</h2>
                        <div class="text-muted">TWEETS</div>
                    </div>
                </div>
              </div>`;

  document.getElementById('cosoPopu').innerHTML = html;
}