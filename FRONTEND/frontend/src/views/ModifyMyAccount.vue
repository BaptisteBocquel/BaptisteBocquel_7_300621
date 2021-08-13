<template>
  <div class="modifymyaccount">
    <Nav/>
    <div class="compte">
      <h1>Modifier mon compte</h1>
      
        <div>
          <form>
            <div class="form-group ">
                <h2> PSEUDO : </h2><br/>
                <input v-model="user_pseudo" type="text" class="form-control" id="exampleInput1"  placeholder="Votre nouveau pseudo">
            </div>
            <div class="form-group ">
                <h2> PASSWORD : </h2><br/>
                <input v-model="user_password" type="text" class="form-control" id="exampleInput3"  placeholder="Votre nouveau mot de passe">
            </div>
            <div class="form-group ">
                <h2> BIO : </h2><br/>
                <input v-model="user_bio" type="text" class="form-control" id="exampleInput4"  placeholder="Votre nouvelle bio">
            </div>
            <div class="compte-choice">
                <button type="submit" class="btn" @click="submitModifyAccount">Submit</button>
                <p><router-link to="/MyAccount">Retour à Mon Compte</router-link></p>
            </div>
            
          </form> 
        </div>
        <div id="errorMessage"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '../components/Nav.vue';
import axios from 'axios';


export default {
  name: 'myAccount',
  components: {
    Nav
  },
  data () {
      return {
          user_pseudo : "",
          user_password: "",
          user_bio: ""
      }
  },
  methods : {
      submitModifyAccount : function (e) {
          e.preventDefault();
          let token = localStorage.getItem("token");

          if(!token){
            localStorage.clear();
            document.location.href="http://localhost:8080";
          }
          
          const params = new URLSearchParams()
          params.append('user_pseudo', this.user_pseudo);
          params.append('user_password', this.user_password);
          params.append('user_bio', this.user_bio);

          axios.put('http://localhost:3000/api/auth/me',
            params,{
            headers : {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
        .then( response => {
          localStorage.removeItem("pseudo");
          localStorage.setItem("pseudo", response.data.user_pseudo);
          document.location.href="http://localhost:8080/?#/MyAccount";
        })
        .catch((e) =>  {
          if(e.response.data.error === "cannot find user"){
            alert("Un problème d'authentification à eu lieu, merci de vous reconnecter.");
            localStorage.clear();
            document.location.href="http://localhost:8080/";
          }else{
            let warning = document.getElementById('warning_account');
            warning.textContent = "Un problème est survenu";
          }
        });
            
      }
  }
}
</script>

<style lang="scss">
    .compte{
        input{
            width: 30%;
            margin: 0 auto;
            margin-bottom: 50px;
        }
        .btn{
          background-color: #fd2d01 ;
          color: white;
        }
        a{
          color: #fd2d01;
        }
        &-choice{
        display:flex;
        justify-content: center;
        align-items: center;
            p{
                padding-top:50px;
                margin-left: 50px;
            }
        }
    }

    //MOBILE DISPLAY
@media screen and (min-width: 350px) and (max-width: 599px){
  .compte{
        h1{
          padding-left: 10px;
          padding-right: 10px;
          height: 110px;
        }
        input{
            width: 80%;
            
        }
        &-choice{
          flex-direction: column;
        }
    }
}
</style>  