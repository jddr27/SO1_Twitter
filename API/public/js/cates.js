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