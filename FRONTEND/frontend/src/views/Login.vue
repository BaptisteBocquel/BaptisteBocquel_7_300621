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
            <div class="message">{{ validation.firstError('user_mail') }}</div>
            <small id="emailHelp" class="form-text text-muted">Nous ne partagerons pas votre adresse mail.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Mot de passe</label>
            <input v-model="user_password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Entrez votre mot de passe" required>
            <div class="message">{{ validation.firstError('user_password') }}</div>
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
            <div class="message">{{ validation.firstError('user_mail') }}</div>
            <small id="emailHelp" class="form-text text-muted">Nous ne partagerons pas votre adresse mail.</small>
          </div>
          <div class="form-group">
            <label for="InputPassword1">Entrez votre mot de passe</label>
            <input v-model="user_password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Mot de passe">
            <div class="message">{{ validation.firstError('user_password') }}</div>
          </div>
          <div class="form-group">
            <label for="InputPassword2">Confirmez votre mot de passe</label>
            <input v-model="user_password_confirm" type="password" class="form-control" id="InputPassword2" placeholder="Mot de passe">
            <div class="message">{{ validation.firstError('user_password_confirm') }}</div>
          </div>
          <div class="form-group">
            <label for="exampleInputPseudo">Entrez votre pseudo</label>
            <input v-model="user_pseudo" type="text" class="form-control" id="exampleInputPseudo" placeholder="Pseudo">
            <div class="message">{{ validation.firstError('user_pseudo') }}</div>
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
import SimpleVueValidation from 'simple-vue-validator';
const Validator = SimpleVueValidation.Validator;

export default {
  name: 'Login',
  data ()  {
    return{
      user_mail : "",
      user_password: "",
      user_password_confirm: "",
      submitted: false,
      user_pseudo:"",
      user_bio:"",
      loginIsDisplay: true,
      signupIsDisplay : false,
      
    }
    
  },
  validators: {
      user_mail: function(value) {
        return Validator.value(value).required().email();
      },
      user_password : function(value){
        return Validator.value(value).required().regex('^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$', 'Le mot de passe doit contenir au moins 8 caractères, avec une majuscule et un chiffre.');
      },
      'user_password_confirm, user_password': function (repeat, password) {
        if (this.submitted || this.validation.isTouched('user_password_confirm')) {
          return Validator.value(repeat).required().match(password);
        }
      },
      user_pseudo: function(value) {
        return Validator.value(value).required().minLength(2).maxLength(12);
      },
      
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
      
      this.$validate()
      .then(function(){
          axios.post('http://localhost:3000/api/auth/login', {
            user_mail: user_mail,
            user_password: user_password
          })
          .then( response => {
          localStorage.setItem("pseudo", response.data.pseudo);
          localStorage.setItem("token", response.data.token);
          
          document.location.href="http://localhost:8080/?#/home";
          })
          .catch(() => {
            let warning = document.getElementById('warning_login');
            warning.textContent = "Impossible de se connecter";
            
          }); 
      })
        
    },
    submitSignup: function (e){
      e.preventDefault();
      
      var user_mail = this.user_mail ;
      var user_password = this.user_password;
      
      var user_pseudo = this.user_pseudo;
      var user_bio = this.user_bio;
      localStorage.setItem("mail", user_mail);
      localStorage.setItem("password", user_password);

        this.submitted = true;
        this.$validate()
          .then(function(success) {
            if (success) {
              
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

                if(e.response.data.error === "user already exist"){
                  let warning = document.getElementById('warning_signup');
                  warning.textContent = "Ce mail est déjà utilisé";
                }
        
            });
          }
        });
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
    .message{
      color: #b64e39;
    }
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
        border: 1px solid #b64e39;
        border-radius: 5px;
        background-color: #b64e39;
        padding: 5px;
        margin-top:25px;
        &:hover{
          background-color: #fbc0c0;
          border: 1px solid #b64e39;
          color : #b64e39;
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
  color: #b64e39;
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