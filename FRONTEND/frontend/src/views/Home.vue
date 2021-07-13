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
          <div class="form-group ">
            <label for="titleMessage">Titre</label>
            <input v-model="message_title" type="text" class="form-control" id="titleMessage"  placeholder="Titre du message" required>
          </div>
          <div class="form-group">
            <label for="contentMessage">Message</label>
            <textarea v-model="message_content" type="text" class="form-control" id="contentMessage" placeholder="Que voulez-vous partager ? " required></textarea>
          </div>
          <div class="form-group">
            <div class="image-upload">
              <label for="file-input">
                <img id="label_file_img" src="../assets/images_icon.png"/>
              </label>
              <input id="file-input" type="file" name="message_attachment"/>
    
            </div>
          </div>
          <button type="submit" class="btn btn-primary" @click="submitMessage">Publier</button>
        </form>
      </div>

      <div class="account">
        <h3>{{ user_pseudo }}</h3>
        <ul>
          <li><a href="#">Mon compte</a></li>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
          <li><a href="#">Conseils de modération</a></li>
        </ul>
      </div>
    </div>
      
    <div v-for="message in messages" :key = "message.id" class="div_message">
      <div class="div_message-title">
        <h3>{{message.message_title}}</h3>
        <p>{{message.createdAt}}</p>
      </div>
      <div class="div_message-content">
        <p>{{message.message_content}}</p>
      </div>
      <div class="div_message_img" v-if="message.message_attachment">
        <img :src="`${message.message_attachment}`" class="img-fluid" alt="" >
      </div>
      <div class="div_message-like">
        <p class="comm"><a href="#">Commentaires</a></p>
        <p><i class="far fa-thumbs-up"></i> {{message.message_likes}}</p>
      </div>
    </div>

    <div class="arrow">
      <a href="#ancre-message"><img src="../assets/arrow.png" class="img-fluid" alt="" ></a>
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
      message_title: "",
      message_content: "",
      messages: null,
      user_pseudo : localStorage.getItem('pseudo')
    }
  },
  mounted () {
    axios
      .get('http://localhost:3000/api/messages')
      .then(response => (this.messages = response.data))
  },
  methods : {
    submitMessage: function (e){
       e.preventDefault();

       let token = localStorage.getItem("token");
       let message_attachment = document.getElementById('file-input');
      
      const headers = {
        // multipart/form-data
        'Content-Type': 'multipart/form-data',
        'Authorization':`Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
        
      }
       
       const formData = new FormData;
       formData.append('message_title', this.message_title);
       formData.append('message_content', this.message_content);
       formData.append('message_attachment', message_attachment.files[0]);

       axios.post('http://localhost:3000/api/messages/new',
        formData,headers
       )
      .then( response => {
        console.log(response); 
      })
      .catch((error) =>  {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
    },
  }
  
}
</script>

<style lang="scss">
  .homepage{
    background-color: rgb(241, 241, 241);
    display: flex;
    justify-content: space-around;
    padding-bottom: 30px;
    padding-top: 30px;
    .newMessage-form{
      background-color: white;
      width:45%;
      height: 520px;
      box-shadow: grey 2px 2px 10px;
      
      border: 1px solid grey;
      padding: 20px 20px;
      border-radius: 10px;
      textarea {
        resize: none;
        width: 100%;
        height: 150px;
      }
      #label_file_img{
        width:40px;
        height:40px;
      }
      h2{
        color: #fd2d01;
        text-align: center;
        margin-bottom: 30px;
      }
      button{
          color: white;
          width: 150px;
          border: 1px solid #fd2d01;
          border-radius: 10px;
          background-color: #fd2d01;
          padding: 5px;
          margin-top:25px;
          &:hover{
            background-color: #fbc0c0;
            border: 1px solid C;
            color : #fd2d01;
          }
      }
    }
    .account{
      margin-top: 50px;
        width: 250px;
        height:420px;
        background-color: #fff;
        box-shadow: grey 2px 2px 10px;
        margin-top: 50px;
        border: 1px solid grey;
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
        border: 1px solid grey;
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
          border: 1px solid #fd2d01;
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
            color: red;
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
    background-color: rgb(241, 241, 241);
    width: 50%;
    box-shadow: grey 2px 2px 10px;
    margin-top : 50px;
    border: 1px solid grey;
    border-radius: 10px;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 20px;
    .div_message_img{
      width: 100%;
      text-align: center;
    }
    & img{
      margin: auto;
      width: 50%;
      height:100%;
    }
    & .div_message-content{
      margin-bottom: 50px;
      font-size: 17px;
    }
    & .div_message-title{
      text-align: center;
      display:flex;
      justify-content: center;
      border-bottom: 2px solid #fd2d01;
      padding-bottom: 15px;
      margin-bottom: 50px;
      & p{
        margin-left:auto;
      }
    }
    & .div_message-like{
      display: flex;
      & .comm{
        margin-left: auto;
        margin-right: 20px;
        a{
          color:black;
          text-decoration: underline;
        }
      }
      
    }
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
</style>
