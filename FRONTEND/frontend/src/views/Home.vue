<template>
  <div class="home">
    <Nav/>
    <div class="homepage">
      <div class="connected">
        <h3>Personnes connectées</h3>
        <div class="connected-users">
          <div>
            <i class="fas fa-circle green"></i>
          </div>
          <p>Utilisateur 1</p>
        </div>
        <div class="connected-users">
          <div>
            <i class="fas fa-circle green"></i>           
          </div>
          <p>Utilisateur 2</p>
        </div>
        <div class="connected-users">
          <div>
            <i class="fas fa-circle green"></i>   
          </div>
          <p>Utilisateur 3</p>
        </div>
        <div class="connected-users">
          <div>
            <i class="fas fa-circle red"></i>
          </div>
          <p>Utilisateur 4</p>
        </div>
        <div class="connected-users">
          <div>
            <i class="fas fa-circle red"></i>
          </div>
          <p>Utilisateur 5</p>
        </div>
      </div>
      <div class="newMessage-form" id="ancre-message">
        <h2>Créer une publication</h2>
        <form>
          <div class="form-group">
            <label for="contentMessage">Message</label>
            <textarea v-model="message_content" type="text" class="form-control" id="contentMessage" placeholder="Que voulez-vous partager ? " required></textarea>
          </div>
          <div id="choice">
            <span id="buttonDisplayImg" type="submit" class="btn btn-primary" @click="displayImg"><img id="label_file_img" src="../assets/image.png"/></span>
            <p>ou</p>
            <span id="buttonDisplayYoutube" type="submit" class="btn btn-primary" @click="displayYoutube"><img id="label_youtube_img" src="../assets/youtube.png"/></span>
          </div>

          <div class="form-group">
            <div class="image-upload"  v-if="imgIsDisplay">
              <input id="file-input" type="file" name="message_attachment" class="input-file"/>
              <label for="file-input" class="input-file-label">Choisir un fichier</label>
            </div>
            <div class="form-group "  v-if="youtubeIsDisplay">
              <input v-model="youtubeLink" type="text" class="form-control" id="linkYoutube"  placeholder="Lien Youtube" >
            </div>
          </div>
          <div class="div-button">
            <button type="submit" class="btn btn-primary" @click="submitMessage">Publier</button>
          </div>

          
          <div id="errorMessage"></div>
        </form>
        
      </div>

      <div class="account">
        <h3>{{ user_pseudo }}</h3>
        <ul>
          <li><router-link to="/MyAccount">Mon compte</router-link></li>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
          <li><a href="#">Conseils de modération</a></li>
        </ul>
      </div>
    </div>

    
    <div >
      <div v-for="message in messages" :key = "message.id" class="div_message" >
        <div class="div_message-title">
          <h3>{{message.message_title}}</h3>
          <p class="createdAt">{{ moment(message.createdAt).format("DD/MM/YY HH:mm:s")  }}</p>
        </div>
        <div class="div_message-content">
          <p>{{message.message_content}}</p>
        </div>
        <div class="div_message-youtube" v-if="message.message_attachment.includes('youtube')">
          <iframe  :src="`${message.message_attachment}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="div_message_img" v-if="message.message_attachment.includes('images')" >
          <img :src="`${message.message_attachment}`" class="img-fluid" alt="" >
        </div>
        <div class="div_message-like">
           <p class="comm"><a @click="buttonComments(`${message.id}`)">Commentaires <span :id="`${message.id}+commentLength`"></span></a></p>
          <p class="colorLike"><i class="far fa-heart heart" @click="buttonLike(`${message.id}`) "  :id="`${message.id}`" ></i> {{message.message_likes}}</p>
          <p> <a  v-if="message.message_title === user_pseudo || adminOrNo == true " ><i class="far fa-trash-alt" @click="deleteMessage(`${message.id}`)"></i></a></p>
          
        </div>
        <div class="div_message-comments" v-if="commentDisplay == message.id">
          <div :id="`${message.id}+form_comment`" class="div_form_comment" >
            <div class="form-group">
              <i class="fas fa-times cross" @click="closeComment"></i>
              <label for="contentComment" v-if="labelDisplay">Comments</label>
              <textarea v-model="comment_content" id="contentComment" type="text" class="form-control" placeholder="Écrivez un commentaire ... " required></textarea>
            </div>
            <button type="submit" class="btn btn-primary buttonFormComment" @click="submitComment(`${message.id}`)">Envoyer</button>
          </div>
        
          <div :id="`${message.id}+comment`" class="div-comments" >
            
          </div>
        </div>
      </div>
      

    </div>
  
  </div>

  
</template>




<script>
// @ is an alias to /src
import Nav from '../components/Nav.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
   Nav
  },
  data () {
    return{
      message_title: localStorage.getItem('pseudo'),
      adminOrNo: "",
      message_content: "",
      comment_content: "",
      commentDisplay: "",
      youtubeLink: "",
      commentIsDisplay: false,
      labelDisplay: false,
      messages: [],
      comments:[],
      user_pseudo : localStorage.getItem('pseudo'),
      imgIsDisplay: false,
      youtubeIsDisplay: false,
      date: "",
    }
  },
  mounted () {
    axios
      .get('http://localhost:3000/api/messages')
      .then(response => {
          
          this.messages = response.data;
          
          
          //get length of comment's message to display before clicking
          for (let i=0; i<response.data.length; i++){
            this.lengthComments(response.data[i].id);
          }
        
          })
      .catch((e) => {
        console.log(e);
      }); 

      // get if user id admin or no 
        let token = localStorage.getItem("token");

        if(!token){
            localStorage.clear();
            document.location.href="http://localhost:8080";
        }

        axios
          .get('http://localhost:3000/api/auth/me',
          {
              headers : {
                Authorization: `Bearer ${token}`,
              }
          })
          .then(response => (this.adminOrNo = response.data.user_admin))

  },
  
  methods : {
    submitMessage: function (e){
       e.preventDefault();

       let token = localStorage.getItem("token");
       var image = document.getElementById('file-input');
       var youtubeLink = this.youtubeLink;
       var message_attachment = "";


       if(image){
          message_attachment = image.files[0];
       }else{
          message_attachment = youtubeLink;
       }

       if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
       }
       
       const formData = new FormData;
       formData.append('message_title', this.message_title);
       formData.append('message_content', this.message_content);
       formData.append('message_attachment', message_attachment);
       
         
       axios.post('http://localhost:3000/api/messages/new',
        formData,{
          headers : {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
       )
      .then( () => {
          document.location.reload();
      })
      .catch((e) =>  {

        // if problem with authentification (token)
        if(e.response.data.error === "user not found"){
          alert("Un problème d'authentification à eu lieu, vous allez être redirigé...");
          localStorage.clear();
          document.location.href="http://localhost:8080/";
        }

        // if message_content is empty 
        if(e.response.data.error === "missing parameters"){
          let errorMessage = document.getElementById('errorMessage');
          errorMessage.textContent = "Écrivez au moins quelquechose...";
        }
      });
    },
    displayImg: function (){
      this.imgIsDisplay = true;
      this.youtubeIsDisplay = false;
      this.youtubeLink = "";
    },
    displayYoutube : function (){
      this.youtubeIsDisplay = true;
      this.imgIsDisplay = false;
    },
    buttonLike: function (id){
      let messageId = id
      let token = localStorage.getItem("token");
      let url = `http://localhost:3000/api/messages/${messageId}/vote/like`;

      if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
       }
      
      axios.post(url,{},
        {
          headers : {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      )
      .then(() => {
        let buttonLike = document.getElementById(messageId);
        document.location.reload();
        buttonLike.style.color = 'green';
      })
      .catch( (e)=>{
        // if token is no longer valid -- si le token n'est plus valable 

        if(e.response.data.error === "user not exist"){
          alert("Un problème d'authentification à eu lieu, vous allez être redirigé...");
          localStorage.clear();
          document.location.href="http://localhost:8080/";
        }

        // if the user has already liked this post (so dislike) -- si l'utilisateur à déjà aimé ce post (alors dislike)

        if(e.response.status === 409){
          axios.post(`http://localhost:3000/api/messages/${messageId}/vote/dislike`,{},
          {
            headers : {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          })
          .then(document.location.reload())
          .catch((e) => e.response.status(500).json({'error' : 'cannot post message'}));
        }
        
      });

    },
    buttonComments: function (id){
     
        this.commentDisplay = id

        if(this.commentDisplay !== id){
          console.log('non')
        }else{
          
          let messageId = id;
          let url = `http://localhost:3000/api/messages/${messageId}/comment`;

          axios.get(url,{},
            {
            }
          )
          .then(response => {
            // display comments when click comment button
            let div_comments = document.getElementById(messageId +'+comment')
            
            if(div_comments.textContent === ""){
              for(let i=0; i<response.data.length; i++){
                let divComment = document.createElement('div');
                let newH = document.createElement('h4');
                div_comments.appendChild(divComment);
                newH.textContent = response.data[i].user.user_pseudo;
                let newP = document.createElement('p');
                divComment.appendChild(newH);
                divComment.appendChild(newP);
                newP.textContent = response.data[i].comments_content;
                divComment.setAttribute('id', 'divComments')
                
              }
            }
          })
          .catch((e) => {
            console.log(e)
            console.log(e.response)
          })
        }
      
    },
    closeComment : function(){
      this.commentDisplay = "";
    },
    submitComment : function (id){
      
      let token = localStorage.getItem("token");

        if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
        }
      
      let messageId = id;
      let comment_content = this.comment_content;

      const params = new URLSearchParams()
      params.append('comments_content', comment_content);
          
         
      axios.post(`http://localhost:3000/api/messages/${messageId}/comment`,
        params,{
          headers : {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
       )
      .then( ()=> {
        document.location.reload();
      })
      .catch(() => {
        console.log('non')
      })
    },
    lengthComments: function (id){
          let messageId = id;
          let url = `http://localhost:3000/api/messages/${messageId}/comment`;

          axios.get(url,{},
            {
            }
          )
          .then(response => {
            
            let ok = document.getElementById(`${messageId}+commentLength`);
            ok.textContent = "(" +response.data.length + ")";
            
          })
          .catch((e) => {
            console.log(e)
            console.log(e.response)
          }) 
    },
    deleteMessage : function (id){
        let token = localStorage.getItem("token");
        let messageId = id
        console.log(messageId)
        if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
        }

        axios
        .delete(`http://localhost:3000/api/messages/${messageId}/delete`,
        {
            headers : {
              Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {

          document.location.reload()
        })
        .catch(e => { 
          
          if(e.response.data.error === "user dont exist"){
            alert("Un problème d'authentification à eu lieu, vous allez être redirigé...");
            localStorage.clear();
            document.location.href="http://localhost:8080/";
          }
        })
    },
    
  },
  
}
</script>

<style lang="scss">
  .home{
    background-color: rgb(255, 246, 246);
    padding-bottom: 20px;
  }

  .homepage{
    
    display: flex;
    justify-content: space-around;
    padding-bottom: 30px;
    padding-top: 100px;
    padding-bottom: 100px;
    .newMessage-form{
      background-color: white;
      width:45%;
      box-shadow: grey 2px 2px 10px;
      padding: 20px 20px;
      border-radius: 10px;
      height: 500px;
      
      textarea {
        resize: none;
        width: 100%;
        height: 150px;
      }
      #choice{
        display:flex;
        align-items:flex-end;
        justify-content: center;
        margin-bottom: 10px;
        margin: 0 auto;
      }
      #label_file_img{
        padding-top: 5px;
        margin-right: 5px;
        margin-left: 10px;
        width:45px;
        height:45px;
      }
      .input-file{
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
          
          
        }
        .input-file-label {
          font-size: 1.25em;
          font-weight: 700;
          color: #b64e39;
          background-color: white;
          display: inline-block;
          padding: 10px;
          border: 1px solid #b64e39;
          border-radius: 5px;
        }

      
      .image-upload{
        text-align: center;
      }
      #label_youtube_img{
        width: 70px;
        height: 40px; 
      }
      h2{
        color: #b64e39;
        text-align: center;
        margin-bottom: 30px;
      }
      #errorMessage{
        text-align: center;
        color: #b64e39;
        margin-top: 10px;
        margin-bottom: 5px;
      }
      .div-button{
        text-align: center;
      }
      button{
          color: white;
          width: 150px;
          border: 1px solid #b64e39;
          border-radius: 10px;
          background-color: #b64e39;
          padding: 5px;
          
          &:hover{
            background-color: #fbc0c0;
            border: 1px solid C;
            color : #b64e39;
          }
      }
      #buttonDisplayImg{
        background-color: #fff;
        border: none;
      }
      #buttonDisplayYoutube{
        background-color: #fff;
        border: none;
      }

    }
    .account{
      margin-top: 50px;
        width: 250px;
        height:420px;
        background-color: #fff;
        box-shadow: grey 2px 2px 10px;
        margin-top: 50px;
        padding: 20px 7px;
        border-radius: 10px;
        h3{
          
          text-align: center;
        }
        ul{
          margin-top: 90px;
          padding-left: 10px;
          list-style: none;
          li{
            margin-top: 30px;
            a{
              color: black;
            }
          }
        }
      }
    .connected{
        width:250px;
        height:420px;
        background-color: #fff;
        box-shadow: grey 2px 2px 10px;
        margin-top: 50px;
        padding: 20px 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        h3{
          
          text-align: center;
        }
        &-users{
          width:95%;
          height:50px;
          border: 1px solid #b64e39;
          border-radius: 10px;
          margin-top:10px;
          display: flex;
          align-items:center;
          padding-left: 20px;
          padding-right: 15px;
          & .green{
            font-size: 12px;
            color: rgb(72, 248, 72);
          }

          & .red{
            font-size: 12px;
            color: #b64e39;
          }
          & p{
            margin-left: 25px;
            margin-top: 15px;
          }
        }
    }
  }


  .div_message{
    margin: 0 auto;
    max-width: 850px;
    width: 55%;
    box-shadow: grey 2px 2px 10px;
    margin-top : 50px;
    border-radius: 10px;
    background-color: #fff;
    
    &_img{
      width: 100%;
      text-align: center;
    }
    & img{
      margin: auto;
      width: 100%;
      max-height: 480px;
    }
    & iframe{
      width:100%;
      height: 360px;
      object-fit: cover;
    }
    &-content{
      margin-bottom: 10px;
      font-size: 22px;
      margin-left: 20px;
      margin-right: 20px;
      text-align: justify;
    }
    &-youtube{
      text-align:center;
    }
    &-title{
      text-align: center;
      display:flex;
      justify-content: center;      align-items: center;
      background-color: #b64e39;
      padding: 15px;
      margin-bottom: 10px;
      border-top-right-radius: 10px ;
      border-top-left-radius: 10px ;
      color:white;
      & p{
        margin-left:auto;
        margin-top: 10px;
      }
    }
    &-like{
      display: flex;
      align-items: center;
      margin-top: 15px;
      padding-right: 20px;
      padding-left:20px;
      .heart{
        
        margin-right: 5px;
        &:hover{
            cursor:  pointer;
        }
      }
      p{
        font-size:19px;
        display: flex;
        align-items: center;
        
        margin-left: 10px;
      }
      & .comm{
        margin-left: auto;
        margin-right: 20px;
        a{
          color:black;
          &:hover{
            cursor:  pointer;
          }
        }
      }
    }
    &-comments{
      width: 100%; 
      background-color: rgb(255, 215, 215);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding-bottom: 10px;
      #divComments{
        padding: 10px;
        background-color: white;
        width: 80%;
        margin: 0 auto;
        border-radius: 5px;
        margin-bottom: 5px;
        word-wrap: break-word;
      }
      h4{
        margin-left: 10px;
        color: #b64e39;
      }
      p{
        font-size: 19px;
        margin-left: 15px;
        
        
      }
      .buttonFormComment{
        background-color: #b64e39;
        margin-right:40px;
      }  
      .div_form_comment{
        text-align: right;
        padding-bottom: 20px;
      }
      .form-group{
        padding-top: 5px;
      }
      textarea{
        width: 90%;
        margin-top: 5px;
        margin-bottom: 5px;
        margin: 0 auto;
      }
      .cross{
        font-size : 20px;
        padding-right:15px;
        width: 100%;
        margin-bottom:35px;
        text-align: right;
      }
    }
    
}

  .div-comments{
    background-color: rgb(255, 215, 215);
    
  }

  

  .arrow{
    position:fixed;
    right: 20px;
    bottom:10px;
    width: 50px;
    height : 50px;
    background-color: #fff;
    img{
      width: 100%;
      height:100%;
      object-fit: cover;
    }
  }

  // TABLETTES DISPLAY

  @media screen and (min-width: 600px) and (max-width:1024px) {
    .homepage{
      .newMessage-form{
        width: 60%;
      }
      .connected{
        display: none;
      }
      .account{
        width: 30%;
        margin-top: 0px;
        height: 460px;
      }
    }
    .div_message{
      width: 80%;
    }

    iframe{
      width: 90%;
      height: 450px;
    }

    .arrow{
      display:none;
    }    
  }

  @media screen and (min-width: 351px) and (max-width: 599px){
    
    .homepage{
      flex-direction: column-reverse;
      .connected{
        display: none;
      }
      .account{
        display: none;
      }
      .newMessage-form{
        width: 90%;
        height: 550px;
        margin: 0 auto;
        .image-upload{
          
          margin-top: 15px;
        }
      }
      
    }
    .div_message{
        width:90%;
        &-title{
        flex-direction: column;
        p{
          margin-left: 0;
        }
      }
    }

    
    
  }

  @media screen and (max-width: 350px){
    
    .homepage{
      
      .connected{
        display: none;
      }
      .account{
        display: none;
      }
      .newMessage-form{
        width: 90%;
        height: 560px;
        .image-upload{
          
          margin-top: 15px;
        }
        .input-file{
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }
      }
    }
    
    
    .div_message{
      width: 80%;
      &-title{
        flex-direction: column;
        p{
          margin-left: 0;
        }
      }
    }
    
  }
  
</style>