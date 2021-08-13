<template>
  <div class="login">

    <div class="login-presentation">
      <img alt="Groupomania logo" src="../assets/icon-left-font.png" class="login-img" >
      <h1>Bienvenue sur le réseau social Groupomania</h1> 
    </div>

    <div class="login-id">

      <div class="login-id__buttons">
        <button v-on:click="loginHide">Se connecter</button>
        <button v-on:click="loginShow">S'inscrire</button>
      </div>

      <div class="login-form" v-if="loginIsDisplay">
        <form>
          <div class="form-group ">
            <label for="exampleInputEmail1">Adresse Mail</label>
            <input v-model="user_mail" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Entrez votre email" required>
            <div class="valid-feedback" id="validEmail">
            
            </div>
            <div class="invalid-feedback" id="invalidEmail">
            
            </div> 
            <small id="emailHelp" class="form-text text-muted">Nous ne partagerons pas votre mot de passe.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Mot de passe</label>
            <input v-model="user_password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Entrez votre mot de passe" required>
          </div>
          
          <button type="submit" class="btn btn-primary" @click="submitLogin">Submit</button>
        </form>
        <div id="warning_login" class="warning">

        </div>
      </div>

      <div class="login-form" v-if="signupIsDisplay">
        <form>
          <div class="form-group ">
            <label for="InputEmail1">Entrez votre adresse mail</label>
            <input v-model="user_mail" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">Nous ne partagerons pas votre adresse mail.</small>
          </div>
          <div class="form-group">
            <label for="InputPassword1">Entrez votre mot de passe</label>
            <input v-model="user_password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Mot de passe">
          </div>
          <div class="form-group">
            <label for="InputPassword2">Confirmez votre mot de passe</label>
            <input v-model="user_password_confirm" type="password" class="form-control" id="InputPassword2" placeholder="Mot de passe">
          </div>
          <div class="form-group">
            <label for="exampleInputPseudo">Entrez votre pseudo</label>
            <input v-model="user_pseudo" type="text" class="form-control" id="exampleInputPseudo" placeholder="Pseudo">
          </div>
          <div class="form-group">
            <label for="textArea">Ecrivez quelquechose sur vous</label>
            <textarea v-model="user_bio" class="form-control" id="textArea" placeholder="Je suis ..."></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary" @click="submitSignup">Submit</button>
        </form>
        <div id="warning_signup" class='warning'>

        </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data ()  {
    return{
      user_mail : "",
      user_password: "",
      user_password_confirm: "",
      user_pseudo:"",
      user_bio:"",
      loginIsDisplay: true,
      signupIsDisplay : false,
      
    }
    
  },
  methods: {
    loginShow: function (){
      this.loginIsDisplay = false; 
      this.signupIsDisplay = true;
    },
    loginHide: function (){
      this.loginIsDisplay = true;
      this.signupIsDisplay = false;
    },
    submitLogin: function (e){
      e.preventDefault();
      
      //create value input login mail
      let user_mail = this.user_mail ;
      
      //create value input login mail
      let user_password = this.user_password;
      
      axios.post('http://localhost:3000/api/auth/login', {
        user_mail: user_mail,
        user_password: user_password
      })
      .then( response => {
        localStorage.setItem("pseudo", response.data.pseudo);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", response.data.admin);
        document.location.href="http://localhost:8080/?#/home";
      })
      .catch((e) => {
        
        if(e.response.data.error == "User not exist in database"){
            let warning = document.getElementById('warning_login');
            warning.textContent = "Merci de saisir un email valide";
          }

        if(e.response.data.error == "Invalid password"){
            let warning = document.getElementById('warning_login');
            warning.textContent = "Mot de passe incorrect";
        }

        if(e.response.data.error == "unable to verify user"){
            let warning = document.getElementById('warning_login');
            warning.textContent = "Impossible de se connecter";
        }
      });
    },
    submitSignup: function (e){
      e.preventDefault();
      
      var user_mail = this.user_mail ;
      var user_password = this.user_password;
      var user_password_confirm = this.user_password_confirm;
      var user_pseudo = this.user_pseudo;
      var user_bio = this.user_bio;
      localStorage.setItem("mail", user_mail);
      localStorage.setItem("password", user_password);

      if(user_password != user_password_confirm ){
        let warning = document.getElementById('warning_signup');
        warning.textContent = "Veuillez resaisir votre mot de passe";
        
      }else{
        axios.post('http://localhost:3000/api/auth/signup', {
          user_mail: user_mail,
          user_password: user_password,
          user_pseudo: user_pseudo, 
          user_bio: user_bio
        })
        .then( () => {
          axios.post('http://localhost:3000/api/auth/login', {
          user_mail: user_mail,
          user_password: user_password
        })
        .then( response => {
          localStorage.setItem("pseudo",response.data.pseudo);
          localStorage.setItem("token", response.data.token);
          document.location.href="http://localhost:8080/?#/home";
        })
        .catch(() => {
          let warning = document.getElementById('warning_login');
          warning.textContent = "Impossible de se connecter";
        });
      })
      .catch((e) => {
          if(e.response.data.error == "invalid email"){
            let warning = document.getElementById('warning_signup');
            warning.textContent = "Merci de saisir un email valide";
          }

          if(e.response.data.error == "invalid password"){
            let warning = document.getElementById('warning_signup');
            warning.textContent = "Mot de passe non valide. Il doit contenir au moins 8 caractères, avec une majuscule et un chiffre.";
          }

          if(e.response.data.error == "username must be length 2 - 12 characters"){
            let warning = document.getElementById('warning_signup');
            warning.textContent = "Votre pseudo doit contenir entre 2 et 12 caractères.";
          }
        
      });
        
      }

      
    },
  },
  components: {
    
  }
}
</script>

<style lang='scss'>
.login{
  display: flex;
  align-items: center;
  flex-direction: column;
  &-form{
    margin-top: 50px;
  }
  &-presentation{
    
    width:50%;
    margin-top:50px;
    text-align:center;
    //font-family : 'Lato', sans-serif;
    img{
      width: 100%;
      height: 200px;
      object-fit: cover;
      object-position: -35px;
      margin-bottom: 20px;
    }
  }
  &-id{
    width: 25%;
    margin-bottom : 30px;
    button{
        color: white;
        width: 150px;
        border: 1px solid #fd2d01;
        border-radius: 5px;
        background-color: #fd2d01;
        padding: 5px;
        margin-top:25px;
        &:hover{
          background-color: #fbc0c0;
          border: 1px solid #fd2d01;
          color : #fd2d01;
        }
      }
    &__buttons{
      text-align: center;
      margin-bottom: 40px;
      button{
        margin-right: 10px;
        margin-left: 10px;
      }
    }
  }
}

.warning{
  text-align: center;
  margin-top: 30px;
  color: #fd2d01;
}

// TABLETTES DISPLAY

@media screen and (min-width: 600px) and (max-width:1024px) {
  .login{
    
    &-presentation{
      width:100%;
    }
  }
}

//MOBILE DISPLAY
@media screen and (min-width: 350px) and (max-width: 599px){
  .login{
      
      &-presentation{
        width:90%;
        img{
          width: 100%;
          height: 100px;
          object-fit: cover;
          object-position: -10px;
          margin-bottom: 0px;
        }
      }
      &-id{
        width:90%;
      }
    }
}

</style>