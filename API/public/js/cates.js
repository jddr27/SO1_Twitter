var chat = io.connect('http://130.211.112.112:3001/chat', { 'forceNew': true });
  
  chat.on('hi', function (data) {
    /*chat.emit('hi!');*/
    document.body.innerHTML = '';
    document.write(data);
  });

  