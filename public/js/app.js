var currentUserKey=localStorage.getItem('id');
var chatKey='';

function signUp(){
    var name=document.getElementById('signup-name');
    var email=document.getElementById('signup-email');
    var password=document.getElementById('signup-password');
    var userId=firebase.database().ref('Users').push().key;

    if(name.value && email.value && password.value){
        var signUp=document.getElementById('signup-btn');
        signUp.setAttribute('data-dismiss','modal');
       
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function(result){
            console.log(result);

            Swal.fire({
                title: 'Signed Up Successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
              })
        })
        
        .catch(function(error) {
            var errorMessage = error.message;
            console.log(errorMessage);

            Swal.fire({
                icon: 'warning',
                title: errorMessage,
                showConfirmButton: false
              })
          })
          setTimeout(function(){
            firebase.database().ref('Users/'+userId).set({
              id:userId,
              name:name.value,
              email:email.value,
              password:password.value
            })
          },2000)
    }
    else{
        Swal.fire({
            icon: 'warning',
            title: 'Incorrect Information',
            showConfirmButton: false
          })
    }
}


function signIn(){
    var email=document.getElementById('signin-email');
    var password=document.getElementById('signin-password');

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    
    .then(function(Users){
      firebase.database().ref('Users').once("value",function(data){
        for(user in data.val()){
          if(Users.user.email===data.val()[user].email){

            localStorage.setItem('id',data.val()[user].id);
            localStorage.setItem("name",data.val()[user].name);
            console.log(localStorage.getItem("name"));
          }
        }
      })
        Swal.fire({
          title: 'Signed In Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(function(){
          window.location.href='files/chat.html';
        },2000)


    })
    
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // console.log(errorMessage);
        Swal.fire({
          icon: 'warning',
          title: errorMessage,
          showConfirmButton: false
        })
      });


}

function facebookLogin(){
    var userId=firebase.database().ref('Users').push().key;
    var provider = new firebase.auth.FacebookAuthProvider();   
      firebase.auth().signInWithPopup(provider)

      .then(function(result) {
        // The signed-in user info.
        var user = result.user;
        localStorage.setItem('name',user.displayName)
        var flag=true;
        firebase.database().ref("Users").once("value",function(data){
            for(i in data.val()){
                if(user.displayName===data.val()[i].name){
                    flag=false;
                    console.log(flag);
                }
            }
        })   
        Swal.fire({
          title: 'Signed In Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })

        setTimeout(function(){
          console.log(flag);
            if(flag){
                firebase.database().ref("Users/" + userId).set({
                    id:userId,
                    name:user.displayName,
                    email:user.email,
                    password:user.displayName
                })
            }
            window.location.href='files/chat.html';
        },2000)
        firebase.database().ref('Users').on('value',function(data){
          for(i in data.val()){
            if(localStorage.getItem('name')==data.val()[i].name){
              localStorage.setItem('id',data.val()[i].id);
            }
          }
        })


    })
    .catch(function (error) {
        var errorMessage = error.message;
        Swal.fire({
            icon: 'warning',
            title: errorMessage,
            showConfirmButton: false
          })
    });

}


function googleLogin(){
    var userId=firebase.database().ref('Users').push().key;
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)

    

    .then(function(result) {
        var user = result.user;
        localStorage.setItem("name",user.displayName);
        var flag=true;
        firebase.database().ref("Users").once("value",function(data){
            for(i in data.val()){
                if(user.displayName===data.val()[i].name){
                    flag=false;
                    console.log(flag);

                }
            }
        })   
        Swal.fire({
          title: 'Signed In Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })

        setTimeout(function(){
          console.log(flag);
            if(flag){
                firebase.database().ref("Users/" + userId).set({
                    id:userId,
                    name:user.displayName,
                    email:user.email,
                    password:user.displayName
                })
            }
            window.location.href='files/chat.html';
        },2000)
        firebase.database().ref('Users').on('value',function(data){
          for(i in data.val()){
            if(localStorage.getItem('name')==data.val()[i].name){
              localStorage.setItem('id',data.val()[i].id);
            }
          }
        })
        



    })

    .catch(function (error) {
        var errorMessage = error.message;
        Swal.fire({
            icon: 'warning',
            title: errorMessage,
            showConfirmButton: false
          })
    });

}


function signOut(){
  firebase.auth().signOut()
  .then(function() {
    Swal.fire({
      icon: 'error',
      title: 'Signed Out',
      showConfirmButton: false,
      timer: 2000
    })    
    setTimeout(function(){
      localStorage.setItem('name','');

      window.location.href='../index.html'
    },2000)
  })

  .catch(function(error) {
    // An error happened.
    console.log(error.message)
  });
  

}


function fetchUsersList(){
    setTimeout(() => {
      if (!firebase.auth().currentUser) {
          window.location.href = "../index.html";
      }
    }, 1500);

  document.getElementById('users').innerHTML=`<div class='text-center'>
                                                  <span class='spinner-border text-primary mt-5' style='width:80px;height:80px;color:#7289da !important'>
                                              </div>`;

  var db=firebase.database().ref('Users');
  var lst='';
  db.on('value',function(users){
    if(users.hasChildren()){
      lst=`<li class="list-group-item" style=background-color:#f8f8f8;><input type="text" placeholder="Search" class="form-control" id="searchField"></li>`;
    }
    users.forEach(function(data){
      var user=data.val();
      if(user.name!=localStorage.getItem('name')){
        lst+=`<li onclick="start('${data.key}','${user.name}')" style='cursor:pointer' id='userName'><i class="fa fa-user-circle" style='font-size:40px' aria-hidden="true"></i>${user.name}</li>`;
        
      }
      // if(user.name===localStorage.getItem('name')){
      //   localStorage.setItem('id',user.id);
      // }
    
        });
      document.getElementById('users-list').innerHTML=lst;
  })
  document.getElementById('currentUserName').append(localStorage.getItem('name'));


}


function sendMessage(){
  
  var time=new Date().toLocaleTimeString();

  var chatMessage={
    userId:currentUserKey,
    msg:document.getElementById('message').value,
    dateTime:new Date().toLocaleString()
  };

  
  if(document.getElementById('message').value!=''){
    firebase.database().ref('chatMessages').child(chatKey).push(chatMessage,function(error){
      if(error){
        alert(error);
      }
      else{
        document.getElementById('message').value='';

        document.getElementById('message').focus();
      }
    })

  }


}



function start(friendKey,friendName){
  var friendList={friendId:friendKey,userId:currentUserKey};

  var db=firebase.database().ref('friend_list');

  var flag=false;

  db.on('value',function(friends){
    friends.forEach(function(data){
      var user=data.val();
      if((user.friendId == friendList.friendId && user.userId==friendList.userId) || (user.friendId == friendList.userId && user.userId==friendList.friendId)){
        flag=true;
        chatKey=data.key;
      }
    });
    if(flag===false){
      chatKey=firebase.database().ref('friend_list').push(friendList,function(error){
        if(error){
          alert(error);
        }
        else{
          document.getElementById('chatBox').removeAttribute('style');
          document.getElementById('startPage').setAttribute('style','display:none');
        
          var windowSize=window.outerWidth;
          if(windowSize<=1070){
            document.getElementById('chatColumn').setAttribute('style','width:100%');
            document.getElementById('usersColumn').setAttribute('style','display:none');
              
          }
        }
      }).getKey();

    }
    else{
      document.getElementById('chatBox').removeAttribute('style');
      document.getElementById('startPage').setAttribute('style','display:none');
    
      var windowSize=window.outerWidth;
      if(windowSize<=1070){
        document.getElementById('chatColumn').setAttribute('style','width:100%');
        document.getElementById('usersColumn').setAttribute('style','display:none');
      }
    }
    document.getElementById('friendName').innerHTML=friendName;
    document.getElementById('chatBox').innerHTML='';
    loadChatMessages(chatKey);
  });
}


function loadChatMessages(chatKey){
  var db=firebase.database().ref('chatMessages').child(chatKey);
  db.on('value',function(chats){
    var messageDisplay='';
    chats.forEach(function(data){
      var chat=data.val();
      var dateTime=chat.dateTime.split(',');

      if(chat.userId != currentUserKey){
        messageDisplay += `<ul id="receiveMsgs">
        <li class="receive">${chat.msg}<span class="timing" title="${dateTime[0]}">${dateTime[1]}</span></li>
    </ul>`
        
      }
      else{
        messageDisplay += `<ul id="sendMsgs">
        <li class="send">${chat.msg}<span class="timing" title="${dateTime[0]}">${dateTime[1]}</span></li>
    </ul>`;
      }



    });
    document.getElementById('chatBox').innerHTML = messageDisplay;
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

  });
}


function showUsers(){
  document.getElementById('usersColumn').setAttribute('style','display:inherit');
  document.getElementById('usersColumn').setAttribute('style','width:100%');
  document.getElementById('chatColumn').setAttribute('style','display:none');
  
}

function backToUsers(){
  showUsers();
}

