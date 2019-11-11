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
var chat = io.connect('http://130.211.112.112:3001/chat', { 'forceNew': true });
  
  chat.on('hi', function (data) {
    /*chat.emit('hi!');*/
    document.body.innerHTML = '';
    document.write(data);
  });